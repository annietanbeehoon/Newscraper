var mongoose = require("monogoose");
var Schema = monogoose.Schema;
var NoteSchema = new Schema ({
    title: String,
    body: String,
});
var Note = monogoose.model("Note, NoteSchema");
module.exports=Note;