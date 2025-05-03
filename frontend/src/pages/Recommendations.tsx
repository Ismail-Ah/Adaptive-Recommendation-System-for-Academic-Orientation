import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, RefreshCw, BookOpen, Briefcase, ChevronDown, ChevronUp, X, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

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

  const calculateMatchPercentage = (diploma: DiplomaRecommendation) => {
    // Calculate match based on student's subjects and diploma subjects
    const studentSubjects = diploma.Matieres_Etudiant;
    const diplomaSubjects = diploma.Matieres_Diplome;
    
    // Count matching subjects
    const matchingSubjects = studentSubjects.filter(subject => 
      diplomaSubjects.some(diplomaSubject => 
        diplomaSubject.toLowerCase().includes(subject.toLowerCase()) ||
        subject.toLowerCase().includes(diplomaSubject.toLowerCase())
      )
    ).length;

    // Calculate percentage (50% weight for subjects match)
    const subjectMatchPercentage = (matchingSubjects / Math.max(studentSubjects.length, diplomaSubjects.length)) * 50;

    // Add 50% if the student's bac mention matches or exceeds the required mention
    const mentionMatch = diploma.Mention_Bac === "Mention Très Bien" ? 50 : 
                        diploma.Mention_Bac === "Bien" ? 40 : 
                        diploma.Mention_Bac === "Assez Bien" ? 30 : 20;

    return subjectMatchPercentage + mentionMatch;
  };

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
      // Calculate match percentage for each diploma
      const dataWithMatch = data.map(diploma => ({
        ...diploma,
        match_percentage: calculateMatchPercentage(diploma)
      }));
      setRecommendations(dataWithMatch);
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

// Reusable DiplomaCard Component with Feedback and Details
const DiplomaCard: React.FC<{
  diploma: DiplomaRecommendation;
  onFeedback: (name: string, liked: boolean) => void;
}> = ({ diploma, onFeedback }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isDarkMode } = useTheme();

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
            <span className="font-medium">{diploma.Mention_Bac}</span>
          </div>
        </div>

        {/* Feedback Buttons */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFeedback(diploma.Nom_Diplôme, true);
            }}
            className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium ${
              isDarkMode 
                ? 'bg-green-900 text-green-200 hover:bg-green-800 border-green-800' 
                : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
            } transition-colors duration-200 border`}
            aria-label="Marquer comme utile"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Utile
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFeedback(diploma.Nom_Diplôme, false);
            }}
            className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium ${
              isDarkMode 
                ? 'bg-red-900 text-red-200 hover:bg-red-800 border-red-800' 
                : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-100'
            } transition-colors duration-200 border`}
            aria-label="Marquer comme pas utile"
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Pas Utile
          </button>
        </div>

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
      </div>
    </div>
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
    if (filters.mention && diploma.Mention_Bac !== filters.mention) return false;
    if (filters.city && !diploma.Ville.toLowerCase().includes(filters.city.toLowerCase())) return false;
    return true;
  });

  // Get unique values for filters
  const uniqueDurations = [...new Set(recommendations?.map(d => d.Durée) || [])].sort();
  const uniqueMentions = [...new Set(recommendations?.map(d => d.Mention_Bac) || [])];
  const uniqueCities = [...new Set(recommendations?.map(d => d.Ville) || [])].sort();

  const handleFeedback = (name: string, liked: boolean) => {
    // TODO: Implement feedback handling
    console.log(`Feedback for ${name}: ${liked ? 'liked' : 'disliked'}`);
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
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Vos Recommandations de Diplômes</h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Basées sur votre profil académique et vos intérêts</p>
          </div>
          <div className="flex items-center gap-4">
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

        <div className="grid grid-cols-1 gap-6">
          {filteredRecommendations?.map((diploma) => (
            <DiplomaCard
              key={diploma.Nom_Diplôme}
              diploma={diploma}
              onFeedback={handleFeedback}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;