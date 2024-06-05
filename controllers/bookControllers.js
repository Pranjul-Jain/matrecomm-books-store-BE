import Books from "../models/books.js";
import logger from "../config/logger.js";
import { sort_keys,order } from "../config/constants.js"
import axios from "axios"

export const getBooks = async (req, res) => {

    let { page_size,page,sort_by,sort_order } = req.query;

    // if query is not present then set default value 
    page_size = !page_size?10:Number(page_size)
    page = !page?1:Number(page)
    sort_by = !sort_by?"name":sort_by.trim().toLowerCase()
    sort_order = !sort_order?"asc":sort_order.trim().toLowerCase()

    // if page size or page number is not valid then return error
    if((isNaN(page_size) || page_size<1) || (isNaN(page) || page<1)){
        logger.error("400 Invalid page size or page number");
        return res.status(400).json({ message: "Invalid page size or page number" });
    }

    // if sort_by or sort_order is not in defined sort_keys and order respectively then return error
    if(!sort_keys.includes(sort_by.toLowerCase())){
        logger.error("400 Invalid sort_by key");
        return res.status(400).json({ message: "Invalid sort_by valid" });
    }

    if(!order.includes(sort_order.toLowerCase())){
        logger.error("400 Invalid sort_order key");
        return res.status(400).json({ message: "Invalid sort_order valid" });
    }

    // calculate page number and adjust sorting string
    const page_number = (page-1)*page_size
    const sorting_string = sort_order==="asc"?`${sort_by}`:`-${sort_by}`

    try {
        let books = await Books.findOne({}).sort(sorting_string);

        if(!books){
            logger.info("No books found");
            return res.status(404).json({ message: "No books found" });
        }

        if(sort_by==="published_year"){
            books = await Books.find({}).sort({publishedDate:sort_order==="asc"?1:-1}).skip(page_number).limit(page_size);
        }else{
            books = await Books.find({}).skip(page_number).sort(sorting_string).limit(page_size);
        }

        // if books length is 0 then the page number is not valid or is out of range
        if(books.length===0){
            logger.error("404 page is out Of range");
            return res.status(404).json({ message: "page is out of range" });
        }

        res.status(200).json({books});

    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}


// api to add book by name
export const addBookByName = async (req,res)=>{

    try{
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.params.name}`)
        const {items} = await response.data

        const filteredItems = items.filter((item) => {

            return item.volumeInfo &&
              item.volumeInfo.title &&
              item.volumeInfo.authors &&
              item.volumeInfo.authors.length>0 &&
              item.volumeInfo.categories &&
              item.volumeInfo.categories.length>0 &&
              item.volumeInfo.description &&
              item.volumeInfo.imageLinks &&
              item.volumeInfo.imageLinks.thumbnail &&
              item.volumeInfo.publishedDate;
          });

        const itemsList = filteredItems.map((item)=>{

            return new Books({
                title:item.volumeInfo.title,
                author:item.volumeInfo.authors[0],
                description:item.volumeInfo.description,
                url:item.volumeInfo.imageLinks.thumbnail,
                genre:item.volumeInfo.categories[0],
                publishedDate:item.volumeInfo.publishedDate
            })
        })
      

        const result = await Books.insertMany(itemsList)
        return res.status(200).json({
            message:"Books added successfully",
            result
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({"message":err.message})
    }
    
}