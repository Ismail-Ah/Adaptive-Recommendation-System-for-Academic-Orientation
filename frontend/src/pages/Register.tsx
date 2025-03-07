import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { UserPlus } from 'lucide-react';

const interests = [
  'Mathématiques',
  'Physique',
  'Chimie',
  'Biologie',
  'Informatique',
  'Économie',
  'Littérature',
];

const subjects = [
  'Mathématiques',
  'Physique-Chimie',
  'Sciences de la Vie et de la Terre',
  'Français',
  'Arabe',
  'Histoire-Géographie',
];

const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  year: z.enum(['1ère Bac', '2ème Bac']),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  subjects: z.array(z.object({
    name: z.string(),
    grade: z.number()
      .min(0, 'Grade must be at least 0')
      .max(100, 'Grade must be at most 100'),
  })).min(1, 'Add at least one subject'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      subjects: subjects.map(subject => ({ name: subject, grade: 0 })),
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      console.log('Registration data:', data);
      // TODO: Implement registration logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <UserPlus className="h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
            <p className="text-gray-600 mt-2">Join our academic guidance platform</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register('name')}
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year
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
                Interests
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
                Subjects and Grades
              </label>
              <div className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={subject} className="flex space-x-4">
                    <Input
                      type="text"
                      value={subject}
                      disabled
                      className="flex-1 bg-gray-50"
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Grade"
                      error={!!errors.subjects?.[index]?.grade}
                      helperText={errors.subjects?.[index]?.grade?.message}
                      {...register(`subjects.${index}.grade` as const, { valueAsNumber: true })}
                      className="w-24"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword')}
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;