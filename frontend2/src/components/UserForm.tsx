import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '../utils/validators';
import type { User } from '../types';

interface UserFormProps {
  onSubmit: (data: Partial<User>) => void;
  initialData?: Partial<User>;
}

export const UserForm = ({ onSubmit, initialData }: UserFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom</label>
          <input
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
            {...register('lastName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date de naissance (JJ/MM/AAAA)</label>
          <input
            {...register('birthDate')}
            placeholder="JJ/MM/AAAA"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Solde (MAD)</label>
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
        <h3 className="text-lg font-medium text-gray-900">Adresse</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro</label>
            <input
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
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
};