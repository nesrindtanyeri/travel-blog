import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Homepage from "./HomePage";
import CreatePostPage from "./CreatePostPage";
import PostDetailsPage from "./PostDetailsPage";

const App = () => {
  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between">
          <Link to="/" className="text-white text-xl">
            Travel Blog
          </Link>
          <Link to="/create" className="text-white">
            Create Post
          </Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/posts/:id" element={<PostDetailsPage />} />
      </Routes>
    </div>
  );
};

export default App;
