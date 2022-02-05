import Satellite from '../models/satellite.js';
import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';
import {validationResult} from 'express-validator';

import axios from 'axios';

const STARLINK_URL = 'https://api.spacexdata.com/v4/starlink';

export const getSatellite = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
  }

  try {
    const escapedName = req.query.name.
        replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const limit = req.query.limit || 10;

    const nameRegex = escapedName +'.*';
    const satellites = await Satellite
        .find({'spaceTrack.OBJECT_NAME': {$regex: nameRegex, $options: 'i'}})
        .limit(limit);
    return res.status(StatusCodes.OK).json(satellites);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getSatellites = async (req, res) => {
  try {
    const satellites = await Satellite.find();
    return res.status(StatusCodes.OK).json(satellites);
  } catch (error) {
    return res.status(StatusCodes.NOT_FOUND)
        .json({message: ReasonPhrases.NOT_FOUND});
  };
};


export const updateSatellites = async (req, res) => {
  try {
    const {data} = await axios.get(STARLINK_URL);
    data.forEach((sat) =>{
      sat.location = {
        type: 'Point', coordinates: [sat.longitude || 0, sat.latitude || 0],
      };
      sat._id = sat.id;
      delete sat.id;
    });
    Satellite.deleteMany()
        .then(()=>{})
        .catch((error)=>{
          console.log(`ERROR DELETING DATA ${error}`);
          res.status(StatusCodes.BAD_REQUEST)
              .json({message: error.text});
        });
    console.log(data);
    Satellite.insertMany(data)
        .then(()=>{
          console.log(`INSERTED ${data.length} satellites`);
          res.status(StatusCodes.OK)
              .send({message: 'Successfully refreshed data'});
        })
        .catch((error)=>{
          console.log(`ERROR INSERTING DATA ${error}`);
          res.status(StatusCodes.BAD_REQUEST)
              .json({message: error.text});
        });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({message: `ERROR ON SPACE X REQUEST`});
  };
};

export const getSatellitesWithin = async (req, res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
  }

  const latitude = req.query.l1;
  const longitude = req.query.l2;
  // unit must be meters according to docs
  const distance =req.query.d * 1000;
  // https://github.com/Automattic/mongoose/wiki/3.8-Release-Notes#geojson-support-for-querynear
  // https://docs.mongodb.com/manual/reference/operator/query/maxDistance/#-maxdistance
  const a = await Satellite.where('location').nearSphere(
      {
        'center':
          {
            'type': 'Point',
            'coordinates': [longitude, latitude],
          },
        'maxDistance': distance,
      },
  ).find(
      {
        'longitude': {$ne: null},
        'latitude': {$ne: null},
      },
  );
  return res.status(StatusCodes.OK).json(a);
};
