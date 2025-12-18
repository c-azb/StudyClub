
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
