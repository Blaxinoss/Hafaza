const express = require('express');
require("dotenv").config();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const teachersRoute = require('./routes/teachersRoutes');
const studentsRoute = require('./routes/studentsRoutes');

const app = express();
app.use(cors());
const port = process.env.PORT;


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err))


app.get('/', (req, res) => {
    res.send("Hello, World!")
})

app.use('/api/teacher', teachersRoute)
app.use('/api/student', studentsRoute)

app.listen(port, () => {
    console.log("server listening on ", port)
})