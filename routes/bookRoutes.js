import express from "express"
import { getBooks, addBookByName } from "../controllers/bookControllers.js"

const bookRoutes = express.Router()

bookRoutes.get("/get-books",getBooks);
bookRoutes.get("/add-book-by-name/:name",addBookByName);

export default bookRoutes;
