
import { useEffect, useState } from "react";
import "./App.css";

const emptyForm = {
  title: "",
  platform: "",
  genre: "",
  status: "Not Started",
};

function App() {
  const [games, setGames] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadGames() {
    try {
      const response = await fetch("/api/games");
      if (!response.ok) throw new Error("Failed to load games");

      setGames(await response.json());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const url = editingId
      ? `/api/games/${editingId}`
      : "/api/games";

    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to save game");
      }

      setForm({ ...emptyForm });
      setEditingId(null);
      await loadGames();
    } catch (err) {
      setError(err.message);
    }
  }

  function editGame(game) {
    setEditingId(game._id);
    setForm({
      title: game.title,
      platform: game.platform,
      genre: game.genre || "",
      status: game.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteGame(id) {
    if (!window.confirm("Are you sure you want to delete this game?")) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`/api/games/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete game");
      }

      if (editingId === id) {
        setEditingId(null);
        setForm({ ...emptyForm });
      }

      await loadGames();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Gaming Catalog Tracker</h1>
        <p>Manage your gaming backlog in one place.</p>
      </header>

      <section>
        <h2>{editingId ? "Edit Game" : "Add New Game"}</h2>

        <form onSubmit={handleSubmit} className="game-form">
          <input
            name="title"
            placeholder="Game title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            name="platform"
            placeholder="Platform"
            value={form.platform}
            onChange={handleChange}
            required
          />

          <input
            name="genre"
            placeholder="Genre"
            value={form.genre}
            onChange={handleChange}
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Not Started">Not Started</option>
            <option value="Playing">Playing</option>
            <option value="Completed">Completed</option>
          </select>

          <button type="submit">
            {editingId ? "Save Changes" : "Add Game"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ ...emptyForm });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      {error && <p className="error">{error}</p>}

      <section>
        <h2>My Game Collection</h2>

        <div className="game-grid">
          {games.map((game) => (
            <article className="game-card" key={game._id}>
              <h3>{game.title}</h3>
              <p>Platform: {game.platform}</p>
              <p>Genre: {game.genre || "N/A"}</p>
              <p>Status: {game.status}</p>

              <div className="game-actions">
                <button onClick={() => editGame(game)}>
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteGame(game._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
  