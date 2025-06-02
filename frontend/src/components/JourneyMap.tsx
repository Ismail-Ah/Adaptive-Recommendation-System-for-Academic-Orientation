import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpen, Briefcase, Target, Star, GraduationCap, ArrowRight, ArrowDown, User, X, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface JourneyMapProps {
  currentStrengths: {
    subjects: string[];
    careers: string[];
    interests: string[];
  };
  areasToFocus: {
    subjects: string[];
    careers: string[];
    interests: string[];
  };
  diploma: {
    nom_diplôme: string;
    ecole: string;
    ville: string;
    durée: number;
    employement_opportunities: string[];
    career: string[];
    match_percentage: number;
    matieres_diplome: string[];
    rating: number;
    notes?: string[];
    ancienne_diplome?: string[];
  };
  onStepClick?: (step: string) => void;
  source?: 'myDiplomas' | 'recommendations';
}

const JourneyMap: React.FC<JourneyMapProps> = ({
  currentStrengths,
  areasToFocus,
  diploma,
  onStepClick,
  source = 'recommendations'
}) => {
  const { isDarkMode } = useTheme();
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [showDiplomaDetails, setShowDiplomaDetails] = useState(false);

  return (
    <div className="relative">
      <Tooltip 
        id="journey-tooltip"
        style={{
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          color: isDarkMode ? '#E5E7EB' : '#374151',
          border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
          borderRadius: '0.375rem',
          padding: '0.5rem',
          fontSize: '0.875rem',
          zIndex: 50
        }}
      />
      
      {/* Desktop: Flow Diagram */}
      <div className="hidden md:block">
        <div className="flex items-center justify-start space-x-8">
          {/* Profile Section - Always show in original position */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div 
              className="cursor-pointer transition-all duration-200 hover:scale-105"
              onClick={() => onStepClick?.('current-profile')}
              onMouseEnter={() => setHoveredStep('current-profile')}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <User className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </motion.div>

          {/* Match Percentage and Ancient Diplomas Section */}
          <div className="relative">
            <div className="flex items-center">
              <div className={`w-8 h-0.5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                diploma.match_percentage >= 90 ? (isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700') : 
                diploma.match_percentage >= 80 ? (isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700') : 
                (isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700')
              }`}>
                {diploma.match_percentage.toFixed(1)}% Match
              </div>
              <div className={`w-8 h-0.5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </div>

            {/* Ancient Diplomas - Vertical below match percentage */}
            {diploma.ancienne_diplome && diploma.ancienne_diplome.filter(d => typeof d === 'string' && !d.startsWith('BAC')).length > 0 && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-4 flex flex-col items-center gap-2">
                {diploma.ancienne_diplome.filter(d => typeof d === 'string' && !d.startsWith('BAC')).map((ancienDiplome, index) => (
                  <motion.div
                    key={ancienDiplome}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className={`p-3 rounded-lg shadow-md whitespace-nowrap ${
                        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                      }`}
                    >
                      <span 
                        className={`text-sm font-medium ${
                          isDarkMode ? 'text-blue-200' : 'text-blue-700'
                        }`}
                      >
                        {ancienDiplome}
                      </span>
                    </div>
                    <ArrowRight className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Simplified Diploma Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md relative"
          >
            <div 
              className={`relative p-6 rounded-xl shadow-lg border-2 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105`}
              onClick={() => setShowDiplomaDetails(true)}
              onMouseEnter={() => setHoveredStep('recommended-diploma')}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} inline-block`}>
                  <BookOpen className={`h-6 w-6 ${isDarkMode ? 'text-green-200' : 'text-green-700'}`} />
                </div>
                {diploma.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className={`h-5 w-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{diploma.rating}/5</span>
                  </div>
                )}
              </div>
              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {diploma.nom_diplôme}
              </h3>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {diploma.ecole} - {diploma.ville}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Durée: {diploma.durée} ans
                  </p>
                </div>
                <ChevronRight className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>

              {/* Notes/Subjects Section */}
              <div className="mt-4 space-y-2">
                {source === 'myDiplomas' && diploma.notes ? (
                  diploma.notes.slice(0, 4).map((note, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <ArrowRight className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span 
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {note}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  diploma.career.slice(0, 2).map((career, index) => (
                    <motion.div
                      key={career}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <ArrowRight className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span 
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isDarkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {career}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Subject Arrows */}
            <div className="absolute -right-48 top-1/2 transform -translate-y-1/2 space-y-4">
              {diploma.matieres_diplome.map((matiere, index) => (
                <motion.div
                  key={matiere}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <ArrowUpRight className={`h-5 w-5 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {matiere}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Employment Sectors */}
        <div className="mt-12 grid grid-cols-2 gap-8 w-full max-w-2xl mx-auto">
          {diploma.employement_opportunities.map((sector, index) => (
            <motion.div
              key={sector}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <ArrowDown className={`h-6 w-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
              <div 
                className={`p-4 rounded-xl shadow-lg border-2 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105`}
                onClick={() => onStepClick?.('career-outcomes')}
                onMouseEnter={() => setHoveredStep('career-outcomes')}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'} inline-block mb-3`}>
                  <Briefcase className={`h-5 w-5 ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`} />
                </div>
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {sector}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical Flow */}
      <div className="md:hidden space-y-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div 
            className={`relative p-3 rounded-xl shadow-lg border-2 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105`}
          >
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
              <User className={`h-5 w-5 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`} />
            </div>
          </div>
        </motion.div>

        {/* Match Percentage */}
        <div className="flex justify-center">
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${
            diploma.match_percentage >= 90 ? (isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700') : 
            diploma.match_percentage >= 80 ? (isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700') : 
            (isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700')
          }`}>
            {diploma.match_percentage.toFixed(1)}% Match
          </div>
        </div>

        {/* Simplified Diploma Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div 
            className={`relative p-4 rounded-xl shadow-lg border-2 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105`}
            onClick={() => setShowDiplomaDetails(true)}
          >
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} inline-block mb-2`}>
              <BookOpen className={`h-5 w-5 ${isDarkMode ? 'text-green-200' : 'text-green-700'}`} />
            </div>
            <h3 className={`text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {diploma.nom_diplôme}
            </h3>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {diploma.ecole} - {diploma.ville}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Durée: {diploma.durée} ans
                </p>
              </div>
              <ChevronRight className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>

            {/* Notes/Subjects Section for Mobile */}
            <div className="mt-4 space-y-2">
              {source === 'myDiplomas' && diploma.notes ? (
                diploma.notes.slice(0, 4).map((note, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {note}
                    </span>
                  </motion.div>
                ))
              ) : (
                diploma.career.slice(0, 2).map((career, index) => (
                  <motion.div
                    key={career}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {career}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Subject Arrows - Mobile */}
        <div className="mt-4 space-y-2">
          {diploma.matieres_diplome.map((matiere, index) => (
            <motion.div
              key={matiere}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <ArrowRight className={`h-5 w-5 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
                }`}
              >
                {matiere}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Diploma Details Modal */}
      {showDiplomaDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-start mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{diploma.nom_diplôme}</h2>
              <div className="flex items-center gap-4">
                {diploma.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className={`h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <span className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{diploma.rating}/5</span>
                  </div>
                )}
                <button
                  onClick={() => setShowDiplomaDetails(false)}
                  className={`p-2 rounded-lg ${
                    isDarkMode 
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  } transition-colors duration-200`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-2`}>
                  Informations Générales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="font-medium">École:</span> {diploma.ecole}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="font-medium">Ville:</span> {diploma.ville}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="font-medium">Durée:</span> {diploma.durée} ans
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {source === 'myDiplomas' && diploma.notes && diploma.notes.length > 0 && (
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-2`}>
                    Notes
                  </h3>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="space-y-3">
                      {diploma.notes.map((note, index) => (
                        <p key={index} className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {note}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Matières Section */}
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-2`}>
                  Matières
                </h3>
                <div className="flex flex-wrap gap-2">
                  {diploma.matieres_diplome.map((matiere) => (
                    <span key={matiere} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode 
                        ? 'bg-green-900 text-green-200 border-green-800' 
                        : 'bg-green-50 text-green-700 border-green-100'
                    } border`}>
                      {matiere}
                    </span>
                  ))}
                </div>
              </div>

              {/* Opportunités d'Emploi */}
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-2`}>
                  Opportunités d'Emploi
                </h3>
                <div className="flex flex-wrap gap-2">
                  {diploma.employement_opportunities.map((opportunity) => (
                    <span key={opportunity} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode 
                        ? 'bg-green-900 text-green-200 border-green-800' 
                        : 'bg-green-50 text-green-700 border-green-100'
                    } border`}>
                      {opportunity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Carrières */}
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-2`}>
                  Carrières Possibles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {diploma.career.map((career) => (
                    <span key={career} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode 
                        ? 'bg-amber-900 text-amber-200 border-amber-800' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    } border`}>
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyMap;