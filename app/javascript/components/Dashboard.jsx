import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user = null }) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    userLoans: 0,
    overdueLoans: 0,
    // Librarian/Admin stats
    totalUsers: 0,
    totalLoans: 0,
    activeLoans: 0,
    overdueLoansSystem: 0,
    totalAuthors: 0,
    totalCategories: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [userLoans, setUserLoans] = useState([]);
  const [recentLoans, setRecentLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/dashboard_data.json');
      const data = response.data;

      setStats(data.stats);
      setRecentBooks(data.recent_books || []);
      setUserLoans(data.user_loans || []);
      setRecentLoans(data.recent_loans || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowBook = async (bookId) => {
    try {
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const response = await axios.post(`/books/${bookId}/borrow`, {}, {
        headers: { 'X-CSRF-Token': token }
      });

      // Show success message
      alert(response.data.message || 'Book borrowed successfully!');

      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Error borrowing book:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Unknown error occurred';
      alert('Error borrowing book: ' + errorMessage);
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const response = await axios.patch(`/loans/${loanId}/return_book`, {}, {
        headers: { 'X-CSRF-Token': token }
      });

      // Show success message
      alert(response.data.message || 'Book returned successfully!');

      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Error returning book:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Unknown error occurred';
      alert('Error returning book: ' + errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to LibraGenie
          <span className="ml-2 text-lg font-normal text-green-600">(React Dashboard)</span>
        </h1>
        {user && (
          <div className="mb-4">
            <p className="text-xl text-gray-600">Your digital library management system</p>
            <div className="mt-2 inline-flex items-center gap-2">
              <span className="text-gray-600">Welcome, {user.name}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'librarian' ? 'bg-purple-100 text-purple-800' :
                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {user.display_role}
              </span>
            </div>
          </div>
        )}
        {!user && <p className="text-xl text-gray-600">Your digital library management system</p>}
      </div>

      {user ? (
        <>
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-blue-600">{stats.totalBooks}</div>
              <div className="text-gray-600">Total Books</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-green-600">{stats.availableBooks}</div>
              <div className="text-gray-600">Available</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-orange-600">{stats.borrowedBooks}</div>
              <div className="text-gray-600">Borrowed</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-purple-600">{stats.userLoans}</div>
              <div className="text-gray-600">Your Active Loans</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
              <div className={`text-2xl font-bold ${stats.overdueLoans > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                {stats.overdueLoans}
              </div>
              <div className="text-gray-600">Overdue</div>
            </div>
          </div>

          {/* Extended Stats for Librarians/Admins */}
          {user.can_manage_books && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-800">📊 System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="text-lg font-bold text-purple-600">{stats.totalUsers}</div>
                  <div className="text-gray-600 text-sm">Total Users</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="text-lg font-bold text-indigo-600">{stats.totalLoans}</div>
                  <div className="text-gray-600 text-sm">Total Loans</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="text-lg font-bold text-blue-600">{stats.activeLoans}</div>
                  <div className="text-gray-600 text-sm">Active Loans</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className={`text-lg font-bold ${stats.overdueLoansSystem > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {stats.overdueLoansSystem}
                  </div>
                  <div className="text-gray-600 text-sm">System Overdue</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="text-lg font-bold text-green-600">{stats.totalAuthors}</div>
                  <div className="text-gray-600 text-sm">Authors</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="text-lg font-bold text-teal-600">{stats.totalCategories}</div>
                  <div className="text-gray-600 text-sm">Categories</div>
                </div>
              </div>
            </div>
          )}

          {/* Recent System Activity for Librarians */}
          {user.can_manage_books && recentLoans.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">📋 Recent System Activity</h2>
              <div className="space-y-3">
                {recentLoans.map(loan => (
                  <div key={loan.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <h4 className="font-semibold">{loan.book.title}</h4>
                      <p className="text-sm text-gray-600">
                        Borrowed by {loan.user.email} • {new Date(loan.borrowed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Due: {new Date(loan.due_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Your Current Loans */}
          {userLoans.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Your Current Loans</h2>
              <div className="space-y-3">
                {userLoans.map(loan => (
                  <div
                    key={loan.id}
                    className={`flex justify-between items-center p-4 border rounded transition-colors ${
                      loan.overdue ? 'bg-red-50 border-red-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{loan.book.title}</h3>
                      <p className="text-sm text-gray-600">by {loan.book.author.name}</p>
                      <p className={`text-sm ${loan.overdue ? 'text-red-600' : 'text-gray-600'}`}>
                        Due: {new Date(loan.due_date).toLocaleDateString()}
                        {loan.overdue && <span className="font-semibold ml-1">(OVERDUE)</span>}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={`/books/${loan.book.id}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleReturnBook(loan.id)}
                        className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Return
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Books */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Recent Books</h2>
              <div className="flex space-x-2">
                <a href="/books" className="text-blue-600 hover:text-blue-800 text-sm">
                  Books (ERB)
                </a>
                <a href="/books/index_react" className="text-green-600 hover:text-green-800 text-sm font-semibold">
                  Books (React)
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentBooks.map(book => (
                <div key={book.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg mb-2">
                    <a href={`/books/${book.id}`} className="text-blue-600 hover:text-blue-800">
                      {book.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">by {book.author.name}</p>
                  <p className="text-gray-500 text-sm mb-2">{book.category.name}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {book.available ? 'Available' : 'Borrowed'}
                    </span>
                    {book.available && stats.userLoans < 5 && (
                      <button
                        onClick={() => handleBorrowBook(book.id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Borrow
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              {/* Actions available to all users */}
              <a
                href="/loans"
                className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-lg font-semibold">📋</div>
                <div>View My Loans</div>
              </a>

              {/* Actions only for librarians and admins */}
              {user.can_manage_books && (
                <>
                  <a
                    href="/books/new_react"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
                  >
                    <div className="text-lg font-semibold">📚</div>
                    <div>Add New Book</div>
                  </a>
                  <a
                    href="/authors/new"
                    className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors"
                  >
                    <div className="text-lg font-semibold">✍️</div>
                    <div>Add Author</div>
                  </a>
                  <a
                    href="/categories/new"
                    className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors"
                  >
                    <div className="text-lg font-semibold">📂</div>
                    <div>Add Category</div>
                  </a>
                </>
              )}

              {/* Actions only for borrowers */}
              {user.role === 'borrower' && (
                <a
                  href="/loans/new"
                  className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <div className="text-lg font-semibold">➕</div>
                  <div>Borrow a Book</div>
                </a>
              )}

            </div>
          </div>
        </>
      ) : (
        /* Not logged in view */
        <div className="text-center bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">Sign up or log in to start managing your library experience</p>
          <div className="space-x-4">
            <a
              href="/users/sign_up"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Sign Up
            </a>
            <a
              href="/users/sign_in"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Log In
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
