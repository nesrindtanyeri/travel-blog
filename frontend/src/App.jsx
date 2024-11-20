import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Homepage from "./HomePage";
import CreatePostPage from "./CreatePostPage";
import PostDetailsPage from "./PostDetailsPage";
import EditPostPage from "./EditPostPage";

const App = () => {
  return (
    <div>
      <nav className="bg-primary  p-4">
        <div className="container mx-auto flex justify-between">
          <Link to="/" className="text-light text-xl">
            Travel Blog
          </Link>
          <Link to="/create" className="text-light">
            Create Post
          </Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/posts/:id" element={<PostDetailsPage />} />
        <Route path="/edit/:id" element={<EditPostPage />} />
      </Routes>
    </div>
  );
};

export default App;
