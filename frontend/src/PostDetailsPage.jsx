import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetailsPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/posts/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!post) {
    return <p className="text-accent">Loading...</p>;
  }

  return (
    <div className="w-screen min-h-screen bg-primary text-light p-6">
  <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
  <p className="text-accent text-lg mb-6">{post.content}</p>
  <img
    src={post.cover}
    alt={post.title}
    className="w-full h-64 object-cover rounded-lg shadow-lg mb-6"
  />
  <div className="flex space-x-4">
    <button
      onClick={() => navigate('/')}
      className="btn bg-secondary text-light shadow-md hover:shadow-lg hover:scale-105 transition-transform"
    >
      Back to Home
    </button>
    <button
      onClick={handleDelete}
      className="btn bg-red-500 text-light shadow-md hover:shadow-lg hover:scale-105 transition-transform"
    >
  Delete Post
      </button>
      <button
        onClick={() => navigate(`/edit/${post.id}`)}
        className="btn bg-accent text-primary shadow-md hover:shadow-lg hover:scale-105 transition-transform"
      >
        Edit Post
      </button>
    </div>
  </div>
);
};

export default PostDetailsPage;
