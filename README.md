## Jobs API
An API to perform complete backend implementations of a job hiring platform. Providing different endpoints to perform different tasks, like listing jobs, applying to a job, or selecting a candidate who applied to a job as a recruiter with proper data population.

Scripted in JavaScript on top of NodeJS and Express JS. Used MongoDB as a database service and implemented data back-population to respective models. Integrated JWT for authentication, AWS S3 as a file storage service, and SendGrid for mailing services.

## Tech Stack
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) 

## Access the API
+ Fork and clone the repository
```md
https://github.com/<github_username>/jobs-api
```
+ Add a `.env` file in the root directory with following credentials mentioned.
```js
PORT = 
MONGO_USERNAME = 
MONGO_PASSWORD = 
AWS_ACCESS_KEY_ID = 
AWS_SECRET_ACCESS_KEY =
AWS_REGION = 
AWS_BUCKET_NAME = 
JWT_ACCESS_TOKEN = 
```

+ Install the dependencies
```ms
npm i
```

+ Run the server
```
npm start
```

----

## Endpoints

+ #### `/users`

+ **POST** `/register` 
    + To create a new user.

+ POST `/login` 
    + Login to a user profile.
    + Requires username and password for authentication.

+ *GET* `/:username`  
    + Get the profile detail of loggedin user.

+ *PUT* `/:username/update` 
    + Update user's profile

+ *DELETE* `/:username/delete` 
    + Delete User from the collection.

+ *GET* `/:username/jobs` 
    + Search for jobs as loggedin user.

+ *GET* `/:username/:job_code/apply` 
    + Apply to a job passing the job code.
    + An user will only be able to apply to a job if he/she is loggedin.

----
+ #### `/company`

+ POST `/register` 
    + Register as a company.
    + 
+ POST `/login` 
    + Login as a company.

+ *GET* `/:company_code` 
    + Get the details of the loggedin company.

+ *PUT* `/:company_code/update` 
    + Update the company details.

+ *DELETE* `/:company_code/delete` 
    + Delete the company from the collection.

+ *PUT* `/:company_code/recruiter/add` 
    + Add a recruiter to the company.

----

+ #### `/recruiter`

+ POST `/register` 
    + Register as a recruiter.
    + A recruiter will able to register only when the provided email is allowed to join the company.

+ POST `/login` 
    + Login as a recruiter.

+ *GET* `/:username` 
    + Get the details of the loggedin recruiter.

+ *PUT* `/:username/update` 
    + Update the recruiter.

+ *DELETE* `/:username/delete` 
    + Delete the recruiter from the collection.

+ *POST* `/:username/jobs/create` 
    + Create a job a recruiter.

+ *GET* `/:username/jobs` 
    + List the jobs created by the loggedin user.
    + This endpoint will only return the jobs created by the particular user, that is the logged in one.

+ *GET* `/:username/:job_code/applicants` 
    + Check the list of all the applicants applied to a job.

+ *GET* `/:username/:job_code/:applicant_username/select` 
    + Select a applicant by the username to a particular job.

----

+ #### `/jobs`
+ GET `/all`
    + List all the jobs.

----
**Note** - *Endpoints mentioned in italic need authentication to access*

Check the complete documentation [here](https://documenter.getpostman.com/view/20799971/2s93RUvXa9#aa2a1d0a-8ee1-449f-962d-756f41c1a748)
---
