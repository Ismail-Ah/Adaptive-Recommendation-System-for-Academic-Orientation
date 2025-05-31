import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, RefreshCw, BookOpen, Briefcase, ChevronDown, ChevronUp, X, Filter, Star, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import JourneyMap from '../components/JourneyMap';

// Define types for diploma recommendations
interface DiplomaRecommendation {
  Nom_Diplôme: string;
  Ecole: string;
  Ville: string;
  Durée: number;
  Matieres_Diplome: string[];
  Ancienne_Diplome: string[];
  Employement_Opportunities: string[];
  Matieres_Etudiant: string[];
  Career: string[];
  Filiere: string[];
  Mention_Bac: string;
  match_percentage: number;
  feedback?: {
    like: boolean;
    rating?: number;
    notes?: string;
  };
  rating?: number;
}

interface FilterOptions {
  duration: number | null;
  mention: string | null;
  city: string | null;
}

// Custom hook for fetching recommendations
const useRecommendations = () => {
  const { user, token } = useAuth();
  const [recommendations, setRecommendations] = useState<DiplomaRecommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRecommendations = async () => {
    if (!token || !user) {
      console.error('No token or user available');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('api/v1/recommend-diplomas', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes('No diploma')) {
          setRecommendations([]);
          return;
        }
        throw new Error(`Failed to fetch recommendations: ${response.status}`);
      }

      const data: DiplomaRecommendation[] = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user, token]);

  return { recommendations, isLoading, refreshRecommendations: fetchRecommendations };
};

// Details Modal Component
const DetailsModal: React.FC<{
  diploma: DiplomaRecommendation;
  onClose: () => void;
}> = ({ diploma, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{diploma.Nom_Diplôme}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Fermer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Informations Générales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">École:</span> {diploma.Ecole}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Ville:</span> {diploma.Ville}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Durée:</span> {diploma.Durée} ans
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Mention Bac Requise:</span> {diploma.Mention_Bac}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Filières Compatibles:</span> {diploma.Filiere.join(', ')}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Matières du Diplôme</h3>
          <div className="flex flex-wrap gap-2">
            {diploma.Matieres_Diplome.map((matiere) => (
              <span key={matiere} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {matiere}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Opportunités d'Emploi</h3>
          <div className="flex flex-wrap gap-2">
            {diploma.Employement_Opportunities.map((opportunity) => (
              <span key={opportunity} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {opportunity}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Carrières Possibles</h3>
          <div className="flex flex-wrap gap-2">
            {diploma.Career.map((career) => (
              <span key={career} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {career}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Anciens Diplômes Acceptés</h3>
          <div className="flex flex-wrap gap-2">
            {diploma.Ancienne_Diplome.map((diplome) => (
              <span key={diplome} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {diplome}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Add new SchemaModal component after DetailsModal
const SchemaModal: React.FC<{
  diploma: DiplomaRecommendation;
  onClose: () => void;
}> = ({ diploma, onClose }) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'schema' | 'journey'>('schema');

  // Generate schema content based on diploma data and user profile
  const generateSchemaContent = (diploma: DiplomaRecommendation) => {
    // Calculate subject matches
    const requiredSubjects = diploma.Matieres_Diplome;
    const studentSubjects = diploma.Matieres_Etudiant;
    const missingSubjects = studentSubjects.filter(subject => !requiredSubjects.includes(subject));
    const strongSubjects = studentSubjects.filter(subject => requiredSubjects.includes(subject));

    // Calculate career alignment
    const careerAlignment = diploma.Career.filter(career => 
      user?.careerAspirations?.includes(career)
    );

    // Calculate interest alignment
    const interestAlignment = diploma.Matieres_Diplome.filter(subject =>
      user?.interests?.includes(subject)
    );

    return {
      currentStrengths: {
        subjects: strongSubjects,
        careers: careerAlignment,
        interests: interestAlignment
      },
      areasToFocus: {
        subjects: missingSubjects,
        careers: diploma.Career.filter(career => !user?.careerAspirations?.includes(career)),
        interests: diploma.Matieres_Diplome.filter(subject => !user?.interests?.includes(subject))
      }
    };
  };

  const schema = generateSchemaContent(diploma);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-start mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Schéma de Réussite - {diploma.Nom_Diplôme}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            } transition-colors duration-200`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2 px-1 ${
              activeTab === 'schema'
                ? isDarkMode
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-blue-600 border-b-2 border-blue-600'
                : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Schéma de Réussite
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`pb-2 px-1 ${
              activeTab === 'journey'
                ? isDarkMode
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-blue-600 border-b-2 border-blue-600'
                : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Parcours de Formation
          </button>
        </div>

        {/* Content */}
        {activeTab === 'schema' ? (
        <div className="space-y-6">
          {/* Current Strengths */}
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-2 flex items-center`}>
              <span className="mr-2">💪</span> Vos Points Forts
            </h3>
            <div className="space-y-4">
              {/* Subject Strengths */}
              {schema.currentStrengths.subjects.length > 0 && (
                <div>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    Matières Maîtrisées
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {schema.currentStrengths.subjects.map((subject) => (
                      <span key={subject} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode 
                          ? 'bg-green-900 text-green-200 border-green-800' 
                          : 'bg-green-50 text-green-700 border-green-100'
                      } border`}>
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Alignment */}
              {schema.currentStrengths.careers.length > 0 && (
                <div>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    Carrières Alignées avec Vos Objectifs
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {schema.currentStrengths.careers.map((career) => (
                      <span key={career} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode 
                          ? 'bg-blue-900 text-blue-200 border-blue-800' 
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      } border`}>
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interest Alignment */}
              {schema.currentStrengths.interests.length > 0 && (
                <div>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    Domaines d'Intérêt Correspondants
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {schema.currentStrengths.interests.map((interest) => (
                      <span key={interest} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode 
                          ? 'bg-purple-900 text-purple-200 border-purple-800' 
                          : 'bg-purple-50 text-purple-700 border-purple-100'
                      } border`}>
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Areas to Focus */}
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-2 flex items-center`}>
              <span className="mr-2">🎯</span> Domaines à Renforcer
            </h3>
            <div className="space-y-4">
              {/* Subject Areas */}
              {schema.areasToFocus.subjects.length > 0 && (
                <div>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    Matières à Renforcer
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {schema.areasToFocus.subjects.map((subject) => (
                      <span key={subject} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode 
                          ? 'bg-yellow-900 text-yellow-200 border-yellow-800' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                      } border`}>
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Areas */}
              {schema.areasToFocus.careers.length > 0 && (
                <div>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    Carrières à Explorer
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {schema.areasToFocus.careers.map((career) => (
                      <span key={career} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode 
                          ? 'bg-orange-900 text-orange-200 border-orange-800' 
                          : 'bg-orange-50 text-orange-700 border-orange-100'
                      } border`}>
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        ) : (
          <JourneyMap
            currentStrengths={schema.currentStrengths}
            areasToFocus={schema.areasToFocus}
            diploma={{
              nom_diplôme: diploma.Nom_Diplôme,
              ecole: diploma.Ecole,
              ville: diploma.Ville,
              durée: diploma.Durée,
              employement_opportunities: diploma.Employement_Opportunities,
              career: diploma.Career,
              match_percentage: diploma.match_percentage,
              matieres_diplome: diploma.Matieres_Diplome,
              rating: diploma.rating || 0,
              ancienne_diplome: diploma.Ancienne_Diplome
            }}
          />
        )}
      </div>
    </div>
  );
};

// Reusable DiplomaCard Component with Feedback and Details
const DiplomaCard: React.FC<{
  diploma: DiplomaRecommendation;
  onFeedback: (name: string, liked: boolean, rating?: number, notes?: string) => void;
  onDelete: (name: string) => void;
}> = ({ diploma, onFeedback, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [rating, setRating] = useState<number>(diploma.feedback?.rating || 0);
  const [notes, setNotes] = useState<string>(diploma.feedback?.notes || '');
  const { isDarkMode } = useTheme();

  const handleRatingSubmit = () => {
    onFeedback(diploma.Nom_Diplôme, true, rating, notes);
    setShowRatingModal(false);
  };

  const handleDelete = () => {
    onDelete(diploma.Nom_Diplôme);
  };

  // Generate a description based on the diploma's characteristics
  const generateDescription = (diploma: DiplomaRecommendation) => {
    const duration = diploma.Durée;
    const mention = diploma.Mention_Bac;
    const field = diploma.Filiere[0]; // Using the first field as primary
    const city = diploma.Ville;
    const school = diploma.Ecole;
    const career = diploma.Career[0]; // Using the first career option

    return `Ce diplôme de ${duration} ans, proposé par ${school} à ${city}, est idéal pour les étudiants ayant obtenu ${mention}. 
    Il s'adresse particulièrement aux étudiants intéressés par le domaine de ${field}. 
    À l'issue de cette formation, les diplômés peuvent prétendre à des postes dans le secteur de ${career}. 
    Le programme couvre un large éventail de matières spécialisées et offre de nombreuses opportunités professionnelles.`;
  };

  return (
    <>
    <div className={`border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}>
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} rounded-lg`}>
                <BookOpen className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{diploma.Nom_Diplôme}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{diploma.Ecole} - {diploma.Ville}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
              diploma.match_percentage >= 90 ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200' : 
              diploma.match_percentage >= 80 ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 
              'bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {diploma.match_percentage.toFixed(1)}% Match
            </span>
              <div className="flex items-center gap-2">
                {diploma.feedback?.rating && (
                  <div className="flex items-center gap-1">
                    <Star className={`h-5 w-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {diploma.feedback.rating}/5
                    </span>
                  </div>
                )}
                {diploma.feedback && (
                  <button
                    onClick={handleDelete}
                    className={`p-2 rounded-lg ${
                      isDarkMode 
                        ? 'text-red-400 hover:bg-gray-700 hover:text-red-300' 
                        : 'text-red-600 hover:bg-red-50 hover:text-red-800'
                    } transition-colors duration-200`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
          </div>
        </div>

        {/* Description */}
        <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed`}>
            {generateDescription(diploma)}
          </p>
          <div className="flex justify-end mt-2">
            <ChevronDown className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} />
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className={`flex flex-wrap gap-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} border-t border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} py-3`}>
          <div className="flex items-center">
            <span className="mr-2">⏱️</span>
            <span className="font-medium">{diploma.Durée} ans</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">📜</span>
              <span className="font-medium">
                {diploma.Mention_Bac === "3" ? "Mention Assez Bien" :
                 diploma.Mention_Bac === "2" ? "Mention Bien" :
                 diploma.Mention_Bac === "1" ? "Mention Très Bien" :
                 "Passable"}
              </span>
          </div>
        </div>

          {/* Update Action Buttons */}
        <div className="flex gap-3">
          <button
              onClick={() => setShowSchemaModal(true)}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium ${
                isDarkMode 
                  ? 'bg-purple-900 text-purple-200 hover:bg-purple-800 border-purple-800' 
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100'
              } transition-colors duration-200 border`}
              aria-label="Voir le schéma de réussite"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Schéma
            </button>
            <button
              onClick={() => setShowRatingModal(true)}
            className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium ${
              isDarkMode 
                ? 'bg-green-900 text-green-200 hover:bg-green-800 border-green-800' 
                : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
            } transition-colors duration-200 border`}
              aria-label="Noter ce diplôme"
            >
              <Star className="h-4 w-4 mr-2" />
              Noter
            </button>
            <button
              onClick={() => onFeedback(diploma.Nom_Diplôme, !diploma.feedback?.like)}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium ${
                diploma.feedback?.like
                  ? isDarkMode 
                    ? 'bg-green-900 text-green-200 hover:bg-green-800 border-green-800' 
                    : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-100'
              } transition-colors duration-200 border`}
              aria-label={diploma.feedback?.like ? "Retirer le like" : "Marquer comme utile"}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
              {diploma.feedback?.like ? "Aimé" : "Utile"}
            </button>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full mx-4`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Noter ce diplôme
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Note
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-full ${
                        rating >= star
                          ? isDarkMode
                            ? 'text-yellow-400 bg-gray-700'
                            : 'text-yellow-500 bg-yellow-50'
                          : isDarkMode
                            ? 'text-gray-400 bg-gray-700'
                            : 'text-gray-300 bg-gray-50'
                      }`}
                    >
                      <Star className="h-6 w-6" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Notes (optionnel)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`w-full rounded-lg p-2 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-200'
                      : 'border-gray-300 text-gray-700'
                  } focus:border-blue-500 focus:ring-blue-500`}
                  rows={3}
                  placeholder="Ajoutez vos commentaires..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-gray-100'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Annuler
          </button>
          <button
                  onClick={handleRatingSubmit}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
          >
                  Enregistrer
          </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Expandable Content */}
        {isExpanded && (
          <div className={`space-y-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div>
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                <span className="mr-2">📚</span> Matières du diplôme
              </h4>
              <div className="flex flex-wrap gap-2">
                {diploma.Matieres_Diplome.map((matiere) => (
                  <span key={matiere} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode 
                      ? 'bg-blue-900 text-blue-200 border-blue-800' 
                      : 'bg-blue-50 text-blue-700 border-blue-100'
                  } border`}>
                    {matiere}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                <span className="mr-2">💼</span> Opportunités d'emploi
              </h4>
              <div className="flex flex-wrap gap-2">
                {diploma.Employement_Opportunities.map((opportunity) => (
                  <span key={opportunity} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode 
                      ? 'bg-green-900 text-green-200 border-green-800' 
                      : 'bg-green-50 text-green-700 border-green-100'
                  } border`}>
                    {opportunity}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                <span className="mr-2">🎯</span> Carrières
              </h4>
              <div className="flex flex-wrap gap-2">
                {diploma.Career.map((career) => (
                  <span key={career} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode 
                      ? 'bg-purple-900 text-purple-200 border-purple-800' 
                      : 'bg-purple-50 text-purple-700 border-purple-100'
                  } border`}>
                    {career}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                <span className="mr-2">📜</span> Anciens Diplômes Acceptés
              </h4>
              <div className="flex flex-wrap gap-2">
                {diploma.Ancienne_Diplome.map((diplome) => (
                  <span key={diplome} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode 
                      ? 'bg-amber-900 text-amber-200 border-amber-800' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  } border`}>
                    {diplome}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      {/* Add Schema Modal */}
      {showSchemaModal && (
        <SchemaModal
          diploma={diploma}
          onClose={() => setShowSchemaModal(false)}
        />
      )}
    </>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <RefreshCw className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
      <p className="text-lg text-gray-700">Chargement des recommandations...</p>
    </div>
  </div>
);

// Main Recommendations Component
const Recommendations: React.FC = () => {
  const { recommendations, isLoading, refreshRecommendations } = useRecommendations();
  const { isDarkMode } = useTheme();
  const { user, token } = useAuth();
  const [viewMode, setViewMode] = useState<'recommendations' | 'journey'>('recommendations');
  const [filters, setFilters] = useState<FilterOptions>({
    duration: null,
    mention: null,
    city: null,
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string | number | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      duration: null,
      mention: null,
      city: null,
    });
  };

  const filteredRecommendations = recommendations?.filter(diploma => {
    if (filters.duration && diploma.Durée !== filters.duration) return false;
    if (filters.mention) {
      const diplomaMention = 
        diploma.Mention_Bac === "3" ? "Mention Assez Bien" :
        diploma.Mention_Bac === "2" ? "Mention Bien" :
        diploma.Mention_Bac === "1" ? "Mention Très Bien" :
        "Passable";
      if (diplomaMention !== filters.mention) return false;
    }
    if (filters.city && !diploma.Ville.toLowerCase().includes(filters.city.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.match_percentage - a.match_percentage);

  // Get unique values for filters
  const uniqueDurations = [...new Set(recommendations?.map(d => d.Durée) || [])].sort();
  const uniqueMentions = [...new Set(recommendations?.map(d => d.Mention_Bac) || [])].map(mention => 
    mention === "3" ? "Mention Assez Bien" :
    mention === "2" ? "Mention Bien" :
    mention === "1" ? "Mention Très Bien" :
    "Passable"
  );
  const uniqueCities = [...new Set(recommendations?.map(d => d.Ville) || [])].sort();

  const handleFeedback = async (name: string, liked: boolean, rating?: number, notes?: string) => {
    if (!user || !token) return;

    try {
      // Find the current diploma to check if it has existing feedback
      const currentDiploma = recommendations?.find(d => d.Nom_Diplôme === name);
      
      // Prepare the feedback data
      const feedbackData = {
        email: user.email,
        diplomeName: name,
        like: liked,
        // If there's existing feedback, include it, otherwise use defaults
        rating: rating ?? currentDiploma?.feedback?.rating ?? 0,
        notes: notes ? [notes] : currentDiploma?.feedback?.notes ?? []
      };

      await axios.post('http://localhost:8088/api/update-feedback', feedbackData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Refresh recommendations to update feedback status
      refreshRecommendations();
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const handleDelete = async (diplomeName: string) => {
    if (!user || !token) return;

    try {
      await axios.delete(`http://localhost:8088/api/feedback/${user.email}/${diplomeName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Refresh recommendations to update feedback status
      refreshRecommendations();
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  // Generate schema content based on diploma data and user profile
  const generateSchemaContent = (diploma: DiplomaRecommendation) => {
    // Calculate subject matches
    const requiredSubjects = diploma.Matieres_Diplome;
    const studentSubjects = diploma.Matieres_Etudiant;
    const missingSubjects = studentSubjects.filter(subject => !requiredSubjects.includes(subject));
    const strongSubjects = studentSubjects.filter(subject => requiredSubjects.includes(subject));

    // Calculate career alignment
    const careerAlignment = diploma.Career.filter(career => 
      user?.careerAspirations?.includes(career)
    );

    // Calculate interest alignment
    const interestAlignment = diploma.Matieres_Diplome.filter(subject =>
      user?.interests?.includes(subject)
    );

    return {
      currentStrengths: {
        subjects: strongSubjects,
        careers: careerAlignment,
        interests: interestAlignment
      },
      areasToFocus: {
        subjects: missingSubjects,
        careers: diploma.Career.filter(career => !user?.careerAspirations?.includes(career)),
        interests: diploma.Matieres_Diplome.filter(subject => !user?.interests?.includes(subject))
      }
    };
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-700">Aucune recommandation disponible</p>
          <button
            onClick={refreshRecommendations}
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Rafraîchir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${isDarkMode ? 'from-gray-900 to-gray-800' : 'from-gray-50 to-white'} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {viewMode === 'recommendations' ? 'Vos Recommandations de Diplômes' : 'Parcours de Formation'}
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {viewMode === 'recommendations' 
                ? 'Basées sur votre profil académique et vos intérêts'
                : 'Visualisez votre parcours vers le diplôme recommandé'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode(viewMode === 'recommendations' ? 'journey' : 'recommendations')}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                isDarkMode 
                  ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' 
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              } transition-colors duration-200 shadow-sm`}
            >
              {viewMode === 'recommendations' ? (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Voir la Carte de Parcours
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Voir les Recommandations
                </>
              )}
            </button>
            <button
              onClick={refreshRecommendations}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Rafraîchir
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm mb-6`}>
          <div className="flex items-center gap-2 mb-4">
            <Filter className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Filtres</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Durée</label>
              <select
                value={filters.duration || ''}
                onChange={(e) => handleFilterChange('duration', e.target.value ? Number(e.target.value) : null)}
                className={`w-full rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'} focus:border-blue-500 focus:ring-blue-500`}
              >
                <option value="">Toutes les durées</option>
                {uniqueDurations.map(duration => (
                  <option key={duration} value={duration}>{duration} ans</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Mention Bac</label>
              <select
                value={filters.mention || ''}
                onChange={(e) => handleFilterChange('mention', e.target.value || null)}
                className={`w-full rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'} focus:border-blue-500 focus:ring-blue-500`}
              >
                <option value="">Toutes les mentions</option>
                {uniqueMentions.map(mention => (
                  <option key={mention} value={mention}>{mention}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Ville</label>
              <select
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value || null)}
                className={`w-full rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'} focus:border-blue-500 focus:ring-blue-500`}
              >
                <option value="">Toutes les villes</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} flex items-center`}
            >
              <X className="h-4 w-4 mr-1" />
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <LoadingSpinner />
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Aucune recommandation disponible</p>
            <button
              onClick={refreshRecommendations}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Rafraîchir les recommandations
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'recommendations' ? (
        <div className="grid grid-cols-1 gap-6">
                {filteredRecommendations?.map((recommendation) => (
            <DiplomaCard
                    key={recommendation.Nom_Diplôme}
                    diploma={recommendation}
              onFeedback={handleFeedback}
              onDelete={handleDelete}
            />
          ))}
        </div>
            ) : (
              <div className="space-y-6">
                {filteredRecommendations?.map((recommendation) => {
                  const schema = generateSchemaContent(recommendation);
                  return (
                    <div key={recommendation.Nom_Diplôme} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                      <JourneyMap
                        currentStrengths={schema.currentStrengths}
                        areasToFocus={schema.areasToFocus}
                        diploma={{
                          nom_diplôme: recommendation.Nom_Diplôme,
                          ecole: recommendation.Ecole,
                          ville: recommendation.Ville,
                          durée: recommendation.Durée,
                          employement_opportunities: recommendation.Employement_Opportunities,
                          career: recommendation.Career,
                          match_percentage: recommendation.match_percentage,
                          matieres_diplome: recommendation.Matieres_Diplome,
                          rating: recommendation.rating || 0,
                          ancienne_diplome: recommendation.Ancienne_Diplome
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;