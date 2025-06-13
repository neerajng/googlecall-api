import DB from "@googlecall/db"
import twilio from 'twilio';

const checkForCalling = async () => {
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log("Checking for upcoming events...", process.env.TWILIO_ACCOUNT_SID);

    // 1. Get current time and 5 minutes from now
    const now = new Date();
    const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);
    
    // 2. Get upcoming events from database
    const events = await DB.auth.checkEvents(process.env.CURRENT_USER_ID! ,now, fiveMinutesLater);
    
    // 3. Call the user
    if (events.count > 0 && events.phone) {
      const message = `Reminder: You have an event starting soon. Title: ${events.firstEvent.summary}.`;

      console.log(process.env.TWILIO_PHONE_NUMBER,`Calling ${events.phone}...`);

      const call = await client.calls.create({
        twiml: `<Response><Say voice="alice">${message}</Say></Response>`,
        to: `+91${events.phone}`, // Add country code if needed
        from: process.env.TWILIO_PHONE_NUMBER!,
      });

      console.log(`Call initiated. SID: ${call.sid}`);
    } else {
      console.log("No upcoming events or missing phone number.");
    }    
    
  } catch (error) {
    console.error("Error in checkUpcomingEvents:", error);
  }
};

const TwilioCall = { checkForCalling };

export default TwilioCall;
