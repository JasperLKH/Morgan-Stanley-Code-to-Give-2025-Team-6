from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def testGet(request):
    """
    A simple test endpoint to verify that the API is working.
    """
    return Response({"message": "GET request successful!"})

@api_view(['POST'])
def testPost(request):
    """
    A simple test endpoint to verify that the API is working with POST requests.
    """
    data = request.data
    return Response({"message": "POST request successful!", "data": data})

@api_view(['PUT'])
def testPut(request):
    """
    A simple test endpoint to verify that the API is working with PUT requests.
    """
    data = request.data
    return Response({"message": "PUT request successful!", "data": data})

@api_view(['DELETE'])
def testDelete(request):
    """
    A simple test endpoint to verify that the API is working with DELETE requests.
    """
    return Response({"message": "DELETE request successful!"})
# Create your views here.
