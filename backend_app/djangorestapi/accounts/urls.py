

from django.urls import path
from . import views

urlpatterns = [
    path('register/',views.RegisterView.as_view()),
    path('token/',views.TokenObtainPairAsCookieView.as_view(),name='token_obtain_pair'),
    path('token/refresh/',views.TokenRefreshFromCookieView.as_view(),name='token_refresh'),
    path('logout/',views.LogoutView.as_view())
]