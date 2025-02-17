import client from "@repo/db/client";
import { Router, type Router as ExpressRouter } from "express";
import {
  AddElementSchema,
  CreateElementSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
} from "../../types";
import { userMiddleware } from "../../middleware/user";

export const spaceRouter: ExpressRouter = Router();

spaceRouter.use(userMiddleware);

spaceRouter.post("/", async (req, res) => {
  const parsedData = CreateSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.error(
      "❌ CreateSpaceSchema Validation Error:",
      parsedData.error.format()
    ); // Log detailed errors
    res.status(400).json({
      message: "Invalid data validation failed for CreateSpaceSchema",
      errors: parsedData.error.format(),
    });
    return;
  }

  if (!parsedData.data.mapId) {
    const space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: Number(parsedData.data.dimensions.split("x")[0]),
        height: Number(parsedData.data.dimensions.split("x")[1]),
        creatorId: req.userId,
      },
    });
    res.json({ message: "Space created successfully", spaceId: space.id });
    return;
  }

  const map = await client.map.findUnique({
    where: { id: parsedData.data.mapId },
    select: {
      mapElements: true,
      width: true,
      height: true,
    },
  });
  console.log("MAP FOUND", map);

  if (!map) {
    console.log("map not found");
    res.status(404).json({ message: "Map not found" });
    return;
  }

  let space = await client.$transaction(async (tx) => {
    const createdSpace = await tx.space.create({
      data: {
        name: parsedData.data.name,
        width: map.width,
        height: map.height,
        creatorId: req.userId,
      },
    });

    console.log("SPACE CREATED", createdSpace);

    await tx.spaceElements.createMany({
      data: map.mapElements.map((e) => ({
        spaceId: createdSpace.id,
        elementId: e.elementId,
        x: e.x!,
        y: e.y!,
      })),
    });

    return createdSpace;
  });

  res.json({ message: "Space created successfully", spaceId: space.id });
});

spaceRouter.delete("/:spaceId", async (req, res) => {
  const space = await client.space.findUnique({
    where: {
      id: req.params.spaceId,
    },
    select: {
      creatorId: true,
    },
  });

  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }

  if (space?.creatorId !== req.userId) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  await client.space.delete({
    where: {
      id: req.params.spaceId,
    },
  });

  res.json({ message: "Space deleted successfully" });
});

spaceRouter.get("/all", async (req, res) => {
  const spaces = await client.space.findMany({
    where: {
      creatorId: req.userId,
    },
  });

  if (!spaces) {
    res.status(400).json({ message: "No spaces found" });
    return;
  }

  res.json({
    spaces: spaces.map((s) => ({
      id: s.id,
      name: s.name,
      thumbnail: s.thumbnail,
      dimensions: `${s.width}x${s.height}`,
    })),
  });
});

spaceRouter.post("/elmement", async (req, res) => {
  const parsedData = AddElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.error("❌ Validation Error:", parsedData.error.format()); // Log detailed errors
    res.status(400).json({
      message: "Invalid data validation failed",
      errors: parsedData.error.format(),
    });
    return;
  }

  const space = await client.space.findUnique({
    where: {
      id: parsedData.data.spaceId,
      creatorId: req.userId,
    },
    select: {
      width: true,
      height: true,
    },
  });

  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }

  await client.spaceElements.create({
    data: {
      spaceId: parsedData.data.spaceId,
      elementId: parsedData.data.elementId,
      x: parsedData.data.x,
      y: parsedData.data.y,
    },
  });

  res.json({ message: "Element added successfully" });
});

spaceRouter.delete("/elmement", async (req, res) => {
  const parsedData = DeleteElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.error("❌ Validation Error:", parsedData.error.format()); // Log detailed errors
    res.status(400).json({
      message: "Invalid data validation failed",
      errors: parsedData.error.format(),
    });
    return;
  }

  const spaceElement = await client.spaceElements.findFirst({
    where: {
      id: parsedData.data.id,
    },
    include: {
      space: true,
    },
  });

  if (
    !spaceElement?.space.creatorId ||
    spaceElement.space.creatorId !== req.userId
  ) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  await client.spaceElements.delete({
    where: {
      id: parsedData.data.id,
    },
  });
});

spaceRouter.get("/:spaceId", async (req, res) => {
  const space = await client.space.findUnique({
    where: {
      id: req.params.spaceId,
    },
    include: {
      elements: { include: { element: true } },
    },
  });

  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }

  res.json({
    dimensions: `${space.width}x${space.height}`,
    elements: space.elements.map((e) => ({
      id: e.id,
      element: {
        id: e.element.id,
        imageUrl: e.element.imageUrl,
        width: e.element.width,
        height: e.element.height,
        static: e.element.static,
      },
      x: e.x,
      y: e.y,
    })),
  });
});
