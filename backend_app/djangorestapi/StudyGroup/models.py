from django.db import models
from django.contrib.auth.models import User
from StudyGeneration.models import StudyPlan

# Create your models here.

class GroupUpDownVote(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    study_plan = models.ForeignKey(StudyPlan,on_delete=models.CASCADE)
    vote = models.IntegerField(default=0)

class PrivateGroupMember(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    study_plan = models.ForeignKey(StudyPlan,related_name="group_votes",on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False,blank=True)
    is_owner = models.BooleanField(default=False,blank=True)
    


    #privateGroupMembers -> group_id, user_id, isAdmin
		#-> isAdmin can invite other