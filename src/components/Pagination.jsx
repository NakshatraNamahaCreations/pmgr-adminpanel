// src/components/Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const baseStyle = {
    padding: "8px 14px",
    margin: "0 5px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const activeStyle = {
    ...baseStyle,
    background: "linear-gradient(135deg, #4f46e5, #2563eb)", // purple → blue gradient
    color: "#fff",
    border: "1px solid #2563eb",
    fontWeight: "bold",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  };

  const disabledStyle = {
    ...baseStyle,
    backgroundColor: "#f5f5f5",
    color: "#aaa",
    cursor: "not-allowed",
    boxShadow: "none",
  };

  const hoverEffect = (style) => ({
    ...style,
    backgroundColor: style === baseStyle ? "#f0f8ff" : style.backgroundColor, // light blue hover
    transform: "scale(1.05)",
  });

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      {/* Prev button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={currentPage === 1 ? disabledStyle : baseStyle}
        onMouseOver={(e) => {
          if (!e.target.disabled) Object.assign(e.target.style, hoverEffect(baseStyle));
        }}
        onMouseOut={(e) => {
          if (!e.target.disabled) Object.assign(e.target.style, baseStyle);
        }}
      >
        ◀ Prev
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={currentPage === page ? activeStyle : baseStyle}
          onMouseOver={(e) => {
            if (currentPage !== page) Object.assign(e.target.style, hoverEffect(baseStyle));
          }}
          onMouseOut={(e) => {
            if (currentPage !== page) Object.assign(e.target.style, baseStyle);
          }}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={currentPage === totalPages ? disabledStyle : baseStyle}
        onMouseOver={(e) => {
          if (!e.target.disabled) Object.assign(e.target.style, hoverEffect(baseStyle));
        }}
        onMouseOut={(e) => {
          if (!e.target.disabled) Object.assign(e.target.style, baseStyle);
        }}
      >
        Next ▶
      </button>
    </div>
  );
};

export default Pagination;
