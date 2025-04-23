from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from .recommender import DiplomaRecommender
from .serializers import DiplomaRecommendationInputSerializer, DiplomaRecommendationOutputSerializer
import os

class DiplomaRecommendationAPI(APIView):
    authentication_classes = []  # No authentication
    permission_classes = [AllowAny]  # Allow all access

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Initialize recommender with data.csv
        data_path = os.path.join(settings.BASE_DIR, 'exported_data.csv')
        self.recommender = DiplomaRecommender(data_path)

    @csrf_exempt
    def post(self, request):
        serializer = DiplomaRecommendationInputSerializer(data=request.data)
        if serializer.is_valid():
            user_features = serializer.validated_data
            # Ensure Mention_Bac defaults to 'Passable' if empty
            user_features['Mention_Bac'] = user_features.get('Mention_Bac', 'Passable')

            try:
                # Get recommendations
                recommendations = self.recommender.recommend(user_features, top_n=5)
                # Serialize output
                output_serializer = DiplomaRecommendationOutputSerializer(recommendations.to_dict('records'), many=True)
                return Response(output_serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {'error': f"Error generating recommendations: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)