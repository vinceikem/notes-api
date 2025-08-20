const errorMessage = require("../utils/errorMessage");

const noteValidator = async (req,res,next) => {
    const data = req.body;
    if(!data && Object.keys(data).length < 1){
        return errorMessage(res,400,"JSON body required")
    }
    const {title,content} = data;
    if(!title || title.length < 1){
        return errorMessage(res,400,"Title must not be empty");
    }
    if(!content || content.length < 1){
        return errorMessage(res,400,"Content must not be empty");
    }
    req.note = {title,content};
    next();
}

module.exports = noteValidator;