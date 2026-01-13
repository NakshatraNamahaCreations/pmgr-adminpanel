import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate, useParams } from "react-router-dom";
import adminApi from "../adminApi";
import "./EditBlog.css";

const API_HOST = "https://api.pmgrandco.com";

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  /* ================= HELPERS ================= */
  const fullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    return `${API_HOST}/${path}`;
  };

  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await adminApi.get(`/blogs/${id}`);
        const blog = res.data;

        setFormData({
          title: blog.title || "",
          bannerImage: null,
          extraImage: null,
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || "",
          description: blog.description || "",
          faqs: blog.faqs?.length ? blog.faqs : [{ question: "", answer: "" }],
          redirectLink: blog.redirectLink || "",
          city: blog.city || "",
        });

        setPreviewImages({
          bannerImage: fullImageUrl(blog.bannerImage),
          extraImage: fullImageUrl(blog.extraImage),
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load blog");

      }
    };

    fetchBlog();
  }, [id, navigate]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviewImages((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
    } else if (name.startsWith("faqs")) {
      const [, index, field] = name.split(".");
      const updatedFaqs = [...formData.faqs];
      updatedFaqs[index][field] = value;
      setFormData((prev) => ({ ...prev, faqs: updatedFaqs }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  /* ================= UPDATE BLOG ================= */
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
              value.filter(
                (f) => f.question.trim() && f.answer.trim()
              )
            )
          );
        } else if (value instanceof File) {
          fd.append(key, value);
        } else {
          fd.append(key, value || "");
        }
      });

      await adminApi.put(`/blogs/${id}`, fd);

      alert("Blog updated successfully");
      navigate("/blog");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <img
          src="/media/CA-India-logo.png"
          alt="CA India"
          className="sidebar-logo"
        />
      </aside>

      {/* CONTENT */}
      <main className="admin-content">
        <div className="admin-card">
          <h2>Edit Blog</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div>
              <label>City *</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              >
                <option value="">Select City</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mysore">Mysore</option>
              </select>
            </div>

            <div>
              <label>Blog Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* BANNER IMAGE */}
            <div>
              <label>Banner Image</label>
              {previewImages.bannerImage && (
                <img
                  src={previewImages.bannerImage}
                  alt="Banner"
                  className="image-preview"
                />
              )}
              <input
                type="file"
                name="bannerImage"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Meta Title *</label>
              <textarea
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Meta Description *</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Blog Description *</label>
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={(e, editor) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: editor.getData(),
                  }))
                }
              />
            </div>

            {/* FAQs */}
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

            {/* EXTRA IMAGE */}
            <div>
              <label>Extra Image</label>
              {previewImages.extraImage && (
                <img
                  src={previewImages.extraImage}
                  alt="Extra"
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
                value={formData.redirectLink}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Blog"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditBlog;
