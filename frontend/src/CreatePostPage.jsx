import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePostPage = () => {
  const [formData, setFormData] = useState({
    author: "",
    title: "",
    content: "",
    cover: "",
  });
  const [showImageSelector, setShowImageSelector] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Img select modal
  const handleImageSelect = (imageUrl) => {
    setFormData((prev) => ({ ...prev, cover: imageUrl }));
    setShowImageSelector(false); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/posts", formData);
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const imageOptions = [
    "https://tinyurl.com/3uvf948v",
    "https://tinyurl.com/38rjekrr",
    "https://tinyurl.com/4yba2hb4",
    "https://tinyurl.com/363txf35",
    "https://tinyurl.com/u38ep8jt",
    "https://tinyurl.com/522b479a",
    "https://tinyurl.com/ufnr6yv9",
    "https://tinyurl.com/yck58n3t",
    "https://tinyurl.com/2za7n93r",
    "https://tinyurl.com/y5yyetw9",
    "https://tinyurl.com/3h2c3bba",
    "https://tinyurl.com/ph7x65fp",
    "https://tinyurl.com/24z43y2f",
    "https://tinyurl.com/3u35mzb8",
    "https://tinyurl.com/y4rwmwdy",
    "https://tinyurl.com/594pkcv5",
  ];

  return (
    <div className="w-screen min-h-screen bg-secondary text-light p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Post</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-primary p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          className="border border-light bg-light text-primary p-2 rounded"
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="border border-light bg-light text-primary p-2 rounded"
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          className="border border-light bg-light text-primary p-2 rounded"
        />
        <button
          type="button"
          className="btn btn-primary shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
          onClick={() => setShowImageSelector(true)}
        >
          Browse Images
        </button>
        {formData.cover && (
          <div className="flex flex-col items-center mt-4">
            <img
              src={formData.cover}
              alt="Selected Cover"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <p className="text-sm text-light mt-2">Selected Image</p>
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
        >
          Create Post
        </button>
      </form>

      {/* Select img modal */}
      {showImageSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-primary text-light rounded-lg p-6 w-3/4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Select an Image</h2>
            <div className="grid grid-cols-4 gap-4">
              {imageOptions.map((imageUrl, index) => (
                <div
                  key={index}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleImageSelect(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={`Option ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-light"
                  />
                </div>
              ))}
            </div>
            <button
              className="btn btn-secondary mt-4"
              onClick={() => setShowImageSelector(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostPage;
