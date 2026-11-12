# When both terminals are running, you have two separate programs plus one cloud service:

Your PC
├── Process 1: Vite dev server   (port 5173)  ← serves React files
├── Process 2: Node + Express    (port 5000)  ← your API
└── Browser                                    ← runs React code

Cloud
└── MongoDB Atlas                              ← database

Each is an independent program. They only communicate by sending HTTP messages or database messages to each other.



1. You open localhost:5173
2. Vite sends index.html → browser loads main.jsx (converted) → React draws the UI
3. useEffect runs → fetch("/api/hello")
4. Vite proxy forwards it → Express on :5000
5. cors → json → route match → handler runs
6. (Later: handler asks Mongoose → Atlas → data comes back)
7. Express sends JSON → proxy → browser
8. setMsg() → React re-renders → you see the text




Package	Purpose
express	Creates the backend API.
mongoose	Connects to MongoDB and defines data models.
cors	Allows the Vite frontend to call the API from a different local port.
dotenv	Reads private configuration from an environment file.
nodemon	Restarts the server when you change backend files.
