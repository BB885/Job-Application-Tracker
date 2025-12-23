Internship Application Tracker

A full-stack web application for tracking internship applications with support for inline editing, filtering, sorting, and analytics. The app allows users to manage application details (company, role, status, date, and notes), visualize outcomes through a custom pie chart with hover percentages, and export analytics as CSV or PDF reports. It is built with React on the frontend and FastAPI on the backend, uses SQLite for persistence, and focuses on clean architecture, practical UX, and real-world features commonly found in internal productivity tools.

Run Locally:

Backend

cd backend
pip install -r requirements.txt
uvicorn main:app --reload

http://127.0.0.1:8000

Frontend

cd frontend
npm install
npm start

http://localhost:3000