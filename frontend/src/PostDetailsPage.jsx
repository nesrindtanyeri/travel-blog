import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetailsPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setNotification('Failed to fetch post.');
        setTimeout(() => setNotification(''), 3000);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/posts/${id}`);
      setNotification('Post deleted successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error deleting post:', error);
      setNotification('Failed to delete post.');
    }
  };

  const handleEdit = () => {
    if (!post || !post.id) {
      console.error('Post or Post ID is undefined');
      return;
    }
    navigate(`/edit/${post.id}`);
  };

  if (!post) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center bg-primary text-light">
        <p className="text-accent text-xl">Loading post details...</p>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-primary text-light p-6">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-accent text-lg mb-6">{post.content}</p>
      <img
        src={post.cover}
        alt={post.title}
        className="w-full max-w-md h-50 object-cover rounded-lg shadow-lg mx-auto mb-6"
      />
      {notification && (
        <div
          className={`p-4 mb-4 rounded ${
            notification.includes('success') ? 'bg-green-800' : 'bg-red-800'
          }`}
        >
          {notification}
        </div>
      )}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/')}
          className="border border-light bg-light text-primary p-2 rounded"
        >
          Back to Home
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="border border-light bg-red-800 text-primary p-2 rounded"
        >
          Delete Post
        </button>
        <button
          onClick={handleEdit}
          className="border border-light bg-green-900 text-primary p-2 rounded"
        >
          Edit Post
        </button>
      </div>
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="delete-modal-title"
        >
          <div className="bg-secondary text-light p-6 rounded shadow-lg">
            <h2 id="delete-modal-title" className="text-2xl font-bold mb-4">
              Are you sure?
            </h2>
            <p className="mb-4">
              Do you really want to delete this post? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDelete}
                className="border border-light bg-red-800 text-primary p-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border border-light bg-light text-primary p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailsPage;
