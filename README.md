
# 🌿 C-SERM UNAS Website

<p align="center">
  <a href="https://csermunas.vercel.app/">
    <img src="https://img.shields.io/badge/Live-Demo-00C853?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
  <img src="https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Style-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

<p align="center">
  🌐 <strong>Live Demo:</strong><br/>
  <a href="https://csermunas.vercel.app/">https://csermunas.vercel.app/</a>
</p>

---

## 📌 Overview

The **C-SERM UNAS Website** is the official digital platform of
**Centre for Sustainable Energy & Resources Management (C-SERM)** — Universitas Nasional.

This project delivers a **modern, scalable, and responsive web experience** for showcasing:

* Institutional activities
* Research & publications
* Projects & collaborations
* Organizational structure

---

## ✨ Features

### 🌐 Public Website

* Fully responsive modern UI
* Interactive hero slider (Swiper.js)
* News & updates system
* Project showcase
* Publications page
* Team directory
* Contact form

### 🔐 Admin Panel

* Secure authentication system
* Full CMS capabilities:

  * Manage News
  * Manage Projects
  * Manage Publications
  * Manage Teams
  * Edit Homepage Content
* Image upload & storage system

---

## 🧩 Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React.js, Tailwind CSS, Axios, React Router |
| Backend  | Node.js, Express.js                         |
| Upload   | Multer                                      |
| Auth     | JWT (optional)                              |

---

## 🏗️ Architecture Diagram

```mermaid
flowchart LR
    A[User Browser] -->|HTTP Request| B[Frontend React]
    B -->|API Call Axios| C[Backend Node Express]
    C --> D[(MySQL Database)]
    C --> E[Uploads Storage]

    subgraph Frontend
        B
    end

    subgraph Backend
        C
        D
        E
    end
```

---

## 🔄 Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    U->>F: Interact (View / Submit)
    F->>B: API Request
    B->>DB: Query Data
    DB-->>B: Result
    B-->>F: JSON Response
    F-->>U: Render UI
```

---

## 📁 Project Structure

```bash
CSERM_UNAS/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── README.md
```

---

## 📸 Preview

> 💡 *Tip: Add more screenshots to improve project presentation*

<p align="center">
  <img width="90%" src="https://github.com/user-attachments/assets/f866cdb7-9e80-4401-a46a-ac25a2194ba1" />
</p>

<p align="center">
  <img width="90%" src="https://github.com/user-attachments/assets/f1a74810-d7eb-4a34-8663-03577e7d7e99" />
</p>

---

## 🌐 Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🖼️ Image Handling

* Upload directory:

```bash
/backend/uploads
```

* Access images:

```bash
http://localhost:5000/uploads/your-image.jpg
```

* Enable static serving in backend:

```js
app.use("/uploads", express.static("backend/uploads"));
```

---

## ⚙️ Deployment Notes

✔ Ensure the following before deployment:

* API URL is correctly configured
* Backend server is publicly accessible
* Uploads directory is properly exposed

---

## 📬 Contact

**Centre for Sustainable Energy & Resources Management (C-SERM)**
Universitas Nasional, Jakarta

🌐 [https://cserm.unas.ac.id](https://cserm.unas.ac.id)
📧 [contact@cserm.unas.ac.id](mailto:contact@cserm.unas.ac.id)

---

## 📜 License

MIT License — free for educational and non-commercial use.

---

## ⭐ Support

If you find this project helpful:

* ⭐ Star this repository
* 🍴 Contribute to development

