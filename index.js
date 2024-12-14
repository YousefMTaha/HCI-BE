import dotenv from "dotenv";
import express from "express";
import initApp from "./src/index.router.js";
dotenv.config();
const app = express();
import cors from "cors";
import morgan from "morgan";
app.use(express.json());
app.use(morgan("tiny"), (req, res, next) => {
  console.log("body", req.body);
  console.log("param", req.params);
  console.log("query", req.query);
  // console.log("headers", req.headers);

  next();
});

// setup port and the baseUrl
const port = process.env.PORT || 5000;
app.use(cors());

initApp(app, express);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
