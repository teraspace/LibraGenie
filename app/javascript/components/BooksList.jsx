import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BooksList = ({ initialBooks = [], initialAuthors = [], initialCategories = [] }) => {
  const [books, setBooks] = useState(initialBooks);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    author_id: '',
    available: ''
  });
  const [authors] = useState(initialAuthors);
  const [categories] = useState(initialCategories);
  const debounceRef = useRef();

  // Debounced search function
  const searchBooks = async (searchFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`/books.json?${params.toString()}`);
      setBooks(response.data.books || []);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced effect for search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchBooks(filters);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category_id: '',
      author_id: '',
      available: ''
    });
  };

  const handleBorrowBook = async (bookId) => {
    try {
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      await axios.post(`/books/${bookId}/borrow`, {}, {
        headers: { 'X-CSRF-Token': token }
      });

      // Refresh the book list
      searchBooks(filters);
    } catch (error) {
      alert('Error borrowing book: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      await axios.patch(`/books/${bookId}/return_book`, {}, {
        headers: { 'X-CSRF-Token': token }
      });

      // Refresh the book list
      searchBooks(filters);
    } catch (error) {
      alert('Error returning book: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Books <span className="text-sm font-normal text-green-600">(React Version)</span>
        </h1>
        <div className="flex space-x-3">
          <a href="/books/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Add New Book (ERB)
          </a>
          <a
            href="/books/new_react"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            onClick={(e) => {
              console.log('Button clicked! Navigating to:', e.target.href);
              // No preventDefault, let it navigate normally
            }}
          >
            Add New Book (React)
          </a>
        </div>
      </div>

      {/* Real-time Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <input
              type="text"
              placeholder="Search books..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.author_id}
              onChange={(e) => handleFilterChange('author_id', e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Authors</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.available}
              onChange={(e) => handleFilterChange('available', e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Books</option>
              <option value="true">Available</option>
              <option value="false">Borrowed</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
          >
            Clear Filters
          </button>
          {loading && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Searching...
            </div>
          )}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">
              <a href={`/books/${book.id}`} className="text-blue-600 hover:text-blue-800">
                {book.title}
              </a>
            </h3>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p><strong>Author:</strong> {book.author?.name}</p>
              <p><strong>Category:</strong> {book.category?.name}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              {book.publication_date && (
                <p><strong>Published:</strong> {new Date(book.publication_date).getFullYear()}</p>
              )}
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                book.available
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {book.available ? 'Available' : 'Borrowed'}
              </span>

              <div className="flex space-x-2">
                <a href={`/books/${book.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                  View
                </a>
                <a href={`/books/${book.id}/edit`} className="text-gray-600 hover:text-gray-800 text-sm">
                  Edit
                </a>
              </div>
            </div>

            {book.available ? (
              <button
                onClick={() => handleBorrowBook(book.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-center block"
              >
                Borrow This Book
              </button>
            ) : book.current_user_borrowed ? (
              <button
                onClick={() => handleReturnBook(book.id)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-center block"
              >
                Return This Book
              </button>
            ) : (
              <div className="w-full bg-gray-100 text-gray-500 px-4 py-2 rounded text-center">
                Currently Borrowed
              </div>
            )}
          </div>
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books found.</p>
          <a href="/books/new_react" className="text-blue-600 hover:text-blue-800">
            Add the first book
          </a>
        </div>
      )}
    </div>
  );
};

export default BooksList;
