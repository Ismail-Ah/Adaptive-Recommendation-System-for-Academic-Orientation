import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { BarChart, DollarSign, BookOpen, Building, MapPin, Award, Clock, Download } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Diploma {
  id: string;
  nomDiplome: string;
  ecole: string;
  ville: string;
  duree: number;
  filiere: string[];
  mentionBac: string;
  career: string[];
  employmentOpportunities: string[];
  ancienneDiplome: string[];
  matieresDiplome: string[];
  matieresEtudiant: string[];
}

interface DiplomaStats {
  total: number;
  byEcole: Record<string, number>;
  byVille: Record<string, number>;
  byFiliere: Record<string, number>;
  byMentionBac: Record<string, number>;
  byDuree: Record<string, number>;
  topCareers: { name: string; count: number }[];
  topEmploymentOpportunities: { name: string; count: number }[];
  averageDuration: number;
}

export const DiplomaStatistics: React.FC = () => {
  const { token } = useAuth();
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [stats, setStats] = useState<DiplomaStats | null>(null);
  const [filteredStats, setFilteredStats] = useState<DiplomaStats | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch diplomas from the backend
  useEffect(() => {
    const fetchDiplomas = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Diploma[]>('http://localhost:8080/api/diplomas/diplomas', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setDiplomas(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch diplomas');
      } finally {
        setLoading(false);
      }
    };

    fetchDiplomas();
  }, [token]);

  // Calculate statistics when diplomas change
  useEffect(() => {
    if (diplomas.length > 0) {
      const calculatedStats = calculateStatistics(diplomas);
      setStats(calculatedStats);
      setFilteredStats(calculatedStats);
    }
  }, [diplomas]);

  const calculateStatistics = (diplomas: Diploma[]): DiplomaStats => {
    const stats: DiplomaStats = {
      total: diplomas.length,
      byEcole: {},
      byVille: {},
      byFiliere: {},
      byMentionBac: {},
      byDuree: {},
      topCareers: [],
      topEmploymentOpportunities: [],
      averageDuration: 0
    };

    // Calculate counts for each category
    let totalDuration = 0;
    diplomas.forEach(diploma => {
      // By School
      stats.byEcole[diploma.ecole] = (stats.byEcole[diploma.ecole] || 0) + 1;
      // By City
      stats.byVille[diploma.ville] = (stats.byVille[diploma.ville] || 0) + 1;
      // By Filiere (since filiere is an array, we count each filiere)
      diploma.filiere.forEach(f => {
        stats.byFiliere[f] = (stats.byFiliere[f] || 0) + 1;
      });
      // By Mention Bac
      if (diploma.mentionBac) {
        stats.byMentionBac[diploma.mentionBac] = (stats.byMentionBac[diploma.mentionBac] || 0) + 1;
      }
      // By Duration
      stats.byDuree[diploma.duree] = (stats.byDuree[diploma.duree] || 0) + 1;
      // Accumulate duration for average
      totalDuration += diploma.duree;
    });

    // Calculate average duration
    stats.averageDuration = diplomas.length > 0 ? totalDuration / diplomas.length : 0;

    // Calculate top careers
    const careers: Record<string, number> = {};
    diplomas.forEach(diploma => {
      diploma.career.forEach(career => {
        careers[career] = (careers[career] || 0) + 1;
      });
    });
    stats.topCareers = Object.entries(careers)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate top employment opportunities
    const opportunities: Record<string, number> = {};
    diplomas.forEach(diploma => {
      diploma.employmentOpportunities.forEach(opportunity => {
        opportunities[opportunity] = (opportunities[opportunity] || 0) + 1;
      });
    });
    stats.topEmploymentOpportunities = Object.entries(opportunities)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return stats;
  };

  const applyFilter = () => {
    if (!stats || !activeFilter || !filterValue) {
      setFilteredStats(stats);
      return;
    }

    const filteredDiplomas = diplomas.filter(diploma => {
      switch (activeFilter) {
        case 'ecole':
          return diploma.ecole.toLowerCase().includes(filterValue.toLowerCase());
        case 'ville':
          return diploma.ville.toLowerCase().includes(filterValue.toLowerCase());
        case 'filiere':
          return diploma.filiere.some(f => f.toLowerCase().includes(filterValue.toLowerCase()));
        case 'mentionBac':
          return diploma.mentionBac.toLowerCase().includes(filterValue.toLowerCase());
        default:
          return true;
      }
    });

    const newStats = calculateStatistics(filteredDiplomas);
    setFilteredStats(newStats);
  };

  const clearFilter = () => {
    setActiveFilter(null);
    setFilterValue('');
    setFilteredStats(stats);
  };

  const exportCSV = () => {
    if (!filteredStats) return;

    let csv = "Diploma Statistics Summary\n";
    csv += `Total Diplomas,${filteredStats.total}\n`;
    csv += `Average Duration (Years),${filteredStats.averageDuration.toFixed(1)}\n\n`;

    csv += "By School\nSchool,Count\n";
    Object.entries(filteredStats.byEcole).forEach(([school, count]) => {
      csv += `${school},${count}\n`;
    });

    csv += "\nBy City\nCity,Count\n";
    Object.entries(filteredStats.byVille).forEach(([city, count]) => {
      csv += `${city},${count}\n`;
    });

    csv += "\nBy Field\nField,Count\n";
    Object.entries(filteredStats.byFiliere).forEach(([filiere, count]) => {
      csv += `${filiere},${count}\n`;
    });

    csv += "\nBy Mention Bac\nMention,Count\n";
    Object.entries(filteredStats.byMentionBac).forEach(([mention, count]) => {
      csv += `${mention},${count}\n`;
    });

    csv += "\nBy Duration\nYears,Count\n";
    Object.entries(filteredStats.byDuree).forEach(([duree, count]) => {
      csv += `${duree},${count}\n`;
    });

    csv += "\nTop Careers\nCareer,Count\n";
    filteredStats.topCareers.forEach(({ name, count }) => {
      csv += `${name},${count}\n`;
    });

    csv += "\nTop Employment Opportunities\nOpportunity,Count\n";
    filteredStats.topEmploymentOpportunities.forEach(({ name, count }) => {
      csv += `${name},${count}\n`;
    });

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'diploma_statistics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare chart data
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    },
    scales: {
      x: { title: { display: true } },
      y: { title: { display: true, text: 'Count' }, beginAtZero: true }
    }
  };

  const createChartData = (data: Record<string, number>, label: string, title: string, backgroundColor: string) => ({
    labels: Object.keys(data),
    datasets: [
      {
        label,
        data: Object.values(data),
        backgroundColor,
        borderColor: backgroundColor.replace('0.6', '1'),
        borderWidth: 1
      }
    ]
  });

  if (loading) {
    return <p className="p-6 text-center">Loading statistics...</p>;
  }

  if (error) {
    return (
      <div className="p-6 bg-white shadow rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!filteredStats) {
    return (
      <div className="p-6 bg-white shadow rounded-lg">
        <p>No statistics available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Diploma Statistics</h2>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={activeFilter || ''}
          onChange={(e) => setActiveFilter(e.target.value || null)}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Filter</option>
          <option value="ecole">School</option>
          <option value="ville">City</option>
          <option value="filiere">Field</option>
          <option value="mentionBac">Mention Bac</option>
        </select>

        {activeFilter && (
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder={`Filter by ${activeFilter}`}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <button
          onClick={applyFilter}
          disabled={!activeFilter || !filterValue}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Apply Filter
        </button>

        <button
          onClick={clearFilter}
          disabled={!activeFilter}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          Clear Filter
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow">
          <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Total Diplomas</p>
            <p className="text-lg font-semibold">{filteredStats.total}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-green-50 rounded-lg shadow">
          <Clock className="h-8 w-8 text-green-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Average Duration</p>
            <p className="text-lg font-semibold">{filteredStats.averageDuration.toFixed(1)} years</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-purple-50 rounded-lg shadow">
          <Building className="h-8 w-8 text-purple-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Unique Schools</p>
            <p className="text-lg font-semibold">{Object.keys(filteredStats.byEcole).length}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-amber-50 rounded-lg shadow">
          <MapPin className="h-8 w-8 text-amber-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Unique Cities</p>
            <p className="text-lg font-semibold">{Object.keys(filteredStats.byVille).length}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <Bar
            data={createChartData(filteredStats.byEcole, 'Diplomas by School', 'Diplomas by School', 'rgba(75, 192, 192, 0.6)')}
            options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Diplomas by School' } } }}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <Bar
            data={createChartData(filteredStats.byVille, 'Diplomas by City', 'Diplomas by City', 'rgba(255, 159, 64, 0.6)')}
            options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Diplomas by City' } } }}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <Bar
            data={createChartData(filteredStats.byFiliere, 'Diplomas by Field', 'Diplomas by Field', 'rgba(153, 102, 255, 0.6)')}
            options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Diplomas by Field' } } }}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <Bar
            data={createChartData(filteredStats.byMentionBac, 'Diplomas by Mention Bac', 'Diplomas by Mention Bac', 'rgba(54, 162, 235, 0.6)')}
            options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Diplomas by Mention Bac' } } }}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <Bar
            data={createChartData(filteredStats.byDuree, 'Diplomas by Duration', 'Diplomas by Duration', 'rgba(255, 99, 132, 0.6)')}
            options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Diplomas by Duration (Years)' } } }}
          />
        </div>
      </div>

      {/* Top Careers and Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-500" /> Top Careers
          </h3>
          <ul className="space-y-2">
            {filteredStats.topCareers.map(({ name, count }) => (
              <li key={name} className="flex justify-between items-center">
                <span>{name}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Award className="h-5 w-5 mr-2 text-purple-500" /> Top Employment Opportunities
          </h3>
          <ul className="space-y-2">
            {filteredStats.topEmploymentOpportunities.map(({ name, count }) => (
              <li key={name} className="flex justify-between items-center">
                <span>{name}</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={exportCSV}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Download className="h-5 w-5 mr-2" />
          Export as CSV
        </button>
      </div>
    </div>
  );
};