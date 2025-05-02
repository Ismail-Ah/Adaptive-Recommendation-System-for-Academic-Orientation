import React from 'react';
import { BarChart, PlusCircle, UploadCloud, List, GraduationCap, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fake diplomas data (you can replace later with API fetch)
const diplomas = [
  {
    id: 1,
    nom_Diplome: 'Engineering in Computer Science',
    ecole: 'ENSIAS',
    ville: 'Rabat',
    filiere: 'Computer Science',
    duree: 5,
  },
  {
    id: 2,
    nom_Diplome: 'Business Administration',
    ecole: 'ISCAE',
    ville: 'Casablanca',
    filiere: 'Business',
    duree: 3,
  },
  // Add more fake diplomas if needed
];

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Calculate quick stats
  const uniqueSchools = new Set(diplomas.map(d => d.ecole)).size;
  const uniqueCities = new Set(diplomas.map(d => d.ville)).size;
  const averageDuration = diplomas.length > 0 
    ? (diplomas.reduce((acc, d) => acc + d.duree, 0) / diplomas.length).toFixed(1)
    : '0';

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
              <p className="text-2xl font-bold text-gray-900">{diplomas.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{uniqueSchools}</p>
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
              <p className="text-2xl font-bold text-gray-900">{uniqueCities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-amber-100 rounded-full p-3 mr-4">
              <Clock className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Duration</p>
              <p className="text-2xl font-bold text-gray-900">{averageDuration} <span className="text-sm text-gray-500">years</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Diplomas</h2>
          </div>

          {diplomas.length > 0 ? (
            <div className="divide-y divide-gray-100 max-h-[32rem] overflow-y-auto">
              {diplomas.slice(0, 10).map((diploma) => (
                <div key={diploma.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-gray-900">{diploma.nom_Diplome}</h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        {diploma.ecole}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {diploma.ville}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {diploma.filiere}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {diploma.duree} year{diploma.duree !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <GraduationCap className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No diplomas available yet.</p>
              <button
                onClick={() => navigate('/admin/add-diploma')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Diploma
              </button>
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>

          <div className="p-6 space-y-4">
            <button
              onClick={() => navigate('/csv-upload')}
              className="w-full flex items-center justify-center px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              <UploadCloud className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Upload CSV File</div>
                <div className="text-xs text-gray-500">Import multiple diplomas at once</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/DiplomaStatistics')}
              className="w-full flex items-center justify-center px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150"
            >
              <BarChart className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">View Statistics</div>
                <div className="text-xs text-gray-500">Analyze diploma data</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
