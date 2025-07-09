import React from 'react';
import { Link } from 'react-router-dom';

export function UnauthorizedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-400">403</h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Access Denied</h2>
          <p className="text-gray-600 mt-2">
            You don't have permission to access this resource.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-color hover:bg-primary-color/90"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}