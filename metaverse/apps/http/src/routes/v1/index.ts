import {
  Request,
  Response,
  Router,
  type Router as ExpressRouter,
} from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SignupSchema } from "../../types";
import client from "@repo/db/client";

export const router: ExpressRouter = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const parseData = SignupSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({ message: "Invalid data validation failed" });
    return;
  }

  try {
    const user = await client.user.create({
      data: {
        username: parseData.data.username,
        password: parseData.data.password,
        role: parseData.data.type === "admin" ? "Admin" : "User",
      },
    });

    res.json({ userID: user.id });
  } catch (error) {
    res.status(400).json({ message: "user already exist" });
  }
});

router.post("/signin", (req, res) => {
  res.json({ message: "Signin" });
});

router.get("/elements", (req, res) => {
  res.json({ message: "Elements" });
});

router.get("/avatars", (req, res) => {
  res.json({ message: "Elements" });
});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
