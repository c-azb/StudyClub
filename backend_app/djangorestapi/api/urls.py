

from django.urls import include, path
from . import views
# from accounts.views import RegisterView

urlpatterns = [
    path('',views.welcome),
    # path('register/',RegisterView.as_view()),

    path('acc/',include('accounts.urls')),
    path('generateStudy/',include('StudyGeneration.urls')),
    path('studyGroup/',include('StudyGroup.urls')),
]