import { Router, type Router as ExpressRouter } from "express";

export const spaceRouter: ExpressRouter = Router();

spaceRouter.post("/", (req, res) => {});

spaceRouter.delete("/:spaceId", (req, res) => {});

spaceRouter.get("/all", (req, res) => {});

spaceRouter.post("/elmement", (req, res) => {});

spaceRouter.delete("/elmement", (req, res) => {});

spaceRouter.get("/:spaceId", (req, res) => {});
