import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 min-h-screen flex items-center justify-center to-blue-500 py-20 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Academic Future Starts Here
            </h1>
            <p className="text-xl mb-8">
              Get personalized academic guidance for Moroccan baccalaureate students
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-transparent border border-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white p-8 rounded-xl h-60 shadow-md hover:shadow-lg transition-shadow">
              <BookOpen className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-center">Personalized Guidance</h3>
              <p className="text-gray-600 text-center">
                Receive tailored recommendations based on your academic performance and interests
              </p>
            </div>
            </motion.div>
            <motion.div>
            <div className="bg-white p-8 rounded-xl h-60 shadow-md hover:shadow-lg transition-shadow">
          <Users className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2 text-center">Career Insights</h3>
          <p className="text-gray-600 text-center">
            Explore potential career paths aligned with your academic strengths
          </p>
        </div>
        </motion.div>
        <motion.div>
        <div className="bg-white p-8 rounded-xl h-60 shadow-md hover:shadow-lg transition-shadow">
          <Brain className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2 text-center">Smart Analytics</h3>
          <p className="text-gray-600 text-center">
            Powered by advanced AI to provide accurate and relevant recommendations
          </p>
        </div>
          </motion.div>
          {/* Repeat for other features */}
        </div>
      </div>


      {/* Footer */}
      <footer className="bg-blue-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold">Academic Guidance</p>
            <p className="text-sm">Empowering Moroccan Students</p>
          </div>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-blue-200">About Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;