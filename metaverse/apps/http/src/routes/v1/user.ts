import { Router, type Router as ExpressRouter } from "express";

export const userRouter: ExpressRouter = Router();

userRouter.post("/metadata", (req, res) => {
  res.json({ message: "Metadata" });
});

userRouter.get("/metadata/bluk", (req, res) => {});
