

from rest_framework import generics,status
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .serializers import UserSerializer,TokenRefreshSerializerCookie,ChangePswSerializer,ChangeAccSerializer
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

from rest_framework.exceptions import ValidationError
from django.contrib.auth import authenticate

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class TokenObtainPairAsCookieView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            refresh_token = response.data['refresh']
            response.set_cookie(
                key='refresh',
                value=refresh_token,
                httponly=True,
                samesite='none',
                secure=True,
                domain=None,
                path="/",
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()
            )
            del response.data['refresh']
        
        return response

class TokenRefreshFromCookieView(TokenRefreshView):
    serializer_class = TokenRefreshSerializerCookie

    def post(self, request, *args, **kwargs):
        request.data["refresh"] = "-"
        return super().post(request, *args, **kwargs)



class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self,request):
        response = Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)
        
        response.delete_cookie(
            key='refresh',
            samesite='none',
            domain=None,
            path="/",
        )

        return response

class ChangePswView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self,request):
        serializer = ChangePswSerializer(data=request.data)
        if serializer.is_valid():
            old_password = serializer.validated_data['psw']
            new_password = serializer.validated_data['newPsw']
            confirm_new_password = serializer.validated_data['newPswConf']

            if new_password != confirm_new_password:
                raise ValidationError({"confirm_new_password": "New password and confirmation do not match."})

            user = authenticate(username=request.user.username, password=old_password)
            if not user:
                raise ValidationError({"old_password": "Old password is incorrect."})
            
            user.set_password(new_password)
            user.save()

            return Response({"message": "Password changed successfully."}, status=200)

        return Response(serializer.errors, status=400)


class UsernameView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        return Response({'username':request.user.username})

    def post(self, request):
        serializer = ChangeAccSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data['psw']
            new_username = serializer.validated_data['username']

            if User.objects.filter(username=new_username).exists():
                raise ValidationError({"new_username": "Username already exists."})

            user = authenticate(username=request.user.username, password=password)
            if not user:
                raise ValidationError({"old_password": "Old password is incorrect."})

            user.username = new_username
            user.save()

            return Response({"message": "Username updated successfully."}, status=200)

        return Response(serializer.errors, status=400)