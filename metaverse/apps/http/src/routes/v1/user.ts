import { Router, type Router as ExpressRouter } from "express";
import { UpdateMetadataSchema } from "../../types";
import { userMiddleware } from "../../middleware/user";
import client from "@repo/db/client";

export const userRouter: ExpressRouter = Router();
userRouter.use(userMiddleware);

userRouter.post("/metadata", async (req, res) => {
  const parsedData = UpdateMetadataSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.error("❌ Validation Error:", parsedData.error.format()); // Log detailed errors
    res.status(400).json({
      message: "Invalid data validation failed",
      errors: parsedData.error.format(),
    });
    return;
  }

  const avatar = await client.avatar.findUnique({
    where: { id: parsedData.data.avatarId },
  });

  if (!avatar) {
    res.status(400).json({ message: "avatar doesn't exist" });
    return;
  }
  await client.user.update({
    where: { id: req.userId },
    data: {
      avatarId: parsedData.data.avatarId,
    },
  });

  res.json({ message: "Metadata updated successfully" });
});

userRouter.get("/metadata/bluk", async (req, res) => {
  const userIdString = req.query.userId as string;
  const userIds = userIdString.slice(1, userIdString?.length - 2).split(",");

  const metadata = await client.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: { avatarId: true },
  });

  res.json({
    avatars: metadata.map((m: any) => ({
      userId: m.id,
      avatarId: m.avatarId?.imageUrl,
    })),
  });
});
