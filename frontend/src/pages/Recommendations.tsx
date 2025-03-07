import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, RefreshCw, BookOpen, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Adjust path to your AuthContext

// Define types for recommendations
interface ProgramRecommendation {
  name: string;
  description: string;
  score: number;
  liked?: boolean;
}

interface CareerRecommendation {
  name: string;
  description: string;
  skills: string[];
  liked?: boolean;
}

interface RecommendationsData {
  programs: ProgramRecommendation[];
  careers: CareerRecommendation[];
}

// Custom hook for fetching recommendations
const useRecommendations = () => {
  const { user, token } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const BACKEND_URL = "http://localhost:8080";

  const mockFetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const mockData: RecommendationsData = {
        programs: [
          {
            name: "Licence en Génie Informatique - ENSIAS",
            description:
              "Un programme d'ingénierie axé sur le développement logiciel, les systèmes d'information et l'intelligence artificielle. Prépare aux carrières dans la technologie.",
            score: 92,
          },
          {
            name: "Licence en Sciences Économiques - FSJES",
            description:
              "Formation en économie et gestion pour comprendre les dynamiques financières et commerciales, idéale pour une carrière en finance ou management.",
            score: 85,
          },
          {
            name: "CPGE - MPSI",
            description:
              "Classe préparatoire aux grandes écoles, filière Mathématiques, Physique et Sciences de l'Ingénieur, pour intégrer les écoles d'ingénieurs au Maroc ou à l'étranger.",
            score: 78,
          },
        ],
        careers: [
          {
            name: "Ingénieur Logiciel",
            description:
              "Conception et développement de logiciels pour des entreprises technologiques ou des startups.",
            skills: ["Programmation", "Algorithmique", "Gestion de projet", "Travail d'équipe"],
          },
          {
            name: "Analyste Financier",
            description:
              "Analyse des données économiques et financières pour conseiller les entreprises ou institutions.",
            skills: ["Analyse de données", "Statistiques", "Comptabilité", "Communication"],
          },
          {
            name: "Enseignant en Mathématiques",
            description:
              "Former la prochaine génération dans le domaine des sciences exactes au niveau secondaire ou supérieur.",
            skills: ["Mathématiques", "Pédagogie", "Patience", "Communication"],
          },
        ],
      };
      setRecommendations(mockData);
    } catch (error) {
      console.error('Error with mock data:', error);
      setRecommendations(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    if (!token || !user) {
      console.error('No token or user available');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/recommendations`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.status}`);
      }

      const data: RecommendationsData = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    mockFetchRecommendations(); // Replace with fetchRecommendations for real backend
  }, [user, token]);

  return { recommendations, isLoading, refreshRecommendations: mockFetchRecommendations };
};

// Reusable ProgramCard Component with Feedback and Details
const ProgramCard: React.FC<{
  program: ProgramRecommendation;
  onFeedback: (name: string, liked: boolean) => void;
  onDetails: (name: string) => void;
}> = ({ program, onFeedback, onDetails }) => (
  <div className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-300">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">{program.name}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{program.description}</p>
      </div>
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${program.score >= 90 ? 'bg-green-100 text-green-800' : program.score >= 80 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
  {program.score}% Match
</span>

    </div>
    <div className="mt-4 flex flex-wrap gap-3">
      <button
        onClick={() => onFeedback(program.name, true)}
        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          program.liked === true
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label="Marquer comme utile"
      >
        <ThumbsUp className="h-4 w-4 mr-2" />
        Utile
      </button>
      <button
        onClick={() => onFeedback(program.name, false)}
        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          program.liked === false
            ? 'bg-red-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label="Marquer comme pas utile"
      >
        <ThumbsDown className="h-4 w-4 mr-2" />
        Pas Utile
      </button>
      <button
        onClick={() => onDetails(program.name)}
        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-200"
        aria-label="Voir les détails"
      >
        Voir les détails
      </button>
    </div>
  </div>
);

// Reusable CareerCard Component with Feedback and Details
const CareerCard: React.FC<{
  career: CareerRecommendation;
  onFeedback: (name: string, liked: boolean) => void;
  onDetails: (name: string) => void;
}> = ({ career, onFeedback, onDetails }) => (
  <div className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-300">
    <h3 className="text-lg font-semibold text-gray-800">{career.name}</h3>
    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{career.description}</p>
    <div className="mt-3 flex flex-wrap gap-2">
      {career.skills.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
        >
          {skill}
        </span>
      ))}
    </div>
    <div className="mt-4 flex flex-wrap gap-3">
      <button
        onClick={() => onFeedback(career.name, true)}
        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          career.liked === true
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label="Marquer comme utile"
      >
        <ThumbsUp className="h-4 w-4 mr-2" />
        Utile
      </button>
      <button
        onClick={() => onFeedback(career.name, false)}
        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          career.liked === false
            ? 'bg-red-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label="Marquer comme pas utile"
      >
        <ThumbsDown className="h-4 w-4 mr-2" />
        Pas Utile
      </button>
      <button
        onClick={() => onDetails(career.name)}
        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-200"
        aria-label="Voir les détails"
      >
        Voir les détails
      </button>
    </div>
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <RefreshCw className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
      <p className="text-lg text-gray-700">Chargement des recommandations...</p>
    </div>
  </div>
);

// Main Recommendations Component
const Recommendations: React.FC = () => {
  const { recommendations, isLoading, refreshRecommendations } = useRecommendations();
  const [isProgramsOpen, setIsProgramsOpen] = useState(true);
  const [isCareersOpen, setIsCareersOpen] = useState(true);

  const handleFeedback = (name: string, liked: boolean, type: 'program' | 'career') => {
    if (!recommendations) return;
    const updatedRecommendations = { ...recommendations };
    const items = type === 'program' ? updatedRecommendations.programs : updatedRecommendations.careers;
    const item = items.find((i) => i.name === name);
    if (item) item.liked = liked;
    console.log(`Feedback for ${name}: ${liked ? 'Liked' : 'Disliked'}`);
    // Send feedback to backend here if needed
  };

  const handleDetails = (name: string) => {
    // Placeholder for showing details (e.g., open a modal)
    console.log(`Show details for: ${name}`);
    // You can implement a modal or navigate to a details page here
  };

  if (isLoading || !recommendations) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-gray-50 min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-12">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Vos Recommandations Personnalisées
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Basées sur votre profil académique et vos intérêts
          </p>
        </div>
        <button
          onClick={refreshRecommendations}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
          aria-label="Rafraîchir les recommandations"
        >
          <RefreshCw className="h-5 w-5 mr-2 animate-spin-slow" />
          Mettre à Jour
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
        {/* Programs Section */}
        <section className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsProgramsOpen(!isProgramsOpen)}
            >
              <div className="flex items-center">
                <BookOpen className="h-7 w-7 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Programmes Recommandés</h2>
              </div>
              {isProgramsOpen ? (
                <ChevronUp className="h-6 w-6 text-gray-600" />
              ) : (
                <ChevronDown className="h-6 w-6 text-gray-600" />
              )}
            </div>
            {isProgramsOpen && (
              <div className="mt-6 space-y-6">
                {recommendations.programs.map((program) => (
                  <ProgramCard
                    key={program.name}
                    program={program}
                    onFeedback={(name, liked) => handleFeedback(name, liked, 'program')}
                    onDetails={handleDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Careers Section */}
        <section className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsCareersOpen(!isCareersOpen)}
            >
              <div className="flex items-center">
                <Briefcase className="h-7 w-7 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Parcours Professionnels</h2>
              </div>
              {isCareersOpen ? (
                <ChevronUp className="h-6 w-6 text-gray-600" />
              ) : (
                <ChevronDown className="h-6 w-6 text-gray-600" />
              )}
            </div>
            {isCareersOpen && (
              <div className="mt-6 space-y-6">
                {recommendations.careers.map((career) => (
                  <CareerCard
                    key={career.name}
                    career={career}
                    onFeedback={(name, liked) => handleFeedback(name, liked, 'career')}
                    onDetails={handleDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Recommendations;