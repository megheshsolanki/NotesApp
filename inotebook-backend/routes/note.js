const express = require("express");
const router = express.Router();
const Notes = require("../models/note");
const isAuth = require("../middleware/isAuth");
const { body, validationResult } = require("express-validator");

// /api/notes/getAllNotes    login required
router.get("/getAllNotes", isAuth, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.status(200).json(notes);
});

// /api/notes/addNote       login required
router.post(
  "/addNote",
  isAuth,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, description, tag } = req.body;
      const note = new Notes({
        title: title,
        description: description,
        tag: tag,
        user: req.user.id,
      });
      const addedNote = await note.save();
      res.status(200).json(addedNote);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

// /api/notes/updateNote
router.put("/updateNote/:noteId", isAuth, async (req, res) => {
  try {
    const { title, tag, description } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (tag) {
      newNote.tag = tag;
    }
    if (description) {
      newNote.description = description;
    }

    let note = await Notes.findById(req.params.noteId);
    if (!note) {
      return res.status(404).send("Not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.noteId,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

// /api/notes/deleteNote
router.delete("/deleteNote/:noteId", isAuth, async (req, res) => {
  try {
    
    let note = await Notes.findById(req.params.noteId);
    if (!note) {
      return res.status(404).send("Not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.noteId);
    res.json({ success : "Note has been deleted", note });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
