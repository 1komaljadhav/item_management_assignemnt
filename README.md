# 🧾 Item Management System

A simple full-stack application to manage a collection of items with image uploads. Built using:

- 📦 Node.js + Express (Backend)
- 🖼️ MySQL (Database)
- ⚛️ React.js (Frontend)
- 📸 Multer (for image upload)
- 📁 REST API support

---

## 📂 Features

- Add new items with name, type, description, and cover image.
- Upload multiple images for each item.
- Retrieve and display all items with their associated images.
- Clean and simple REST API structure.

---

## 🛠️ Tech Stack

| Layer     | Tech        |
|-----------|-------------|
| Frontend  | React.js    |
| Backend   | Node.js, Express |
| Database  | MySQL       |
| Uploads   | Multer      |

---

## 📊 Database Schema

### `items`
| Column       | Type          | Description                    |
|--------------|---------------|--------------------------------|
| id           | INT (PK)      | Auto-incremented primary key   |
| name         | VARCHAR(255)  | Name of the item               |
| type         | VARCHAR(100)  | Type or category of the item   |
| description  | TEXT          | Description of the item        |
| cover_image  | VARCHAR(500)  | URL/path to the cover image    |
| created_at   | TIMESTAMP     | Timestamp of creation          |

### `item_images`
| Column      | Type          | Description                    |
|-------------|---------------|--------------------------------|
| id          | INT (PK)      | Auto-incremented primary key   |
| item_id     | INT (FK)      | Foreign key referencing `items.id` |
| image_url   | VARCHAR(500)  | URL/path of the image          |

---
