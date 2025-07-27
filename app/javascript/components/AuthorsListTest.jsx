import React, { useState, useEffect } from 'react';

const AuthorsListTest = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('📋 AuthorsListTest: Effect running...');

    // Simulate data fetch without axios
    setTimeout(() => {
      console.log('📋 AuthorsListTest: Setting test data...');
      setAuthors([
        { id: 1, name: 'Test Author 1', bio: 'Test bio 1' },
        { id: 2, name: 'Test Author 2', bio: 'Test bio 2' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', border: '2px solid blue' }}>
        <h2 style={{ color: 'blue' }}>🔄 Loading Test Authors...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', border: '2px solid red' }}>
        <h2 style={{ color: 'red' }}>❌ Error: {error}</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '2px solid green' }}>
      <h2 style={{ color: 'green' }}>✅ Test Authors List</h2>
      <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
        {authors.map(author => (
          <div key={author.id} style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{author.name}</h3>
            <p>{author.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorsListTest;
