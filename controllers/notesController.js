const Note = require("../models/note");
const errorMessage = require("../utils/errorMessage");

const getNotes = async (req,res) => {
    const {id} = req.user;
    let {page=1,limit=5} = req.query;
    page=parseInt(page);
    limit = parseInt(limit)

    if(!page || page < 1){
        return errorMessage(res,400,"Page must be an integer greater than 0")
    }
    if(!limit || limit < 1 || limit > 20){
        return errorMessage(res,400,"Page must be an integer greater than 0 and less than 20")
    }
    try{
const totalNotes = await Note.countDocuments({user:id});
    const totalPages = Math.ceil(totalNotes / limit);
    const fetchedNotes = await Note.find({user:id}).skip((page-1)*limit).limit(limit);
    const nextPage = page+1<=totalPages?`http://localhost:5778/notes?page=${page+1}&limit=${limit}`:null
    const prevPage = page-1>0?`http://localhost:5778/notes?page=${page-1}&limit=${limit}`:null;
    const hasMore = page+1<=totalPages?true:false


    res.status(200).json({
        success:true,
        hasMore:hasMore,
        page:page,
        limit:limit,
        totalPages:totalPages,
        totalNotes:totalNotes,
        nextPage:nextPage,
        prevPage:prevPage,
        notes:fetchedNotes
    })
    }catch(err){
        return errorMessage(res,500,"Error fetching notes")
    }
    
}
const getNotesById = async (req,res) => {
    const note = req.note;
    const userId = note.user.toString();
    if(req.user.id !== userId){
            return errorMessage(res,401,"Forbidden!!")
        }
    res.status(200).json({
        success:true,
        note : foundNote,
    });
    
}
const createNote = async (req,res) => {
    const {title,content} = req.verifiedFields;
    const id = req.user.id;
    try{
        const newNote =  new Note({
        user:id, title:title, content:content
    });
    await newNote.save()

    res.status(201).json({
        success:true,
        message:"Note has been created",
        note: {title:title,content:content}
    })}catch(err){
        errorMessage(res,500,"Error creating note")
    }
    

}
const updateNotes = async (req,res) => {
    const note = req.note;
    const userId = req.user.id;
    const {title,content} = req.verifiedFields;
    try {
        if(userId !== note.user.toString()){
            return errorMessage(res,401,"Forbidden!!")
        }
        const updatedNote = await Note.findByIdAndUpdate(id,{title:title,content:content},{new:true});
        res.status(200).json({
            success:true,
            message: `Note with id ${id} has been updated`,
            note: updatedNote
        });

    } catch (error) {
        errorMessage(res,500,"Error updating note")
    }
    

}
const deleteNote = async (req,res) => {
  const note = req.note
  const userId = note.user.toString();
    if(req.user.id !== userId){
        return errorMessage(res,401,"Forbidden!!")
    }
    try {
        await Note.findByIdAndDelete(id);
        res.status(200).json({success:true,message:`Note with id ${id} has been successfully deleted`})
    } catch (error) {
        return errorMessage(res,500,"Error deleting note")
    }

}


module.exports = {getNotes,getNotesById,createNote,updateNotes,deleteNote}