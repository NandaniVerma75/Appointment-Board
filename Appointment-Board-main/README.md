# Appointment Board

Hi! This is my submission for the Full Stack Developer Intern practical task. 
It's a simple appointment board built for a small team to manage their schedule.

## How to run it locally

1. Install the dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack
- Next.js (React)
- Tailwind CSS for styling
- A simple local `appointments.json` file as the database so you don't have to set up Postgres or MongoDB just to test this out!

## Features 
- View all appointments in a list
- Filter by date and status (scheduled, completed, cancelled)
- Add a new appointment (validates that time slots don't overlap)
- Edit existing appointments
- Mark appointments as completed or cancel them

Let me know if you have any questions about the code!
