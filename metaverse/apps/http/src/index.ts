import express from "express";
import { router } from "./routes/v1";
import { testDbConnection } from "./checkDb";

const app = express();
app.use(express.json());
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Http server is running");
});

const startServer = async () => {
  await testDbConnection();

  app.listen(3000, () => {
    console.log("🚀 Server is running on port 3000: http://localhost:3000");
  });
};

startServer();
