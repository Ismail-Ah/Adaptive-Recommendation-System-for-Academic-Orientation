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
  };
  onStepClick?: (step: string) => void;
}

const JourneyMap: React.FC<JourneyMapProps> = ({
  currentStrengths,
  areasToFocus,
  diploma,
  onStepClick
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
        <div className="flex items-center justify-center space-x-12">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-xs"
          >
            <div 
              className={`relative p-3 rounded-xl shadow-lg border-2 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105`}
              onClick={() => onStepClick?.('current-profile')}
              onMouseEnter={() => setHoveredStep('current-profile')}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} inline-block mb-2`}>
                <User className={`h-5 w-5 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`} />
              </div>
              <h3 className={`text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Votre Profil
              </h3>

              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium mb-1">Points Forts</h4>
                  <div className="flex flex-wrap gap-1">
                    {currentStrengths.subjects.map((subject) => (
                      <span 
                        key={subject}
                        data-tooltip-id="journey-tooltip"
                        data-tooltip-content={`Vous êtes fort en ${subject}`}
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Match Percentage Arrow */}
          <div className="relative">
            <div className="flex items-center">
              <div className={`w-12 h-0.5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                diploma.match_percentage >= 90 ? (isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700') : 
                diploma.match_percentage >= 80 ? (isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700') : 
                (isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700')
              }`}>
                {diploma.match_percentage.toFixed(1)}% Match
              </div>
              <div className={`w-12 h-0.5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </div>
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
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} inline-block mb-4`}>
                <BookOpen className={`h-6 w-6 ${isDarkMode ? 'text-green-200' : 'text-green-700'}`} />
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
            className={`relative p-6 rounded-xl shadow-lg border-2 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105`}
          >
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} inline-block mb-4`}>
              <User className={`h-6 w-6 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`} />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Points Forts</h4>
                <div className="flex flex-wrap gap-2">
                  {currentStrengths.subjects.map((subject) => (
                    <span 
                      key={subject}
                      data-tooltip-id="journey-tooltip"
                      data-tooltip-content={`Vous êtes fort en ${subject}`}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
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
          className="relative"
        >
          <div 
            className={`relative p-6 rounded-xl shadow-lg border-2 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105`}
            onClick={() => setShowDiplomaDetails(true)}
          >
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} inline-block mb-4`}>
              <BookOpen className={`h-6 w-6 ${isDarkMode ? 'text-green-200' : 'text-green-700'}`} />
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
          </div>

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
        </motion.div>
      </div>
    </div>
  );
};

export default JourneyMap;