import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthorsList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredAuthors, setFilteredAuthors] = useState([]);

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredAuthors(authors);
    } else {
      const filtered = authors.filter(author =>
        author.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredAuthors(filtered);
    }
  }, [search, authors]);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('/authors/index_react.json');
      setAuthors(response.data.authors);
      setFilteredAuthors(response.data.authors);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (authorId, authorName) => {
    if (!confirm(`Are you sure you want to delete "${authorName}"?`)) {
      return;
    }

    try {
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      await axios.delete(`/authors/${authorId}`, {
        headers: {
          'X-CSRF-Token': token
        }
      });

      // Remove from local state
      setAuthors(authors.filter(author => author.id !== authorId));
      alert('Author deleted successfully!');
    } catch (error) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Error deleting author');
      }
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
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Authors
            <span className="ml-2 text-sm font-normal text-green-600">(React Version)</span>
          </h1>
          <a
            href="/authors/new_react"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add New Author
          </a>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search authors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md border border-gray-300 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Authors Grid */}
        {filteredAuthors.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No authors found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search.trim() ? 'Try adjusting your search terms.' : 'Get started by creating a new author.'}
            </p>
            {!search.trim() && (
              <div className="mt-6">
                <a
                  href="/authors/new_react"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add New Author
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuthors.map((author) => (
              <div key={author.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{author.name}</h3>
                  <div className="flex space-x-2">
                    <a
                      href={`/authors/${author.id}/show_react`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </a>
                    <a
                      href={`/authors/${author.id}/edit_react`}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDelete(author.id, author.name)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {author.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{author.bio}</p>
                )}

                <div className="flex items-center text-sm text-gray-500">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {author.books ? author.books.length : 0} book(s)
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to traditional view */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href="/authors"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Switch to Traditional View
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthorsList;
