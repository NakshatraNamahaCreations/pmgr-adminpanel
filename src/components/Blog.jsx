import "./Blog.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fullImageUrl = (path) => {
    if (!path) return "/media/perar-logo.png";
    if (path.startsWith("http")) return path;
    return `https://pmgrbackend.onrender.com/${path}`;
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await api.delete(`/admin/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <img src="/media/CA-India-logo.png" className="sidebar-logo" />
      </aside>

      <main className="admin-content">
        <div className="blog-container">
          <div className="blog-header">
            <h2>Blog List</h2>
            <Link to="/add-blog" className="add-blog-btn">
              Add Blog
            </Link>
          </div>

          <div className="table-container">
            {loading ? (
              <p className="loading-text">Loading...</p>
            ) : blogs.length === 0 ? (
              <p className="loading-text">No blogs found</p>
            ) : (
              <table className="blog-table">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Title</th>
                    <th>City</th>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog, i) => (
                    <tr key={blog._id}>
                      <td>{i + 1}</td>
                      <td>{blog.title}</td>
                      <td>{blog.city}</td>
                      <td>
                        <img
                          src={fullImageUrl(blog.bannerImage)}
                          className="blog-image"
                        />
                      </td>
                      <td>
                        {blog.description
                          ?.replace(/<[^>]+>/g, "")
                          .slice(0, 80)}
                        ...
                      </td>
                      <td className="actions">
                        <FiEdit
                          onClick={() =>
                            navigate(`/edit-blog/${blog._id}`)
                          }
                        />
                        <FiTrash2 onClick={() => handleDelete(blog._id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
