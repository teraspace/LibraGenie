import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const BookFormAdvanced = ({ book = {}, authors = [], categories = [], isEdit = false }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [authorSearch, setAuthorSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [filteredAuthors, setFilteredAuthors] = useState(authors);
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [isbnValidating, setIsbnValidating] = useState(false);
  const [isbnValid, setIsbnValid] = useState(null);
  const debounceRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setValue,
    watch,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      title: book.title || '',
      isbn: book.isbn || '',
      author_id: book.author_id || '',
      category_id: book.category_id || '',
      publication_date: book.publication_date || '',
      description: book.description || ''
    }
  });

  const watchedIsbn = watch('isbn');

  // Filter authors based on search
  useEffect(() => {
    if (authorSearch.trim() === '') {
      setFilteredAuthors(authors);
    } else {
      setFilteredAuthors(
        authors.filter(author =>
          author.name.toLowerCase().includes(authorSearch.toLowerCase())
        )
      );
    }
  }, [authorSearch, authors]);

  // Filter categories based on search
  useEffect(() => {
    if (categorySearch.trim() === '') {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter(category =>
          category.name.toLowerCase().includes(categorySearch.toLowerCase())
        )
      );
    }
  }, [categorySearch, categories]);

  // Validate ISBN in real-time
  useEffect(() => {
    if (watchedIsbn && watchedIsbn.length > 3) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        setIsbnValidating(true);
        try {
          const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
          const response = await axios.get(`/books/validate_isbn?isbn=${encodeURIComponent(watchedIsbn)}&exclude_id=${book.id || ''}`, {
            headers: { 'X-CSRF-Token': token }
          });

          if (response.data.valid) {
            setIsbnValid(true);
            clearErrors('isbn');
          } else {
            setIsbnValid(false);
            setError('isbn', { type: 'manual', message: 'ISBN already exists' });
          }
        } catch (error) {
          setIsbnValid(null);
        } finally {
          setIsbnValidating(false);
        }
      }, 500);
    } else {
      setIsbnValid(null);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [watchedIsbn, book.id, setError, clearErrors]);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrors({});

    try {
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const config = {
        headers: {
          'X-CSRF-Token': token,
          'Content-Type': 'application/json'
        }
      };

      let response;
      if (isEdit) {
        response = await axios.patch(`/books/${book.id}`, { book: data }, config);
      } else {
        response = await axios.post('/books', { book: data }, config);
      }

      console.log('✅ Book saved successfully:', response.data);

      // Handle redirect based on response
      const bookId = response.data.id || response.data.book?.id;
      if (bookId) {
        window.location.href = `/books/${bookId}`;
      } else {
        console.error('❌ No book ID in response:', response.data);
        // Fallback: redirect to books index
        window.location.href = '/books';
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ base: ['An error occurred while saving the book'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      window.location.href = `/books/${book.id}`;
    } else {
      window.location.href = '/books';
    }
  };

  const getIsbnInputClassName = () => {
    let baseClass = "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent";

    if (isbnValidating) {
      return `${baseClass} border-yellow-300 focus:ring-yellow-500`;
    } else if (isbnValid === true) {
      return `${baseClass} border-green-300 focus:ring-green-500`;
    } else if (isbnValid === false) {
      return `${baseClass} border-red-300 focus:ring-red-500`;
    } else {
      return `${baseClass} border-gray-300 focus:ring-blue-500`;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? "Edit Book" : "Add New Book"}
          <span className="ml-2 text-sm font-normal text-green-600">(React Version)</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Display */}
          {(Object.keys(errors).length > 0 || Object.keys(formErrors).length > 0) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium">Please fix the following errors:</h3>
              <ul className="mt-2 text-red-700 text-sm list-disc list-inside">
                {Object.entries(errors).map(([field, messages]) =>
                  Array.isArray(messages) ? messages.map((message, index) => (
                    <li key={`${field}-${index}`}>{field}: {message}</li>
                  )) : <li key={field}>{field}: {messages}</li>
                )}
                {Object.entries(formErrors).map(([field, error]) => (
                  <li key={field}>{field}: {error.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* ISBN with validation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('isbn', { required: 'ISBN is required' })}
                type="text"
                className={getIsbnInputClassName()}
              />
              {isbnValidating && (
                <div className="absolute right-3 top-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                </div>
              )}
              {isbnValid === true && (
                <div className="absolute right-3 top-2 text-green-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {isbnValid === false && (
                <div className="absolute right-3 top-2 text-red-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {isbnValid === false && (
              <p className="text-red-500 text-sm mt-1">This ISBN is already in use</p>
            )}
          </div>

          {/* Author and Category Grid with Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search authors..."
                  value={authorSearch}
                  onChange={(e) => setAuthorSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <select
                  {...register('author_id', { required: 'Author is required' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  size={Math.min(filteredAuthors.length + 1, 5)}
                >
                  <option value="">Select an author</option>
                  {filteredAuthors.map(author => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Don't see the author?{' '}
                <a
                  href="/authors/new"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Add a new author
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <select
                  {...register('category_id', { required: 'Category is required' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  size={Math.min(filteredCategories.length + 1, 5)}
                >
                  <option value="">Select a category</option>
                  {filteredCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Don't see the category?{' '}
                <a
                  href="/categories/new"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Add a new category
                </a>
              </p>
            </div>
          </div>

          {/* Publication Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Date
            </label>
            <input
              {...register('publication_date')}
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the book..."
            />
            <p className="text-sm text-gray-500 mt-1">Brief description of the book</p>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || isbnValid === false}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </span>
              ) : (
                'Save Book'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormAdvanced;
