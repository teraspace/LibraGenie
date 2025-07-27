import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthorDetail = ({ authorId }) => {
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setLoading(true);

        // Fetch author details
        const authorResponse = await axios.get(`/authors/${authorId}.json`);
        setAuthor(authorResponse.data);

        // Fetch books by this author
        const booksResponse = await axios.get(`/books.json?author_id=${authorId}`);
        setBooks(booksResponse.data.books || []);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching author data:', err);
        setError('Error loading author details');
        setLoading(false);
      }
    };

    if (authorId) {
      fetchAuthorData();
    }
  }, [authorId]);

  const handleEdit = () => {
    window.location.href = `/authors/${authorId}/edit`;
  };

  const handleBack = () => {
    window.location.href = '/authors/index_react';
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este autor? Esta acción no se puede deshacer.')) {
      try {
        await axios.delete(`/authors/${authorId}`, {
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          }
        });
        window.location.href = '/authors/index_react';
      } catch (err) {
        console.error('Error deleting author:', err);
        alert('Error al eliminar el autor');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Autor no encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{author.name}</h1>
            <p className="mt-2 text-gray-600">Detalles del autor</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Volver
            </button>
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* Author Information Card */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Información del Autor</h2>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Nombre</dt>
            <dd className="mt-1 text-sm text-gray-900">{author.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{author.email || 'No especificado'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Biografía</dt>
            <dd className="mt-1 text-sm text-gray-900">{author.biography || 'No especificada'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total de libros</dt>
            <dd className="mt-1 text-sm text-gray-900">{books.length}</dd>
          </div>
        </dl>
      </div>

      {/* Books by this Author */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Libros de este autor ({books.length})
        </h2>

        {books.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay libros</h3>
            <p className="mt-1 text-sm text-gray-500">Este autor aún no tiene libros registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-sm font-medium text-gray-900 mb-2">{book.title}</h3>
                <p className="text-xs text-gray-500 mb-2">ISBN: {book.isbn}</p>
                <p className="text-xs text-gray-600 mb-3">{book.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.available ? 'Disponible' : 'Prestado'}
                  </span>
                  <a
                    href={`/books/${book.id}`}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    Ver detalles
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDetail;
