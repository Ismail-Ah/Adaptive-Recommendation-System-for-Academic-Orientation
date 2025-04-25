from rest_framework import serializers

class DiplomaRecommendationInputSerializer(serializers.Serializer):
    Matieres_Etudiant = serializers.ListField(
        child=serializers.CharField(),
        help_text="List of student subjects (e.g., ['Physique', 'Mathématiques'])"
    )
    Career = serializers.ListField(
        child=serializers.CharField(),
        help_text="List of career interests (e.g., ['Construction', 'Ingénierie'])"
    )
    Filiere = serializers.CharField(
        help_text="Filiere (e.g., 'SP')"
    )
    Durée = serializers.IntegerField(
        required=False,
        allow_null=True,
        min_value=1,
        help_text="Duration in years (optional)"
    )
    Mention_Bac = serializers.ChoiceField(
        choices=['Passable', 'Assez Bien', 'Bien', 'Très Bien', 'Mention Très Bien'],
        required=False,
        allow_blank=True,
        help_text="Bac mention (optional)"
    )

class DiplomaRecommendationOutputSerializer(serializers.Serializer):
    Nom_Diplôme = serializers.CharField()
    Ecole = serializers.CharField()
    Ville = serializers.CharField()

    Durée = serializers.IntegerField(allow_null=True)
    Matieres_Diplome = serializers.ListField(child=serializers.CharField())
    Ancienne_Diplome = serializers.ListField(child=serializers.CharField())
    Employement_Opportunities = serializers.ListField(child=serializers.CharField())
    Matieres_Etudiant = serializers.ListField(child=serializers.CharField())
    Career = serializers.ListField(child=serializers.CharField())
    Filiere = serializers.ListField(child=serializers.CharField(), allow_empty=True)
    Mention_Bac = serializers.CharField(allow_blank=True)
    match_percentage = serializers.FloatField()