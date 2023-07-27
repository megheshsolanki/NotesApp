const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title :{
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true,
        unique : true
    },
    tag : {
        type : String,
        default : 'General'
    },
    date:{
        type: Date,
        default : Date.now
    },
    user:{
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'user'
    }
});

module.exports = mongoose.model('Note',noteSchema);