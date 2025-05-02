import React, { useState, useEffect } from 'react';
import { BarChart, DollarSign, BookOpen, Building, MapPin, Award, Clock, Download } from 'lucide-react';
import { Diploma, DiplomaStats } from '../../types/index';

// Fake initial data for testing (can be fetched later)
const initialDiplomas: Diploma[] = [
  {
    id: '1',
    nom_Diplome: 'Engineering in Computer Science',
    ecole: 'ENSIAS',
    career: ['Developer', 'Engineer'],
    employement_Opportunities: ['Software Company', 'Startup'],
    ancienne_Diplome: '',
    filiere: 'Computer Science',
    duree: 5,
    mention_Bac: 'Très Bien',
    ville: 'Rabat',
    matieres_Diplome: ['Programming', 'Algorithms'],
    matieres_Etudiant: ['Math', 'Physics']
  },
  {
    id: '2',
    nom_Diplome: 'Business Administration',
    ecole: 'ISCAE',
    career: ['Manager', 'Entrepreneur'],
    employement_Opportunities: ['Company', 'Consulting'],
    ancienne_Diplome: '',
    filiere: 'Business',
    duree: 3,
    mention_Bac: 'Bien',
    ville: 'Casablanca',
    matieres_Diplome: ['Management', 'Finance'],
    matieres_Etudiant: ['Economy', 'Math']
  }
];

export const DiplomaStatistics: React.FC = () => {
  const [diplomas, setDiplomas] = useState<Diploma[]>(initialDiplomas);
  const [stats, setStats] = useState<DiplomaStats | null>(null);
  const [filteredStats, setFilteredStats] = useState<DiplomaStats | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState('');

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
      topEmploymentOpportunities: []
    };

    diplomas.forEach(diploma => {
      stats.byEcole[diploma.ecole] = (stats.byEcole[diploma.ecole] || 0) + 1;
      stats.byVille[diploma.ville] = (stats.byVille[diploma.ville] || 0) + 1;
      stats.byFiliere[diploma.filiere] = (stats.byFiliere[diploma.filiere] || 0) + 1;
      if (diploma.mention_Bac) {
        stats.byMentionBac[diploma.mention_Bac] = (stats.byMentionBac[diploma.mention_Bac] || 0) + 1;
      }
      stats.byDuree[diploma.duree] = (stats.byDuree[diploma.duree] || 0) + 1;
    });

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

    const opportunities: Record<string, number> = {};
    diplomas.forEach(diploma => {
      diploma.employement_Opportunities.forEach(opportunity => {
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
          return diploma.filiere.toLowerCase().includes(filterValue.toLowerCase());
        case 'mention_Bac':
          return diploma.mention_Bac.toLowerCase().includes(filterValue.toLowerCase());
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
    if (!stats) return;

    let csv = "Diploma Statistics Summary\n";
    csv += `Total Diplomas,${stats.total}\n\n`;

    csv += "By School\nSchool,Count\n";
    Object.entries(stats.byEcole).forEach(([school, count]) => {
      csv += `${school},${count}\n`;
    });

    csv += "\nBy City\nCity,Count\n";
    Object.entries(stats.byVille).forEach(([city, count]) => {
      csv += `${city},${count}\n`;
    });

    csv += "\nBy Field\nField,Count\n";
    Object.entries(stats.byFiliere).forEach(([filiere, count]) => {
      csv += `${filiere},${count}\n`;
    });

    csv += "\nBy Mention Bac\nMention,Count\n";
    Object.entries(stats.byMentionBac).forEach(([mention, count]) => {
      csv += `${mention},${count}\n`;
    });

    csv += "\nBy Duration\nYears,Count\n";
    Object.entries(stats.byDuree).forEach(([duree, count]) => {
      csv += `${duree},${count}\n`;
    });

    csv += "\nTop Careers\nCareer,Count\n";
    stats.topCareers.forEach(({ name, count }) => {
      csv += `${name},${count}\n`;
    });

    csv += "\nTop Employment Opportunities\nOpportunity,Count\n";
    stats.topEmploymentOpportunities.forEach(({ name, count }) => {
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

  if (!filteredStats) {
    return <p>Loading statistics...</p>;
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      {/* Same structure: Filters, Statistics cards, Export button, Graphs */}
      {/* I can continue the full rendering if you want! */}
      <h2 className="text-2xl font-bold mb-6">Diploma Statistics (Local Version)</h2>
      {/* ... */}
    </div>
  );
};
