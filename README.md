JobHunter- A secure and role-based job portal built in MERN stack with TypeScript and ShadCN UI — enabling recruiters and candidates to connect via unique job IDs and dashboards.

## Link to open the platform

https://job-hunter-git-main-vaibhav-mathurs-projects.vercel.app/

## Tech Stack
MongoDB, Express, React, Node.js, TypeScript, Redux Toolkit, Asyncthunk, axios interceptor, ShadCN UI, JWT, bcrypt

## Key Features
🔐 Authentication & Security

JWT-protected private routes for login, dashboard, and job posting

bcrypt-secured password storage

Unique username check with dedicated API & modal feedback

📋 Form Handling

Multi-entry registration: education, experience, internships

Custom form validator for empty inputs

Autofill for recruiter details in job posting form

📦 Job Handling

Custom jobID generator (e.g., BHG665) for easy sharing

Duplicate jobID prevention with backend screening API

3-in-1 APIs for fetching candidates, jobs, or applications

2-in-1 screening API for role-specific button rendering

📊 Dashboards & Role-Specific Access

Separate dashboards for candidate and recruiter

Conditional rendering of apply/view/delete buttons based on login state and job ownership

"My Applications" & "My Recruitments" views

🔄 State Management

Centralized API access with createAsyncThunk

Custom thunks for conditional querying, screening, and deletion

Modular API controllers

🧠 Smart UI Features

Conditional buttons on job pages

Custom paginator component

Custom alert dialogs for API feedback

🗃️ Data & Storage

Composite schema with custom data structures and custom interfaces

Separate jobApplications collection with candidate + recruiter + job object

### Table for APIs

| Base Route | Sub Route | HTTP Method |  Thunk function to call API  |  Slice name that is subscribed to the store   | Reducer in store to provide access to useSelector hook of the state all across project  |
|------------|-----------|-------------|------------------------------|-----------------------------------------------|------------------------------------------------------------------|
|/candidate  |/create    |    POST    |  candidateRegistration  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|            |/delete/:username    |   DELETE   |  deleteCandidate  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|            |/login     |    POST    |  candidateLogin  |  candidateLoginSlice  |  candidateLoginthunk  |
|            |/refresh-token  |  POST  |  No thunk required to hit this endpoint, it is handles by the axios interceptor  |  N/A  |  N/A  
|            |/username/check  |  POST  |  checkUsernameAvailability  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|            |/username/create  |  POST  |  generateUsername  |  candidateUsernameGeneratorSlice  |  candidateUsernameGenerator  |
|            |/logout  |  POST  |  candidateLogout  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|            |/fetchAll  |  GET  |  fetchAllCandidates  |  allCandidateSlice  |  fetch_all_candidates  |
|            |/dashboard  |  GET  |  candidateDashboard  |  candidateDashboardSlice  |  candidateDashboard  |
|            |/fetch/:username  |  GET  |  fetchCandidateDetails  |  candidateProfileSlice  |  candidate_profile  |
|/recruiter  |/create    |  POST  |  recruiterRegistration  |   No slice required, it provides only HTTP code for success or failure    |    N/A    |
|            |/delete/:username  |  DELETE  |  deleteRecruiter  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|            |/login  |  POST    |  recruiterLogin  |  recruiterLoginSlice  |  recruiterLoginThunk  |
|            |/refresh-token  |  POST  |  No thunk required to hit this endpoint, it is handles by the axios interceptor  |  N/A  |  N/A
|            |/username/check  |  POST  |  checkUsernameAvailability  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|            |/username/create  | POST  |  generateUsername  |  recruiterUsernameGeneratorSlice  |  recruiterUsernameGenerator  |
|            |/logout  |  POST  |  recruiterLogout  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|            |/fetchAll  |  GET  |  fetchAllRecruiters  |  allRecruitersSlice  |  fetch_all_recruiters  |
|            |/dashboard  |  GET  |  recruiterDashboard  |  recruiterDashboardSlice  |  recruiterDashboard
|            |/fetch/:username  |  GET  |  fetchRecruiterDetails  |  recruiterProfileSlice  |  recruiter_profile
|/job        |/fetch    | GET  |  fetchAllJobs  |  allJobsSlice  |  allJobs  |
|            |/fetchIndividualJob/:jobID  |  GET  |  fetchIndividualJob  |  individualJobSlice  |  individual_job  |
|            |/create  |  POST  |  createJobThunk  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|            |/delete/:jobID  |  DELETE  |  deleteJobPostingThunk  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|            |/deleteID/:jobID  |  DELETE  |  deleteJobID  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|            |/createID  |  POST  |  generateJobID  |  No slice required, it provides only HTTP code for success or failure    |    N/A    | 
|            |screenID/:jobID  |  GET  |  checkJobID  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|/applications  |  /create  |  POST  |  createApplicationThunk  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|               |/screening  |  GET  |  screenApplicationThunk  |  No slice required, it provides only HTTP code for success or failure    |    N/A    |
|               | /jobStatus  |  GET  |  candidateJobApplicationThunk  |  allJobsAppliedSlice  |  jobsAppliedByCandidate  |
|               | /jobStatus  |  GET  |  recruiterJobListingThunk  |  allRecruitmentSlice  |  allRecruitmentsBySlice  |
|               | /jobStatus  |  GET  |  jobApplicantsThunk  |  jobApplicantsSlice  |  allApplicantsForJob  |

### Resuable APIs from above table

1. /recruiter and /candidate

These APIs share common controller functions at the backend, making it reusbale in nature. They are made with generic functions. Just need to pass the user role and corresponding names of the databases.



