from django.db import models
from django.contrib.auth.models import User
from .src.configs_setup import ContentEnum,LearnSpeedEnum,AIComplexityEnum

class StudyPlan(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to="group_images/%Y",null=True,blank=True)
    is_public = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    #configs = models.ForeignKey(StudyPlanConfigs,on_delete=models.CASCADE)

    # up_votes = models.IntegerField(default=0,blank=True)
    # down_votes = models.IntegerField(default=0,blank=True)
    #description = models.CharField(max_length=500,blank=True,default='')

class StudyPlanConfigs(models.Model):
    subject = models.CharField(max_length=1000)
    contentLayer = models.IntegerField(choices=[(member.value, member.name) for member in ContentEnum])
    schoolLevel = models.CharField(max_length=30)
    startPoint = models.CharField(max_length=1000,blank=True,default='')
    learnSpeed = models.IntegerField(choices=[(member.value, member.name) for member in LearnSpeedEnum])
    aiComplexity = models.IntegerField(choices=[(member.value, member.name) for member in AIComplexityEnum])
    studyPlan = models.ForeignKey(StudyPlan,on_delete=models.CASCADE,related_name='study_config')

class Topic(models.Model):
    index = models.IntegerField()
    title = models.CharField(max_length=500)
    content = models.CharField(max_length=10000)
    study_plan = models.ForeignKey(StudyPlan,related_name='study_topic',on_delete=models.CASCADE)



