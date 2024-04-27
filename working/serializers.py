from rest_framework import serializers
from .models import Vacancy, CustomUser
from django.contrib.auth.hashers import make_password


class VacancySerializer(serializers.ModelSerializer):
    #user = serializers.PrimaryKeyRelatedField(read_only=True)
    #user = serializers.HiddenField(default=serializers.CurrentUserDefault)
    
    class Meta:
        model = Vacancy
        fields = '__all__'
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['userId'] = user.id
        return Vacancy.objects.create(**validated_data)
"""
class UserSerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    password = serializers.HiddenField(default=serializers.CurrentUserDefault)
    date_joined = serializers.HiddenField(default=serializers.CurrentUserDefault)
    is_active = serializers.HiddenField(default=serializers.CurrentUserDefault)
    is_staff = serializers.HiddenField(default=serializers.CurrentUserDefault)


    class Meta:
        model = CustomUser
        fields = "__all__"
"""


""""""
class UserSerializer(serializers.ModelSerializer):
    def validate_password(self, value: str) -> str:
    
        return make_password(value)
    
    class Meta:
        model = CustomUser
        fields = "__all__"
