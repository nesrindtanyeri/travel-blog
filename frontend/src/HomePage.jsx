import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import heroVideo from "./img/hero-video.mp4";

const Homepage = () => {
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
      <header className="relative w-full h-[80vh] flex items-center justify-center">
        
        <div className="relative w-[90%] h-full overflow-hidden rounded-3xl shadow-lg">
          
          <video
            className="w-full h-full object-cover"
            src={heroVideo} 
            autoPlay
            loop
            muted
          ></video>
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>

        <div className="absolute z-10 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Where Ever You Go, Go With Your Heart
          </h1>
          <p className="text-xl mb-8">
            Enjoy Your Adventure In Forest Of Dreams. Discover breathtaking
            places and share your adventures with us.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/create"
              className="btn bg-accent text-light shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 px-6 py-3 rounded-lg"
            >
              Create Yours Now
            </Link>
            <Link
              to="/posts"
              className="btn bg-secondary text-light shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 px-6 py-3 rounded-lg"
            >
              Explore Previous Posts
            </Link>
          </div>
        </div>
      </header>

      {/* All Posts */}
      <main className="container mx-auto p-0 mt-16 bg-primary">
        <h1 className="text-center text-3xl font-bold mb-4">All Posts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                to={`/posts/${post.id}`} 
                key={post.id}
                className="group relative border border-light bg-secondary rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl"
              >
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-light mb-2">
                    {post.title}
                  </h2>
                  <p className="text-accent mb-4">
                    {post.content.substring(0, 100)}...
                  </p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-light text-lg font-semibold">
                    Read More
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-accent">No posts available.</p>
          )}
        </div>
      </main>
      <footer className="bg-secondary text-light p-4 mt-8">
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

export default Homepage;
