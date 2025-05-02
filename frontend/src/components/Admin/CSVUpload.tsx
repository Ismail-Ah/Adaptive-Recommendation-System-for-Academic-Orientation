import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Diploma } from '../../types/index'; // keep your type import

export const CSVUpload: React.FC = () => {
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
      if (droppedFile.type === 'text/csv') {
        setFile(droppedFile);
        setUploadResult({ success: false, message: '' });
      } else {
        setUploadResult({ success: false, message: 'Please upload a CSV file.' });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv') {
        setFile(selectedFile);
        setUploadResult({ success: false, message: '' });
      } else {
        setUploadResult({ success: false, message: 'Please upload a CSV file.' });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadResult({ success: false, message: '' });

    try {
      const text = await file.text();
      const result = parseCSV(text);

      if (result.success) {
        setUploadResult({
          success: true,
          message: `Successfully parsed ${result.diplomas.length} diplomas!`,
          diplomas: result.diplomas
        });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setUploadResult({ success: false, message: result.message });
      }
    } catch (error) {
      setUploadResult({ success: false, message: 'Error parsing CSV file. Please check the format.' });
    } finally {
      setIsUploading(false);
    }
  };

  const parseCSV = (csvText: string): { success: boolean; message: string; diplomas: Diploma[] } => {
    const lines = csvText.split('\n');
    if (lines.length < 2) {
      return { success: false, message: 'The CSV file is empty or badly formatted.', diplomas: [] };
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const requiredFields = [
      'nom_Diplome', 'ecole', 'career', 'employement_Opportunities',
      'filiere', 'duree', 'ville', 'matieres_Diplome', 'matieres_Etudiant'
    ];

    const missingFields = requiredFields.filter(field => !headers.includes(field));
    if (missingFields.length > 0) {
      return { success: false, message: `Missing headers: ${missingFields.join(', ')}`, diplomas: [] };
    }

    const diplomas: Diploma[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = parseCSVLine(lines[i]);
      if (values.length !== headers.length) {
        errors.push(`Line ${i + 1}: Expected ${headers.length} columns, got ${values.length}`);
        continue;
      }

      const diploma: Partial<Diploma> = { id: uuidv4() };

      headers.forEach((header, index) => {
        const value = values[index].trim();

        switch (header) {
          case 'nom_Diplome':
          case 'ecole':
          case 'ancienne_Diplome':
          case 'filiere':
          case 'ville':
          case 'mention_Bac':
            diploma[header as keyof Diploma] = value;
            break;
          case 'duree':
            const dureeNum = parseInt(value);
            if (isNaN(dureeNum) || dureeNum <= 0) {
              errors.push(`Line ${i + 1}: Invalid duree "${value}".`);
            } else {
              diploma.duree = dureeNum;
            }
            break;
          case 'career':
          case 'employement_Opportunities':
          case 'matieres_Diplome':
          case 'matieres_Etudiant':
            if (value.startsWith('[') && value.endsWith(']')) {
              const arrayStr = value.slice(1, -1);
              diploma[header as keyof Diploma] = arrayStr.split('|').map(v => v.trim());
            } else {
              diploma[header as keyof Diploma] = value ? [value] : [];
            }
            break;
        }
      });

      // Validate all required
      const missingValues = requiredFields.filter(field => {
        const val = diploma[field as keyof Diploma];
        if (field === 'duree') return typeof val !== 'number' || val <= 0;
        if (Array.isArray(val)) return val.length === 0;
        return !val;
      });

      if (missingValues.length > 0) {
        errors.push(`Line ${i + 1}: Missing/invalid fields: ${missingValues.join(', ')}`);
      } else {
        diplomas.push(diploma as Diploma);
      }
    }

    if (errors.length > 0) {
      return { success: false, message: errors.slice(0, 5).join('\n'), diplomas: [] };
    }

    return { success: true, message: '', diplomas };
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  };

  const clearFile = () => {
    setFile(null);
    setUploadResult({ success: false, message: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Upload CSV File</h2>

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
          <p className="text-xs text-gray-500">CSV files only</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
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
          {isUploading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </div>
    </div>
  );
};
