import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { 
  counsellorsApi, 
  appointmentsApi, 
  wellnessApi, 
  blogsApi, 
  articlesApi, 
  resourcesApi,
  messagesApi,
  notificationsApi,
  goalsApi,
  testimonialsApi,
  adminApi
} from '../services/api';
import { toast } from 'react-hot-toast';

export function TestingDashboard() {
  const { user, profile } = useAuthContext();
  const [testResults, setTestResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    try {
      console.log(`Running test: ${testName}`);
      const result = await testFn();
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'success', data: result, error: null }
      }));
      toast.success(`✅ ${testName} passed`);
    } catch (error: any) {
      console.error(`Test failed: ${testName}`, error);
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'error', data: null, error: error.message }
      }));
      toast.error(`❌ ${testName} failed`);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});

    // Test Authentication APIs
    await runTest('Auth Profile', () => authApi.getProfile());

    // Test Counsellors APIs
    await runTest('Get Counsellors', () => counsellorsApi.getAll());
    await runTest('Get Available Counsellors', () => counsellorsApi.getAvailable());

    // Test Appointments APIs
    await runTest('Get Appointments', () => appointmentsApi.getAll());
    await runTest('Get Upcoming Appointments', () => appointmentsApi.getUpcoming());

    // Test Wellness APIs
    await runTest('Get Wellness Entries', () => wellnessApi.getAll());
    await runTest('Get Wellness Stats', () => wellnessApi.getStats());

    // Test Blog APIs
    await runTest('Get Blog Posts', () => blogsApi.getAll());
    await runTest('Get Published Blogs', () => blogsApi.getPublished());

    // Test Articles APIs
    await runTest('Get Articles', () => articlesApi.getAll());
    await runTest('Get Published Articles', () => articlesApi.getPublished());

    // Test Resources APIs
    await runTest('Get Resources', () => resourcesApi.getAll());
    await runTest('Get Free Resources', () => resourcesApi.getFree());

    // Test Messages APIs
    await runTest('Get Conversations', () => messagesApi.getConversations());
    await runTest('Get Unread Message Count', () => messagesApi.getUnreadCount());

    // Test Notifications APIs
    await runTest('Get Notifications', () => notificationsApi.getAll());
    await runTest('Get Unread Notifications', () => notificationsApi.getUnread());

    // Test Goals APIs
    await runTest('Get Goals', () => goalsApi.getAll());
    await runTest('Get Goal Stats', () => goalsApi.getStats());

    // Test Testimonials APIs
    await runTest('Get Testimonials', () => testimonialsApi.getAll());
    await runTest('Get Approved Testimonials', () => testimonialsApi.getApproved());

    // Test Admin APIs (if user has admin role)
    if (profile?.role === 'admin' || profile?.role === 'manager') {
      await runTest('Get Admin Stats', () => adminApi.getStats());
      await runTest('Get Users', () => adminApi.getUsers());
    }

    setIsRunning(false);
    toast.success('🎉 All tests completed!');
  };

  const createTestData = async () => {
    try {
      // Create a wellness entry
      await wellnessApi.create({
        entry_date: new Date().toISOString().split('T')[0],
        mood_score: 7,
        wellness_score: 8,
        anxiety_level: 3,
        sleep_hours: 7.5,
        exercise_minutes: 30,
        meditation_minutes: 15,
        notes: 'Test wellness entry'
      });

      // Create a goal
      await goalsApi.create({
        title: 'Test Goal',
        description: 'This is a test goal',
        category: 'wellness',
        target_value: 100,
        current_value: 25,
        unit: 'points',
        target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });

      // Create a testimonial
      await testimonialsApi.create({
        rating: 5,
        title: 'Test Testimonial',
        content: 'This is a test testimonial for the platform',
        is_anonymous: true
      });

      toast.success('✅ Test data created successfully!');
    } catch (error: any) {
      toast.error(`❌ Failed to create test data: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">System Integration Testing</h1>
        <p className="text-gray-600 mb-6">
          Test all API endpoints and system functionality to ensure proper integration.
        </p>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
          
          <button
            onClick={createTestData}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Create Test Data
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Current User Info:</h3>
          <p><strong>ID:</strong> {user?.id}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {profile?.role}</p>
          <p><strong>Name:</strong> {profile?.full_name || 'Not set'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(testResults).map(([testName, result]: [string, any]) => (
          <div
            key={testName}
            className={`p-4 rounded-lg border-2 ${
              result.status === 'success'
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{testName}</h3>
              <span className={`text-xs px-2 py-1 rounded ${
                result.status === 'success'
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}>
                {result.status === 'success' ? '✅ PASS' : '❌ FAIL'}
              </span>
            </div>
            
            {result.status === 'success' ? (
              <div className="text-xs text-gray-600">
                <p>Data received: {Array.isArray(result.data) ? `${result.data.length} items` : 'Object'}</p>
              </div>
            ) : (
              <div className="text-xs text-red-600">
                <p>Error: {result.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Test Summary</h2>
          <div className="bg-white p-4 rounded-lg border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Object.keys(testResults).length}
                </div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(testResults).filter((r: any) => r.status === 'success').length}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(testResults).filter((r: any) => r.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}