import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { Upload, AlertCircle, CheckCircle, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Diploma } from '../../types/index';

export const CSVUpload: React.FC = () => {
  const BACKEND_URL_CHANGEMENT="http://localhost:8086";
  const { token } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; diplomas?: Diploma[] }>({ success: false, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/json') {
        setFile(droppedFile);
        setUploadResult({ success: false, message: '' });
      } else {
        setUploadResult({ success: false, message: 'Please upload a JSON file.' });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/json') {
        setFile(selectedFile);
        setUploadResult({ success: false, message: '' });
      } else {
        setUploadResult({ success: false, message: 'Please upload a JSON file.' });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadResult({ success: false, message: '' });

    try {
      const text = await file.text();
      const result = parseJSON(text);

      if (result.success) {
        const uploadPromises = result.diplomas.map(async (diploma) => {
          // Prepare payload to match DiplomaUpdateDTO
          const payload = {
            nomDiplome: diploma.nom_Diplome,
            ecole: diploma.ecole,
            ville: diploma.ville,
            duree: diploma.duree,
            mentionBac: diploma.mention_Bac,
            filiere: diploma.filiere,
            career: diploma.career,
            employmentOpportunities: diploma.employement_Opportunities,
            ancienneDiplome: diploma.ancienne_Diplome,
            matieresDiplome: diploma.matieres_Diplome,
            matieresEtudiant: diploma.matieres_Etudiant
          };
          await axios.post('http://localhost:8080/api/diplomas/create', payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const response2 = await fetch(`${BACKEND_URL_CHANGEMENT}/api/diplomas-updated`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }          });
          console.log(response2);
        });

        await Promise.all(uploadPromises);
        setUploadResult({
          success: true,
          message: `Successfully uploaded ${result.diplomas.length} diplomas!`,
          diplomas: result.diplomas
        });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setUploadResult({ success: false, message: result.message });
      }
    } catch (error) {
      setUploadResult({ success: false, message: 'Error uploading diplomas. Please check the file or server connection.' });
    } finally {
      setIsUploading(false);
    }
  };

  const parseJSON = (jsonText: string): { success: boolean; message: string; diplomas: Diploma[] } => {
    try {
      const data = JSON.parse(jsonText);
      const diplomas = Array.isArray(data) ? data : [data];

      const requiredFields = [
        'nomDiplome', 'ecole', 'ville', 'duree', 'filiere', 'career',
        'employmentOpportunities', 'matieresDiplome', 'matieresEtudiant'
      ];

      const errors: string[] = [];
      const validDiplomas: Diploma[] = [];

      diplomas.forEach((diploma, index) => {
        const missingFields = requiredFields.filter(field => {
          const value = diploma[field];
          if (field === 'duree') return typeof value !== 'number' || value <= 0;
          if (['filiere', 'career', 'employmentOpportunities', 'matieresDiplome', 'matieresEtudiant'].includes(field))
            return !Array.isArray(value) || value.length === 0;
          return !value;
        });

        if (missingFields.length > 0) {
          errors.push(`Diploma ${index + 1}: Missing or invalid fields: ${missingFields.join(', ')}`);
        } else {
          validDiplomas.push({
            id: uuidv4(),
            nom_Diplome: diploma.nomDiplome,
            ecole: diploma.ecole,
            ville: diploma.ville,
            duree: diploma.duree,
            mention_Bac: diploma.mentionBac || '',
            filiere: diploma.filiere,
            career: diploma.career,
            employement_Opportunities: diploma.employmentOpportunities,
            ancienne_Diplome: diploma.ancienneDiplome || [],
            matieres_Diplome: diploma.matieresDiplome,
            matieres_Etudiant: diploma.matieresEtudiant
          });
        }
      });

      if (errors.length > 0) {
        return { success: false, message: errors.slice(0, 5).join('\n'), diplomas: [] };
      }

      return { success: true, message: '', diplomas: validDiplomas };
    } catch (error) {
      return { success: false, message: 'Invalid JSON format.', diplomas: [] };
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadResult({ success: false, message: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Upload JSON File</h2>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <Upload className="h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => fileInputRef.current?.click()}
            >
              Click to upload
            </button>{' '}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">JSON files only</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {file && (
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md mt-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Upload className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="inline-flex text-gray-400 hover:text-gray-500 ml-4"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {uploadResult.message && (
        <div className={`rounded-md mt-4 p-4 ${uploadResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {uploadResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${uploadResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {uploadResult.success ? 'Success!' : 'Error'}
              </h3>
              <div className="mt-2 text-sm">
                <p>{uploadResult.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload JSON'}
        </button>
      </div>
    </div>
  );
};