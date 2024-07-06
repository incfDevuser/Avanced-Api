import express from "express";
import fs from 'fs'
import jewerlyRoutes from "./routes/jewerlyRoutes.js";
import dotenv from 'dotenv'
dotenv.config()
const app = express();
const port = process.env.PORT

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});
const logActivity = (req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFile("activity.log", log, (err) => {
    if (err) {
      console.error("Error al escribir en el archivo de log", err);
    }
  });
  next();
};
app.use(logActivity)
app.use("/", jewerlyRoutes);
