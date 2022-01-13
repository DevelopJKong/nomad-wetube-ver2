import "dotenv/config";  // 왜 이렇게 하면 잘 작동되는지 그래도 제대로 알아두어야 할거 같다
import "./db";
import "./model/Video";
import "./model/User";
import app from "./server";


const PORT = 4080;

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT} 😎`);

app.listen(PORT, handleListening);
