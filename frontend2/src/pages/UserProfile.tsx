import { useAuth } from '../hooks/useAuth';
import { formatCurrency, formatDate, formatAddress } from '../utils/formatters';
import { User, Calendar, Wallet, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '../utils/validators';
import type { z } from 'zod';

type UserFormData = z.infer<typeof userSchema>;

export const UserProfile = () => {
  const { user } = useAuth();

  const { 
    register, 
    formState: { errors },
    handleSubmit 
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user
  });

  const onSubmit = async (data: UserFormData) => {
    console.log('Updated profile:', data);
    // Implement profile update logic here
  };

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

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    type="text"
                    {...register('firstName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    {...register('lastName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date de naissance
                  </label>
                  <input
                    type="text"
                    {...register('birthDate')}
                    placeholder="JJ/MM/AAAA"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.birthDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Wallet className="inline h-4 w-4 mr-1" />
                    Solde (MAD)
                  </label>
                  <input
                    type="number"
                    {...register('balance', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.balance && (
                    <p className="mt-1 text-sm text-red-600">{errors.balance.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <MapPin className="inline h-5 w-5 mr-2" />
                  Adresse
                </h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Numéro</label>
                    <input
                      type="text"
                      {...register('address.streetNumber')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.address?.streetNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.streetNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom de la rue</label>
                    <input
                      type="text"
                      {...register('address.streetName')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.address?.streetName && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.streetName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ville</label>
                    <input
                      type="text"
                      {...register('address.city')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.address?.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Code Postal</label>
                    <input
                      type="text"
                      {...register('address.postalCode')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.address?.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.postalCode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pays</label>
                    <input
                      type="text"
                      {...register('address.country')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.address?.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.country.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition duration-150 ease-in-out hover:scale-[1.02]"
                >
                  Mettre à jour
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};