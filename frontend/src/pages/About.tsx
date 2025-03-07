import React from 'react';
import { BookOpen, Brain, Users, Target, Sparkles } from 'lucide-react';

function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          About Academic Guidance
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Empowering Moroccan students to make informed decisions about their academic and professional future
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2">
          <BookOpen className="h-12 w-12 text-blue-600 mb-6 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Smart Recommendations</h3>
          <p className="text-gray-600 text-center">
            Our system uses advanced algorithms to analyze your academic performance and interests,
            providing personalized recommendations for your educational journey.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2">
          <Brain className="h-12 w-12 text-blue-600 mb-6 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">AI-Powered Insights</h3>
          <p className="text-gray-600 text-center">
            Powered by Neo4j and GNN technology, our platform delivers adaptive academic guidance
            based on comprehensive data analysis.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2">
          <Users className="h-12 w-12 text-blue-600 mb-6 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Student Success</h3>
          <p className="text-gray-600 text-center">
            Join thousands of Moroccan students who have found their path to success through
            our guidance system.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2">
          <Target className="h-12 w-12 text-blue-600 mb-6 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Targeted Guidance</h3>
          <p className="text-gray-600 text-center">
            Get specific recommendations for both higher education programs and long-term
            career paths that match your profile.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2">
          <Sparkles className="h-12 w-12 text-blue-600 mb-6 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Personalized Learning</h3>
          <p className="text-gray-600 text-center">
            Tailored learning plans to help you achieve your academic and career goals.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg overflow-hidden mb-20">
        <div className="p-10 text-white">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                <p className="text-gray-200">
                  Sign up and provide your academic information, including grades and interests.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
                <p className="text-gray-200">
                  Receive personalized suggestions for educational programs and career paths.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Provide Feedback</h3>
                <p className="text-gray-200">
                  Rate recommendations to help improve future suggestions and keep your guidance relevant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
          <p className="text-gray-600 mb-8">
            Have questions or need assistance? We're here to help!
          </p>
          <div className="space-y-4">
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