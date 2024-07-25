from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response 
from .serializer import UserSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

class TestView(APIView):
    
    def get(self,format=None):
        print("API was called")
        return Response("Good", status=201)


class UserView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        print("creating user")

        user_data = request.data
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid(raise_exception=False):
            user_serializer.save()
            return Response({"user":user_serializer.data}, status=201) 
        
        return Response({"msg":"ERR"}, status=400)
    

    def get(self, reqeust, format=None):
        print("getting user")
        if reqeust.user.is_authenticated == False or reqeust.user.is_active == False:
            return Response("invalid credentials", status=400)
        
        user = UserSerializer(reqeust.user)
        print(user)
        return Response(user.data, status=201)
    

class UserLoginView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):

        if request.user.is_authenticated == False or request.user.is_active == False:
            return Response("invalid credentials", status=403)
        
        user = UserSerializer(request.user)
        return Response(user.data, status=201)
    
    def post(self, request, format=None):
        user_obj = User.objects.filter(username=request.data['username']).first() or User.objects.filter(email=request.data['email']).first()

        if user_obj is None:
            return Response("invalid credentials", status=400)