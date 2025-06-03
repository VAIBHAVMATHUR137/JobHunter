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

| Base Route | Sub Route | HTTP Method
|------------|-----------|------------|
|/candidate  |/create    |    POST    |
|            |/delete/:username    |   DELETE   |
|            |/login     |    POST    |
|            |/refresh-token  |  POST  |
|            |/username/check  |  POST  |
|            |/username/create  |  POST  |
|            |/logout  |  POST  |
|            |/fetchAll  |  GET  |
|            |/dashboard  |  GET  |
|/recruiter  |/create    |  POST  |
|            |/delete/:username  |  DELETE  |




