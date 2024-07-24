from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response 
# Create your views here.

class TestView(APIView):

    def get(self,  format=None):
        print("API was called")
        return Response("Good", status=201)
