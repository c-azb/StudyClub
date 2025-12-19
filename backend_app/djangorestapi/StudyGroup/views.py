from django.shortcuts import render
from rest_framework.views import APIView
from .models import GroupUpDownVote,PrivateGroupMember
from .serializers import UpDownVoteSerializer,StudyUpDownVoteSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


class StudyVote(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self,request,study_pk):
        res = self.get_up_down_votes(study_pk,request.user.pk)

        if res is None:
            request.data['study_plan'] = study_pk
            request.data['user'] = request.user.pk
            serializer = UpDownVoteSerializer(data =request.data)
            #print(request.data)

            if serializer.is_valid():
                serializer.save()
                return Response({},status=status.HTTP_201_CREATED)
            return Response(serializer.error_messages,status=status.HTTP_400_BAD_REQUEST)
            
        return Response({"error":"User already voted"},status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    # def get(self,request,study_pk):
    #     res = self.get_up_down_votes(study_pk,request.user.pk)
    #     all_votes = GroupUpDownVote.objects.filter(study_plan = study_pk)
    #     data = dict(total=0)
    #     for vote in all_votes:
    #         data['total'] += vote

    #     if res:
    #         serializer = UpDownVoteSerializer(res)
    #         data.update(serializer.data)
            
    #     return Response(data,status=status.HTTP_200_OK)


    def put(self,request,study_pk):
        res = self.get_up_down_votes(study_pk,request.user.pk)

        if res:
            request.data['study_plan'] = study_pk
            request.data['user'] = request.user.pk
            serializer = UpDownVoteSerializer(res,data =request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_200_OK)
            
            return Response(serializer.error_messages,status=status.HTTP_400_BAD_REQUEST)
        return Response({"error":"User already voted"},status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def delete(self,request,study_pk):
        res = self.get_up_down_votes(study_pk,request.user.pk)
        if res:
            res.delete()
            return Response({},status=status.HTTP_200_OK)
        return Response({'error':'could not find object to delete'},status=status.HTTP_400_BAD_REQUEST)
    
    def get_up_down_votes(self,study_pk,user_pk):
        try:
            return GroupUpDownVote.objects.get(user=user_pk,study_plan=study_pk)
        except:
            return None

# from StudyGeneration.models import StudyPlan
# from StudyGeneration.serializers import StudysOverviewSerializer
# from django.db.models import Q
from django.db.models import Q,Sum,Value
from django.db.models.functions import Coalesce

class ListMyVotedGroups(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request,vote):
        res = GroupUpDownVote.objects.filter(user = request.user.pk,vote = vote-1).select_related('study_plan').\
            annotate(votes = Coalesce(Sum("vote"),Value(0)))

        serializer = StudyUpDownVoteSerializer(res,many=True)
        fixed_data = []


        for d in serializer.data:
            item = d['study_plan']
            item['my_vote'] = d['vote']
            item['votes'] = d['votes']
            fixed_data.append(item)

        #print(serializer.data)
        return Response(fixed_data)

#[{'id': 5, 
# 'study_plan': {'id': 3, 'image': '/media/group_images/2025/images.jpg', 
# 'title': 'Python', 'is_public': True, 'created_at': '2025-12-15T20:00:07.840658Z', 'updated_at': '2025-12-15T20:00:07.841655Z', 
# 'user': 1, 'configs': 3}, 'vote': -1, 'user': 1}]