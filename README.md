# JobHunter – An app where talent meets opportunities

A job portal built in MERN stack, where user can register either as candidate or recruiter. Both roles were provided different functionalities as per the roles they will be registering on the app.  

## 🚀 Features  

1. 🧾 Multi-step registration for candidates (education, internships, experience).
2. 👤 Secured recruiter dashboard to post jobs and track applicants.
3. 🧑‍🎓 Secured candidate dashboard to view application status, and explore new jobs.
4. 🔐 JWT-based route protection and authentication.
5. 🛡️ Role-based access control using middleware.
6. ♻️ Reusable backend APIs with generic controllers.
7. 💾 Password encryption with bcrypt.
8. 🧠 Job application tracker with filters.
9. 🪟 Unique username creation at the time of registration for both candidates and recruiter.
10. 🪪 Unique 6 digit alphanumeric jobID allottment for each job posted by recruiter for easy sharing among peers.
11. 🔠 Autofill of details of recruiters in the job posting form.
12. 🖱️ Conditional rendering of buttons for job page as per status of job corresponding to candidate and recruiter.
13. ❌ Filtering of irrelevant jobs for candidate and recruiter in Find Jobs section.
14. 🌻 Custom components such as dialog box, jobID generator, username generator.

## 🧱 Tech Stack

**Frontend:** React, TypeScript, Redux Toolkit, Tailwind CSS, ShadCN UI  
**Backend:** Node.js, Express.js, TypeScript  
**Database:** MongoDB with Mongoose  
**Deployment:** Render (Backend), vercel (Frontend)

## 📸 Screenshots
1. All Jobs section
![Screenshot (137)](https://github.com/user-attachments/assets/fe26a48e-844a-4b66-804c-16d5f5c9ac9e)


2. Candidate Dashboard  
![Screenshot (138)](https://github.com/user-attachments/assets/57ecb7b8-c0ff-4759-b3d0-4aca660ba71d)


3. Job Applications of a candidate
![Screenshot (139)](https://github.com/user-attachments/assets/27574550-8f74-4f4f-82c1-3a902cbe15bf)


4. Username screening API at registration
![Screenshot (140)](https://github.com/user-attachments/assets/91821de2-48c8-42f8-97a3-32c07bc6109a)

![Screenshot (141)](https://github.com/user-attachments/assets/e3670576-8bd4-4c59-8082-dacf53531b0e)



5. Autofill of recruiter details at start recruitments section, along with auto jobID generator that automatically enables when page loads
   
![Screenshot (142)](https://github.com/user-attachments/assets/bb354504-4b25-405d-b92e-60d2092f6413)


6. Recruiter can check status of recruitments he has posted on its dashboard
![Screenshot (143)](https://github.com/user-attachments/assets/54347c66-fd9c-411a-9568-906f497d5645)


7. List of applicants on recruiter dashboard for a particular job
![Screenshot (144)](https://github.com/user-attachments/assets/4aa9bc78-44ec-4a1b-9193-278a82e79c96)


8. Conditional Rendering of buttons, depending upon whether, recruiter has posted that job or not

![Screenshot (145)](https://github.com/user-attachments/assets/65fb5bee-579d-4255-a24f-058e591089e4)

![Screenshot (146)](https://github.com/user-attachments/assets/81a24ab9-e221-41c1-9361-b14f073e5b5f)









