# Task Manager

A modern task management application built with Next.js 15, featuring user authentication, role-based access control, and real-time task management capabilities.

## 🚀 Demo
Visit the live demo: [Task Manager](https://task-manager-snowy-pi.vercel.app/)

## 📸 How The App Works

### Homepage
#### Dark Mode
![Task Manager Homepage Dark](./public/app/dash-blak.png)
#### Light Mode
![Task Manager Homepage Light](./public/app/home-white.png)
The homepage provides a clean, modern interface introducing users to the task management platform. It features a responsive navigation bar, hero section explaining key features, and quick access to login/register options.

### Authentication Flow
#### Login/Register Page
![Login Page](./public/app/login.png)
![Sign Up Page](./public/app/sign-up.png)
Users can either login with existing credentials or create a new account. The registration process includes email verification for security.

#### Email Verification
![Email Verification](./public/app/email.png)
![Email Verification](./public/app/verified.png)
After registration, users receive a verification email to confirm their account, ensuring security and preventing spam accounts.

### Dashboard
#### Dark Mode
![Dashboard Dark](./public/app/home-black.png)
#### Light Mode
![Dashboard Light](./public/app/dash-white.png)
The dashboard provides an overview of all tasks and events. It features a responsive sidebar for navigation and quick access to different sections.

### Event Management
#### Creating Events
![Create Event Form](./public/app/create-event.png)
Users can create new events by filling out details such as:
- Event title
- Description
- Date and time
- Location
- Attendees

#### Event View
![Event Created](./public/app/created-event.png)
Once created, events display all relevant information and allow for easy editing and management.

### Task Management
#### Creating Tasks
![Create Task](./public/app/create-task.png)
![Task Fields](./public/app/create-task1.png)
The task creation interface allows users to:
- Set task title
- Add description
- Add related files

#### Completed Tasks
![Task Completed](./public/app/task-created.png)
Completed tasks are marked and can be filtered for easy tracking of progress.

### Attendee Management
#### Adding Attendees
![Search Attendees](./public/app/attendees-search.png)
Users can search and add attendees to events with an intuitive interface.

#### Attendee List
![Attendee List](./public/app/added-attendees.png)
View and manage all attendees for each event, with options to remove or add more participants.

### Platform Settings
#### Settings Configuration
![Settings](./public/app/settings.png)
The settings panel allows users to customize their event presentations and manage their content. Users can enhance their events by adding custom images and have full control over event management, including the ability to delete events when needed.

#### Image Management
![Before Adding an image(Initial save)](./public/app/set-before.png)
Events initially display with a default placeholder image, ensuring a consistent look across the platform before customization.

![After Adding an image (Adding image in settings)](./public/app/set-after.png)
Users can personalize their events by uploading custom images through the settings interface, replacing the default placeholder with images that better represent their events.

### Task Details
#### Task View
![Task View](./public/app/view-ask.png)
Detailed task view showing all task information, progress, and related activities.

#### Full Task Details
![Full Task Details](./public/app/task-veiw-full.png)
Comprehensive view of task details including comments, attachments, and history.

### Admin Dashboard
#### Admin Overview
![Admin Overview](./public/app/admin.png)
The admin dashboard provides a comprehensive overview of all system activities, user statistics, and platform analytics. Administrators can monitor the entire platform from this centralized interface.

![Admin Overview](./public/app/admin-users.png)
Administrator have access to a complete user management system where they can view,and monitor all user accounts. This includes the ability to view user activity, status, and account details.

![Admin Overview](./public/app/admin-analytics.png)
The analytics section offers detailed insights into platform usage, including task completion rates, user engagement metrics, and system performance statistics.


## ✨ Features

### Authentication
- User authentication with email verification
- Password reset functionality
- Role-based access control (Admin/User)

### Task Management
- Create, read, update, and delete tasks
- Real-time search and filtering
- Task organization and categorization

### User Interface
- Responsive design for all devices
- Modern and clean UI with shadcn/ui components
- Dark mode support

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) - React Framework
- [Auth.js](https://authjs.dev/) - Authentication
- [Prisma](https://www.prisma.io/) - ORM
- [Neon DB](https://neon.tech/) - PostgreSQL Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Zod](https://zod.dev/) - Type Validation
- [Conform](https://conform.guide/) - Form Handling
- [Node Mailer](https://nodemailer.com/) - Email Verification

## 🚦 Getting Started

### Prerequisites
Make sure you have pnpm installed (required for Next.js 15 compatibility):
```bash
npm install -g pnpm
pnp install
pnp run dev