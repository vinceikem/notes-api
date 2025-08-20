const Note = require("../models/note");
const errorMessage = require("../utils/errorMessage");

const getNotes = async (req,res) => {
    const {id} = req.user;
    let {page=1,limit=5,title=""} = req.query;
    page=parseInt(page);
    limit = parseInt(limit)

    if(!page || page < 1){
        return errorMessage(res,400,"Page must be an integer greater than 0")
    }
    if(!limit || limit < 1 || limit > 20){
        return errorMessage(res,400,"Page must be an integer greater than 0 and less than 20")
    }
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
}
const getNotesById = async (req,res) => {

}
const createNote = async (req,res) => {
    const data = req.body
    if(!data || Object.keys(data).length <1){
        errorMessage(res,400,"JSON body required")
    }
    const id = req.user.id;
    const {title="",content=""} = req.body
    if(!title || !content || title.trim().length < 1 || content.trim().length <1){
        errorMessage(res,400,"Note has empty fields");
    }
    const newNote =  new Note({
        user:id, title:title, content:content
    });
    await newNote.save()

    res.status(201).json({
        success:true,
        message:"Note has been created",
        note: {title:title,content:content}
    })

}
const updateNotes = async (req,res) => {

}
const deleteNote = async (req,res) => {

}
const deleteAllNotes = async (req,res) => {

}

module.exports = {getNotes,getNotesById,createNote,updateNotes,deleteAllNotes,deleteNote}