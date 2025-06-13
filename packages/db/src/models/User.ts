import mongoose, { Document, Schema } from "mongoose";

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  status?: string;
  htmlLink?: string;
  description?: string;
}

export interface IUser extends Document {
  uuid: string;
  name: string;
  email: string;
  picture: string;
  phone?: string;
  events?: GoogleCalendarEvent[]; // ✅ add this line
  createdOn: Date;
  updatedOn: Date;
}

const UserSchema: Schema = new Schema(
  {
    uuid: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String, required: true },
    phone: { type: String },
    events: [
      {
        id: String,
        summary: String,
        start: {
          dateTime: String,
          date: String,
        },
        end: {
          dateTime: String,
          date: String,
        },
        status: String,
        htmlLink: String,
        description: String,
      }
    ], // ✅ add this field
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
  },
  {
    collection: "users",
  }
);

export default mongoose.model<IUser>("users", UserSchema);
