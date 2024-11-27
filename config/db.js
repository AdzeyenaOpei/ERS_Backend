const mongoose = require("mongoose")

const MONGODB_URI = "mongodb+srv://opeiadzeyena123:ObjectSystem1@firstcluster.dkmvt.mongodb.net/ERS_System?retryWrites=true&w=majority&appName=FirstCluster";

const connectDB = () =>{
    mongoose.connect(MONGODB_URI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
        })
        .then(() => console.log("MongoDB Connected"))
        .catch(err => console.log(err))  
}

module.exports = connectDB;