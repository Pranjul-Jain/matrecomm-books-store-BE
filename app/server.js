import express from "express"
import logger from "../config/logger.js"
import dotenv from "dotenv"
import connectDb from "../config/db.js"
import bookRoutes from "../routes/bookRoutes.js"

// configure dotenv file
dotenv.config();

// configure express
const app = express()

app.use(express.json({
    limit:"16kb"
}))

app.use(express.urlencoded({ 
    extended: true,
    limit:"16kb"
}))

// adding routes
app.use("",bookRoutes);

connectDb().then(() => {
    app.listen(process.env.PORT || 3000, () => 
        console.log("Server is running at port "+(process.env.PORT || 3000))
    )
    
    logger.info("Server is running at port "+(process.env.PORT || 3000))
}).catch(err=>{
    console.log(err)
})
