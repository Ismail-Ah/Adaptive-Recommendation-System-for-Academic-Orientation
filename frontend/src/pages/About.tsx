import React from 'react';
import { BookOpen, Brain, Users, Trophy, Target, Sparkles } from 'lucide-react';

function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About Academic Guidance
        </h1>
        <p className="text-xl text-gray-600">
          Empowering Moroccan students to make informed decisions about their academic and professional future
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Recommendations</h3>
          <p className="text-gray-600">
            Our system uses advanced algorithms to analyze your academic performance and interests,
            providing personalized recommendations for your educational journey.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Brain className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
          <p className="text-gray-600">
            Powered by Neo4j and GNN technology, our platform delivers adaptive academic guidance
            based on comprehensive data analysis.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <Users className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Student Success</h3>
          <p className="text-gray-600">
            Join thousands of Moroccan students who have found their path to success through
            our guidance system.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <Target className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Targeted Guidance</h3>
          <p className="text-gray-600">
            Get specific recommendations for both higher education programs and long-term
            career paths that match your profile.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Create Your Profile</h3>
                <p className="text-gray-600">
                  Sign up and provide your academic information, including grades and interests.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Get Recommendations</h3>
                <p className="text-gray-600">
                  Receive personalized suggestions for educational programs and career paths.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Provide Feedback</h3>
                <p className="text-gray-600">
                  Rate recommendations to help improve future suggestions and keep your guidance relevant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            Have questions or need assistance? We're here to help!
          </p>
          <div className="space-y-2">
            <p className="text-gray-600">
              <strong>Email:</strong> support@academicguidance.ma
            </p>
            <p className="text-gray-600">
              <strong>Phone:</strong> +212 5XX-XXXXXX
            </p>
            <p className="text-gray-600">
              <strong>Hours:</strong> Monday - Friday, 9:00 - 17:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;