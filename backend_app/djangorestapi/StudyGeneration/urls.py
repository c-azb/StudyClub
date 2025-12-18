
from django.urls import path
from . import views

urlpatterns = [
    path('generate/',views.GenerateView.as_view()),
    path('topics/<int:pk>/',views.RetrieveTopicsView.as_view()),
    path('latestGroups/',views.LatestGroups.as_view()),
    path('publicGroup/<int:pk>/',views.PublicGroup.as_view()),
    path('privateGroup/<int:pk>/',views.PrivateGroup.as_view()),

]