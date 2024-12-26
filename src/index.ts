import express, { Application } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import router from "./routes";

dotenv.config();

const app: Application = express();

// Middlewares
app.use(express.json());

app.use("/api", router);

// Rutas básicas
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Manejo de errores global
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send({ error: "Something went wrong!" });
});


// Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
