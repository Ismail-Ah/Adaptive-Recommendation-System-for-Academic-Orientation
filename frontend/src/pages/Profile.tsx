import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Save, UserCircle, BookOpen, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Define types for User and form data


interface FormData {
  email: string;
  name: string;
  year: string;
  filiere: string;
  interests: string[];
  subjects: string[];
  careerAspirations: string[];
  duree: number;
  montionBac: string;
}

// Predefined options (typed as const arrays)
const availableInterests = [
  'Mathématiques',
  'Physique',
  'Chimie',
  'Sciences de la Vie et de la Terre',
  'Informatique',
  'Économie et Gestion',
  'Littérature',
  'Philosophie',
] as const;

const availableBacMentions = ['Passable', 'Assez Bien', 'Bien', 'Très Bien'] as const;

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    year: '1ère Bac',
    filiere: '',
    interests: [],
    subjects: [],
    careerAspirations: [],
    duree: 2,
    montionBac: '',
  });
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [availableFilieres, setAvailableFilieres] = useState<string[]>([]);
  const [availableStudyDurations, setAvailableStudyDurations] = useState<number[]>([]);
  const [availableCareerAspirations, setAvailableCareerAspirations] = useState<string[]>([]);
  const [availableBacMentions, setAvailableBacMentions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, filieresRes, dureesRes, careersRes, mentionsRes] = await Promise.all([
          fetch('http://localhost:8080/api/diplomas/subjects-etud'),
          fetch('http://localhost:8080/api/diplomas/filiers'),
          fetch('http://localhost:8080/api/diplomas/durees'),
          fetch('http://localhost:8080/api/diplomas/careers'),
          fetch('http://localhost:8080/api/diplomas/mentions')
        ]);

        const [subjectsData, filieresData, dureesData, careersData, mentionsData] = await Promise.all([
          subjectsRes.json(),
          filieresRes.json(),
          dureesRes.json(),
          careersRes.json(),
          mentionsRes.json()
        ]);

        setAvailableSubjects(subjectsData);
        setAvailableFilieres(filieresData);
        setAvailableStudyDurations(dureesData);
        setAvailableCareerAspirations(careersData);
        setAvailableBacMentions(mentionsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load form data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        name: user.name || '',
        year: user.year || '1ère Bac',
        filiere: user.filiere || '',
        interests: user.interests || [],
        subjects: user.subjects || [],
        careerAspirations: user.careerAspirations || [],
        duree: user.duree !== undefined ? user.duree : 2,
        montionBac: user.montionBac || '',
      });
    }
  }, [user]);

  const handleAddItem = (field: keyof Pick<FormData, 'interests' | 'subjects' | 'careerAspirations'>): void => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const handleRemoveItem = (field: keyof Pick<FormData, 'interests' | 'subjects' | 'careerAspirations'>, index: number): void => {
    const newItems = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newItems });
  };

  const handleItemChange = (
    field: keyof Pick<FormData, 'interests' | 'subjects' | 'careerAspirations'>,
    index: number,
    value: string
  ): void => {
    const newItems = [...formData[field]];
    newItems[index] = value;
    setFormData({ ...formData, [field]: newItems });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      console.log('Profile updated successfully');
      setTimeout(() => setIsSubmitting(false), 600);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl rounded-2xl overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} border`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full shadow-md">
              <UserCircle className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Profil Étudiant</h1>
              <p className="mt-1 text-blue-100 text-lg">Personnalisez vos informations académiques</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  disabled
                  className={`block w-full rounded-xl ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-500'} px-4 py-3 shadow-sm focus:ring-0`}
                  aria-disabled="true"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nom Complet
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`block w-full rounded-xl ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'} px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duree-200`}
                  placeholder="Entrez votre nom complet"
                />
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-xl ${isDarkMode ? 'border-gray-600' : 'border-gray-100'} border shadow-sm`}>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-indigo-600'}`} />
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Information du bac</h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-6">
                  {/* Année Académique */}
                  <div className="w-1/3">
                    <label htmlFor="year" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Année Académique
                    </label>
                    <select
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className={`w-full rounded-xl ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'} px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all`}
                    >
                      <option value="">Sélectionnez une année</option>
                      <option value="1ère Bac">1ère Bac</option>
                      <option value="2ème Bac">2ème Bac</option>
                    </select>
                  </div>

                  {/* Filière */}
                  <div className="w-1/3">
                    <label htmlFor="filiere" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Filière
                    </label>
                    <select
                      id="filiere"
                      value={formData.filiere}
                      onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
                      disabled={!formData.year}
                      className={`w-full rounded-xl ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'} px-4 py-3 shadow-sm transition-all focus:ring-indigo-500 focus:border-indigo-500 ${
                        !formData.year ? (isDarkMode ? "bg-gray-800 cursor-not-allowed" : "bg-gray-200 cursor-not-allowed") : ""
                      }`}
                    >
                      <option value="">Sélectionnez une filière</option>
                      {availableFilieres.map((filiere) => (
                        <option key={filiere} value={filiere}>
                          {filiere}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mention Bac */}
                  <div className="w-1/3">
                    <label htmlFor="montionBac" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Mention Bac
                    </label>
                    <select
                      id="montionBac"
                      value={formData.montionBac}
                      onChange={(e) => setFormData({ ...formData, montionBac: e.target.value })}
                      disabled={!formData.year || formData.year !== "2ème Bac"}
                      className={`w-full rounded-xl ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'} px-4 py-3 shadow-sm transition-all focus:ring-indigo-500 focus:border-indigo-500 ${
                        !formData.year || formData.year !== "2ème Bac" ? (isDarkMode ? "bg-gray-800 cursor-not-allowed" : "bg-gray-200 cursor-not-allowed") : ""
                      }`}
                    >
                      <option value="">Sélectionnez une mention</option>
                      {availableBacMentions.map((mention) => (
                        <option key={mention} value={mention}>
                          {mention}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="duree" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Durée d&apos;Étude Voulue Post-Bac (années)
              </label>
              <select
                id="duree"
                value={formData.duree}
                onChange={(e) => setFormData({ ...formData, duree: Number(e.target.value) })}
                className={`w-full rounded-xl ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'} px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all`}
              >
                <option value="">Sélectionnez une durée</option>
                {availableStudyDurations.map((duree) => (
                  <option key={duree} value={duree}>
                    {duree} ans
                  </option>
                ))}
              </select>
            </div>

            {/* Subjects Section */}
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-xl ${isDarkMode ? 'border-gray-600' : 'border-gray-100'} border shadow-sm`}>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-indigo-600'}`} />
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Matières</h3>
              </div>
              <div className="space-y-4">
                {formData.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center gap-4 animate-fade-in">
                    <select
                      value={subject}
                      onChange={(e) => handleItemChange('subjects', index, e.target.value)}
                      className={`block w-full rounded-xl ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'} px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duree-200`}
                    >
                      <option value="">Sélectionnez une matière</option>
                      {availableSubjects.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('subjects', index)}
                      className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-600' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'} rounded-full transition-all duree-200`}
                      aria-label="Supprimer cette matière"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddItem('subjects')}
                  className={`w-full flex items-center justify-center py-3 px-4 border border-dashed ${isDarkMode ? 'border-blue-400 text-blue-400 hover:bg-gray-600 hover:border-blue-300' : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400'} rounded-xl transition-all duree-200`}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Ajouter une Matière
                </button>
              </div>
            </div>

            {/* Career Aspirations Section */}
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-xl ${isDarkMode ? 'border-gray-600' : 'border-gray-100'} border shadow-sm`}>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-indigo-600'}`} />
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Aspirations Professionnelles</h3>
              </div>
              <div className="space-y-4">
                {formData.careerAspirations.map((aspiration, index) => (
                  <div key={index} className="flex items-center gap-4 animate-fade-in">
                    <select
                      value={aspiration}
                      onChange={(e) => handleItemChange('careerAspirations', index, e.target.value)}
                      className={`block w-full rounded-xl ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'} px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duree-200`}
                    >
                      <option value="">Sélectionnez une aspiration</option>
                      {availableCareerAspirations.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('careerAspirations', index)}
                      className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-600' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'} rounded-full transition-all duree-200`}
                      aria-label="Supprimer cette aspiration"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddItem('careerAspirations')}
                  className={`w-full flex items-center justify-center py-3 px-4 border border-dashed ${isDarkMode ? 'border-blue-400 text-blue-400 hover:bg-gray-600 hover:border-blue-300' : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400'} rounded-xl transition-all duree-200`}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Ajouter une Aspiration
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center items-center gap-2 py-4 px-6 border border-transparent shadow-md text-base font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duree-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="inline-block h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les Modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;