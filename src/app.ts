import express, { Application, Request, Response } from "express";
import userRouter from "./routes/userRouter";

const app: Application = express();
app.use(express.json());

const port: number = 3000;

app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
