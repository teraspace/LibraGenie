import React, { useState } from 'react'

const CategoryForm = ({ category, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const url = isEdit ? `/categories/${category.id}` : '/categories'
      const method = isEdit ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({
          category: formData
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Success - redirect to category or categories list
        const redirectUrl = isEdit ? `/categories/${category.id}` : '/categories'
        window.location.href = redirectUrl
      } else {
        // Handle validation errors
        if (data.errors) {
          setErrors(data.errors)
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ base: 'An error occurred while saving the category.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Category' : 'New Category'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEdit ? 'Update the category information below.' : 'Add a new category to organize books in the library.'}
          </p>
        </div>

        {errors.base && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800 text-sm">{errors.base}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`appearance-none relative block w-full px-3 py-3 border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
              placeholder="Enter category name"
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{Array.isArray(errors.name) ? errors.name[0] : errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`appearance-none relative block w-full px-3 py-3 border ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
              placeholder="Enter a brief description of this category..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{Array.isArray(errors.description) ? errors.description[0] : errors.description}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => window.location.href = '/categories'}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium py-2 px-6 rounded-md transition duration-200 min-w-[120px]`}
            >
              {isSubmitting ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryForm
