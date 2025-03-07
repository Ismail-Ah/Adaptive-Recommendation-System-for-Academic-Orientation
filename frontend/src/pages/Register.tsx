import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Adjust the import path based on your file structure

// Moroccan curriculum-based interests and subjects
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

const subjects = [
  'Mathématiques',
  'Physique-Chimie',
  'Sciences de la Vie et de la Terre',
  'Français',
  'Arabe',
  'Histoire-Géographie',
  'Philosophie',
];

// Career aspirations based on common Moroccan academic/professional paths
const careerAspirations = [
  'Ingénierie',
  'Médecine',
  'Droit',
  'Économie',
  'Enseignement',
  'Technologie de l’Information',
  'Arts et Lettres',
];

// Schema for registration
const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .regex(/^[a-zA-Z\s]+$/, 'Le nom doit contenir uniquement des lettres et des espaces'),
  email: z.string().email('Veuillez entrer un email valide'),
  year: z.enum(['1ère Bac', '2ème Bac']),
  interests: z.array(z.string()).min(1, 'Sélectionnez au moins un intérêt'),
  subjects: z.array(z.string()).min(1, 'Sélectionnez au moins une matière que vous aimez'),
  careerAspirations: z
    .array(z.string())
    .min(1, 'Sélectionnez au moins une aspiration professionnelle'),
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
  const { register: registerUser, error } = useAuth(); // Use the register function from AuthContext
  const navigate = useNavigate(); // For redirecting after successful registration
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      // Call the register function from AuthContext
      await registerUser({
        name: data.name,
        email: data.email,
        year: data.year,
        interests: data.interests,
        subjects: data.subjects,
        careerAspirations: data.careerAspirations,
        password: data.password,
      });
      // On success, redirect to a dashboard or home page
      navigate('/profile');
    } catch (err) {
      console.error('Erreur d’inscription:', err);
      // Error is already handled in the AuthContext (stored in state.error)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <UserPlus className="h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Créer Votre Compte</h2>
            <p className="text-gray-600 mt-2">Rejoignez notre plateforme d’orientation académique</p>
          </div>

          {/* Display error from AuthContext if it exists */}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
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

            <div>
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

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Année
              </label>
              <select
                id="year"
                {...register('year')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="1ère Bac">1ère Bac</option>
                <option value="2ème Bac">2ème Bac</option>
              </select>
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intérêts
              </label>
              <div className="grid grid-cols-2 gap-4">
                {interests.map((interest) => (
                  <label key={interest} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={interest}
                      {...register('interests')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
              {errors.interests && (
                <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matières que vous aimez
              </label>
              <div className="grid grid-cols-2 gap-4">
                {subjects.map((subject) => (
                  <label key={subject} className="flex items-center space-x-2">
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
              {errors.subjects && (
                <p className="mt-1 text-sm text-red-600">{errors.subjects.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aspirations Professionnelles
              </label>
              <div className="grid grid-cols-2 gap-4">
                {careerAspirations.map((aspiration) => (
                  <label key={aspiration} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={aspiration}
                      {...register('careerAspirations')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{aspiration}</span>
                  </label>
                ))}
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Connectez-vous ici
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;