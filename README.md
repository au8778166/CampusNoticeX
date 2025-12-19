# 🚀 CampusNoticeX

> CampusNoticeX is a full-stack MERN application that automatically collects, organizes, and presents college notices in one place, helping students stay updated without repeatedly visiting official websites.

---

## 🌟 Why CampusNoticeX?

College notice boards are often:
- Hard to navigate
- Poorly organized
- Updated frequently without alerts

CampusNoticeX solves this problem by:
- Automatically scraping official college notice websites
- Storing notices in a structured database
- Providing a clean, searchable, and secure interface for students

---

## 🧠 Core Features

### 🔄 Automated Notice Scraping
- Uses **Puppeteer** to scrape official college notice boards
- Runs automatically using **cron jobs**
- Prevents duplicate notices using database checks

### 🔐 Secure User Authentication
- JWT-based authentication
- HTTP-only cookies for security
- Protected routes for sensitive pages

### 📌 Notice Management
- Notices sorted by **actual notice date**
- Search notices by keyword
- Category-based classification (Exam, Holiday, Fee, etc.)
- Pagination-ready backend APIs

### 🤖 AI-Generated Notice Summary
- Integrated with **OpenAI API**
- Generates short, student-friendly summaries
- Available on the notice detail page
- Helps students quickly understand important notices

### 🎨 Modern UI
- Built with **React + Tailwind CSS**
- Responsive design (mobile & desktop)
- Clean gradients, cards, and animations
- User avatar-based navigation

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Puppeteer (Web Scraping)
- Node-cron (Automation)
- OpenAI API

---
