import { Router, Request, Response } from "express";
import { google } from "googleapis";
import App from "@googlecall/app";
import Utils from "@googlecall/utils";

const googleAuthRouter = Router();

googleAuthRouter.get("/social/:service", async (req: Request, res: Response) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.CALLBACK_URI,
    );

    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/calendar"
    ];

    const { service } = req.params;

    if (service === "google") {
      const url = oauth2Client.generateAuthUrl({
        scope: scopes,
      });
      return res.redirect(url);
    } else {
      return res.redirect("/_not-found");
    }
  } catch (error) {
    console.error(error);
    Utils.ApiResponse.error(res, error);
  }
});

googleAuthRouter.get("/callback/:service", async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const code = req.query.code as string;

    if (service !== "google") {
      return res.redirect("/_not-found");
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.CALLBACK_URI,
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userInfo = await google.oauth2("v2").userinfo.get({ auth: oauth2Client });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const now = new Date().toISOString();    
    const calendarConfig = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now,
      maxResults: 5,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = calendarConfig.data.items || [];
    console.log(events)

    if (userInfo.status !== 200) {
      throw { statusCode: 404, message: "userInfo not found" };
    }
    const response = await App.auth.getAuth(userInfo,events );
    const jwtToken = Utils.Jwt.createToken(response.uuid);
    res.cookie("AUTHORIZATION", jwtToken, {
      httpOnly: true, // JS can't access it
      secure: process.env.NODE_ENV === "production", // only HTTPS in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Utils.ApiResponse.success(res, response, "Authentication successful");
    return res.redirect(process.env.FRONTEND_ACCESS!);
  } catch (error) {
    console.error(error);
    // Utils.ApiResponse.error(res, error);
    return res.redirect(`${process.env.FRONTEND_ACCESS!}?error=auth_failed`);
  }
});

googleAuthRouter.get("/logout", async (req: Request, res: Response) => {
  try {
    res.clearCookie('AUTHORIZATION', {
      path: '/',
      domain: 'localhost', // optional
      httpOnly: true,
    });
    return res.redirect(process.env.ALLOWED_ORIGIN!);  
  } catch (error) {
    console.error(error);
    Utils.ApiResponse.error(res, error);
  }
});


export default googleAuthRouter;
