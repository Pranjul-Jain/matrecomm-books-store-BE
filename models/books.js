import mongoose from "mongoose"

const booksSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: [true, "Please Enter Book Name"]
    },
    author: {
        type: String,
        unique: true,
        required: [true, "Please Enter Book Author"]
    },
    description: {
        type: String
    },
    publishedDate:{
        type: Date,
        required: [true,"Please Enter Date"]
    },
    genre: {
        type: String,
        genre: [true, "Please Enter Genre"]
    },
    url: {
        type: String
    }
});

const Books = mongoose.model("books", booksSchema);

export default Books;