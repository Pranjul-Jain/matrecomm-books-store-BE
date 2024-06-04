import express from "express"
import { getBooks, postBook } from "../controllers/bookControllers.js"

const bookRoutes = express.Router()

bookRoutes.get("/get-books",getBooks);
bookRoutes.post("/add-book",postBook);

export default bookRoutes;
