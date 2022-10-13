// import library
require('dotenv').config()
const express = require('express')
const cors = require('cors')
var createError = require('http-errors');
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require('swagger-jsdoc') 


// import files from other folders
const userRouter = require('./routes/users')
const taskRouter = require('./routes/tasks')
const subTaskRouter = require('./routes/subTasks')
const connectDB = require('./db/connect')
const auth = require('./middleware/authentication')

// swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Todo App",
            version: "1.0.0",
            description: "A Todo task App API"
        },
        servers: [
            {
                url: "http://localhost:5000/api/taskManager"
            }
        ],        
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options)

// call express function
const app = express()


// middleware to use request from body or url
app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

// Routes
app.use('/api/taskManager/tasks', auth, taskRouter);
app.use('/api/taskManager/subTasks', auth, subTaskRouter);
app.use('/api/taskManager/auth', userRouter);

app.get('/', (req, res) => {
    res.send('welcome to task manager API')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    //res.status(404).json({err:"Not found"})
    const err = new Error('Not found.')
    err.status = 404
    next(err)
  });

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        err: {
            status: err.status || 500,
            message: err.message
        }
    })
})  

//Assign port from .env or default 3000
const port = process.env.PORT || 3000


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        });
    } catch (error) {
        console.log(error);
    }
};

start();
