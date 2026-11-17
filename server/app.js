
const express = require("express");
const mongoose = require("mongoose");
const Game = require("./models/Game");

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/gamingCatalog")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Homepage
app.get("/", (req, res) => {
  res.send("Gaming Catalog Tracker Server");
});

// Health route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Gaming Catalog Tracker API is running"
  });
});

// Get all games
app.get("/api/games", async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: "Failed to get games" });
  }
});

// Add a game
app.post("/api/games", async (req, res) => {
  try {
    const game = new Game(req.body);
    const savedGame = await game.save();
    res.status(201).json(savedGame);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

 // Update an existing game
app.put("/api/games/:id", async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json(game);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a game
app.delete("/api/games/:id", async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json({ message: "Game deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server after MongoDB connects
mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
