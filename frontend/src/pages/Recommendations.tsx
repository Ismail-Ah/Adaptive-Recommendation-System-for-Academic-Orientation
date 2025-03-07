import React, { useEffect } from 'react';
import { ThumbsUp, ThumbsDown, RefreshCw, BookOpen, Briefcase } from 'lucide-react';

// Mock useUser hook with default data
const mockUseUser = () => {
  const defaultRecommendations = {
    programs: [
      {
        name: "Computer Science MS",
        description: "Master's program focusing on advanced computing concepts and software development.",
        score: 92
      },
      {
        name: "Data Science Certificate",
        description: "Short-term program teaching data analysis and machine learning techniques.",
        score: 85
      }
    ],
    careers: [
      {
        name: "Software Engineer",
        description: "Designs and develops software applications for various platforms.",
        skills: ["JavaScript", "React", "Node.js"]
      },
      {
        name: "Data Analyst",
        description: "Analyzes data to provide insights and support decision-making.",
        skills: ["Python", "SQL", "Statistics"]
      }
    ]
  };

  return {
    recommendations: defaultRecommendations,
    refreshRecommendations: () => console.log("Refreshing recommendations...")
  };
};

function Recommendations() {
  const { recommendations, refreshRecommendations } = mockUseUser();

  useEffect(() => {
    if (!recommendations) {
      refreshRecommendations();
    }
  }, [recommendations, refreshRecommendations]);

  if (!recommendations) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
          <p className="mt-2 text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Personalized Recommendations</h1>
          <p className="mt-2 text-gray-600">Based on your academic profile and interests</p>
        </div>
        <button
          onClick={() => refreshRecommendations()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Update Recommendations
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Recommended Programs</h2>
            </div>
            <div className="space-y-4">
              {recommendations.programs.map((program) => (
                <div key={program.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{program.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{program.description}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {program.score}% Match
                    </span>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Not Helpful
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Career Paths</h2>
            </div>
            <div className="space-y-4">
              {recommendations.careers.map((career) => (
                <div key={career.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-lg font-medium text-gray-900">{career.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{career.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {career.skills?.map((skill) => (
                      <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Not Helpful
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recommendations;