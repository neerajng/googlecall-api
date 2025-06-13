import { Router, Request, Response } from "express";
import DB from "@googlecall/db";
import Utils from "@googlecall/utils";
import requireToken from "../middlewares/requireToken";

const calendarRouter = Router();

calendarRouter.get("/upcoming", requireToken, async (req: Request, res: Response) => {
  try {
    const userUuid = (req as any).user?.uuid;

    if (!userUuid) {
      return Utils.ApiResponse.error(res, { message: "Unauthorized" });
    }

    const user = await DB.auth.getUserById(userUuid); // Fetch user with events
    
    if (!user || !user.events) {
      return Utils.ApiResponse.success(res, [], "No upcoming events found.");
    }

    return Utils.ApiResponse.success(res, user, "Upcoming events fetched.");
  } catch (error) {
    console.error("Calendar Error:", error);
    Utils.ApiResponse.error(res, error);
  }
});

export default calendarRouter;
