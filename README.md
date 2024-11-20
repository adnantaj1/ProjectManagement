# Project Management System

## Description
This Project Management System is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and is designed to streamline the operations within an organization by differentiating user roles such as owners, admins, and employees. Tailwind CSS and Ant Design are utilized for styling to create a visually appealing and functional interface for each user type.

### Key Features
- **Role-Based Interfaces:** Separate interfaces for owners, admins, employees, ensuring that each user accesses only the relevant parts of the application.
- **Advanced Permissions:**
  - **Owner:** Full access to all features including management of admins and employees, creation of new projects, and user invitations.
  - **Admin:** Assigned specific permissions by the owner to oversee certain tasks and manage employees.
  - **Employee:** Ability to view and update the status of assigned tasks.
- **Notifications:** Real-time updates for admins and employees whenever a task status is changed or when they are invited to a project.
- **Project Management:** Owners can create new projects and manage them through a comprehensive dashboard.

## Live Demo
The project is currently hosted on Render and can be accessed [here](https://projectmanager-iqvd.onrender.com). Please note, the initial load time might take up to 30 seconds due to the free hosting environment on Render.

## Technologies Used
- **Frontend:** React.js, Tailwind CSS, Ant Design
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Hosting:** Render

## Getting Started

### Prerequisites
Before setting up the project locally, ensure you have the following installed:
- Node.js
- npm (Node Package Manager)
- MongoDB

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/adnantaj1/ProjectManagement.git
   cd project-manager
