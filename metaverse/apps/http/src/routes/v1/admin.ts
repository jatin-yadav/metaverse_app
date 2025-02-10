import client from "@repo/db/client";
import { Router, type Router as ExpressRouter } from "express";
import { adminMiddleware } from "../../middleware/admin";
import {
  AddElementSchema,
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
  UpdateElementSchema,
} from "../../types";

export const adminRouter: ExpressRouter = Router();

adminRouter.post("/element", adminMiddleware, async (req, res) => {
  const parsedData = CreateElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.error("❌ Validation Error:", parsedData.error.format()); // Log detailed errors
    res.status(400).json({
      message: "Invalid data validation failed",
      errors: parsedData.error.format(),
    });
    return;
  }

  const element = await client.element.create({
    data: {
      width: parsedData.data.width,
      height: parsedData.data.height,
      imageUrl: parsedData.data.imageUrl,
      static: parsedData.data.static,
    },
  });

  res.json({ id: element.id, message: "Element created successfully" });
});

adminRouter.put("/element/:elementId", adminMiddleware, async (req, res) => {
  const parsedData = UpdateElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.error("❌ Validation Error:", parsedData.error.format()); // Log detailed errors
    res.status(400).json({
      message: "Invalid data validation failed",
      errors: parsedData.error.format(),
    });
    return;
  }

  client.element.update({
    where: { id: req.params.elementId },
    data: {
      imageUrl: parsedData.data.imageUrl,
    },
  });

  res.json({ message: "Element updated successfully" });
});

adminRouter.get("/avtar", adminMiddleware, async (req, res) => {
  const parsedData = CreateAvatarSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.error("❌ Validation Error:", parsedData.error.format()); // Log detailed errors
    res.status(400).json({
      message: "Invalid data validation failed",
      errors: parsedData.error.format(),
    });
    return;
  }

  const avatar = await client.avatar.create({
    data: { name: parsedData.data.name, imageUrl: parsedData.data.imageUrl },
  });

  res.json({ id: avatar.id, message: "Avatar created successfully" });
});

adminRouter.get("/map", adminMiddleware, async (req, res) => {
  const parsedData = CreateMapSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.error("❌ Validation Error:", parsedData.error.format()); // Log detailed errors
    res.status(400).json({
      message: "Invalid data validation failed",
      errors: parsedData.error.format(),
    });
    return;
  }

  const map = await client.map.create({
    data: {
      name: parsedData.data.name,
      width: Number(parsedData.data.dimensions.split("x")[0]),
      height: Number(parsedData.data.dimensions.split("x")[1]),
      thumbnail: parsedData.data.thumbnail,
      mapElements: {
        create: parsedData.data.defaultElements.map((e) => ({
          elementId: e.elementId,
          x: e.x,
          y: e.y,
        })),
      },
    },
  });

  res.json({ id: map.id });
});
