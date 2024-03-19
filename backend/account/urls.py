"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from .views import CheckEmailExistence,ImageView
from account import views


urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('api/images/', ImageView.as_view(), name='image-detail'),
    path('api/create-study/',views.CreateStudy.as_view(),name='study'),
    path('api/next-available-id/', views.NextAvailableIDView.as_view(), name='next-available-id'),
    path('api/studies/', views.StudyListView.as_view(), name='study-list'),
    path('api/study/delete/<str:user>/<str:study_name>/', views.StudyDeleteView.as_view(), name='study-delete'),
    path('api/check-study/<str:user>/<str:studyName>/',views.CheckStudyNameExistence.as_view(), name = 'check_studyname_exists'),
    path('api/queries/<int:study_id>/', views.ListQuery.as_view(), name='queries'),


    path('api/results/<str:study_id>/',views.ListResults.as_view(),name='result'),
    path('api/<str:email>/', CheckEmailExistence.as_view(), name='check_email_exists'),


    path('api/sentiment-analysis/<int:study_id>/', views.LexiconSentimentAnalysisView.as_view(), name='lexicon-sentiment-analysis'),
    
]

