import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import userRoute from "../routes/auth.route.js";

const app = express();
const port = process.env.PORT || 8080;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 70, // Limit each IP to 70 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/home", (req, res) => {
  res.send("Home page!");
});

app.use("/api/v1", userRoute);

app.listen(port, () => {
  console.log(`Server is started on ${port}`);
});
