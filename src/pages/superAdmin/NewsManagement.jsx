import { useEffect, useState } from "react";
import {
  getNews,
  createNews,
  updateNews,
  deleteNews,
} from "../../services/newsService";

export default function NewsManagement() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", image: null });
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    const res = await getNews();
    setNews(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("content", form.content);
    if (form.image) data.append("image", form.image);

    editId ? await updateNews(editId, data) : await createNews(data);

    setForm({ title: "", content: "", image: null });
    setEditId(null);
    loadData();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ title: item.title, content: item.content, image: null });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus news ini?")) {
      await deleteNews(id);
      loadData();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Kelola News (SuperAdmin)</h1>

      {/* FORM sama */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input name="title" value={form.title} onChange={handleChange}
          placeholder="Judul" className="w-full border p-2 rounded" required />
        <textarea name="content" value={form.content} onChange={handleChange}
          placeholder="Konten" className="w-full border p-2 rounded" required />
        <input type="file" name="image" onChange={handleChange} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Update News" : "Tambah News"}
        </button>
      </form>

      {news.map((n) => (
        <div key={n.id} className="bg-white p-4 rounded shadow mb-3">
          <h3 className="font-semibold">{n.title}</h3>
          <p className="text-sm text-gray-600">{n.content}</p>

          <div className="flex gap-4 mt-2">
            <button onClick={() => handleEdit(n)} className="text-blue-600 text-sm">
              Edit
            </button>
            <button
              onClick={() => handleDelete(n.id)}
              className="text-red-600 text-sm"
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
