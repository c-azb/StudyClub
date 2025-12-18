from django.shortcuts import render
from rest_framework.views import APIView
from .models import GroupUpDownVote,PrivateGroupMember
from .serializers import UpDownVoteSerializer
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

