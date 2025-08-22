const Note = require("../models/note");
const errorMessage = require("../utils/errorMessage");
const noteIdValidator = async (req,res,next) => {
    const noteId = req.params.id;
    if(!noteId || noteId.length < 1){
        return errorMessage(res,400,"No id supplied");
    }
    try{
    const note = await Note.findById(noteId)
    if(!note){
        return errorMessage(res,400,'Id does not exist')
    }
    req.note = note;
    next();
}
catch(err){
    return errorMessage(res,400,"Id does not exist")
}
}

module.exports = noteIdValidator;