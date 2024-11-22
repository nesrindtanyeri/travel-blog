import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="font-sans bg-primary text-light min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-secondary text-light p-4 fixed w-full top-0 z-10 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-xl italic transition-transform hover:scale-110 hover:text-accent"
          >
            Bon Voyage - Explore
          </Link>
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
      <main className="container mx-auto mt-20 p-4 flex-1">
        <h1 className="text-center text-3xl font-bold mb-6">All Posts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                to={`/posts/${post.id}`}
                key={post.id}
                className="group relative border border-light bg-secondary rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl"
              >
                {/* Image Section */}
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                {/* Post Content */}
                <div className="p-4">
                  <h2 className="text-xl font-bold text-light mb-2">{post.title}</h2>
                  <p className="text-accent">{post.content.substring(0, 100)}...</p>
                </div>
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-light text-lg font-semibold">Read More</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-accent">No posts available.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-light p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Travel Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PostsPage;
