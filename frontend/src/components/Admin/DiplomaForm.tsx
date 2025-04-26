import React, { useState } from 'react';
import { Diploma, MentionBacOption } from '../../types/index';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react';

interface DiplomaFormProps {
  onSuccess?: () => void;
}

export const DiplomaForm: React.FC<DiplomaFormProps> = ({ onSuccess }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [diplomas, setDiplomas] = useState<Diploma[]>([]); // local diplomas array

  const [formData, setFormData] = useState<Omit<Diploma, 'id'>>({
    nom_Diplome: '',
    ecole: '',
    career: [],
    employement_Opportunities: [],
    ancienne_Diplome: '',
    filiere: '',
    duree: 0,
    mention_Bac: '',
    ville: '',
    matieres_Diplome: [],
    matieres_Etudiant: [],
  });

  // Form states for adding items
  const [careerInput, setCareerInput] = useState('');
  const [opportunityInput, setOpportunityInput] = useState('');
  const [matiereDiplomeInput, setMatiereDiplomeInput] = useState('');
  const [matiereEtudiantInput, setMatiereEtudiantInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'duree') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddItem = (field: keyof typeof formData, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (!value.trim()) return;
    if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] as string[]), value.trim()]
      });
      setter('');
    }
  };

  const handleRemoveItem = (field: keyof typeof formData, index: number) => {
    if (Array.isArray(formData[field])) {
      const newArray = [...(formData[field] as string[])];
      newArray.splice(index, 1);
      setFormData({ ...formData, [field]: newArray });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newDiploma: Diploma = {
      id: uuidv4(),
      ...formData
    };

    // Locally add the diploma
    setDiplomas((prev) => [...prev, newDiploma]);

    setFormSubmitted(true);

    // Reset form
    setFormData({
      nom_Diplome: '',
      ecole: '',
      career: [],
      employement_Opportunities: [],
      ancienne_Diplome: '',
      filiere: '',
      duree: 0,
      mention_Bac: '',
      ville: '',
      matieres_Diplome: [],
      matieres_Etudiant: [],
    });

    if (onSuccess) {
      onSuccess();
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

<form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <label htmlFor="nom_Diplome" className="block text-sm font-medium text-gray-700">
              Nom Diplôme *
            </label>
            <input
              type="text"
              id="nom_Diplome"
              name="nom_Diplome"
              required
              value={formData.nom_Diplome}
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
            <label htmlFor="filiere" className="block text-sm font-medium text-gray-700">
              Filière *
            </label>
            <input
              type="text"
              id="filiere"
              name="filiere"
              required
              value={formData.filiere}
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
            <label htmlFor="mention_Bac" className="block text-sm font-medium text-gray-700">
              Mention Bac
            </label>
            <select
              id="mention_Bac"
              name="mention_Bac"
              value={formData.mention_Bac}
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
          
          <div>
            <label htmlFor="ancienne_Diplome" className="block text-sm font-medium text-gray-700">
              Ancienne Diplôme
            </label>
            <input
              type="text"
              id="ancienne_Diplome"
              name="ancienne_Diplome"
              value={formData.ancienne_Diplome}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        {/* Array inputs */}
        <div className="space-y-6">
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
                onClick={() => handleAddItem('employement_Opportunities', opportunityInput, setOpportunityInput)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.employement_Opportunities.map((item, index) => (
                <div key={index} className="inline-flex items-center bg-green-100 rounded-full px-3 py-1 text-sm text-green-800">
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('employement_Opportunities', index)}
                    className="ml-1 text-green-500 hover:text-green-700 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            {formData.employement_Opportunities.length === 0 && (
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
                onClick={() => handleAddItem('matieres_Diplome', matiereDiplomeInput, setMatiereDiplomeInput)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.matieres_Diplome.map((item, index) => (
                <div key={index} className="inline-flex items-center bg-amber-100 rounded-full px-3 py-1 text-sm text-amber-800">
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('matieres_Diplome', index)}
                    className="ml-1 text-amber-500 hover:text-amber-700 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            {formData.matieres_Diplome.length === 0 && (
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
                onClick={() => handleAddItem('matieres_Etudiant', matiereEtudiantInput, setMatiereEtudiantInput)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.matieres_Etudiant.map((item, index) => (
                <div key={index} className="inline-flex items-center bg-purple-100 rounded-full px-3 py-1 text-sm text-purple-800">
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('matieres_Etudiant', index)}
                    className="ml-1 text-purple-500 hover:text-purple-700 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            {formData.matieres_Etudiant.length === 0 && (
              <p className="mt-1 text-xs text-red-500">Please add at least one student subject</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              !formData.nom_Diplome || 
              !formData.ecole || 
              !formData.filiere || 
              !formData.ville || 
              formData.duree <= 0 || 
              formData.career.length === 0 || 
              formData.employement_Opportunities.length === 0 || 
              formData.matieres_Diplome.length === 0 || 
              formData.matieres_Etudiant.length === 0
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
