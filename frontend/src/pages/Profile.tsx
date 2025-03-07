import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Save, UserCircle, BookOpen } from 'lucide-react';

// Mock useUser hook with default data
const mockUseUser = () => {
  const defaultProfile = {
    name: 'John Doe',
    year: '1ère Bac',
    interests: ['Mathématiques', 'Physique'],
    subjects: [
      { name: 'Mathématiques', grade: 85 },
      { name: 'Physique', grade: 90 },
      { name: 'Sciences de la Vie et de la Terre', grade: 88 }
    ]
  };

  return {
    profile: defaultProfile,
    updateProfile: async (data: any) => console.log('Profile updated with:', data)
  };
};

function Profile() {
  const { profile, updateProfile } = mockUseUser();
  const [formData, setFormData] = useState({
    name: '',
    year: '1ère Bac',
    interests: ['Mathématiques', 'Physique'],
    subjects: [
      { name: 'Mathématiques', grade: 85 },
      { name: 'Physique', grade: 90 },
      { name: 'Sciences de la Vie et de la Terre', grade: 88 }
    ]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleAddSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: '', grade: 0 }]
    });
  };

  const handleRemoveSubject = (index: number) => {
    const newSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      // Add success notification here
      setTimeout(() => {
        setIsSubmitting(false);
      }, 600);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setIsSubmitting(false);
    }
  };

  // Calculate average grade
  const averageGrade = formData.subjects.length > 0 
    ? (formData.subjects.reduce((sum, subject) => sum + subject.grade, 0) / formData.subjects.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <UserCircle className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Student Profile</h1>
              <p className="text-blue-100">Manage your academic information</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Academic Year
                </label>
                <select
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                >
                  <option value="1ère Bac">1ère Bac</option>
                  <option value="2ème Bac">2ème Bac</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">Academic Subjects</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Average Grade:</span>
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                    {averageGrade}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {formData.subjects.map((subject, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={subject.name}
                        onChange={(e) => {
                          const newSubjects = [...formData.subjects];
                          newSubjects[index].name = e.target.value;
                          setFormData({ ...formData, subjects: newSubjects });
                        }}
                        placeholder="Subject name"
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        value={subject.grade}
                        min="0"
                        max="100"
                        onChange={(e) => {
                          const newSubjects = [...formData.subjects];
                          newSubjects[index].grade = parseInt(e.target.value);
                          setFormData({ ...formData, subjects: newSubjects });
                        }}
                        placeholder="Grade"
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="w-full flex items-center justify-center py-3 px-4 border border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add New Subject
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;