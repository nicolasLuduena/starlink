import axios from 'axios';
import Satellite from '../models/satellite.js';

const STARLINK_URL = 'https://api.spacexdata.com/v4/starlink';

export const refreshStarlink = async () =>{
  console.log('Refreshing database');
  const {data} = await axios.get(STARLINK_URL);
  data.forEach((sat) =>{
    sat.location = {
      type: 'Point', coordinates: [sat.longitude || 0, sat.latitude || 0],
    };
    sat._id = sat.id;
    delete sat.id;
  });
  console.log(await Satellite.deleteMany());
  console.log(await Satellite.insertMany(data));
  console.log('Database refreshed');
};
