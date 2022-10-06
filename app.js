require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.json());

app.get('/', (req, res) => {
    res.send('welcome to task manager API')
})

//Assign port from .env or default 5000
const port = process.env.PORT || 5000


const start = async () => {
    try {

        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        });
    } catch (error) {
        console.log(error);
    }
};

start();
