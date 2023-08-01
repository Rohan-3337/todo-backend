const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://rohan:roh%40n123@cluster0.o74to4q.mongodb.net/"
mongoose.set("strictQuery", false);

const connect_To_mongo = async()=>{
    try {
        await mongoose.connect(mongoURI,()=>{
            console.log("connected Successfully database :)")
        })
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = connect_To_mongo;