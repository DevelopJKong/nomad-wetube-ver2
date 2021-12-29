import express from "express";
import morgan from "morgan";
const PORT = 4050;

const app = express();
const logger = morgan("dev");


const handleHome = (req,res) => res.send("hi");
const handleLogin = (req,res) => res.send("login");

app.use(logger);
app.get("/", handleHome);
app.get("/login",handleLogin);


const handleListening = () => console.log(`Server listening on port http://localhost:${PORT} 😎`);

app.listen(PORT, handleListening);