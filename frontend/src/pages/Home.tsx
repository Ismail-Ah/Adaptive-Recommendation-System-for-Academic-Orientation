import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Brain } from 'lucide-react';

function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Your Academic Future Starts Here
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Get personalized academic guidance for Moroccan baccalaureate students
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Personalized Guidance</h3>
          <p className="text-gray-600">
            Receive tailored recommendations based on your academic performance and interests
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Users className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Career Insights</h3>
          <p className="text-gray-600">
            Explore potential career paths aligned with your academic strengths
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Brain className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
          <p className="text-gray-600">
            Powered by advanced AI to provide accurate and relevant recommendations
          </p>
        </div>
      </div>

      <div className="text-center">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80"
          alt="Students studying"
          className="rounded-xl shadow-lg mx-auto mb-8"
        />
      </div>
    </div>
  );
}

export default Home;