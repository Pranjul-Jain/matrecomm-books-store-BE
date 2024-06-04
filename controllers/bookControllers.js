import Books from "../models/books.js";
import logger from "../config/logger.js";
import { sort_keys,order } from "../config/constants.js"

export const getBooks = async (req, res) => {

    // filtering valid query parameters
    const filter_keys = Object.keys(req.query).filter((value)=>sort_keys.includes(value.split(" ")[0]))

    if(filter_keys.length<1){
        logger.error("400 Please provide atleast one correct query parameter")
        return res.status(400).json({message:"Please provide atleast one correct query parameter"})
    }

    const find_object = {}
    const sortingString = ""

    // constructing find object and sorting string
    filter_keys.forEach((key)=>{
        if(key==="price" || key==="date"){

            const [filter_key,filter_condition,option1,option2] = req.query[key].split(" ");

            if(filter_condition==="between"){
                if(!option1 || !option2 || isNaN(Number(option1)) || isNaN(Number(option2)) ){
                    logger.error(`400 Invalid ${filter_key} options`)
                    return res.status(400).json({message:"Invalid query parameter options"})
                }

                option1 = Number(option1)
                option2 = Number(option2)

                find_object[filter_key] = {
                    [filter_condition]: {[(option1>option2?"$lt":"$gt")]:option1,[(option1>option2?"$gt":"$lt")]:option2}
                }
            }else{
                if(filter_condition!=="less-than" && filter_condition!=="more-than"){
                    logger.error("400 Invalid query parameter")
                    return res.status(400).json({message:"Invalid query parameter"})
                }

                if(isNaN(Number(option1))){
                    logger.error(`400 Invalid ${filter_key} options`)
                    return res.status(400).json({message:"Invalid query parameter options"})
                }

                option1 = Number(option1)

                find_object[filter_key] = {
                    [filter_condition==="less-than"?"$lt":"$gt"]: option1
                }
            }

        }else{

            const [sort_by,sort_order] = req.query[key].split(" ");

            if(!sort_by || !sort_order || !order.includes(sort_order)){
                logger.error("400 Invalid query parameter")
                return res.status(400).json({message:"Invalid query parameter"})
            }

            if(sort_order==="asc"){
                sortingString+=!sortingString?`${key}`:` ${key}`
            }else{
                sortingString+=!sortingString?`-${key}`:` -${key}`
            }
        }
    })

    try {
        const books = await Books.find(find_object).sort(sortingString);
        res.status(200).json(books);
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

export const postBook = async (req,res)=>{

    const book = req.body;
    const newBook = new Books(book);

    try {
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        logger.error(error.message);
        res.status(409).json({ message: error.message });
    }
}