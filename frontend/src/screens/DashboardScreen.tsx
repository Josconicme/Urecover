import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { TestingDashboard } from '../components/TestingDashboard';

export function DashboardScreen() {
  const { user, profile, signOut } = useAuthContext();
  const [showTesting, setShowTesting] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  if (showTesting) {
    return <TestingDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">U-Recover Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTesting(!showTesting)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                {showTesting ? 'Back to Dashboard' : 'System Testing'}
              </button>
              <span className="text-gray-700">Welcome, {profile?.full_name || user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-primary-color text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-color/90"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to U-Recover
              </h2>
              <p className="text-gray-600 mb-4">
                Your mental health journey starts here.
              </p>
              <div className="space-y-2 mb-6">
                <p><strong>User ID:</strong> {user?.id}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {profile?.role}</p>
                <p><strong>Name:</strong> {profile?.full_name || 'Not set'}</p>
              </div>
              
              <button
                onClick={() => setShowTesting(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Open System Testing Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}