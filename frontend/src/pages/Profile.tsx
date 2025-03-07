import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Save, UserCircle, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Adjust path to your AuthContext

// Define types for User and form data
interface User {
  email: string;
  name: string;
  year: string;
  interests: string[];
  subjects: string[];
  careerAspirations: string[];
}

interface FormData {
  email: string;
  name: string;
  year: string;
  interests: string[];
  subjects: string[];
  careerAspirations: string[];
}

// Predefined options (typed as const arrays)
const availableInterests = [
  'Mathématiques', 'Physique', 'Chimie', 'Sciences de la Vie et de la Terre',
  'Informatique', 'Économie et Gestion', 'Littérature', 'Philosophie',
] as const;
const availableSubjects = [
  'Mathématiques', 'Physique-Chimie', 'Sciences de la Vie et de la Terre',
  'Français', 'Arabe', 'Histoire-Géographie', 'Philosophie',
] as const;
const availableCareerAspirations = [
  'Ingénierie', 'Médecine', 'Droit', 'Économie', 'Enseignement',
  'Technologie de l’Information', 'Arts et Lettres',
] as const;

type InterestOption = typeof availableInterests[number];
type SubjectOption = typeof availableSubjects[number];
type CareerAspirationOption = typeof availableCareerAspirations[number];

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth(); // Assume useAuth returns { user: User, updateProfile: (data: FormData) => Promise<void> }
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    year: '1ère Bac',
    interests: [],
    subjects: [],
    careerAspirations: [],
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        name: user.name || '',
        year: user.year || '1ère Bac',
        interests: user.interests || [],
        subjects: user.subjects || [],
        careerAspirations: user.careerAspirations || [],
      });
    }
  }, [user]);

  const handleAddItem = (field: keyof Pick<FormData, 'interests' | 'subjects' | 'careerAspirations'>): void => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''], // Add empty string for new item
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
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <UserCircle className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Profil Étudiant</h1>
              <p className="text-blue-100">Gérez vos informations académiques</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  disabled // Email is the identifier, non-editable
                  className="block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 px-4 py-3"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom Complet
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                  placeholder="Entrez votre nom complet"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Année Académique
                </label>
                <select
                  id="year"
                  value={formData.year}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                >
                  <option value="1ère Bac">1ère Bac</option>
                  <option value="2ème Bac">2ème Bac</option>
                </select>
              </div>
            </div>

            {/* Interests Section */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">Intérêts</h3>
                </div>
              </div>
              <div className="space-y-4">
                {formData.interests.map((interest, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <select
                      value={interest}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleItemChange('interests', index, e.target.value)
                      }
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                    >
                      <option value="">Sélectionnez un intérêt</option>
                      {availableInterests.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('interests', index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddItem('interests')}
                  className="w-full flex items-center justify-center py-3 px-4 border border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Ajouter un Intérêt
                </button>
              </div>
            </div>

            {/* Subjects Section */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">Matières</h3>
                </div>
              </div>
              <div className="space-y-4">
                {formData.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <select
                      value={subject}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleItemChange('subjects', index, e.target.value)
                      }
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
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
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddItem('subjects')}
                  className="w-full flex items-center justify-center py-3 px-4 border border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Ajouter une Matière
                </button>
              </div>
            </div>

            {/* Career Aspirations Section */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">Aspirations Professionnelles</h3>
                </div>
              </div>
              <div className="space-y-4">
                {formData.careerAspirations.map((aspiration, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <select
                      value={aspiration}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleItemChange('careerAspirations', index, e.target.value)
                      }
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
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
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddItem('careerAspirations')}
                  className="w-full flex items-center justify-center py-3 px-4 border border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200"
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
                className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
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