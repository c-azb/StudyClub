

from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .serializers import UserSerializer,TokenRefreshSerializerCookie
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from django.conf import settings
from rest_framework.views import APIView

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

from rest_framework.response import Response
from rest_framework import status

class LogoutView(APIView):
    def post(self,request):
        response = Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)
        
        response.delete_cookie(
            key='refresh',
            samesite='none',
            domain=None,
            path="/",
        )

        return response