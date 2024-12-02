import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts");
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, posts]);

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

      <main className="container mx-auto mt-20 p-4 flex-1">
        <h1 className="text-center text-3xl font-bold mb-6">All Posts</h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search posts by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md p-3 text-secondary border border-light rounded-lg shadow focus:outline-none focus:ring focus:ring-accent text-dark"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
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
                  <p className="text-accent">
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
            <p className="text-center text-accent">No posts found.</p>
          )}
        </div>
      </main>

      <footer className="bg-secondary text-light p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Travel Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PostsPage;
