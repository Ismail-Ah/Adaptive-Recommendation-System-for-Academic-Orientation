import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const schemaConnexion = z.object({
  identifiantEtudiant: z.string()
  /*
    .min(1, 'L\'identifiant étudiant est requis')
    .regex(/^[A-Z0-9]+$/, 'L\'identifiant étudiant doit contenir uniquement des lettres majuscules et des chiffres'),
    */,
  motDePasse: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    /*
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
    */
});

type FormulaireConnexion = z.infer<typeof schemaConnexion>;

function Connexion() {
  const navigate = useNavigate();
  const { login, error: erreurAuth } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormulaireConnexion>({
    resolver: zodResolver(schemaConnexion),
  });

  const onSubmit = async (data: FormulaireConnexion) => {
    try {
      await login(data.identifiantEtudiant, data.motDePasse);
      navigate('/profile');
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Identifiants invalides',
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <LogIn className="h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Bienvenue</h2>
            <p className="text-gray-600 mt-2">Connectez-vous à votre compte</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {(errors.root || erreurAuth) && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {errors.root?.message || erreurAuth}
              </div>
            )}

            <div>
              <label htmlFor="identifiantEtudiant" className="block text-sm font-medium text-gray-700 mb-1">
                Identifiant étudiant
              </label>
              <Input
                id="identifiantEtudiant"
                type="text"
                placeholder="Entrez votre identifiant étudiant"
                error={!!errors.identifiantEtudiant}
                helperText={errors.identifiantEtudiant?.message}
                {...register('identifiantEtudiant')}
              />
            </div>

            <div>
              <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <Input
                id="motDePasse"
                type="password"
                placeholder="Entrez votre mot de passe"
                error={!!errors.motDePasse}
                helperText={errors.motDePasse?.message}
                {...register('motDePasse')}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{' '}
              <Link to="/inscription" className="font-medium text-blue-600 hover:text-blue-500">
                Inscrivez-vous ici
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Connexion;
