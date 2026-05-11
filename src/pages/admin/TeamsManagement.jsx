import { useEffect, useState } from "react";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../../services/teamService";

/* =========================
   API BASE
========================= */

const API_BASE = (
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app"
).replace(/\/$/, "");

/* =========================
   RESOLVE IMAGE
========================= */

const resolveImage = (image) => {
  if (!image) {
    return "https://via.placeholder.com/300x300?text=No+Image";
  }

  // full url
  if (image.startsWith("http")) {
    return image;
  }

  // /uploads/teams/xxx.png
  if (image.startsWith("/uploads")) {
    return `${API_BASE}${image}`;
  }

  // uploads/teams/xxx.png
  if (image.startsWith("uploads")) {
    return `${API_BASE}/${image}`;
  }

  // teams/xxx.png
  return `${API_BASE}/uploads/${image}`;
};

export default function TeamsManagement() {
  const [teams, setTeams] = useState([]);

  const [form, setForm] = useState({
    name: "",
    division: "CSERM STAFF",
    position: "",
    bio: "",
    image: null,
  });

  const [editId, setEditId] = useState(null);

  /* =========================
     LOAD TEAMS
  ========================= */

  const loadTeams = async () => {
    try {
      const response = await getTeams();

      console.log("TEAM RESPONSE:", response);

      let data = [];

      if (Array.isArray(response)) {
        data = response;
      } else if (Array.isArray(response?.data)) {
        data = response.data;
      }

      setTeams(data);
    } catch (error) {
      console.error("LOAD TEAM ERROR:", error);
      setTeams([]);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  /* =========================
     HANDLE CHANGE
  ========================= */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("division", form.division);
      formData.append("position", form.position);
      formData.append("bio", form.bio);

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editId) {
        await updateTeam(editId, formData);
      } else {
        await createTeam(formData);
      }

      setForm({
        name: "",
        division: "CSERM STAFF",
        position: "",
        bio: "",
        image: null,
      });

      setEditId(null);

      loadTeams();
    } catch (error) {
      console.error("SUBMIT TEAM ERROR:", error);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {
    try {
      await deleteTeam(id);
      loadTeams();
    } catch (error) {
      console.error("DELETE TEAM ERROR:", error);
    }
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (team) => {
    setEditId(team.id);

    setForm({
      name: team.name || "",
      division: team.division || "CSERM STAFF",
      position: team.position || "",
      bio: team.bio || "",
      image: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Kelola Teams
      </h1>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <div className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="division"
            value={form.division}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Management">
              Management
            </option>

            <option value="CSERM STAFF">
              CSERM STAFF
            </option>
          </select>

          <input
            type="text"
            name="position"
            placeholder="Posisi / Jabatan"
            value={form.position}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <textarea
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={5}
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editId
              ? "Update Team"
              : "Tambah Team"}
          </button>
        </div>
      </form>

      {/* LIST TEAM */}

      <div className="space-y-4">
        {teams.length > 0 ? (
          teams.map((team) => {
            const imageSource =
              team.image ||
              team.image_url ||
              "";

            const finalImage =
              resolveImage(imageSource);

            console.log(
              "FINAL TEAM IMAGE:",
              finalImage
            );

            return (
              <div
                key={team.id}
                className="bg-white p-4 rounded shadow flex gap-4"
              >
                {/* IMAGE */}

                <img
                  src={finalImage}
                  alt={team.name}
                  className="w-24 h-24 object-cover rounded border"
                  onError={(e) => {
                    e.target.onerror = null;

                    e.target.src =
                      "https://via.placeholder.com/300x300?text=No+Image";
                  }}
                />

                {/* CONTENT */}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-bold text-xl">
                      {team.name}
                    </h2>

                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                      {team.division}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-2">
                    {team.position}
                  </p>

                  <p className="text-gray-700">
                    {team.bio}
                  </p>

                  <div className="flex gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(team)
                      }
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(team.id)
                      }
                      className="text-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-500">
            Belum ada data team.
          </div>
        )}
      </div>
    </div>
  );
}