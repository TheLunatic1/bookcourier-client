import { useState } from "react";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiBookOpen, FiImage, FiLink, FiDollarSign, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AddBook() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    author: "",
    coverImage: "",
    description: "",
    category: "Fiction",
    price: "",
  });

  if (user?.role !== "librarian") {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-error mb-4">Access Denied</h1>
          <p className="text-xl opacity-70">Only librarians can add books</p>
        </div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setForm({ ...form, coverImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreview(urlInput);
      setForm({ ...form, coverImage: urlInput });
      setShowUrlInput(false);
      setUrlInput("");
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.coverImage || !form.price || form.price <= 0) {
    toast.error("Please fill all required fields");
    return;
  }

  setLoading(true);
  try {
    await API.post("/books", {
      ...form,
      price: Number(form.price),
    });
    toast.success("Book added successfully!");
    
    navigate("/dashboard/my-books");
  } catch (err) {
    toast.error("Failed to add book");
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
          <FiBookOpen className="text-primary" />
          Add New Book
        </h1>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Cover Image */}
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Book Cover</span></label>
                {!preview ? (
                  <label className="border-4 border-dashed border-base-300 rounded-xl w-full min-h-96 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition">
                    <FiImage className="w-20 h-20 opacity-50 mb-4" />
                    <p className="text-lg mb-2">Click to upload image</p>
                    <p className="text-sm opacity-70 mb-4">or</p>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(true)}
                      className="link link-primary flex items-center gap-2"
                    >
                      <FiLink className="w-5 h-5" />
                      Add from URL
                    </button>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                ) : (
                  <div className="relative">
                    {/* Image with natural aspect ratio */}
                    <img 
                      src={preview} 
                      alt="Book cover" 
                      className="rounded-xl shadow-2xl mx-auto max-w-full h-auto max-h-screen object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview("");
                        setForm({ ...form, coverImage: "" });
                        setShowUrlInput(false);
                      }}
                      className="btn btn-circle btn-error absolute top-4 right-4"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                )}

                {/* URL Input */}
                {showUrlInput && !preview && (
                  <div className="mt-6 flex gap-3 max-w-2xl mx-auto">
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="input input-bordered flex-1"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
                    />
                    <button type="button" onClick={handleUrlSubmit} className="btn btn-success px-8">
                      Add
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Book Title</span></label>
                  <input
                    type="text"
                    placeholder="Enter book title"
                    className="input input-bordered"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Author</span></label>
                  <input
                    type="text"
                    placeholder="Author name"
                    className="input input-bordered"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium flex items-center gap-2">
                    <FiDollarSign /> Price (৳)
                  </span></label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    placeholder="150"
                    className="input input-bordered"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Category</span></label>
                  <select
                    className="select select-bordered"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option>Fiction</option>
                    <option>Non-Fiction</option>
                    <option>Science</option>
                    <option>Biography</option>
                    <option>Mystery</option>
                    <option>Romance</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Description (Optional)</span></label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  placeholder="Write something about the book..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                  {loading ? <span className="loading loading-spinner"></span> : "Add Book"}
                </button>
                <button type="button" onClick={() => navigate("/my-books")} className="btn btn-ghost flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}