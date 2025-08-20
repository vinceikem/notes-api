const express = require("express");
const { getNotes, getNotesById,createNote, updateNotes, deleteNote, deleteAllNotes } = require("../controllers/notesController");
const auth = require("../middleware/auth");
const noteValidator = require("../middleware/noteValidator");
const noteIdValidator = require("../middleware/noteIdValidator");
const router = express.Router();

router.use(auth);
router.post("/",noteValidator,createNote)
router.get("/",getNotes)
router.delete("/",deleteAllNotes)
//router.use(noteIdValidator)
router.get("/:id",noteIdValidator,getNotesById);
router.put("/:id",noteIdValidator,noteValidator,updateNotes)
router.delete("/:id",noteIdValidator,deleteNote)


module.exports = router;