from rest_framework import serializers
from .models import Location

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model=Location
        fields='__all__'