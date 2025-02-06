import { Router, type Router as ExpressRouter } from "express";

export const adminRouter: ExpressRouter = Router();

adminRouter.post("/element", (req, res) => {});

adminRouter.post("/element/:elementId", (req, res) => {});

adminRouter.get("/avtar", (req, res) => {});

adminRouter.get("/map", (req, res) => {});
