import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MentionBacOption } from '../../types/index';
import { X } from 'lucide-react';

interface DiplomaFormProps {
  onSuccess?: () => void;
}

interface FormData {
  nomDiplome: string;
  ecole: string;
  career: string[];
  employmentOpportunities: string[];
  ancienneDiplome: string[];
  filiere: string[];
  duree: number;
  mentionBac: string;
  ville: string;
  matieresDiplome: string[];
  matieresEtudiant: string[];
}

export const DiplomaForm: React.FC<DiplomaFormProps> = ({ onSuccess }) => {
  const { isAdmin, token } = useAuth();
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nomDiplome: '',
    ecole: '',
    career: [],
    employmentOpportunities: [],
    ancienneDiplome: [],
    filiere: [],
    duree: 0,
    mentionBac: '',
    ville: '',
    matieresDiplome: [],
    matieresEtudiant: [],
  });

  // Form states for adding items
  const [careerInput, setCareerInput] = useState('');
  const [opportunityInput, setOpportunityInput] = useState('');
  const [matiereDiplomeInput, setMatiereDiplomeInput] = useState('');
  const [matiereEtudiantInput, setMatiereEtudiantInput] = useState('');
  const [filiereInput, setFiliereInput] = useState('');
  const [ancienneDiplomeInput, setAncienneDiplomeInput] = useState('');

  if (!isAdmin()) {
    navigate('/');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'duree') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddItem = (field: keyof FormData, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (!value.trim()) return;
    if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] as string[]), value.trim()]
      });
      setter('');
    }
  };

  const handleRemoveItem = (field: keyof FormData, index: number) => {
    if (Array.isArray(formData[field])) {
      const newArray = [...(formData[field] as string[])];
      newArray.splice(index, 1);
      setFormData({ ...formData, [field]: newArray });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare payload to match DiplomaUpdateDTO
    const payload = {
      nomDiplome: formData.nomDiplome,
      ecole: formData.ecole,
      career: formData.career,
      employmentOpportunities: formData.employmentOpportunities,
      ancienneDiplome: formData.ancienneDiplome,
      filiere: formData.filiere,
      duree: formData.duree,
      mentionBac: formData.mentionBac,
      ville: formData.ville,
      matieresDiplome: formData.matieresDiplome,
      matieresEtudiant: formData.matieresEtudiant
    };

    try {
      await axios.post('http://localhost:8080/api/diplomas/create', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setFormSubmitted(true);
      setError(null);

      // Reset form
      setFormData({
        nomDiplome: '',
        ecole: '',
        career: [],
        employmentOpportunities: [],
        ancienneDiplome: [],
        filiere: [],
        duree: 0,
        mentionBac: '',
        ville: '',
        matieresDiplome: [],
        matieresEtudiant: [],
      });
      setCareerInput('');
      setOpportunityInput('');
      setMatiereDiplomeInput('');
      setMatiereEtudiantInput('');
      setFiliereInput('');
      setAncienneDiplomeInput('');

      if (onSuccess) {
        onSuccess();
      }

      // Navigate back to AdminDiplomas after a short delay to show success message
      setTimeout(() => {
        navigate('/AdminDiplomas');
      }, 1500);

    } catch (err) {
      setError('Failed to create diploma');
      setFormSubmitted(false);
    }
  };

  const mentionBacOptions: MentionBacOption[] = ['Très Bien', 'Bien', 'Assez Bien', ''];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Diploma</h2>

      {formSubmitted && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Diploma added successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <label htmlFor="nomDiplome" className="block text-sm font-medium text-gray-700">
              Nom Diplôme *
            </label>
            <input
              type="text"
              id="nomDiplome"
              name="nomDiplome"
              required
              value={formData.nomDiplome}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="ecole" className="block text-sm font-medium text-gray-700">
              École *
            </label>
            <input
              type="text"
              id="ecole"
              name="ecole"
              required
              value={formData.ecole}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
              Ville *
            </label>
            <input
              type="text"
              id="ville"
              name="ville"
              required
              value={formData.ville}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="duree" className="block text-sm font-medium text-gray-700">
              Durée (années) *
            </label>
            <input
              type="number"
              id="duree"
              name="duree"
              min="1"
              required
              value={formData.duree || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="mentionBac" className="block text-sm font-medium text-gray-700">
              Mention Bac
            </label>
            <select
              id="mentionBac"
              name="mentionBac"
              value={formData.mentionBac}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Sélectionnez une mention</option>
              {mentionBacOptions.filter(opt => !!opt).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Array inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filière *
            </label>
            <div className="flex">
              <input
                type="text"
                value={filiereInput}
                onChange={(e) => setFiliereInput(e.target.value)}
                className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add a filière"
              />
              <button
                type="button"
                onClick={() => handleAddItem('filiere', filiereInput, setFiliereInput)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.filiere.map((item, index) => (
                <div key={index} className="inline-flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm text-blue-800">
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('filiere', index)}
                    className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            {formData.filiere.length === 0 && (
              <p className="mt-1 text-xs text-red-500">Please add at least one filière</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Career Paths *
            </label>
            <div className="flex">
              <input
                type="text"
                value={careerInput}
                onChange={(e) => setCareerInput(e.target.value)}
                className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add a career path"
              />
              <button
                type="button"
                onClick={() => handleAddItem('career', careerInput, setCareerInput)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.career.map((item, index) => (
                <div key={index} className="inline-flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm text-blue-800">
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('career', index)}
                    className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            {formData.career.length === 0 && (
              <p className="mt-1 text-xs text-red-500">Please add at least one career path</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Opportunities *
            </label>
            <div className="flex">
              <input
                type="text"
                value={opportunityInput}
                onChange={(e) => setOpportunityInput(e.target.value)}
                className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add an employment opportunity"
              />
              <button
                type="button"
                onClick={() => handleAddItem('employmentOpportunities', opportunityInput, setOpportunityInput)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.employmentOpportunities.map((item, index) => (
                <div key={index} className="inline-flex items-center bg-green-100 rounded-full px-3 py-1 text-sm text-green-800">
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('employmentOpportunities', index)}
                    className="ml-1 text-green-500 hover:text-green-700 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            {formData.employmentOpportunities.length === 0 && (
              <p className="mt-1 text-xs text-red-500">Please add at least one employment opportunity</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matières Diplôme *
            </label>
            <div className="flex">
              <input
                type="text"
                value={matiereDiplomeInput}
                onChange={(e) => setMatiereDiplomeInput(e.target.value)}
                className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add a subject"
              />
              <button
                type="button"
                onClick={() => handleAddItem('matieresDiplome', matiereDiplomeInput, setMatiereDiplomeInput)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.matieresDiplome.map((item, index) => (
                <div key={index} className="inline-flex items-center bg-amber-100 rounded-full px-3 py-1 text-sm text-amber-800">
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('matieresDiplome', index)}
                    className="ml-1 text-amber-500 hover:text-amber-700 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            {formData.matieresDiplome.length === 0 && (
              <p className="mt-1 text-xs text-red-500">Please add at least one subject</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matières Étudiant *
            </label>
            <div className="flex">
              <input
                type="text"
                value={matiereEtudiantInput}
                onChange={(e) => setMatiereEtudiantInput(e.target.value)}
                className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add a student subject"
              />
              <button
                type="button"
                onClick={() => handleAddItem('matieresEtudiant', matiereEtudiantInput, setMatiereEtudiantInput)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.matieresEtudiant.map((item, index) => (
                <div key={index} className="inline-flex items-center bg-purple-100 rounded-full px-3 py-1 text-sm text-purple-800">
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('matieresEtudiant', index)}
                    className="ml-1 text-purple-500 hover:text-purple-700 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            {formData.matieresEtudiant.length === 0 && (
              <p className="mt-1 text-xs text-red-500">Please add at least one student subject</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ancienne Diplôme
            </label>
            <div className="flex">
              <input
                type="text"
                value={ancienneDiplomeInput}
                onChange={(e) => setAncienneDiplomeInput(e.target.value)}
                className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add a previous diploma"
              />
              <button
                type="button"
                onClick={() => handleAddItem('ancienneDiplome', ancienneDiplomeInput, setAncienneDiplomeInput)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.ancienneDiplome.map((item, index) => (
                <div key={index} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-800">
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('ancienneDiplome', index)}
                    className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin-diplomas')}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              !formData.nomDiplome || 
              !formData.ecole || 
              formData.filiere.length === 0 || 
              !formData.ville || 
              formData.duree <= 0 || 
              formData.career.length === 0 || 
              formData.employmentOpportunities.length === 0 || 
              formData.matieresDiplome.length === 0 || 
              formData.matieresEtudiant.length === 0
            }
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Diploma
          </button>
        </div>
      </form>
    </div>
  );
};