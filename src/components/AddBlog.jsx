// src/pages/admin/BlogPage.jsx
import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { FaFile, FaPencil } from "react-icons/fa6";
import "./AddBlog.css";
import api from "../api"

const API_URL = "http://https://pmgrbackend.onrender.com/api/admin/blogs";

const AddBlog = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePath = (basePath) =>
    location.pathname === basePath ||
    location.pathname.startsWith(basePath + "/");

  const [formData, setFormData] = useState({
    title: "",
    bannerImage: null,
    extraImage: null,
    metaTitle: "",
    metaDescription: "",
    description: "",
    faqs: [{ question: "", answer: "" }],
    redirectLink: "",
    city: "",
  });

  const [previewImages, setPreviewImages] = useState({
    bannerImage: null,
    extraImage: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData((p) => ({ ...p, [name]: file }));
      setPreviewImages((p) => ({ ...p, [name]: URL.createObjectURL(file) }));
    } else if (name.startsWith("faqs")) {
      const [, index, field] = name.split(".");
      const updated = [...formData.faqs];
      updated[index][field] = value;
      setFormData((p) => ({ ...p, faqs: updated }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleAddFAQ = () => {
    setFormData((p) => ({
      ...p,
      faqs: [...p.faqs, { question: "", answer: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "faqs") {
          fd.append(
            "faqs",
            JSON.stringify(
              value.filter((f) => f.question.trim() && f.answer.trim())
            )
          );
        } else if (value instanceof File) {
          fd.append(key, value);
        } else {
          fd.append(key, value || "");
        }
      });

     const token = localStorage.getItem("adminToken");

await api.post("/admin/blogs", fd, {
  headers: { "Content-Type": "multipart/form-data" },
});


      alert("Blog created successfully");
      navigate("/blog");
    } catch (err) {
      alert("Blog creation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
    {/* SIDEBAR (LOGO ONLY) */}
      <aside className="admin-sidebar">
        <img
          src="/media/CA-India-logo.png"
          alt="CA India"
          className="sidebar-logo"
        />
      </aside>

      {/* FORM */}
      <main className="admin-content">
        <div className="admin-card">
          <h2>Add New Blog</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div>
              <label>City *</label>
              <select name="city" onChange={handleChange} required>
                <option value="">Select City</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mysore">Mysore</option>
              </select>
            </div>

            <div>
              <label>Blog Title *</label>
              <input name="title" onChange={handleChange} required />
            </div>

            <div>
              <label>Banner Image *</label>
              {previewImages.bannerImage && (
                <img
                  src={previewImages.bannerImage}
                  alt="preview"
                  className="image-preview"
                />
              )}
              <input
                type="file"
                name="bannerImage"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Meta Title *</label>
              <textarea name="metaTitle" onChange={handleChange} required />
            </div>

            <div>
              <label>Meta Description *</label>
              <textarea
                name="metaDescription"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Blog Description *</label>
              <CKEditor
                editor={ClassicEditor}
                onChange={(e, editor) =>
                  setFormData((p) => ({
                    ...p,
                    description: editor.getData(),
                  }))
                }
              />
            </div>

            <div>
              <label>FAQs</label>
              {formData.faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <input
                    name={`faqs.${i}.question`}
                    value={faq.question}
                    onChange={handleChange}
                    placeholder="Question"
                  />
                  <textarea
                    name={`faqs.${i}.answer`}
                    value={faq.answer}
                    onChange={handleChange}
                    placeholder="Answer"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddFAQ}
                className="btn-secondary"
              >
                Add FAQ
              </button>
            </div>

            <div>
              <label>Extra Image</label>
              {previewImages.extraImage && (
                <img
                  src={previewImages.extraImage}
                  alt="preview"
                  className="image-preview"
                />
              )}
              <input
                type="file"
                name="extraImage"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Redirect Link</label>
              <input
                type="url"
                name="redirectLink"
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Blog"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddBlog;
