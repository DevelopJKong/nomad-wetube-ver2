import express from "express";
import morgan from "morgan";
import globalRouter from "./routes/globalRouter";

import userRouter from "./routes/userRouter";
import videoRouter from "./routes/videoRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));// 이렇게 사용하면 자바스크립트를 이해할수있도록 해준다
app.use("/",globalRouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);

export default app;