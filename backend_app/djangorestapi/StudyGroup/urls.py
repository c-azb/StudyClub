

from django.urls import path
from . import views

urlpatterns = [
    path('studyVote/<int:study_pk>/',views.StudyVote.as_view()),
    path('listMyVotedGroups/<int:vote>/',views.ListMyVotedGroups.as_view()),

]