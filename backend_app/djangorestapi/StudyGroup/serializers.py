
from .models import GroupUpDownVote,PrivateGroupMember
from rest_framework import serializers

class UpDownVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupUpDownVote
        fields = '__all__'
    
    def validate_vote(self,value):
        if value <= 1 and value >= -1:
            return value
        
        raise serializers.ValidationError("Invalid ai complexity option")


class GetUpDownVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupUpDownVote
        fields = ['vote']

# from StudyGeneration.serializers import StudyPlanSerializer
from StudyGeneration.serializers import StudyPlanSerializer

class StudyUpDownVoteSerializer(serializers.ModelSerializer):

    study_plan = StudyPlanSerializer(many=False,read_only=True) #dont use if same name of var; source = 'study_plan'
    votes = serializers.IntegerField(read_only=True)

    class Meta:
        model = GroupUpDownVote
        fields = '__all__'