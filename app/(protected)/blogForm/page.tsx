"use client"
import { useState } from 'react';

export default function NewBlog() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    authorName: '',
    position: '',
    readtime:' ',
    sections: [{ subheading: '', content: '' }],
    tags: '',
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSectionChange = (index:any, e:any) => {
    const { name, value } = e.target;
    const sections = [...formData.sections];
    sections[index][name] = value;
    setFormData({
      ...formData,
      sections,
    });
  };

  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { subheading: '', content: '' }],
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const response = await fetch('/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        tags: formData.tags.split(',').map((tag) => tag.trim()),
      }),
    });
    console.log(response)
    if (response.ok) {
      alert('Blog posted successfully!');
      setFormData({
        title: '',
        description: '',
        authorName: '',
        position: '',
        readtime:' ',
        sections: [{ subheading: '', content: '' }],
        tags: '',
      });
    } else {
      alert('Failed to post blog');
    }
  };

  return (
    <div>
      <h1>New Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Author Name</label>
          <input type="text" name="authorName" value={formData.authorName} onChange={handleChange} required />
        </div>
        <div>
          <label>Author Position</label>
          <input type="text" name="position" value={formData.position} onChange={handleChange} required />
        </div>
        <div>
          <label>Reading Time</label>
          <input type="text" name="readtime" value={formData.readtime} onChange={handleChange} required />
        </div>
        <div>
          <label>Tags</label>
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} required />
        </div>
        {formData.sections.map((section, index) => (
          <div key={index}>
            <div>
              <label>Subheading</label>
              <input type="text" name="subheading" value={section.subheading} onChange={(e) => handleSectionChange(index, e)} required />
            </div>
            <div>
              <label>Content</label>
              <textarea name="content" value={section.content} onChange={(e) => handleSectionChange(index, e)} required />
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddSection}>Add Section</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
