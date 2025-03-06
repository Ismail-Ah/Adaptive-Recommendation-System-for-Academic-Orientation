import { useAuth } from '../hooks/useAuth';
import { formatCurrency, formatDate, formatAddress } from '../utils/formatters';
import { User, Mail, Calendar, Wallet, MapPin } from 'lucide-react';

export const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-bold text-white">
                  Profil Utilisateur
                </h3>
                <p className="mt-1 text-indigo-100">
                  Gérez vos informations personnelles
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 grid grid-cols-3 gap-4">
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <User className="h-5 w-5 mr-2" />
                  Nom complet
                </dt>
                <dd className="col-span-2 text-sm text-gray-900 mt-0">
                  {user.firstName} {user.lastName}
                </dd>
              </div>

              <div className="py-4 grid grid-cols-3 gap-4">
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <Calendar className="h-5 w-5 mr-2" />
                  Date de naissance
                </dt>
                <dd className="col-span-2 text-sm text-gray-900 mt-0">
                  {formatDate(user.birthDate)}
                </dd>
              </div>

              <div className="py-4 grid grid-cols-3 gap-4">
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <Wallet className="h-5 w-5 mr-2" />
                  Solde
                </dt>
                <dd className="col-span-2 text-sm font-medium text-emerald-600 mt-0">
                  {formatCurrency(user.balance)}
                </dd>
              </div>

              <div className="py-4 grid grid-cols-3 gap-4">
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <MapPin className="h-5 w-5 mr-2" />
                  Adresse
                </dt>
                <dd className="col-span-2 text-sm text-gray-900 mt-0">
                  {formatAddress(user.address)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};