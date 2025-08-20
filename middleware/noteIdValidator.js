const Note = require("../models/note");
const errorMessage = require("../utils/errorMessage");
const noteIdValidator = async (req,res,next) => {
    const noteId = req.params.id;
    console.log(noteId)
    if(!noteId || noteId.length < 1){
        return errorMessage(res,400,"No id supplied");
    }
    try{
    const idExists = await Note.findById(noteId)
    console.log(req.method,noteId)
    req.noteId = noteId;
    next();
}
catch(err){
    return errorMessage(res,400,"Id does not exist")
}
}

module.exports = noteIdValidator;