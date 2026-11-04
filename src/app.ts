import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UpstreamError } from "./fakeStore";
import { apiRouter } from "./routes/apiRoutes";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api", apiRouter);

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) {
    response.status(400).json({ error: "Invalid request", details: error.flatten() });
    return;
  }

  if (error instanceof UpstreamError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }

  response.status(500).json({ error: "Internal server error" });
});

export { app };