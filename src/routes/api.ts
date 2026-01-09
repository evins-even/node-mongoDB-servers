import { Router } from "express";
import backend from "./backend/backend";

const apiRoutes = Router();

apiRoutes.use("/backend", backend);

export default apiRoutes;