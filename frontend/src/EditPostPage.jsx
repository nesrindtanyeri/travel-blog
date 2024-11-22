import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    cover: "",
  });
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/posts/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("API Endpoint:", `http://localhost:5000/posts/${id}`);
    console.log("Form Data Before Submit:", formData);
    console.log("Form Data:", formData);

    try {
      await axios.put(`http://localhost:5000/posts/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setNotification("Post updated successfully!");
      setTimeout(() => setNotification(""), 3000);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      setNotification("Failed to update post.");
    }
  };

  return (
    <div className="w-screen min-h-screen bg-primary text-light p-6">
      <h1 className="text-4xl font-bold mb-4">Edit Post</h1>
      {/* Notification */}
      {notification && (
        <div className="notification bg-secondary text-light p-2 rounded mb-4">
          {notification}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title || ""}
          onChange={handleChange}
          className="border border-light bg-light text-primary p-2 rounded"
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content || ""}
          onChange={handleChange}
          className="border border-light bg-light text-primary p-2 rounded"
        />
        <input
          type="text"
          name="cover"
          placeholder="Cover Image URL"
          value={formData.cover || ""}
          onChange={handleChange}
          className="border border-light bg-light text-primary p-2 rounded"
        />
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
