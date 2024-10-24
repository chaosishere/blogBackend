import express, { Application, Request, Response } from "express";
import userRouter from "./routes/userRouter";
import blogRouter from "./routes/postRouter";

const app: Application = express();
app.use(express.json());

const port: number = 3000;

app.use("/api/users", userRouter);
app.use("/api", blogRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
