// import library
require('dotenv').config()
const express = require('express')
const cors = require('cors')
var createError = require('http-errors');
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require('swagger-jsdoc') 
const schedule = require('node-schedule')
const webPush = require('web-push')
const bodyParser = require('body-parser')



// import files from other folders
const notificationRouter = require('./routes/notification')
const userRouter = require('./routes/users')
const taskRouter = require('./routes/tasks')
const subTaskRouter = require('./routes/subTasks')
const profileRouter = require('./routes/profile')
const connectDB = require('./db/connect')
const auth = require('./middleware/authentication')
const scheduleRouter = require('./routes/schedule')
const { statusSchedule } = require('./controllers/schedule');
const { notification } = require('./controllers/notification');

// swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "TooDoo Task App",
            version: "1.0.0",
            description: "A TooDoo task App API"
        },
        servers: [
            {
                url: "https://too-doo-task.herokuapp.com/api/TooDoo"
            }
        ],        
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options)

// call express function
const app = express()



// const publicVapidKey = process.env.PUBLIC_KEYS
// const privateVapidKey = process.env.PRIVATE_KEYS

// webPush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey)

// middleware to use request from body or url
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
app.use("/profileImage", express.static("uploads/profile"))
// Routes
app.use('/api/TooDoo/profile', auth, profileRouter);
app.use('/api/TooDoo/notification', auth, notificationRouter);
app.use('/api/TooDoo/subscribe', auth, scheduleRouter);
app.use('/api/TooDoo/tasks', auth, taskRouter);
app.use('/api/TooDoo/subTasks', auth, subTaskRouter);
app.use('/api/TooDoo/auth', userRouter);

app.get('/', (req, res) => {
    res.status(200).send(
        `<h1>Welcome to TooDoo Task app API</h1>
        <p>To access swagger documentation go to <a href='/api-docs'>api-docs</a>`)
});






// catch 404 and forward to error handler
app.use(function(req, res, next) {
    //res.status(404).json({err:"Not found"})
    const err = new Error('Not found.')
    err.status = 404
    next(err)
  });

// Error handler 
app.use((err, req, res, next) => {
    res.status(err.status || 400)
    res.json({
        err: {
            status: err.status || 400,
            msg: err.message
        }
    })
})  

//Assign port from .env or default 3000
const port = process.env.PORT || 3000


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        //schedule.scheduleJob('*/1 * * * *', statusSchedule) 
        schedule.scheduleJob('*/1 * * * *', notification) 
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        });
    } catch (error) {
        console.log(error);
    }
};

start();
