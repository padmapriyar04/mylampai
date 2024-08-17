"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'

const CreateCommunityForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Retrieve JWT token from headers
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        toast.error(errorMessage.error || 'Failed to create community');
      }

      const data = await response.json();
      alert(`Community "${data.community.name}" created successfully!`);
      router.push('/adminDashboard'); // Redirect to homepage after successful creation

    } catch (error) {
      console.error('Error creating community:', error);
      alert('Failed to create community. Please try again.');
    }
  };

  return (
    <div>
      <h1>Create Community</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          className='text-black'
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br /><br />
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          className='text-black'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          cols={50}
        />
        <br /><br />
        <button type="submit">Create Community</button>
      </form>
    </div>
  );
};

export default CreateCommunityForm;
