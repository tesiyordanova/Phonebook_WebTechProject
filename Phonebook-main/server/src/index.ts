import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"
import mongoose from "mongoose";
import contactsController from "./api/contacts/contactsController";
import authController from "./api/auth/authController";
import cookieParser from "cookie-parser";
import multer from "multer";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());

app.use('/content', express.static(__dirname + '/content'));
const upload = multer({ dest: __dirname + "/uploads/"})

app.use("/api/contacts", contactsController);
app.use("/api/auth", authController);

app.listen(PORT, async () => {
  console.log(process.env.DATABASE_CONNECTION_STRING);
  await mongoose.connect(process.env.DATABASE_CONNECTION_STRING as string);

  console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
  throw new Error(error.message);
});
