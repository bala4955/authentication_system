## Application Details
  - This is a completely API based backed application, We don't have a UI/Frontend, Need to trigger backend APIs for using this application.
  - Used NodeJs as a Backend tech and MongoDB Database
  - Used passport & JWT for Authentication
  - Storing Hashed Passwords in DB 
  - Preventing NoSQL injection with mongo-sanitize
  - Connected to Atlas MongoDB free trail.
  - Used Swagger for API Documentation. 
  - Showing the information based on roles.
  - Only admin users can access create and update the entities
  - Used a Couopn Module for showing protected data after login

## Before using

- Please make sure that you have:
 - node.js installed (https://nodejs.org/)
 - npm installed
 - cros-env installed
 - have mongodb installed and running locally (https://www.mongodb.com/)
   - Using Windows, just open the terminal at where you installed mongo and run `mongod.exe`
 - NOTE: Please give your mongodb connection url in /.env-dev file as MongoDBAtlas has some ristrictions to connect from mutiple networks.
 - run npm install in your root project folder
 - run npm install nodemon in your root project folder
 - run npm install express in your root project folder. Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.Reference URL:(https://expressjs.com/)

## Start Project

To run the project, please use a command line the following:
```
 - npm install
 - npm start
``` 
It will run the server at port 3000.

## API Endpoints

*Base URL*
- V1: http://localhost:3000/api/

*Swagger URL*
- V1: http://localhost:3000/api-docs/

## Project Usecases

 - Users can register into the system by providing name, email, role and password.
    - Adding validation for "role" field, only "admin" and "normal" values are alloweds
    - Email should be unique
    - All the above mentioned fields are mandatory
 - Users can login into the system by providing email and password.
 - Users who are having "admin" role can edit the user details like name and role by providing "user_id" in params and jwt token in headers and name/admin values in payload
 - Users who are having admins can create coupons by providing name and code
    - Both details (name, code) are mandatory
    - Unique code validation applied
    - coupons's "code" length must be 10 characters
- Users can view all the available coupons with pagination
- Only Admin Users can view allcoupon code
- Users can see their own coupons with /mycoupons endpoint, when they hit get all coupon list can't see the coupons code its masked
- Only Admins Users can edit the coupons