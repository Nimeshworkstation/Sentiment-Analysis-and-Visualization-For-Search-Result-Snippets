from djoser.serializers import UserCreateSerializer
from .models import UserAccount,ImageModel,Study,Query,Result,NextAvailableID,LexiconSentimentAnalysis
from rest_framework import serializers

class UserCreateSerializer(UserCreateSerializer):
    class Meta:
        model = UserAccount
        fields = ['id','email','name','password']


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount  # Replace with your custom user model
        fields = ('email',)  # Include the email field


class ImageModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageModel
        fields = ('id', 'url', 'caption', 'description')




class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'

class QuerySerializer(serializers.ModelSerializer):
    snippets = ResultSerializer(many=True, read_only=True)
    class Meta:
        model = Query
        fields = '__all__'

class StudySerializer(serializers.ModelSerializer):
    queries = QuerySerializer(many=True, read_only=True)
    snippets = ResultSerializer(source='snippets_related', many=True, read_only=True)

    class Meta:
        model = Study
        fields = '__all__'

class NextAvailableIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = NextAvailableID
        fields = '__all__'



class LexiconSentimentAnalysisSerializer(serializers.ModelSerializer):
    search_engine = serializers.SerializerMethodField()

    class Meta:
        model = LexiconSentimentAnalysis
        fields = '__all__'

    def get_search_engine(self, obj):
        # Retrieve the search_engine from the related Result model
        if obj.result:
            return obj.result.search_engine
        return None
