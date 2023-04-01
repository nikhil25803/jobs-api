### Jobs API
An API to perform complete backend implementations of a job hiring platform. Providing different endpoints to perform different tasks, like filtering jobs, applying to a job, or selecting a candidate who applied to a job.

Scripted in JavaScript on top of NodeJS and Express JS. Used MongoDB as a database service and implemented data bac-population to respective models. Integrated JWT for authentication, AWS S3 as a file storage service, and SendGrid for mailing services.

### Tech Stack
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

### Access the API
+ Fork and clone the repository
```md
https://github.com/<github_username>/jobs-api
```

+ Install the dependencies
```ms
npm i
```

+ Run the server
```
npm start
```

### Endpoints

+ ### `/users`

    + POST `/register`
    + POST `/login`
    + GET `/:username`
    + PUT `/:username/update`
    + DELETE `/:username/delete`
    + GET `/:username/jobs`
    + GET `/:username/:job_code/apply`

+ ### `/company`

    + POST `/register`
    + POST `/login`
    + GET `/:company_code`
    + PUT `/:company_code/update`
    + DELETE `/:company_code/delete`
    + PUT `/:company_code/recruiter/add`

+ ### `/recruiter`

    + POST `/register`
    + POST `/login`
    + GET `/:username`
    + PUT `/:username/update`
    + DELETE `/:username/delete`
    + POST `/:username/jobs/create`
    + GET `/:username/jobs`
    + GET `/:username/:job_code/applicants`
    + GET `/:username/:job_code/:applicant_username/select`

+ ### `/jobs`
    + GET `/all`