"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function NewBlog() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    authorName: "",
    position: "",
    readtime: "",
    sections: [{ subheading: "", content: "" }],
    tags: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSectionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const sections = [...formData.sections] as any;

    sections[index][name] = value;

    setFormData({
      ...formData,
      sections,
    });
  };

  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { subheading: "", content: "" }],
    });
  };

  const handleRemoveSection = () => {
    if (formData.sections.length > 1) {
      const sections = [...formData.sections];
      sections.pop();
      setFormData({
        ...formData,
        sections,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      }),
    });

    if (response.ok) {
      toast.success("Blog posted successfully");
      setFormData({
        title: "",
        description: "",
        authorName: "",
        position: "",
        readtime: "",
        sections: [{ subheading: "", content: "" }],
        tags: "",
      });
    } else {
      toast.error("Failed to post blog");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6 text-center">New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Author Name</label>
          <input
            type="text"
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            Author Position
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Reading Time</label>
          <input
            type="text"
            name="readtime"
            value={formData.readtime}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {formData.sections.map((section, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg space-y-4">
            <div>
              <label className="block text-lg font-medium mb-2">
                Subheading
              </label>
              <input
                type="text"
                name="subheading"
                value={section.subheading}
                onChange={(e) => handleSectionChange(index, e)}
                required
                className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Content</label>
              <textarea
                name="content"
                value={section.content}
                onChange={(e) => handleSectionChange(index, e)}
                required
                className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              ></textarea>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleAddSection}
            className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
          >
            Add Section
          </button>
          <button
            type="button"
            onClick={handleRemoveSection}
            className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
          >
            Remove Section
          </button>
          <button
            type="submit"
            className="py-2 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}