

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

class UserSerializer(serializers.ModelSerializer):
    #write_only -> cannot be read
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    class Meta:
        model = User
        fields = ['username', 'email', 'password','password2']
    
    def validate(self, data):
        data = super().validate(data)
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        # User.objects.create = save the password in a plain text
        # User.objects.create_user = automatically hash the password
        validated_data.pop('password2')

        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        # user = User.objects.create_user(**validated_data)
        return user


class TokenRefreshSerializerCookie(TokenRefreshSerializer):
    
    def validate(self, attrs):
        request = self.context.get("request")
        cookie_refresh = request.COOKIES.get("refresh") if request else None
        if not cookie_refresh:
            raise serializers.ValidationError({"refresh": "Refresh token not provided."})
        attrs["refresh"] = cookie_refresh

        return super().validate(attrs)


class ChangePswSerializer(serializers.Serializer):
    psw = serializers.CharField(write_only=True)
    newPsw = serializers.CharField(write_only=True)
    newPswConf = serializers.CharField(write_only=True)

class ChangeAccSerializer(serializers.Serializer):
    psw = serializers.CharField(write_only=True)
    username = serializers.CharField(write_only=True)