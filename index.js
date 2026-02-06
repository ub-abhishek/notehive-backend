require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const Room = require("./models/Room");
const Note = require("./models/Note");

const app = express();
app.use(express.json());

// --------------------
// MongoDB Atlas connect
// --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// --------------------
// Home route
// --------------------
app.get("/", (req, res) => {
  res.send("NOTEHIVE backend is running");
});

// --------------------
// Create Room
// --------------------
app.post("/rooms", async (req, res) => {
  const { roomName } = req.body;

  if (!roomName) {
    return res.status(400).json({ error: "Room name is required" });
  }

  try {
    const newRoom = new Room({ roomName });
    await newRoom.save();

    res.json({
      message: "Room created",
      room: newRoom,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create room" });
  }
});

// --------------------
// Add Note
// --------------------
app.post("/notes", async (req, res) => {
  const { roomId, content } = req.body;

  if (!roomId || !content) {
    return res.status(400).json({ error: "roomId and content are required" });
  }

  try {
    const newNote = new Note({
      roomId,
      content,
    });

    await newNote.save();

    res.json({
      message: "Note added",
      note: newNote,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add note" });
  }
});

// --------------------
// Get Notes by Room
// --------------------
app.get("/notes/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    const notes = await Note.find({ roomId });
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// --------------------
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
