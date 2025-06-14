import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { UserPlus, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Moroccan curriculum-based interests
const interests = [
  'Mathématiques',
  'Physique',
  'Chimie',
  'Sciences de la Vie et de la Terre',
  'Informatique',
  'Économie et Gestion',
  'Littérature',
  'Philosophie',
];

// Schema for registration
const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .regex(/^[a-zA-Z\s]+$/, 'Le nom doit contenir uniquement des lettres et des espaces'),
  email: z.string().email('Veuillez entrer un email valide'),
  year: z.enum(['1ère Bac', '2ème Bac']),
  filiere: z.string().min(1, 'Sélectionnez une filière'),
  subjects: z.array(z.string()).min(1, 'Sélectionnez au moins une matière que vous aimez'),
  careerAspirations: z
    .array(z.string())
    .min(1, 'Sélectionnez au moins une aspiration professionnelle'),
  studyDuration: z.string().min(1, 'Sélectionnez la durée d\'étude voulue'),
  bacMention: z.string().min(1, 'Sélectionnez une mention'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

function Register() {
  const { register: registerUser, error } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  console.log('Form errors:', errors);

  const [isBacFieldsDisabled, setIsBacFieldsDisabled] = useState(true);
  const [isMentionBacDisabled, setIsMentionBacDisabled] = useState(true);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [availableFilieres, setAvailableFilieres] = useState<string[]>([]);
  const [availableStudyDurations, setAvailableStudyDurations] = useState<string[]>([]);
  const [availableCareerAspirations, setAvailableCareerAspirations] = useState<string[]>([]);
  const [availableBacMentions, setAvailableBacMentions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [careerSearch, setCareerSearch] = useState('');
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [showAllCareers, setShowAllCareers] = useState(false);
  const SUBJECTS_PER_PAGE = 6;
  const CAREERS_PER_PAGE = 6;

  const selectedYear = watch('year');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, filieresRes, dureesRes, careersRes, mentionsRes] = await Promise.all([
          fetch('http://localhost:8080/api/diplomas/subjects-etud'),
          fetch('http://localhost:8080/api/diplomas/filiers'),
          fetch('http://localhost:8080/api/diplomas/durees'),
          fetch('http://localhost:8080/api/diplomas/careers'),
          fetch('http://localhost:8080/api/diplomas/mentions')
        ]);

        const [subjectsData, filieresData, dureesData, careersData, mentionsData] = await Promise.all([
          subjectsRes.json(),
          filieresRes.json(),
          dureesRes.json() as Promise<number[]>,
          careersRes.json(),
          mentionsRes.json()
        ]);

        setAvailableSubjects(subjectsData);
        setAvailableFilieres(filieresData);
        setAvailableStudyDurations(dureesData.map(d => `${d} ans`));
        setAvailableCareerAspirations(careersData);
        setAvailableBacMentions(mentionsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    if (selectedYear === '1ère Bac' || selectedYear === '2ème Bac') {
      setIsBacFieldsDisabled(false);
      if (selectedYear === '2ème Bac') {
        setIsMentionBacDisabled(false);
      } else {
        setIsMentionBacDisabled(true);
      }
    } else {
      setIsBacFieldsDisabled(true);
      setIsMentionBacDisabled(true);
    }
  }, [selectedYear]);

  const onSubmit = async (data: RegisterForm) => {
    console.log('Form submitted with data:', data);
    try {
      console.log('Attempting to register user...');
      await registerUser({
        name: data.name,
        email: data.email,
        year: data.year,
        filiere: data.filiere,
        interests: data.subjects,
        subjects: data.subjects,
        careerAspirations: data.careerAspirations,
        duree: parseInt(data.studyDuration[0]),
        montionBac: data.bacMention,
        password: data.password,
      });
      console.log('Registration successful, navigating to profile');
      navigate('/profile');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('Form submit event triggered');
    handleSubmit(onSubmit)(e);
  };

  const filteredSubjects = availableSubjects.filter(subject =>
    subject.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const filteredCareers = availableCareerAspirations.filter(career =>
    career.toLowerCase().includes(careerSearch.toLowerCase())
  );

  const displayedSubjects = showAllSubjects ? filteredSubjects : filteredSubjects.slice(0, SUBJECTS_PER_PAGE);
  const displayedCareers = showAllCareers ? filteredCareers : filteredCareers.slice(0, CAREERS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <UserPlus className="h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Créer Votre Compte</h2>
            <p className="text-gray-600 mt-2">Rejoignez notre plateforme d\'orientation académique</p>
          </div>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom Complet
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Entrez votre nom complet"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register('name')}
                />
              </div>

              <div className="flex-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Entrez votre email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register('email')}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex-1">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Année Académique
                </label>
                <select
                  id="year"
                  {...register('year')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez une année</option>
                  <option value="1ère Bac">1ère Bac</option>
                  <option value="2ème Bac">2ème Bac</option>
                </select>
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                )}
              </div>

              <div className="flex-1">
                <label htmlFor="filiere" className="block text-sm font-medium text-gray-700 mb-1">
                  Filière
                </label>
                <select
                  id="filiere"
                  {...register('filiere')}
                  disabled={isBacFieldsDisabled}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    isBacFieldsDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Sélectionnez une filière</option>
                  {availableFilieres.map((filiere) => (
                    <option key={filiere} value={filiere}>
                      {filiere}
                    </option>
                  ))}
                </select>
                {errors.filiere && (
                  <p className="mt-1 text-sm text-red-600">{errors.filiere.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex-1">
                <label htmlFor="studyDuration" className="block text-sm font-medium text-gray-700 mb-1">
                  Durée d\'Étude Voulue Post-Bac
                </label>
                <select
                  id="studyDuration"
                  {...register('studyDuration')}
                  disabled={isBacFieldsDisabled}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    isBacFieldsDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Sélectionnez une durée</option>
                  {availableStudyDurations.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
                {errors.studyDuration && (
                  <p className="mt-1 text-sm text-red-600">{errors.studyDuration.message}</p>
                )}
              </div>

              <div className="flex-1">
                <label htmlFor="bacMention" className="block text-sm font-medium text-gray-700 mb-1">
                  Mention Bac
                </label>
                <select
                  id="bacMention"
                  {...register('bacMention')}
                  disabled={isMentionBacDisabled}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    isMentionBacDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Sélectionnez une mention</option>
                  {availableBacMentions.map((mention) => (
                    <option key={mention} value={mention}>
                      {mention}
                    </option>
                  ))}
                </select>
                {errors.bacMention && (
                  <p className="mt-1 text-sm text-red-600">{errors.bacMention.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matières que vous aimez
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une matière..."
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {subjectSearch && (
                    <button
                      onClick={() => setSubjectSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {displayedSubjects.map((subject) => (
                    <label
                      key={subject}
                      className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                        (watch('subjects') || [])?.includes(subject)
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={subject}
                        {...register('subjects')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
                {filteredSubjects.length > SUBJECTS_PER_PAGE && (
                  <button
                    type="button"
                    onClick={() => setShowAllSubjects(!showAllSubjects)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    {showAllSubjects ? (
                      <>
                        Voir moins <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Voir plus ({filteredSubjects.length - SUBJECTS_PER_PAGE} autres) <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
              {errors.subjects && (
                <p className="mt-1 text-sm text-red-600">{errors.subjects.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aspirations Professionnelles
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une carrière..."
                    value={careerSearch}
                    onChange={(e) => setCareerSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {careerSearch && (
                    <button
                      onClick={() => setCareerSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {displayedCareers.map((career) => (
                    <label
                      key={career}
                      className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                        (watch('careerAspirations') || [])?.includes(career)
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={career}
                        {...register('careerAspirations')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{career}</span>
                    </label>
                  ))}
                </div>
                {filteredCareers.length > CAREERS_PER_PAGE && (
                  <button
                    type="button"
                    onClick={() => setShowAllCareers(!showAllCareers)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    {showAllCareers ? (
                      <>
                        Voir moins <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Voir plus ({filteredCareers.length - CAREERS_PER_PAGE} autres) <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
              {errors.careerAspirations && (
                <p className="mt-1 text-sm text-red-600">{errors.careerAspirations.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de Passe
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Créez un mot de passe"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmez le Mot de Passe
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirmez votre mot de passe"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              onClick={() => console.log('Submit button clicked')}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Création du compte...
                </span>
              ) : (
                'Créer un Compte'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;