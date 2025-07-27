import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoansList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLoans();
  }, [filter]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const url = filter ? `/loans/index_react.json?filter=${filter}` : '/loans/index_react.json';
      const response = await axios.get(url);
      setLoans(response.data.loans);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (loanId) => {
    if (!confirm('Are you sure you want to return this book?')) {
      return;
    }

    try {
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      await axios.patch(`/loans/${loanId}/return_book`, {}, {
        headers: {
          'X-CSRF-Token': token
        }
      });

      // Refresh the loans list
      fetchLoans();
      alert('Book returned successfully!');
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Error returning book');
    }
  };

  const getStatusBadge = (loan) => {
    if (loan.returned_at) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Returned
        </span>
      );
    } else if (loan.status === 'overdue') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {loan.days_overdue} day(s) overdue
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Active
        </span>
      );
    }
  };

  const filterButtons = [
    { key: '', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'returned', label: 'Returned' },
    { key: 'overdue', label: 'Overdue' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            My Loans
            <span className="ml-2 text-sm font-normal text-green-600">(React Version)</span>
          </h1>
          <a
            href="/loans/new_react"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Borrow a Book
          </a>
        </div>

        {/* Filter buttons */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === btn.key
                    ? btn.key === 'overdue'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loans List */}
        {loans.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No loans found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter ? `No ${filter} loans found.` : 'You haven\'t borrowed any books yet.'}
            </p>
            <div className="mt-6">
              <a
                href="/loans/new_react"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Borrow Your First Book
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {loans.map((loan) => (
                <li key={loan.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <p className="text-lg font-medium text-gray-900 truncate">
                              {loan.book.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              by {loan.book.author.name} • {loan.book.category.name}
                            </p>
                            <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                              <span>
                                <strong>Borrowed:</strong> {loan.formatted_created_at}
                              </span>
                              <span>
                                <strong>Due:</strong> {loan.formatted_due_date}
                              </span>
                              {loan.formatted_returned_at && (
                                <span className="text-green-600">
                                  <strong>Returned:</strong> {loan.formatted_returned_at}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(loan)}
                        {!loan.returned_at && (
                          <button
                            onClick={() => handleReturnBook(loan.id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition-colors"
                          >
                            Return Book
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Back to traditional view */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href="/loans"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Switch to Traditional View
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoansList;
