import {
  Request,
  Response,
  Router,
  type Router as ExpressRouter,
} from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SigninSchema, SignupSchema } from "../../types";
import client from "@repo/db/client";
import { hash, compare } from "../../scrypt";
import jwt from "jsonwebtoken";
import { JWT_SCRETE_KEY } from "../../config";
import { log } from "node:console";
export const router: ExpressRouter = Router();

router.post("/signup", async (req: Request, res: Response) => {
  console.log("req body", req.body);
  const parsedData = SignupSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.error("❌ Validation Error:", parsedData.error.format()); // Log detailed errors
    res.status(400).json({
      message: "Invalid data validation failed",
      errors: parsedData.error.format(),
    });
    return;
  }

  const hashedPassword = await hash(parsedData.data.password);

  try {
    const user = await client.user.findFirst({
      where: {
        username: parsedData.data.username,
      },
    });

    if (user) {
      res.status(400).json({ message: "User allready exists" });
      return;
    }

    const newuser = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.type == "admin" ? "Admin" : "User",
      },
    });

    res.status(200).json({ userID: newuser.id });
  } catch (error) {
    console.log("ERROR:=======>", error);
    res.status(400).json({ message: "server error somthing went wrong" });
  }
});

router.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.error("❌ Validation Error:", parsedData.error.format()); // Log detailed errors
    res.status(400).json({
      message: "Invalid data validation failed",
      errors: parsedData.error.format(),
    });
    return;
  }

  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    const isValid = await compare(parsedData.data.password, user.password);

    if (!isValid) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      { userID: user.id, role: user.role },
      JWT_SCRETE_KEY
    );

    res.status(200).json({ token });
  } catch (error) {
    console.log("ERROR:=======>", error);
    res.status(400).json({ message: "somthing went wrong" });
  }
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
