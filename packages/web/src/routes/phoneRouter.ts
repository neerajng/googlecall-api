import { Router, Request, Response } from "express";
import DB from "@googlecall/db";
import Utils from "@googlecall/utils";
import requireToken from "../middlewares/requireToken";

const phoneRouter = Router();

phoneRouter.patch("/", requireToken, async (req: Request, res: Response) => {
  try {
    const userUuid = (req as any).user?.uuid;
    const {phone} = req.body;

    if (!userUuid) {
      return Utils.ApiResponse.error(res, { message: "Unauthorized" });
    }

    const updatedUser = await DB.auth.updateUser(userUuid, phone);
    
    if (!updatedUser) {
      return Utils.ApiResponse.success(res, [], "Failed to update phone number");
    }

    return Utils.ApiResponse.success(res, updatedUser, "Updated phone number");
  } catch (error) {
    console.error("Calendar Error:", error);
    Utils.ApiResponse.error(res, error);
  }
});

export default phoneRouter;
