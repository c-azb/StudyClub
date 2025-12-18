from django.shortcuts import render
from rest_framework.views import APIView
from .models import GroupUpDownVote,PrivateGroupMember
from .serializers import UpDownVoteSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

class StudyVote(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self,request,study_pk):

        request.data['study_plan'] = study_pk
        serializer = UpDownVoteSerializer(request.data)

        if serializer.is_valid():
            serializer.save()


        pass
