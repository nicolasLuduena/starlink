import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import satelliteRoutes from './routes/satellites.js';
import {addScheduledJobs} from './schedules/schedules.js';
import {ToadScheduler} from 'toad-scheduler';


const app = express();
dotenv.config();


app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors());

app.use('/satellite', satelliteRoutes);

const CONNECTION_URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;


const scheduler = new ToadScheduler();
addScheduledJobs(scheduler);

mongoose.connect(
    CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(
        PORT, () => console.log(`Server running on port: ${PORT}`)),
    ).catch((error) => console.log(error.message));
