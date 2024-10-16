import express, { Application, request, Request, Response } from "express";

const app: Application = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express:TypeScript" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
