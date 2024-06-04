import mongoose from "mongoose"

const booksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Book Name"]
    },
    author: {
        type: String,
        required: [true, "Please Enter Book Author"]
    },
    description: {
        type: String
    },
    date:{
        type: Date,
        required: [true,"Please Enter Date"]
    },
    ratings: {
        type: Number
    },
    price: {
        type: Number,
        required: [true, "Please Enter Price"]
    },
    url: {
        type: String
    }
});

const Books = mongoose.model("books", booksSchema);

export default Books;