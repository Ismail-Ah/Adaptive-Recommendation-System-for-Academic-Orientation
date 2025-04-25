import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

function Accueil() {
  return (
    <div>
      {/* Section Héros */}
      <div className="bg-gradient-to-r from-blue-600 min-h-screen flex items-center justify-center to-blue-500 py-20 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Votre Avenir Académique Commence Ici
            </h1>
            <p className="text-xl mb-8">
              Obtenez des conseils académiques personnalisés pour les élèves du baccalauréat marocain
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Commencer
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-transparent border border-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
              >
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section Fonctionnalités */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white p-8 rounded-xl h-60 shadow-md hover:shadow-lg transition-shadow">
              <BookOpen className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-center">Orientation Personnalisée</h3>
              <p className="text-gray-600 text-center">
                Recevez des recommandations adaptées à vos performances académiques et à vos intérêts
              </p>
            </div>
          </motion.div>
          <motion.div>
            <div className="bg-white p-8 rounded-xl h-60 shadow-md hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-center">Perspectives de Carrière</h3>
              <p className="text-gray-600 text-center">
                Explorez les débouchés professionnels en fonction de vos forces académiques
              </p>
            </div>
          </motion.div>
          <motion.div>
            <div className="bg-white p-8 rounded-xl h-60 shadow-md hover:shadow-lg transition-shadow">
              <Brain className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-center">Analyse Intelligente</h3>
              <p className="text-gray-600 text-center">
                Alimentée par l'IA avancée pour des recommandations précises et pertinentes
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pied de page */}
      <footer className="bg-blue-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold">Orientation Académique</p>
            <p className="text-sm">Accompagner les étudiants marocains</p>
          </div>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-blue-200">À Propos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Accueil;
