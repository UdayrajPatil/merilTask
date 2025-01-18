'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const JobRequisitionPage = () => {
  const router = useRouter();
  const [requisitions, setRequisitions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    department: '',
    designation: '',
    no_of_positions: '',
    custom_skills: '',
    company: '',
    status: '',
    requested_by: '',
    custom_how_the_vacancy_as_arisen: '',
    requested_by_designation: '',
    posting_date: '',
    expected_by: '',
    custom_employee_type: '',
    custom_location: '',
    custom_work_experience: '',
    custom_salary: '',
    custom_preferred_notice_period: '',
    custom_qualifications: '',
    description: '',
  });

  const [apiKey, setApiKey] = useState(null);
  const [apiSecret, setApiSecret] = useState(null);

  

  // Fetch API keys from localStorage in useEffect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedApiKey = localStorage.getItem('apiKey');
      const storedApiSecret = localStorage.getItem('apiSecret');

      if (!storedApiKey || !storedApiSecret) {
        router.push('/login'); // Redirect to login if keys are missing
        return;
      }

      setApiKey(storedApiKey);
      setApiSecret(storedApiSecret);
      fetchRequisitions(storedApiKey, storedApiSecret);
    }
  }, []);

  const fetchRequisitions = async (apiKey, apiSecret) => {
    
    try {
       
      const response = await fetch('https://erpprd.microcrispr.com/api/resource/JobRequisition',
        {
        method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey} : ${apiSecret}`,
          },
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setRequisitions(data.data || []);
      } else {
        setError('Failed to fetch job requisitions');
      }
    } catch (err) {
        console.log('err', err)
      setError('An error occurred while fetching requisitions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!apiKey || !apiSecret) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        'https://erprd.microcrispr.com/api/resource/Job',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${apiKey}:${apiSecret}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setShowForm(false);
        fetchRequisitions(apiKey, apiSecret); 
        setFormData({}); 
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create job requisition');
      }
    } catch (err) {
      setError('An error occurred while submitting the form');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Job Requisitions</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showForm ? 'View Listings' : 'Create New'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {showForm ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                {/* Add similar input fields for all other form fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">No. of Positions</label>
                  <input
                    type="number"
                    name="no_of_positions"
                    value={formData.no_of_positions}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                {/* Add other fields following the same pattern */}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Positions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requisitions.map((req, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{req.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{req.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{req.no_of_positions}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{req.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRequisitionPage;