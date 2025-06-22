import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    coverImage: "",
    images: []
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [success, setSuccess] = useState(false);

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    fetch(`${API_BASE}/items`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error loading items", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("type", form.type);
    formData.append("description", form.description);
    formData.append("coverImage", form.coverImage);

    form.images.forEach((image) => {
      formData.append("images", image.file); // correct
    });
    

    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const addedItem = await res.json();
        setItems([...items, addedItem]);
        setForm({ name: "", type: "", description: "", coverImage: "", images: [] });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  const handleImageList = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      url: URL.createObjectURL(file),
      file
    }));
    setForm({ ...form, images: files });
  };

  const nextImage = () => {
    if (selectedItem) {
      setCarouselIndex((prev) => (prev + 1) % selectedItem.images.length);
    }
  };

  const prevImage = () => {
    if (selectedItem) {
      setCarouselIndex((prev) =>
        (prev - 1 + selectedItem.images.length) % selectedItem.images.length
      );
    }
  };

  const handleEnquire = async () => {
    try {
      await fetch(`${API_BASE}/enquire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName: selectedItem.name })
      });
      alert("Enquiry email sent.");
    } catch (err) {
      alert("Failed to send enquiry.");
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/150";
    return image.startsWith("http")
      ? image
      : `${API_BASE}/uploads/${image}`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>
        Item Management
      </h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", marginTop: "30px" }}>
        {/* Add Item */}
        <div style={{ flex: "1", border: "1px solid #ccc", padding: "20px" }}>
          <h2>Add Item</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Item Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="text"
              placeholder="Item Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              style={{ width: "100%", marginBottom: "10px" }}
            ></textarea>
            <input
              type="text"
              placeholder="Cover Image Filename (optional)"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageList}
              style={{ marginBottom: "10px" }}
            />
            <button type="submit">Add Item</button>
            {success && <p style={{ color: "green" }}>Item successfully added</p>}
          </form>
        </div>

        {/* View Items */}
        <div style={{ flex: "1", border: "1px solid #ccc", padding: "20px" }}>
          <h2>View Items</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "10px"
            }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedItem(item);
                  setCarouselIndex(0);
                }}
                style={{ border: "1px solid #ddd", padding: "10px", cursor: "pointer" }}
              >
                <img
                  src={getImageUrl(item.coverImage || item.images?.[0])}
                  alt="Cover"
                  style={{ width: "100%", height: "100px", objectFit: "cover" }}
                />
                <p style={{ textAlign: "center", marginTop: "8px" }}>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>{selectedItem.name}</h3>
            <p><strong>Type:</strong> {selectedItem.type}</p>
            <p><strong>Description:</strong> {selectedItem.description}</p>

            {/* Carousel */}
            <div style={{ textAlign: "center", margin: "10px 0" }}>
              <button onClick={prevImage}>◀</button>
              <img
                src={getImageUrl(selectedItem.images?.[carouselIndex])}
                alt="carousel"
                style={{ width: "200px", height: "150px", objectFit: "cover", margin: "0 10px" }}
              />
              <button onClick={nextImage}>▶</button>
            </div>

            <button onClick={handleEnquire}>Enquire</button>
            <button onClick={() => setSelectedItem(null)} style={{ marginLeft: "10px" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  width: "400px",
  borderRadius: "8px"
};

export default App;
