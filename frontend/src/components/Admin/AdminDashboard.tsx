
import React, { useEffect, useState } from 'react';
import { BarChart, PlusCircle, UploadCloud, List, GraduationCap, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Diploma {
  id: number;
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


export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [totalDiplomas, setTotalDiplomas] = useState(0);
  const [totalSchools, setTotalSchools] = useState(0);
  const [totalCities, setTotalCities] = useState(0);
  const [averageDuration, setAverageDuration] = useState('0');

  useEffect(() => {
    fetchDiplomas();
    fetchStatistics();
  }, []);

  const fetchDiplomas = async () => {
    try {
      const response = await axios.get<Diploma[]>('http://localhost:8080/api/diplomas/diplomas');
      setDiplomas(response.data);
    } catch (error) {
      console.error('Failed to fetch diplomas', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const [diplomasRes, schoolsRes, citiesRes] = await Promise.all([
        axios.get<number>('http://localhost:8080/api/diplomas/statistics/total-diplomas'),
        axios.get<number>('http://localhost:8080/api/diplomas/statistics/total-schools'),
        axios.get<number>('http://localhost:8080/api/diplomas/statistics/total-cities')
      ]);

      setTotalDiplomas(diplomasRes.data);
      setTotalSchools(schoolsRes.data);
      setTotalCities(citiesRes.data);
      
      // Calculate average duration from diplomas data
      if (diplomas.length > 0) {
        const avgDuration = diplomas.reduce((acc, curr) => acc + curr.duree, 0) / diplomas.length;
        setAverageDuration(avgDuration.toFixed(1));
      }
    } catch (error) {
      console.error('Failed to fetch statistics', error);
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => navigate('/DiplomaForm')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Diploma
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <List className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Diplomas</p>
              <p className="text-2xl font-bold text-gray-900">{totalDiplomas}</p>

            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <GraduationCap className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Schools</p>
              <p className="text-2xl font-bold text-gray-900">{totalSchools}</p>

            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <MapPin className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cities</p>
              <p className="text-2xl font-bold text-gray-900">{totalCities}</p>

            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <Clock className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Duration</p>
              <p className="text-2xl font-bold text-gray-900">{averageDuration} years</p>

            </div>
          </div>
        </div>
      </div>

      {/* Recent Diplomas Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Recent Diplomas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fields</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {diplomas.slice(0, 5).map((diploma) => (
                <tr key={diploma.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {diploma.nomDiplome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {diploma.ecole}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {diploma.ville}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {diploma.duree} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {diploma.filiere.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};
