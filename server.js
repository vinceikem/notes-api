const express = require("express");
require("dotenv").config();
const connectDB = require("./database/db");
const Note = require("./models/note")

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes")
const auth = require("./middleware/auth");
const app = express();
connectDB();

app.use(express.json())

app.get("/",auth,(req,res)=>{
    console.log("User joined server")
    res.send("home");
})

app.get("/me",auth,async(req,res)=>{
    const {username,id} = req.user
    const notes = await Note.find({user: id})
    const totalNotes = notes.length
        return res.status(200).json({
            success:true,
            id: id,
            username:username,
            notesCount:totalNotes
        });
})

app.use("/auth",authRoutes);
app.use("/notes",notesRoutes);



app.listen(process.env.PORT,()=>{
    console.log(`Server listening on ${process.env.PORT}`);

});