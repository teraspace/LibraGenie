import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoanForm = () => {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedBookDetails, setSelectedBookDetails] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFormData();
  }, []);

  useEffect(() => {
    // Set default due date to 2 weeks from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setDueDate(defaultDueDate.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (selectedBook) {
      const book = availableBooks.find(b => b.id.toString() === selectedBook);
      setSelectedBookDetails(book);
    } else {
      setSelectedBookDetails(null);
    }
  }, [selectedBook, availableBooks]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/loans/new_react.json');
      setAvailableBooks(response.data.available_books);
    } catch (error) {
      console.error('Error fetching form data:', error);
      setErrors({ general: 'Error loading available books' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBook) {
      setErrors({ book_id: ['Please select a book'] });
      return;
    }

    if (!dueDate) {
      setErrors({ due_date: ['Please select a due date'] });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const response = await axios.post('/loans', {
        loan: {
          book_id: selectedBook,
          due_date: dueDate
        }
      }, {
        headers: {
          'X-CSRF-Token': token,
          'Content-Type': 'application/json'
        }
      });

      // Redirect to loans index on success
      window.location.href = '/loans/index_react';
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'An error occurred while borrowing the book' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/loans/index_react';
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <a
          href="/loans/index_react"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to My Loans
        </a>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Borrow a Book
            <span className="ml-2 text-sm font-normal text-green-600">(React Version)</span>
          </h1>
          <p className="mt-1 text-sm text-gray-600">Select a book to borrow and set the due date.</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Errors */}
            {(errors.general || Object.keys(errors).length > 0) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      There were errors with your submission:
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {errors.general && <li>{errors.general}</li>}
                        {Object.entries(errors).map(([field, messages]) =>
                          field !== 'general' && Array.isArray(messages) && messages.map((message, index) => (
                            <li key={`${field}-${index}`}>{message}</li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Book Selection */}
            <div>
              <label htmlFor="book_select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Book
              </label>
              <div className="relative">
                <select
                  id="book_select"
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a book to borrow...</option>
                  {availableBooks.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.display_title}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-sm text-gray-500">Only available books are shown in this list.</p>
              {errors.book_id && (
                <p className="mt-1 text-sm text-red-600">{errors.book_id[0]}</p>
              )}
            </div>

            {/* Selected Book Details */}
            {selectedBookDetails && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Book Details:</h4>
                <div className="text-sm text-gray-700">
                  <p><strong>Title:</strong> {selectedBookDetails.title}</p>
                  <p><strong>Author:</strong> {selectedBookDetails.author.name}</p>
                  <p><strong>Category:</strong> {selectedBookDetails.category.name}</p>
                  {selectedBookDetails.description && (
                    <p><strong>Description:</strong> {selectedBookDetails.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Due Date */}
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Books can be borrowed for up to 6 months. Default is 2 weeks from today.
              </p>
              {errors.due_date && (
                <p className="mt-1 text-sm text-red-600">{errors.due_date[0]}</p>
              )}
            </div>

            {/* Loan Terms */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">📚 Loan Terms & Conditions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You can borrow up to 5 books at a time</li>
                <li>• Maximum loan period is 6 months</li>
                <li>• Late returns may result in restrictions</li>
                <li>• Books must be returned in good condition</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedBook}
                className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  submitting || !selectedBook
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Borrowing...
                  </span>
                ) : (
                  'Borrow Book'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Available Books Summary */}
      <div className="mt-8 bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Available Books ({availableBooks.length})
          </h2>
        </div>
        <div className="p-6">
          {availableBooks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No books are currently available for borrowing.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableBooks.slice(0, 6).map((book) => (
                <div key={book.id} className="border border-gray-200 rounded-lg p-3">
                  <h3 className="font-medium text-gray-900 text-sm">{book.title}</h3>
                  <p className="text-xs text-gray-600">{book.author.name}</p>
                  <p className="text-xs text-gray-500">{book.category.name}</p>
                </div>
              ))}
              {availableBooks.length > 6 && (
                <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-center bg-gray-50">
                  <p className="text-sm text-gray-500">
                    +{availableBooks.length - 6} more books
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Back to traditional view */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <a
          href="/loans/new"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Switch to Traditional View
        </a>
      </div>
    </div>
  );
};

export default LoanForm;
