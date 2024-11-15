import express, { Application, Request, Response } from "express";
import userRouter from "./routes/userRouter";
import blogRouter from "./routes/postRouter";
import cors from "cors";

const app: Application = express();
app.use(express.json());

app.use(cors());

const port: number = 3000;

app.use("/api/users", userRouter);
app.use("/api", blogRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
