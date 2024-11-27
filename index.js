const express = require('express');
const connectDB = require("./config/db")
const Employee = require("./models/Employee")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express();

//Routes
const creationRoutes = require("./routes/creationRoutes");
// Middleware to parse JSON
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

connectDB()
const PORT = 3000;
app.use("api/creation",creationRoutes)

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
