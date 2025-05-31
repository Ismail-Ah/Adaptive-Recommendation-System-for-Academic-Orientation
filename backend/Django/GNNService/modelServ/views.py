from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from .recommender import DiplomaRecommender
from .serializers import DiplomaRecommendationInputSerializer, DiplomaRecommendationOutputSerializer
import os
import logging
from django.utils.decorators import method_decorator

logger = logging.getLogger(__name__)

class DiplomaRecommendationAPI(APIView):
    authentication_classes = []  # No authentication
    permission_classes = [AllowAny]  # Allow all access

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        data_path = os.path.join(settings.BASE_DIR, 'data.csv')
        model_path = os.path.join(settings.BASE_DIR, 'model.pth')
        self.recommender = DiplomaRecommender(data_path, model_path)

    @csrf_exempt
    def post(self, request):
        serializer = DiplomaRecommendationInputSerializer(data=request.data)
        if serializer.is_valid():
            user_features = serializer.validated_data
            user_features['Mention_Bac'] = user_features.get('Mention_Bac', 'Passable')
            desired_duree = user_features.get('Durée', 3)
            try:
                if self.recommender.validate_user_input(user_features):
                    predictions = self.recommender.predict(user_features, desired_duree, top_k=10)
                    output_serializer = DiplomaRecommendationOutputSerializer(predictions.to_dict('records'), many=True)
                    return Response(output_serializer.data, status=status.HTTP_200_OK)
                else:
                    logger.error("Invalid user input. Please use valid features from training data.")
                    logger.info("Check logs for valid subjects, careers, and filieres.")
                    return Response(
                        {'error': 'Invalid user input. Please use valid features.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Exception as e:
                logger.error(f"Error generating recommendations: {str(e)}")
                return Response(
                    {'error': f"Error generating recommendations: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class RetrainModelAPI(APIView):
    permission_classes = []

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        data_path = os.path.join(settings.BASE_DIR, 'data.csv')
        model_path = os.path.join(settings.BASE_DIR, 'model.pth')
        self.recommender = DiplomaRecommender(data_path, model_path)

    def get(self, request):
        try:
            self.recommender.retrain()
            return Response({"message": "Model retrained and saved successfully"}, 
                          status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error retraining model: {str(e)}")
            return Response({"error": f"Error retraining model: {str(e)}"}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)