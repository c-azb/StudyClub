
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .src.study_generator import StudyGeneration,LLMs
from .src.llms import get_llm
from .src.configs_setup import create_user_input,get_ai_complexity_setups
from .serializers import StudyPlanSerializer,TopicSerializer,StudyConfigsSerializer,StudyTopicSerializer,StudysOverviewSerializer, StudyConfigsSerializerVal

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.db.models import Q,Sum,Value
from django.db.models.functions import Coalesce

from .models import StudyPlan,Topic,StudyPlanConfigs

class GenerateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self,request):

        if 'regen' in request.data:
            old_study_plan = get_object_or_404(StudyPlan,pk=request.data['regen'],user=request.user)
        else: old_study_plan = None

        configs_serializer = StudyConfigsSerializerVal(data = request.data)

        if not configs_serializer.is_valid():
            return Response( configs_serializer.error_messages,status=status.HTTP_400_BAD_REQUEST )

        user_input = create_user_input(configs_serializer.validated_data)
        params = get_ai_complexity_setups( configs_serializer.validated_data.get("aiComplexity") )

        llms = LLMs(
            plan_llm=get_llm( *params["plan_llm"] ),
            plan_val_llm=get_llm(  *params["plan_val_llm"] ),
            content_llm=get_llm( *params["content_llm"] ),
        )

        study_gen = StudyGeneration(llms,use_validation=params["use_validation"],max_iterations=params["max_iterations"])
        print("Generating content")
        res = study_gen.invoke(user_input=user_input)

        request.data['user'] = request.user.pk
        study_plan_serializer = StudyPlanSerializer(data = request.data)
        if not study_plan_serializer.is_valid():
            return Response( study_plan_serializer.error_messages,status=status.HTTP_400_BAD_REQUEST )
        else:
            sp_inst = study_plan_serializer.save()

        study_content = res["study_content"]
        study_plan = res["study_plan"]

        request.data['studyPlan'] = sp_inst.pk
        configs_serializer = StudyConfigsSerializer(data = request.data)
        if configs_serializer.is_valid(): configs_serializer.save()
        else: return Response( configs_serializer.error_messages,status=status.HTTP_400_BAD_REQUEST )

        topics = []

        for i,topic,content in zip(range(0,len(study_plan)),study_plan,study_content):
            topic_data={"index":i,"title":topic,"content":content,"study_plan":sp_inst.pk}
            topics.append(topic_data)

        topic_serializer = TopicSerializer(data=topics,many=True)
        if topic_serializer.is_valid():
            topic_serializer.save()
        else:
            print(topic_serializer.error_messages)
        
        data = {
            'id':sp_inst.pk,
            'title':study_plan_serializer.validated_data['title'],
            "created_at":sp_inst.created_at,
            "updated_at":sp_inst.updated_at,
            'user':request.user.pk,
            'topics':topics
        }

        if old_study_plan is not None: old_study_plan.delete()

        return Response(data,status=status.HTTP_200_OK)


    def get(self,request):
        my_study_plans = StudyPlan.objects.filter(user=request.user.pk).prefetch_related("studyconfig").\
            annotate( votes =Coalesce(Sum("group_votes__vote"),Value(0)),\
                     my_vote =Coalesce(Sum("group_votes__vote",filter=Q(group_votes__user=request.user.pk)),Value(0))  ).order_by("-updated_at")
        
        serializer = StudysOverviewSerializer(my_study_plans,many=True)
        #print(serializer.data)

        #my_study_plans = StudyPlan.objects.filter(user=request.user.pk).order_by("-updated_at")
        #serializer = StudyPlanSerializer(my_study_plans,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    


class RetrieveTopicsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request,pk):
        sp = StudyPlan.objects.filter(pk=pk,user=request.user.pk)
        if sp:
            topics = Topic.objects.filter(study_plan = pk).order_by('index')
            serializer = TopicSerializer(topics,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response({'error':'unaccessable object'},status=status.HTTP_400_BAD_REQUEST)




class LatestGroups(APIView):
    permission_classes = [AllowAny]

    def get(self,request):
        latest = StudyPlan.objects.filter(is_public=True).prefetch_related("studyconfig").annotate( votes =Coalesce(Sum("group_votes__vote"),Value(0)) ).order_by("-created_at")
        featured = latest.order_by('-votes')

        if len(latest) > 10: latest = latest[:10]
        if len(featured) > 10: featured = featured[:10]
        
        latest_serializer = StudysOverviewSerializer(latest,many=True)
        featured_serializer = StudysOverviewSerializer(featured,many=True)
        #print(latest_serializer.data)
        data = {"latest":latest_serializer.data,"featured":featured_serializer.data}
        return Response(data,status=status.HTTP_200_OK)


class PublicGroup(APIView):
    permission_classes = [AllowAny]

    def get(self,request,pk):
        study_plan = StudyPlan.objects.\
            filter(is_public=True,pk=pk).\
                prefetch_related("study_topic").\
                    annotate( votes =Coalesce(Sum("group_votes__vote"),Value(0)), my_vote =Value(0) ).first()
        
        serializer = StudyTopicSerializer(study_plan)
        data = serializer.data
        data['is_owner'] = False
        return Response(data,status=status.HTTP_200_OK)

        
class PrivateGroup(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request,pk):
        study_plan = StudyPlan.objects.\
            filter(Q(user=request.user.pk)|Q(is_public=True),pk=pk).\
                prefetch_related("study_topic").\
                        annotate( votes =Coalesce(Sum("group_votes__vote"),Value(0)),\
                                 my_vote =Coalesce(Sum("group_votes__vote",filter=Q(group_votes__user=request.user.pk)),Value(0)) ).first()
        serializer = StudyTopicSerializer(study_plan)
        data = serializer.data
        data['is_owner'] = serializer.data['user'] == request.user.pk
        return Response(data,status=status.HTTP_200_OK)

        
        #res=StudyPlan.objects.filter(is_public=True).order_by("-created_at").prefetch_related("topic_set").all()


    def delete(self,request,pk):
        study_plan = get_object_or_404(StudyPlan,pk=pk,user=request.user)
        study_plan.delete()
        return Response(status=status.HTTP_200_OK)

class GetStudyConfigs(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request,pk):
        study_plan_configs = get_object_or_404(StudyPlanConfigs,studyPlan=pk,studyPlan__user = request.user)
        study_plan = get_object_or_404(StudyPlan,pk=pk,user = request.user)
        serializer = StudyConfigsSerializer(study_plan_configs)
        data = serializer.data
        data['title'] = study_plan.title
        data['is_public'] = study_plan.is_public
        return Response(data,status=status.HTTP_200_OK)


