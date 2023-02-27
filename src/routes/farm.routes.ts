import { RequestHandler, Router } from "express";
import { FarmsController } from "modules/farms/farms.controller";
import { authenticateTokenMiddleware } from "middlewares/token-authentication.middleware";

const router = Router();
const farmsController = new FarmsController();

router.use(authenticateTokenMiddleware);
router.post("/", farmsController.create.bind(farmsController) as RequestHandler);

export default router;
