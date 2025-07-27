import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AuthorForm = ({ author = {}, isEdit = false }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setValue
  } = useForm({
    defaultValues: {
      name: author.name || '',
      bio: author.bio || ''
    }
  });

  useEffect(() => {
    if (isEdit && author) {
      setValue('name', author.name || '');
      setValue('bio', author.bio || '');
    }
  }, [author, isEdit, setValue]);

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
        response = await axios.patch(`/authors/${author.id}`, { author: data }, config);
      } else {
        response = await axios.post('/authors', { author: data }, config);
      }

      console.log('✅ Author saved successfully:', response.data);

      // Handle redirect based on response
      const authorId = response.data.id || response.data.author?.id;
      if (authorId) {
        window.location.href = `/authors/${authorId}/show_react`;
      } else {
        console.error('❌ No author ID in response:', response.data);
        // Fallback: redirect to authors index
        window.location.href = '/authors/index_react';
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ base: ['An error occurred while saving the author'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      window.location.href = `/authors/${author.id}/show_react`;
    } else {
      window.location.href = '/authors/index_react';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? "Edit Author" : "Add New Author"}
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

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter author's full name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biography
            </label>
            <textarea
              {...register('bio')}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief biography of the author (optional)"
            />
            <p className="text-sm text-gray-500 mt-1">Brief biography or description of the author</p>
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
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </span>
              ) : (
                'Save Author'
              )}
            </button>
          </div>
        </form>

        {/* Back link */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <a
            href="/authors/index_react"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Authors List
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthorForm;
