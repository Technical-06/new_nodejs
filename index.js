import express from "express";
import bodyParser from "body-parser";

import usersRoutes from "./routes/users.js";

const app = express();
const PORT = 9000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", usersRoutes);

app.get("/", (req, res) => res.send("Welcome to the Users API"));

app.listen(PORT, () =>
  console.log(`server running on port: http://localhost:${PORT}`)
);
