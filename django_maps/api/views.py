from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import LocationSerializer,Location
# Create your views here.
@api_view(['GET'])
def overview(request):
    urls={
        'save_location':'save-location/',
        'get_location':'get-location/'
    }
    return Response(urls)

@api_view(['POST'])
def save_location(request):
    serializer=LocationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        print(request.data)
        return Response(serializer.data)
    return Response(serializer.errors)

@api_view(['GET'])
def get_location(request):
    locations=Location.objects.all()
    serializer=LocationSerializer(locations,many=True)
    return Response(serializer.data)