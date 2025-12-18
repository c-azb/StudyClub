

from rest_framework import serializers
from .models import StudyPlan,Topic, StudyPlanConfigs
from .src.configs_setup import ContentEnum,LearnSpeedEnum,AIComplexityEnum,school_level_options
from StudyGroup.serializers import GetUpDownVoteSerializer

class StudyConfigsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyPlanConfigs
        fields = '__all__'
    
    def validate_startPoint(self,value):
        return value.strip()

    def validate_subject(self,value):
        if len(value) <= 5:
            raise serializers.ValidationError("Invalid subject len, should be bigger than 5 characters")
        return value.strip()

    def validate_contentLayer(self, value):
        try:
            ContentEnum(value)
            return value
        except:
            raise serializers.ValidationError("Invalid content layer option")

    def validate_learnSpeed(self, value):
        try:
            LearnSpeedEnum(value)
            return value
        except:
            raise serializers.ValidationError("Invalid learn speed option")

    def validate_aiComplexity(self, value):
        try:
            AIComplexityEnum(value)
            return value
        except:
            raise serializers.ValidationError("Invalid ai complexity option")

class StudyPlanSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = StudyPlan
        fields = '__all__'

    def validate_title(self,value):
        if len(value) <= 5:
            raise serializers.ValidationError("Invalid title len, should be bigger than 5 characters")
        return value.strip()

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'

class StudyTopicSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(source="study_topic", many=True, read_only=True)
    votes = serializers.IntegerField(read_only=True)
    my_vote = serializers.IntegerField(read_only=True,default=True)
    

    class Meta:
        model = StudyPlan
        fields = '__all__'



class StudysOverviewSerializer(serializers.ModelSerializer):
    subject = serializers.CharField(source="configs.subject", read_only=True)
    votes = serializers.IntegerField(read_only=True)

    class Meta:
        model = StudyPlan
        fields = ['id','title','image','is_public','created_at','updated_at','user','configs','votes','subject']
