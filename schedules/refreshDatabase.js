import {SimpleIntervalJob, AsyncTask} from 'toad-scheduler';
import {refreshStarlink} from '../controllers/utils.js';


const refreshDbTask = new AsyncTask(
    'simple task',
    refreshStarlink,
);
export const refreshDbJob = new SimpleIntervalJob({hours: 1}, refreshDbTask);

