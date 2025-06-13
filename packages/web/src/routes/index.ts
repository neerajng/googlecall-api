import { Router } from "express";
import googleAuthRouter from "./googleAuthRouter";
import calendarRouter from "./calendarRouter";
import phoneRouter from "./phoneRouter";

const apiRouter: Router = Router();

apiRouter.use("/v1/auth", googleAuthRouter);
apiRouter.use("/v1/calendar", calendarRouter);
apiRouter.use("/v1/phone", phoneRouter);

export default apiRouter;

