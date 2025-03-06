import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { UserTable } from '../components/UserTable';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '01/01/1990',
    balance: 5000,
    address: {
      streetNumber: '123',
      streetName: 'Rue Mohammed V',
      city: 'Casablanca',
      postalCode: '20000',
      country: 'Maroc'
    },
    role: 'user'
  }
];

export const UserManagement = () => {
  const [users] = useState<User[]>(mockUsers);
  const navigate = useNavigate();

  const handleEdit = (user: User) => {
    navigate(`/users/edit/${user.id}`);
  };

  const handleDelete = (userId: string) => {
    console.log('Delete user:', userId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
            </div>
            <button
              onClick={() => navigate('/users/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition duration-150 ease-in-out hover:scale-[1.02]"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter un utilisateur
            </button>
          </div>

          <div className="bg-white rounded-lg overflow-hidden">
            <UserTable
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};