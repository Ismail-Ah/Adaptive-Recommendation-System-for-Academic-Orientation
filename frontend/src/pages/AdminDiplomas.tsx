import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, ChevronLeft, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react';

interface Diploma {
  id: string;
  nomDiplome: string;
  ecole: string;
  ville: string;
  duree: number;
  filiere: string[];
  year?: string;
  matieresDiplome: string[];
  career: string[];
  employmentOpportunities: string[];
  ancienneDiplome: string[];
  mentionBac: string;
  matieresEtudiant: string[];
}

const ITEMS_PER_PAGE = 10;

const AdminDiplomas: React.FC = () => {
  const BACKEND_URL_CHANGEMENT="http://localhost:8086";
  const { isAdmin, token } = useAuth();
  const navigate = useNavigate();
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [filteredDiplomas, setFilteredDiplomas] = useState<Diploma[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [editingDiploma, setEditingDiploma] = useState<Diploma | null>(null);
  const [formData, setFormData] = useState<Diploma | null>(null);

  if (!isAdmin()) {
    navigate('/');
    return null;
  }

  useEffect(() => {
    fetchDiplomas();
  }, [isAdmin, navigate]);

  const fetchDiplomas = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Diploma[]>('http://localhost:8080/api/diplomas/diplomas', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Map the API response and ensure array fields are arrays
      const mappedDiplomas = response.data.map((d: Diploma) => ({
        ...d,
        duree: d.duree || (d.duree?.years ? d.duree.years : d.duree),
        filiere: Array.isArray(d.filiere) ? d.filiere : [],
        matieresDiplome: Array.isArray(d.matieresDiplome) ? d.matieresDiplome : [],
        career: Array.isArray(d.career) ? d.career : [],
        employmentOpportunities: Array.isArray(d.employmentOpportunities) ? d.employmentOpportunities : [],
        ancienneDiplome: Array.isArray(d.ancienneDiplome) ? d.ancienneDiplome : [],
        matieresEtudiant: Array.isArray(d.matieresEtudiant) ? d.matieresEtudiant : [],
        mentionBac: d.mentionBac || '',
        year: d.year || undefined
      }));
      setDiplomas(mappedDiplomas);
      setFilteredDiplomas(mappedDiplomas);
      if (mappedDiplomas.length > 0) {
        console.log('Fetched diplomas:', mappedDiplomas);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch diplomas');
    } finally {
      setLoading(false);
    }
  };

  const uniqueSchools = [...new Set(diplomas.map(d => d.ecole))];
  const uniqueCities = [...new Set(diplomas.map(d => d.ville))];
  const uniqueYears = [...new Set(diplomas.map(d => d.year).filter(year => year && year !== 'null'))];
  const uniqueFilieres = [...new Set(
    diplomas
      .flatMap(d => d.filiere || [])
      .map(filiere => filiere.trim())
  )].filter(filiere => filiere !== '');

  useEffect(() => {
    let filtered = diplomas;

    if (searchTerm) {
      filtered = filtered.filter(diploma =>
        diploma.nomDiplome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diploma.ecole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diploma.ville.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSchool) {
      filtered = filtered.filter(diploma => diploma.ecole === selectedSchool);
    }

    if (selectedCity) {
      filtered = filtered.filter(diploma => diploma.ville === selectedCity);
    }

    if (selectedYear) {
      filtered = filtered.filter(diploma => diploma.year === selectedYear);
    }

    if (selectedFiliere) {
      filtered = filtered.filter(diploma =>
        diploma.filiere && diploma.filiere.includes(selectedFiliere)
      );
    }

    setFilteredDiplomas(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedSchool, selectedCity, selectedYear, selectedFiliere, diplomas]);

  const totalPages = Math.ceil(filteredDiplomas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDiplomas = filteredDiplomas.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDelete = async (name: string) => {
    if (window.confirm('Are you sure you want to delete this diploma?')) {
      try {
        await axios.delete(`http://localhost:8080/api/diplomas/delete/${encodeURIComponent(name)}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const response2 = await fetch(`${BACKEND_URL_CHANGEMENT}/api/diplomas-updated`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }          });
        console.log(response2);
        fetchDiplomas();
      } catch (err) {
        setError('Failed to delete diploma');
      }
    }
  };

  const handleEdit = (diploma: Diploma) => {
    setEditingDiploma(diploma);
    setFormData({ ...diploma });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Diploma) => {
    const value = e.target.value;
    setFormData(prev => prev ? {
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !editingDiploma) return;

    const payload = {
      nomDiplome: formData.nomDiplome,
      ecole: formData.ecole,
      ville: formData.ville,
      duree: parseInt(formData.duree as unknown as string, 10),
      mentionBac: formData.mentionBac,
      filiere: formData.filiere,
      career: formData.career,
      employmentOpportunities: formData.employmentOpportunities,
      ancienneDiplome: formData.ancienneDiplome,
      matieresDiplome: formData.matieresDiplome,
      matieresEtudiant: formData.matieresEtudiant
    };

    try {
      await axios.put(`http://localhost:8080/api/diplomas/update/${encodeURIComponent(editingDiploma.nomDiplome)}`, payload, {
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
      setEditingDiploma(null);
      setFormData(null);
      fetchDiplomas();
    } catch (err) {
      setError('Failed to update diploma');
    }
  };

  const handleCancelEdit = () => {
    setEditingDiploma(null);
    setFormData(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Diplomas Management</h1>
        <button
          onClick={() => navigate('/DiplomaForm')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Diploma
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {editingDiploma && formData && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Update Diploma</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Diploma Name</label>
              <input
                type="text"
                name="nomDiplome"
                value={formData.nomDiplome}
                onChange={handleFormChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">School</label>
              <input
                type="text"
                name="ecole"
                value={formData.ecole}
                onChange={handleFormChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleFormChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (years)</label>
              <input
                type="number"
                name="duree"
                value={formData.duree}
                onChange={handleFormChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year (optional)</label>
              <input
                type="text"
                name="year"
                value={formData.year || ''}
                onChange={handleFormChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mention Bac</label>
              <input
                type="text"
                name="mentionBac"
                value={formData.mentionBac}
                onChange={handleFormChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Filiere (comma-separated)</label>
              <input
                type="text"
                value={(formData.filiere || []).join(', ')}
                onChange={(e) => handleArrayChange(e, 'filiere')}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Fields (comma-separated)</label>
              <input
                type="text"
                value={(formData.matieresDiplome || []).join(', ')}
                onChange={(e) => handleArrayChange(e, 'matieresDiplome')}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Career (comma-separated)</label>
              <input
                type="text"
                value={(formData.career || []).join(', ')}
                onChange={(e) => handleArrayChange(e, 'career')}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Employment Opportunities (comma-separated)</label>
              <input
                type="text"
                value={(formData.employmentOpportunities || []).join(', ')}
                onChange={(e) => handleArrayChange(e, 'employmentOpportunities')}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Previous Diplomas (comma-separated)</label>
              <input
                type="text"
                value={(formData.ancienneDiplome || []).join(', ')}
                onChange={(e) => handleArrayChange(e, 'ancienneDiplome')}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Student Subjects (comma-separated)</label>
              <input
                type="text"
                value={(formData.matieresEtudiant || []).join(', ')}
                onChange={(e) => handleArrayChange(e, 'matieresEtudiant')}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Diploma
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search diplomas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Schools</option>
          {uniqueSchools.map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </select>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Cities</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Years</option>
          {uniqueYears.sort((a, b) => a.localeCompare(b)).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select
          value={selectedFiliere}
          onChange={(e) => setSelectedFiliere(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Filieres</option>
          {uniqueFilieres.sort((a, b) => String(a).localeCompare(String(b))).map((filiere, index) => (
            <option key={`${filiere}-${index}`} value={filiere}>{filiere}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {filteredDiplomas.length === 0 ? (
            <div className="text-center text-gray-600">No diplomas found.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">School</th>
                      <th className="py-2 px-4 border-b">City</th>
                      <th className="py-2 px-4 border-b">Duration</th>
                      <th className="py-2 px-4 border-b">Year</th>
                      <th className="py-2 px-4 border-b">Filiere</th>
                      <th className="py-2 px-4 border-b">Fields</th>
                      <th className="py-2 px-4 border-b">Career</th>
                      <th className="py-2 px-4 border-b">Employment Opportunities</th>
                      <th className="py-2 px-4 border-b">Previous Diplomas</th>
                      <th className="py-2 px-4 border-b">Mention Bac</th>
                      <th className="py-2 px-4 border-b">Student Subjects</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDiplomas.map((diploma) => (
                      <tr key={diploma.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{diploma.nomDiplome}</td>
                        <td className="py-2 px-4 border-b">{diploma.ecole}</td>
                        <td className="py-2 px-4 border-b">{diploma.ville}</td>
                        <td className="py-2 px-4 border-b">{diploma.duree} years</td>
                        <td className="py-2 px-4 border-b">{diploma.year || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">{(diploma.filiere || []).join(', ') || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">{(diploma.matieresDiplome || []).join(', ') || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">{(diploma.career || []).join(', ') || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">{(diploma.employmentOpportunities || []).join(', ') || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">{(diploma.ancienneDiplome || []).join(', ') || 'None'}</td>
                        <td className="py-2 px-4 border-b">{diploma.mentionBac || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">{(diploma.matieresEtudiant || []).join(', ') || 'N/A'}</td>
                        <td className="py-2 px-4 border-b flex space-x-2">
                          <button
                            onClick={() => handleEdit(diploma)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit diploma"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(diploma.nomDiplome)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete diploma"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredDiplomas.length)} of {filteredDiplomas.length} diplomas
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border rounded disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="px-3 py-1">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDiplomas;