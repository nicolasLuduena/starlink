export const refreshStarlink = async () =>{
  const {data} = await axios.get(STARLINK_URL);
  data.forEach((sat) =>{
    sat.location = {
      type: 'Point', coordinates: [sat.longitude || 0, sat.latitude || 0],
    };
    sat._id = sat.id;
    delete sat.id;
  });
  Satellite.deleteMany();
  console.log(data.length);
  Satellite.insertMany(data);
  console.log(`INSERTED ${data.length} satellites`);
};
