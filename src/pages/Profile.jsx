import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { FiUser, FiMail, FiCamera, FiLink, FiSave, FiX, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Profile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [preview, setPreview] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setName(authUser.name);
      setEmail(authUser.email);
      setPhotoURL(authUser.photoURL);
      setPreview(authUser.photoURL);
    }
  }, [authUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setPreview(result);
        setPhotoURL(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreview(urlInput);
      setPhotoURL(urlInput);
      setShowUrlInput(false);
      setUrlInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.patch("/users/profile", {
        name,
        photoURL,
      });
      const updatedUser = { ...user, name, photoURL };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Update failed");
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">My Profile</h1>

        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body">
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="avatar">
                    <div className="w-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                      <img src={preview} alt="Profile" />
                    </div>
                  </div>

                  {/* Upload Button */}
                  <label className="absolute bottom-2 right-2 btn btn-circle btn-primary">
                    <FiCamera className="w-6 h-6" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* LINK OPTION */}
                <div className="mt-6 text-center">
                  {showUrlInput ? (
                    <div className="flex gap-2 max-w-sm">
                      <input
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        className="input input-bordered flex-1"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
                      />
                      <button onClick={handleUrlSubmit} className="btn btn-success">
                        <FiCheckCircle />
                      </button>
                      <button onClick={() => setShowUrlInput(false)} className="btn btn-error">
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowUrlInput(true)}
                      className="link link-primary flex items-center gap-2 hover:link-hover"
                    >
                      <FiLink className="w-5 h-5" />
                      Add photo from URL
                    </button>
                  )}
                </div>

                <h2 className="text-3xl font-bold mt-6">{name}</h2>
                <p className="text-lg opacity-70">{email}</p>
                <div className="badge badge-lg badge-primary mt-3 py-4 px-6">
                  {user.role.toUpperCase()}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FiUser /> Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-full text-lg"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FiMail /> Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="input input-bordered w-full bg-base-200"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex-1"
                  >
                    {loading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="btn btn-ghost flex-1"
                  >
                    <FiX className="mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}