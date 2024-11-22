import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
    <div className="font-sans bg-primary text-light">
      <nav className="bg-secondary text-light p-4 fixed w-full top-0 z-10 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <a
            href="#"
            className="text-xl italic transition-transform duration-500 hover:scale-110 hover:text-accent animate-bounce"
          >
            Bon Voyage - Enjoy & Remember
          </a>

          <div className="flex justify-center">
            <img
              src={"/img/bon-voyage.png"}
              alt="Bon Voyage Logo"
              className="w-52 h-auto"
            />
          </div>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            <li>
              <Link to="/create" className="hover:text-accent">
                Create a Post
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 w-screen bg-primary text-light p-6 pt-20">
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
          <button
            type="submit"
            className="btn btn-primary shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-secondary text-light p-4 mt-auto">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/img/bon-voyage.png"
              alt="Bon Voyage Logo"
              className="w-48 h-auto"
            />
          </div>

          <div className="text-center">
            <p>&copy; 2024 Travel Blog. All rights reserved.</p>
          </div>

          <div className="flex space-x-4">
            <a href="#" className="hover:text-accent">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="hover:text-accent">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-accent">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EditPostPage;
