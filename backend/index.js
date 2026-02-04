import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todos.js";
import dotenv from "dotenv";
dotenv.config();


const PORT = process.env.PORT || 5000;

const app = express();

// app.use(cors({
//   origin : '*'
//   // origin: "https://frontend-6j0r.onrender.com"
// }));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://frontend-6j0r.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
