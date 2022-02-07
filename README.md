# STARLINK API
Backend project:
* Build a backend API service that returns the live information of satellites. An example of this API response is https://api.spacexdata.com/v4/starlink (we are recreating this API endpoint)
* Create a database with the appropriate schema. You can use any database of choice. To keep things simple, you can use Sqlite3
* Bonus: create an API endpoint that allows search by satellite name
* Bonus: create an API that takes as input parameters a (latitude l1, longitude l2, distance d) and returns all satellites that are within a maximum distance d from (l1, l2)

## Endpoints
* `starlink-imagine-api.herokuapp.com/satellite/all` : returns all available satellite data
* `starlink-imagine-api.herokuapp.com/satellite?name=<choose a name>&limit=<choose how many results>`: search satellites by name. The limit field is optional
* `starlink-imagine-api.herokuapp.com/satellite/within?l1=<latitude>&l2=<longitude>&d=<distance in kilometers>`: returns all satellites that are within a maximum distance d from (l1, l2)

## Use locally
This repository was developed with NodeJs v17.4.0 --- So keep that in mind if you have a different version.

1. Clone this repository.
2. You will need a mongo db instance. You can use a free instance in the cloud (thanks to MongoDB Atlas). 
3. Once you have created your MongoDB Atlas database: Add your IP address to the list of allowed connections, create your DB user and copy your connection URI.
4. Create a `.env` file at the root directory of the repository
5. Add the line `MONGO_URI=<paste your MONGO URI here>` (you should complete it with your password)
6. Run the command `npm install`
7. Run the command `npm start`


You should be able to use this repository

