from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

# Create your views here.

@api_view(['GET'])
def welcome(request):
    #http://127.0.0.1:8000/api/v1/?format=json
    return Response({'msg':'welcome to study club!'},status.HTTP_200_OK)