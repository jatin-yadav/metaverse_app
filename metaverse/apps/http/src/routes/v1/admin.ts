import client from "@repo/db/client";
import {
  Router,
  type Router as ExpressRouter,
  Request,
  Response,
} from "express";
import {
  AddElementSchema,
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
  UpdateElementSchema,
} from "../../types";
import { adminMiddleware } from "../../middleware/admin";

export const adminRouter: ExpressRouter = Router();

adminRouter.use(adminMiddleware);

adminRouter.post("/element", async (req: Request, res: Response) => {
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

adminRouter.put("/element/:elementId", async (req, res, next) => {
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

adminRouter.post("/avatar", async (req, res, next) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized: User ID missing" });
      return;
    }
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if (!parsedData.success) {
      console.error("❌ Avatar Validation Error:", parsedData.error.format()); // Log detailed errors
      res.status(400).json({
        message: "Invalid data validation failed",
        errors: parsedData.error.format(),
      });
      return;
    }

    const avatar = await client.avatar.create({
      data: {
        name: parsedData.data.name,
        imageUrl: parsedData.data.imageUrl,
      },
    });

    res.json({ avatarId: avatar.id, message: "Avatar created successfully" });
  } catch (error) {
    console.error("❌ Error creating avatar:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Internal server error", error: errorMessage });
  }
});

adminRouter.get("/map", async (req, res, next) => {
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
