const express = require("express");
const { getNotes, getNotesById,createNote, updateNotes, deleteNote, deleteAllNotes } = require("../controllers/notesController");
const auth = require("../middleware/auth");
const router = express.Router();

router.use(auth);
router.post("/",createNote)
router.get("/",getNotes)
router.get("/:id",getNotesById)
router.put("/:id",updateNotes)
router.delete("/:id",deleteNote)
router.delete("/",deleteAllNotes)

module.exports = router