
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .src.study_generator import StudyGeneration,LLMs
from .src.llms import get_llm
from .src.configs_setup import create_user_input,get_ai_complexity_setups
from .serializers import StudyPlanSerializer,TopicSerializer,StudyConfigsSerializer,StudyTopicSerializer,StudysOverviewSerializer

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.db.models import Q

from .models import StudyPlan,Topic,StudyPlanConfigs

class GenerateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self,request):

        configs_serializer = StudyConfigsSerializer(data = request.data)

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

        study_content = res["study_content"]
        study_plan = res["study_plan"]

        inst = configs_serializer.save()
        request.data['user'] = request.user.pk
        request.data['configs'] = inst.pk

        study_plan_serializer = StudyPlanSerializer(data = request.data)

        if not study_plan_serializer.is_valid():
            return Response( study_plan_serializer.error_messages,status=status.HTTP_400_BAD_REQUEST )

        instance = study_plan_serializer.save()
        pk = instance.pk
        topics = []

        for i,topic,content in zip(range(0,len(study_plan)),study_plan,study_content):
            topic_data={"index":i,"title":topic,"content":content,"study_plan":pk}
            topics.append(topic_data)

        topic_serializer = TopicSerializer(data=topics,many=True)
        if topic_serializer.is_valid():
            topic_serializer.save()
        else:
            print(topic_serializer.error_messages)
        
        data = {
            'id':pk,
            'title':study_plan_serializer.validated_data['title'],
            "created_at":instance.created_at,
            "updated_at":instance.updated_at,
            'user':request.user.pk,
            'topics':topics
        }

        return Response(data,status=status.HTTP_200_OK)


    def get(self,request):
        my_study_plans = StudyPlan.objects.filter(user=request.user.pk).order_by("-updated_at")
        serializer = StudyPlanSerializer(my_study_plans,many=True)
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

from django.db.models import Sum,Value#, Q
from django.db.models.functions import Coalesce


class LatestGroups(APIView):
    permission_classes = [AllowAny]

    def get(self,request):
        #isFeatured = request.query_params.get('isFeatured', None)
        #order_by = "-up_votes" if isFeatured else "-created_at" 

        #latest = StudyPlan.objects.filter(is_public=True).select_related("configs").prefetch_related('group_votes').order_by("-created_at")
        latest = StudyPlan.objects.filter(is_public=True).select_related("configs").annotate( votes =Coalesce(Sum("group_votes"),Value(0)) ).order_by("-created_at")
        featured = StudyPlan.objects.filter(is_public=True).select_related("configs").annotate( votes =Coalesce(Sum("group_votes"),Value(0)) ).order_by("-votes")
        
        if len(latest) > 10: latest = latest[:10]
        if len(featured) > 10: featured = featured[:10]
        
        latest_serializer = StudysOverviewSerializer(latest,many=True)
        featured_serializer = StudysOverviewSerializer(featured,many=True)
        data = {"latest":latest_serializer.data,"featured":featured_serializer.data}
        return Response(data,status=status.HTTP_200_OK)


class PublicGroup(APIView):
    permission_classes = [AllowAny]

    def get(self,request,pk):
        study_plan = StudyPlan.objects.filter(is_public=True,pk=pk).prefetch_related("study_topic").annotate( votes =Coalesce(Sum("group_votes"),Value(0)) ).first()
        serializer = StudyTopicSerializer(study_plan)
        return Response(serializer.data,status=status.HTTP_200_OK)

        
        #res=StudyPlan.objects.filter(is_public=True).order_by("-created_at").prefetch_related("topic_set").all()

class PrivateGroup(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request,pk):
        study_plan = StudyPlan.objects.filter(Q(user=request.user.pk)|Q(is_public=True),pk=pk).prefetch_related("topic_set").annotate( votes =Coalesce(Sum("group_votes"),Value(0)) ).first()
        serializer = StudyTopicSerializer(study_plan)
        return Response(serializer.data,status=status.HTTP_200_OK)

        
        #res=StudyPlan.objects.filter(is_public=True).order_by("-created_at").prefetch_related("topic_set").all()

