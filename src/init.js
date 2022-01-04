import "./db";
import "./model/Video";
import app from "./server";

const PORT = 4050;

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT} 😎`);

app.listen(PORT, handleListening);
