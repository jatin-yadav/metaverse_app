import { Router } from "express";

export const router = Router();

router.post("/signup", (req, res) => {
  res.json({ message: "Signup" });
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

// router.use('/user',userRouter);'
