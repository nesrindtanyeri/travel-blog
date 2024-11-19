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
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-600">{post.content}</p>
      <img src={post.cover} alt={post.title} className="w-full h-64 object-cover my-4" />
      <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">Delete Post</button>
    </div>
  );
};

export default PostDetailsPage;
