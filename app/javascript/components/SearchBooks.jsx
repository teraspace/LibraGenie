import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SearchBooks = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef();
  const searchRef = useRef();

  useEffect(() => {
    if (query.length >= 2) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/books.json?search=${encodeURIComponent(query)}`);
          setResults(response.data.books || []);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBookSelect = (book) => {
    window.location.href = `/books/${book.id}`;
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 Search books, authors, ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-sm text-gray-500 border-b">
                Found {results.length} {results.length === 1 ? 'book' : 'books'}
              </div>
              {results.map(book => (
                <div
                  key={book.id}
                  onClick={() => handleBookSelect(book)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{book.title}</h4>
                      <p className="text-sm text-gray-600">by {book.author?.name}</p>
                      <p className="text-xs text-gray-500">{book.category?.name} • ISBN: {book.isbn}</p>
                    </div>
                    <div className="ml-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        book.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.available ? 'Available' : 'Borrowed'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length >= 2 && !loading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="text-2xl mb-2">📚</div>
              <p>No books found for "{query}"</p>
              <a href="/books/new_react" className="text-blue-600 hover:text-blue-800 text-sm">
                Add a new book?
              </a>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBooks;
