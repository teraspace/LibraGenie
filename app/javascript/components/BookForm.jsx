import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const BookForm = ({ book = {}, authors = [], categories = [], isEdit = false }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setValue,
    watch
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

      // Redirect on success
      window.location.href = `/books/${response.data.id}`;
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? "Edit Book" : "Add New Book"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Display */}
          {(Object.keys(errors).length > 0 || Object.keys(formErrors).length > 0) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium">Please fix the following errors:</h3>
              <ul className="mt-2 text-red-700 text-sm list-disc list-inside">
                {Object.entries(errors).map(([field, messages]) =>
                  messages.map((message, index) => (
                    <li key={`${field}-${index}`}>{field}: {message}</li>
                  ))
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
              Title
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* ISBN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              {...register('isbn', { required: 'ISBN is required' })}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Author and Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <select
                {...register('author_id', { required: 'Author is required' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select an author</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
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
                Category
              </label>
              <select
                {...register('category_id', { required: 'Category is required' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
            />
            <p className="text-sm text-gray-500 mt-1">Brief description of the book</p>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
