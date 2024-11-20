import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import heroImage from './img/4.jpg';

const Homepage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="font-sans bg-primary text-light">
      {/* Navbar */}
      <nav className="bg-secondary text-light p-4 fixed w-full top-0 z-10 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <a href="#" className="text-2xl font-bold">Travel Blog</a>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/create" className="hover:text-accent">Create a Post</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-primary via-transparent to-secondary">
          <div className="text-center text-light">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Where Ever You Go, Go With Your Heart
            </h1>
            <p className="text-xl mb-8">
              Enjoy Your Adventure In Forest Of Dreams. Discover breathtaking places and share your adventures with us.
            </p>
            <Link
  to="/create"
  className="btn bg-accent text-light shadow-lg hover:shadow-xl hover:scale-105 transition-transform transition-shadow duration-300 px-6 py-3 rounded-lg"
>
  Create Yours Now
</Link>

          </div>
        </div>
      </header>

      {/* Main Content (Homepage Posts) */}
      <main className="container mx-auto p-6 mt-16">
        <h1 className="text-3xl font-bold mb-4">All Posts</h1>
        <div className="grid grid-cols-1 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="border border-light bg-secondary p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-light">{post.title}</h2>
                <p className="text-accent">{post.content.substring(0, 100)}...</p>
                <Link to={`/posts/${post.id}`} className="text-light hover:text-accent">Read More</Link>
              </div>
            ))
          ) : (
            <p className="text-accent">No posts available.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-light p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Travel Blog. All rights reserved.</p>
          <div className="flex justify-center mt-4 space-x-4">
            <a href="#" className="hover:text-accent"><i className="fab fa-facebook"></i></a>
            <a href="#" className="hover:text-accent"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-accent"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
