# A full-stack web app built with React (Vite) + Node.js (Express) + MongoDB (Atlas).
This file records everything set up so far, so the project can be recreated or understood later.

1. Tech Stack
Layer	     Technology	                    Purpose
Frontend	React + Vite	           User interface (runs in the browser)
Backend	   Node.js + Express	      API server, business logic
Database   MongoDB Atlas (cloud)	   Permanent data storage
ODM	         Mongoose	               Talks to MongoDB from Node
Dev tools	 nodemon, ESLint	      Auto-restart server, code linting


# 1. What each tool does
* Vite: dev server + compiler (JSX to JS) + bundler. Gives instant updates (HMR) and builds for production with npm run build. Frontend only.
* Node.js: runs JavaScript outside the browser. It runs the Express server and tools like Vite.
* Express: library on top of Node that makes routes and servers easy.
* MongoDB Atlas: free cloud database. No local install needed.
* Mongoose: defines schemas/models and queries MongoDB.
* cors: allows the React app (different port) to call the server.
* dotenv: loads secrets from the .env file.
* nodemon: restarts the server automatically when files change.


# 2. Architecture
React (browser, :5173)  -->  Express (Node, :5000)  -->  MongoDB Atlas
React (browser, :5173)  <--  Express (Node, :5000)  <--  MongoDB Atlas

The browser never talks to the database directly. Express sits in between to keep the database secure.

Example request flow

React calls fetch("/api/hello").
The Vite proxy forwards /api/* to http://localhost:5000.
Express matches the route app.get("/api/hello").
Express (when needed) reads or writes data in MongoDB through Mongoose.
Express returns JSON, and React stores it in state and shows it on screen.
3. Folder Structure
DevArena/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx         # Main component (edited)
│   │   └── main.jsx        # Entry point, renders <App />
│   ├── index.html          # Has <div id="root">
│   ├── vite.config.js      # Proxy added here (edited)
│   └── package.json
├── server/                 # Node + Express backend
│   ├── index.js            # Server entry file (created)
│   ├── .env                # Secrets (created, never commit)
│   └── package.json        # type: module + scripts (edited)
├── .gitignore              # node_modules, .env
├── README.md
└── doc.md                  # This file

Frontend flow: index.html -> main.jsx -> App.jsx

4. Setup Steps Performed
4.1 Frontend (client)
bash
npm create vite@latest client -- --template react

Choices made:

Framework: React, JavaScript
Linter: ESLint
Install with npm and start now: Yes
bash
cd client
npm i
4.2 Backend (server)
bash
mkdir server
cd server
npm init -y
npm i express cors dotenv mongoose
npm i -D nodemon
4.3 Edit server/package.json

Change "type": "commonjs" to "type": "module" (enables import syntax) and replace scripts:

json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
Command	Runs	Auto-restart	Used for
npm run dev	nodemon index.js	Yes	Development
npm start	node index.js	No	Production
4.4 Create server/index.js
js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the server" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
Line	Meaning
express()	Creates the server
cors()	Allows requests from the React app
express.json()	Lets the server read JSON request bodies
mongoose.connect(...)	Connects to MongoDB using MONGO_URI
app.get("/api/hello")	A route (URL the server responds to)
app.listen(5000)	Starts the server on port 5000
4.5 MongoDB Atlas setup
Sign up at mongodb.com/atlas and create a free (M0) cluster.
A database user is created (username + password).
Network Access: your current IP is added. If your IP changes later, add 0.0.0.0/0 (Allow Access from Anywhere) for learning.
Connect -> Drivers and Client Libraries -> Node.js -> copy the connection string.
4.6 Create server/.env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/devarena?retryWrites=true&w=majority

Notes:

Replace <username> and <password> with the real values (no < > brackets).
/devarena after .net is the database name.
Use a password with only letters and numbers. Special characters like @, #, / must be URL-encoded.
Never share or commit this file.
4.7 Add proxy in client/vite.config.js
js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:5000" },
  },
});

The proxy forwards any request starting with /api to port 5000, so React can call /api/hello instead of the full URL and CORS issues are avoided in development.

4.8 Replace client/src/App.jsx
jsx
import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMsg(data.message));
  }, []);

  return <h1>{msg}</h1>;
}

export default App;
useState stores the message.
useEffect with [] runs once when the page loads and calls the server.
4.9 Create .gitignore (root folder)
node_modules
.env



5. How to Run
Use two terminals.

Terminal 1: server

bash
cd server
npm run dev

Expected output:

Server running on port 5000
MongoDB connected

Terminal 2: client

bash
cd client
npm run dev

Open http://localhost:5173. The page should show "Hello from the server".

Useful tips:

Type rs + Enter in the server terminal to restart nodemon (needed after editing .env).
Press Ctrl + C in a terminal to stop a running server.
6. Troubleshooting
Problem	Cause	Fix
ECONNREFUSED 127.0.0.1:27017	.env still points to local MongoDB	Use the Atlas connection string, then rs
bad auth	Wrong database password	Reset it in Atlas -> Database Access
Timeout / ENOTFOUND	IP not allowed in Atlas	Network Access -> Add 0.0.0.0/0
Blank page in browser	Server not running or proxy missing	Check Terminal 1 and vite.config.js
Port already in use	Old process still running	Ctrl + C in old terminals, then restart
"3 high severity vulnerabilities" after installing nodemon	Dev-only dependency warning	Ignore. Don't run npm audit fix --force
Cannot use import in server	"type": "module" missing	Add it to server/package.json
7. Security Checklist
 .env is listed in .gitignore
 Database password was changed if it was ever shared (Atlas -> Database Access -> Edit -> Edit Password)
 Connection string is never pasted in chats, screenshots or GitHub
 Before deploying, restrict Atlas Network Access to your hosting provider instead of 0.0.0.0/0
8. Git Commands
bash
git add .
git commit -m "Initial full stack setup"
git push