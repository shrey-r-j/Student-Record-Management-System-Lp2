# ☁️ Cloud-Based Student Record Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application to store and manage student records, built for easy deployment on **AWS EC2**.

## Features

- **CRUD Operations** — Add, View, Update, and Delete student records
- **Search & Filter** — Search by name/roll/email, filter by department and year
- **Dashboard** — Stats overview with department breakdown and recent students
- **Responsive UI** — Works on desktop, tablet, and mobile
- **Production Ready** — Backend serves React build in production (single port deployment)

## Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React 19 + Vite             |
| Backend   | Node.js + Express           |
| Database  | MongoDB + Mongoose          |
| Styling   | Vanilla CSS (Dark Theme)    |

## Project Structure

```
student-records/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Request handlers
│   ├── models/Student.js     # Mongoose schema
│   ├── routes/               # API routes
│   ├── seeder.js             # Sample data seeder
│   ├── server.js             # Express server
│   └── .env                  # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Toast, Modal
│   │   ├── pages/            # Dashboard, StudentList, StudentForm, StudentDetail
│   │   ├── api.js            # Axios API service
│   │   └── index.css         # Global styles
│   └── vite.config.js        # Vite config with proxy
└── README.md
```

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` (proxies API calls to port 5000)



## API Endpoints

| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| GET    | /api/students        | Get all students (+ search/filter) |
| GET    | /api/students/:id    | Get single student         |
| POST   | /api/students        | Create new student         |
| PUT    | /api/students/:id    | Update student             |
| DELETE | /api/students/:id    | Delete student             |
| GET    | /api/students/stats  | Get aggregated statistics  |
| GET    | /api/health          | Health check               |

---

## 🚀 AWS EC2 Deployment Guide

### Step 1: Launch EC2 Instance
1. An active **AWS Account**.
2. An **EC2 Instance** launched with **Ubuntu Server 22.04 LTS** (or newer).
3. The `.pem` key pair downloaded to your local machine for SSH access.
4. **Security Group Configuration**: Ensure the following inbound rules are set in your AWS EC2 Security Group:
   - **Port 22** (SSH) - From your IP address.
   - **Port 3000** (Custom TCP) - For the Frontend (or whichever port you choose to serve it on).
   - **Port 5000** (Custom TCP) - For the Backend API.

## Step 2: Connect to Your EC2 Instance

Open your local terminal, navigate to the folder containing your `.pem` key, and connect to the server:
```bash
# Set appropriate permissions for your key
chmod 400 your-key-pair.pem

# Connect to the instance
ssh -i "your-key-pair.pem" ubuntu@<your-ec2-public-ip>
```

### Step 3: Install Node.js & MongoDB
```bash
# Update package lists
sudo apt update && sudo apt upgrade -y

# Install curl (if not already installed)
sudo apt install curl -y

# Download and install Node.js (Version 20.x recommended)
sudo apt install -y nodejs

sudo apt install npm 

# Verify installation
node -v
npm -v

# Install git
sudo apt install git

# Install PM2 globally to manage background processes
sudo npm install -g pm2
```

### Step 4: Clone & Setup Project
```bash
git clone <YOUR_REPO_URL>
cd student-records

# Backend
cd backend
npm install
# Edit .env file
nano .env
```

Set in `.env`:
```
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### Step 5: Build Frontend
```bash
cd ../frontend
npm install
npm run build
```

### Step 7: Run with PM2
```bash
sudo npm install -g pm2
cd ~/student-records/backend
pm2 start server.js --name student-records

# Save the current list of PM2 processes
pm2 save

# Generate the startup script
pm2 startup

```

### Step 8: Access the App
Open `http://<EC2_PUBLIC_IP>:5000` in your browser.

---

## Environment Variables

| Variable    | Description                    | Default                                      |
|-------------|--------------------------------|----------------------------------------------|
| NODE_ENV    | Environment mode               | development                                  |
| PORT        | Server port                    | 5000                                         |
| MONGO_URI   | MongoDB connection string      | mongodb://localhost:27017/student_records     |
