from rest_framework import serializers

class DiplomaRecommendationInputSerializer(serializers.Serializer):
    Matieres_Etudiant = serializers.ListField(child=serializers.CharField(), required=True)
    Career = serializers.ListField(child=serializers.CharField(), required=True)
    Filiere = serializers.CharField(required=True)
    Durée = serializers.IntegerField(required=True)
    Mention_Bac = serializers.CharField(required=False, allow_blank=True)

class DiplomaRecommendationOutputSerializer(serializers.Serializer):
    Nom_Diplôme = serializers.CharField()
    Ecole = serializers.CharField()
    Employement_Opportunities = serializers.ListField(child=serializers.CharField())
    Ville = serializers.CharField()
    Matieres_Etudiant = serializers.ListField(child=serializers.CharField())
    Ancienne_Diplome = serializers.ListField(child=serializers.CharField())  # Changed to ListField
    Durée = serializers.IntegerField()
    Matieres_Diplome = serializers.ListField(child=serializers.CharField())
    Career = serializers.ListField(child=serializers.CharField())
    Filiere = serializers.ListField(child=serializers.CharField())
    Mention_Bac = serializers.CharField()
    match_percentage = serializers.FloatField()