from django.urls import path
from . import views

urlpatterns = [
    path('api/recommend/', views.DiplomaRecommendationAPI.as_view()),
    path('api/retrain/', views.RetrainModelAPI.as_view(), name='retrain'),
]