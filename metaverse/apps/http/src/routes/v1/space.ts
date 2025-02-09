import client from "@repo/db/client";
import { Router, type Router as ExpressRouter } from "express";
import { CreateSpaceSchema } from "../../types";

export const spaceRouter: ExpressRouter = Router();

spaceRouter.post("/", async (req, res) => {
  const parsedData = CreateSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.error("❌ Validation Error:", parsedData.error.format()); // Log detailed errors
    res.status(400).json({
      message: "Invalid data validation failed",
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
  if (!map) {
    res.status(404).json({ message: "Map not found" });
    return;
  }

  let space = await client.$transaction(async () => {
    const space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: map.width,
        height: map.height,
        creatorId: req.userId,
      },
    });

    await client.spaceElements.createMany({
      data: map.mapElements.map((e) => ({
        spaceId: space.id,
        elementId: e.elementId,
        x: e.x!,
        y: e.y!,
      })),
    });

    return space;
  });

  res.json({ message: "Space created successfully", spaceId: space.id });
});

spaceRouter.delete("/:spaceId", (req, res) => {});

spaceRouter.get("/all", (req, res) => {});

spaceRouter.post("/elmement", (req, res) => {});

spaceRouter.delete("/elmement", (req, res) => {});

spaceRouter.get("/:spaceId", (req, res) => {});
