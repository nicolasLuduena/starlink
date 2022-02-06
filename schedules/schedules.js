import {refreshDbJob} from './refreshDatabase.js';

export const addScheduledJobs = (scheduler) => {
  scheduler.addSimpleIntervalJob(refreshDbJob);
};
