import { Request, Response, NextFunction } from "express";
import Utils from "@googlecall/utils";
import DB from "@googlecall/db";

const requireToken = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const token = req.cookies.AUTHORIZATION; // 🔥 Read from cookie

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = Utils.Jwt.verifyToken(token)
    const userId :string =decoded && typeof decoded === "object" ? (decoded as any).id || "" : ""
    const user = await DB.auth.getUserById(userId);
    
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user; // attach user to request
    
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default requireToken;

