from django.urls import path
from . import views

urlpatterns = [
    path('api/recommend/', views.DiplomaRecommendationAPI.as_view()),
]