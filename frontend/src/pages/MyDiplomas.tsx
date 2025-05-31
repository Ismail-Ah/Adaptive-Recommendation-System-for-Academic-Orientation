import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpen, Star, ThumbsUp, Filter, X, RefreshCw, Clock, MapPin, ChevronDown, ChevronUp, Target, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import JourneyMap from '../components/JourneyMap';

// Define types for feedback and diploma data
interface Note {
  id: string;
  text: string;
}

interface DiplomaFeedback {
  match_percentage: number | null;
  notes: string[];
  rating: number;
  like: boolean;
  nom_diplôme: string;
  mention_bac: string;
  matieres_diplome: string[];
  ancienne_diplome: string[];
  matieres_etudiant: string[];
  employement_opportunities: string[];
  ville: string;
  ecole: string;
  durée: number;
  filiere: string[];
  career: string[];
}

interface FilterOptions {
  type: string;
  minRating: number;
  city: string;
}

// Custom hook for fetching user's diplomas
const useMyDiplomas = () => {
  const { user, token } = useAuth();
  const [feedbacks, setFeedbacks] = useState<DiplomaFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    if (!user || !token) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(`http://localhost:8088/api/get-feedback`, 
        { email: user.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setFeedbacks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setFeedbacks([]); // Set empty array on error
      setError(null); // Clear error state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [user, token]);

  const handleDelete = async (diplomeName: string) => {
    if (!user || !token) return;
    
    try {
      await axios.delete(`http://localhost:8088/api/feedback/${user.email}/${diplomeName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Refresh the feedbacks list
      fetchFeedbacks();
    } catch (err) {
      console.error('Error deleting feedback:', err);
    }
  };

  return { feedbacks, isLoading, error, refreshFeedbacks: fetchFeedbacks, handleDelete };
};

// Details Modal Component
const DetailsModal: React.FC<{
  feedback: DiplomaFeedback;
  onClose: () => void;
  onUpdate: (update: {
    diplomeName: string;
    like: boolean;
    rating: number;
    notes: string[];
  }) => void;
}> = ({ feedback, onClose, onUpdate }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-start mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{feedback.nom_diplôme}</h2>
          <div className="flex items-center gap-4">
            {feedback.rating && (
              <div className="flex items-center gap-1">
                <Star className={`h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                <span className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feedback.rating}/5</span>
              </div>
            )}
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
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-2`}>
              Informations Générales
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="font-medium">École:</span> {feedback.ecole}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="font-medium">Ville:</span> {feedback.ville}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="font-medium">Durée:</span> {feedback.durée} ans
                </p>
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="font-medium">Mention Bac Requise:</span> {feedback.mention_bac}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="font-medium">Filières Compatibles:</span> {feedback.filiere.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Notes Preview */}
          {feedback.notes && feedback.notes.length > 0 && (
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                Notes
              </h4>
              <div className="space-y-2">
                {feedback.notes.slice(0, 4).map((note, index) => (
                  <div key={index} className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} flex-1`}>
                      {note}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newText = prompt('Edit note:', note);
                          if (newText && newText !== note) {
                            const newNotes = [...feedback.notes];
                            newNotes[index] = newText;
                            onUpdate({
                              diplomeName: feedback.nom_diplôme,
                              like: feedback.like,
                              rating: feedback.rating,
                              notes: newNotes
                            });
                          }
                        }}
                        className={`p-1 rounded-lg ${
                          isDarkMode 
                            ? 'text-blue-400 hover:bg-gray-600 hover:text-blue-300' 
                            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-800'
                        } transition-colors duration-200`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          const newNotes = [...feedback.notes];
                          newNotes.splice(index, 1);
                          onUpdate({
                            diplomeName: feedback.nom_diplôme,
                            like: feedback.like,
                            rating: feedback.rating,
                            notes: newNotes
                          });
                        }}
                        className={`p-1 rounded-lg ${
                          isDarkMode 
                            ? 'text-red-400 hover:bg-gray-600 hover:text-red-300' 
                            : 'text-red-600 hover:bg-red-50 hover:text-red-800'
                        } transition-colors duration-200`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {feedback.notes.length > 4 && (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
                    +{feedback.notes.length - 4} autres notes...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Opportunités d'Emploi */}
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-2`}>
              Opportunités d'Emploi
            </h3>
            <div className="flex flex-wrap gap-2">
              {feedback.employement_opportunities.map((opportunity) => (
                <span key={opportunity} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-green-900 text-green-200 border-green-800' 
                    : 'bg-green-50 text-green-700 border-green-100'
                } border`}>
                  {opportunity}
                </span>
              ))}
            </div>
          </div>

          {/* Carrières */}
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-2`}>
              Carrières Possibles
            </h3>
            <div className="flex flex-wrap gap-2">
              {feedback.career.map((career) => (
                <span key={career} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-amber-900 text-amber-200 border-amber-800' 
                    : 'bg-amber-50 text-amber-700 border-amber-100'
                } border`}>
                  {career}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Diploma Card Component
const DiplomaCard: React.FC<{
  feedback: DiplomaFeedback;
  onDelete: (diplomeName: string) => void;
  onUpdate: (update: {
    diplomeName: string;
    like: boolean;
    rating: number;
    notes: string[];
  }) => void;
}> = ({ feedback, onDelete, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editLike, setEditLike] = useState(feedback.like);
  const [editRating, setEditRating] = useState(feedback.rating || 0);
  const [editNotes, setEditNotes] = useState((feedback.notes && feedback.notes.length > 0) ? feedback.notes.join('\n') : '');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditSave = async () => {
    setIsSaving(true);
    await onUpdate({
      diplomeName: feedback.nom_diplôme,
      like: editLike,
      rating: editRating,
      notes: editNotes.split('\n').map(n => n.trim()).filter(Boolean)
    });
    setIsSaving(false);
    setShowEdit(false);
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
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{feedback.nom_diplôme}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{feedback.ecole} - {feedback.ville}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {feedback.rating && (
                <div className="flex items-center gap-1">
                  <Star className={`h-5 w-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feedback.rating}/5</span>
                </div>
              )}
              <button
                onClick={() => onDelete(feedback.nom_diplôme)}
                className={`p-2 rounded-lg ${isDarkMode ? 'text-red-400 hover:bg-gray-700 hover:text-red-300' : 'text-red-600 hover:bg-red-50 hover:text-red-800'} transition-colors duration-200`}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className={`flex flex-wrap gap-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} border-t border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} py-3`}>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span className="font-medium">{feedback.durée} ans</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="font-medium">{feedback.ville}</span>
            </div>
          </div>

          {/* Notes Preview */}
          {feedback.notes && feedback.notes.length > 0 && (
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                Notes
              </h4>
              <div className="space-y-2">
                {feedback.notes.slice(0, 4).map((note, index) => (
                  <div key={index} className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} flex-1`}>
                      {note}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newText = prompt('Edit note:', note);
                          if (newText && newText !== note) {
                            const newNotes = [...feedback.notes];
                            newNotes[index] = newText;
                            onUpdate({
                              diplomeName: feedback.nom_diplôme,
                              like: feedback.like,
                              rating: feedback.rating,
                              notes: newNotes
                            });
                          }
                        }}
                        className={`p-1 rounded-lg ${
                          isDarkMode 
                            ? 'text-blue-400 hover:bg-gray-600 hover:text-blue-300' 
                            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-800'
                        } transition-colors duration-200`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          const newNotes = [...feedback.notes];
                          newNotes.splice(index, 1);
                          onUpdate({
                            diplomeName: feedback.nom_diplôme,
                            like: feedback.like,
                            rating: feedback.rating,
                            notes: newNotes
                          });
                        }}
                        className={`p-1 rounded-lg ${
                          isDarkMode 
                            ? 'text-red-400 hover:bg-gray-600 hover:text-red-300' 
                            : 'text-red-600 hover:bg-red-50 hover:text-red-800'
                        } transition-colors duration-200`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {feedback.notes.length > 4 && (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
                    +{feedback.notes.length - 4} autres notes...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Career Opportunities */}
          <div>
            <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Opportunités de carrière
            </h4>
            <div className="flex flex-wrap gap-2">
              {feedback.employement_opportunities.map((career) => (
                <span key={career} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900 text-green-200 border-green-800' : 'bg-green-50 text-green-700 border-green-100'} border`}>
                  {career}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setShowDetails(true)}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'} transition-colors duration-200`}
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Voir les détails
            </button>
            <button
              onClick={() => setShowEdit(true)}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-yellow-900 text-yellow-200 hover:bg-yellow-800' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'} transition-colors duration-200`}
            >
              <Star className="h-4 w-4 mr-2" />
              Modifier le feedback
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <DetailsModal
          feedback={feedback}
          onClose={() => setShowDetails(false)}
          onUpdate={onUpdate}
        />
      )}

      {/* Edit Feedback Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full mx-4`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Modifier le feedback</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Note</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setEditRating(star)}
                      className={`p-2 rounded-full ${editRating >= star ? (isDarkMode ? 'text-yellow-400 bg-gray-700' : 'text-yellow-500 bg-yellow-50') : (isDarkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-300 bg-gray-50')}`}
                    >
                      <Star className="h-6 w-6" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notes (une par ligne)</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className={`w-full rounded-lg p-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'} focus:border-blue-500 focus:ring-blue-500`}
                  rows={3}
                  placeholder="Ajoutez vos commentaires...\nUne note par ligne."
                />
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Chaque ligne sera traitée comme une note séparée. Vous pourrez les modifier ou les supprimer individuellement.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editLike}
                  onChange={e => setEditLike(e.target.checked)}
                  id={`like-checkbox-${feedback.nom_diplôme}`}
                  className="mr-2"
                />
                <label htmlFor={`like-checkbox-${feedback.nom_diplôme}`} className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>J'aime ce diplôme</label>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowEdit(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}
                  disabled={isSaving}
                >
                  Annuler
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                  disabled={isSaving}
                >
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <RefreshCw className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
      <p className="text-lg text-gray-700">Chargement de vos diplômes...</p>
    </div>
  </div>
);

// Main MyDiplomas Component
const MyDiplomas: React.FC = () => {
  const { feedbacks, isLoading, error, refreshFeedbacks, handleDelete } = useMyDiplomas();
  const { isDarkMode } = useTheme();
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    minRating: 0,
    city: 'all'
  });
  const { user, token } = useAuth();
  const [viewMode, setViewMode] = useState<'recommendations' | 'journey'>('recommendations');

  const handleFilterChange = (key: keyof FilterOptions, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      minRating: 0,
      city: 'all'
    });
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (filters.type !== 'all' && feedback.like !== (filters.type === 'liked')) return false;
    if (filters.minRating > 0 && (!feedback.rating || feedback.rating < filters.minRating)) return false;
    if (filters.city !== 'all' && !feedback.ville.toLowerCase().includes(filters.city.toLowerCase())) return false;
    return true;
  });

  // Update feedback handler
  const handleUpdateFeedback = async ({ diplomeName, like, rating, notes }: { diplomeName: string; like: boolean; rating: number; notes: string[]; }) => {
    if (!user || !token) return;
    try {
      await axios.post('http://localhost:8088/api/update-feedback', {
        email: user.email,
        diplomeName,
        like,
        rating,
        notes
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      refreshFeedbacks();
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${isDarkMode ? 'from-gray-900 to-gray-800' : 'from-gray-50 to-white'} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mes Diplômes</h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Gérez vos diplômes sauvegardés et vos retours</p>
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
                  Voir les Diplômes
                </>
              )}
            </button>
            <button
              onClick={refreshFeedbacks}
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
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className={`w-full rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'} focus:border-blue-500 focus:ring-blue-500`}
              >
                <option value="all">Tous les diplômes</option>
                <option value="liked">Diplômes aimés</option>
                <option value="not-liked">Diplômes non aimés</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Note minimale</label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                className={`w-full rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'} focus:border-blue-500 focus:ring-blue-500`}
              >
                <option value="0">Toutes les notes</option>
                <option value="1">1 étoile et plus</option>
                <option value="2">2 étoiles et plus</option>
                <option value="3">3 étoiles et plus</option>
                <option value="4">4 étoiles et plus</option>
                <option value="5">5 étoiles</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Ville</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className={`w-full rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'} focus:border-blue-500 focus:ring-blue-500`}
              >
                <option value="all">Toutes les villes</option>
                {Array.from(new Set(feedbacks.map(f => f.ville)))
                  .filter(Boolean)
                  .sort()
                  .map(city => (
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

        {/* Empty State or Feedback List */}
        {(!feedbacks || feedbacks.length === 0) ? (
          <div className="text-center py-12">
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Vous n'avez pas encore de diplômes sauvegardés</p>
          </div>
        ) : (
          <>
            {viewMode === 'recommendations' ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredFeedbacks.map((feedback) => (
              <DiplomaCard
                key={feedback.nom_diplôme}
                feedback={feedback}
                onDelete={handleDelete}
                onUpdate={handleUpdateFeedback}
              />
            ))}
          </div>
            ) : (
              <div className="space-y-6">
                {filteredFeedbacks.map((feedback) => {
                  const schema = {
                    currentStrengths: {
                      subjects: feedback.matieres_etudiant,
                      careers: feedback.career,
                      interests: feedback.matieres_diplome
                    },
                    areasToFocus: {
                      subjects: [],
                      careers: [],
                      interests: []
                    }
                  };
                  return (
                    <div key={feedback.nom_diplôme} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                      <JourneyMap
                        currentStrengths={schema.currentStrengths}
                        areasToFocus={schema.areasToFocus}
                        diploma={{
                          nom_diplôme: feedback.nom_diplôme,
                          ecole: feedback.ecole,
                          ville: feedback.ville,
                          durée: feedback.durée,
                          employement_opportunities: feedback.employement_opportunities,
                          career: feedback.career,
                          match_percentage: feedback.match_percentage || 0,
                          matieres_diplome: feedback.matieres_diplome,
                          rating: feedback.rating || 0,
                          notes: feedback.notes,
                          ancienne_diplome: feedback.ancienne_diplome
                        }}
                        source="myDiplomas"
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

export default MyDiplomas; 