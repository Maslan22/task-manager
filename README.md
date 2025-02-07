Task Manager

A modern task management application built with Next.js 15, featuring user authentication, role-based access control, and real-time task management capabilities.

🚀 Demo
Visit the live demo: Task Manager


✨ Features:


Authentication

User authentication with email verification

Password reset functionality

Role-based access control (Admin/User)


Task Management

Create, read, update, and delete tasks

Real-time search and filtering

Task organization and categorization

User Interface

Responsive design for all devices

Modern and clean UI with shadcn/ui components

Dark mode support



🛠️ Tech Stack:


Next.js 15 - React Framework

Auth.js - Authentication

Prisma - ORM

Neon DB - PostgreSQL Database

Tailwind CSS - Styling

shadcn/ui - UI Components

Zod - Type Validation

Conform - Form Handling

Node Mailer - Email Verification


🚦 Getting Started



Prerequisites

Make sure you have pnpm installed (required for Next.js 15 compatibility):

npm install -g pnpm

Installation

Clone the repository:

bashCopygit clone https://github.com/Maslan22/task-manager.git

cd task-manager

Install dependencies:

pnpm install

Run the development server:

pnpm dev

Open http://localhost:3000 with your browser to see the result.


👩‍💻 Development

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

This project uses next/font to automatically optimize and load Geist, a custom font for Vercel.


🔑 Admin Access

To access the admin dashboard (uses same login page route as normal users):

Email: admin@taskmanager.com

Password: admin@Password.com


📝 Environment Variables

Create a .env file in the root directory with the following variables:

DATABASE_URL=your_database_url

NEXTAUTH_SECRET=your_nextauth_secret

NEXTAUTH_URL=http://localhost:3000


Vercel for hosting

shadcn/ui for beautiful UI components

Next.js team for the amazing framework
