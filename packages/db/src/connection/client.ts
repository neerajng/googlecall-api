import mongoose from "mongoose";
import Utils from "@googlecall/utils";

class MongoDBClient {
  private static instance: MongoDBClient;
  private mongooseInstance: typeof mongoose | null = null;

  public static getInstance(): MongoDBClient {
    if (!MongoDBClient.instance) {
      MongoDBClient.instance = new MongoDBClient();
    }
    return MongoDBClient.instance;
  }

  public async initialize(): Promise<void> {
    if (this.mongooseInstance) {
      console.log("MongoDB is already connected.");
      return;
    }

    try {
      const uri = Utils.getEnv("MONGODB_URI");
      this.mongooseInstance = await mongoose.connect(uri, {
        maxPoolSize: 10,
        key: undefined,
        passphrase: undefined,
        pfx: undefined,
        secureProtocol: undefined,
      });
      console.log("MongoDB connected successfully.");
    } catch (error) {
      console.log(`MongoDB connection error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.mongooseInstance) {
      console.log("MongoDB is not connected.");
      return;
    }

    try {
      await mongoose.disconnect();
      this.mongooseInstance = null;
      console.log("MongoDB disconnected successfully.");
    } catch (error) {
      console.log(`MongoDB disconnection error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public getConnection(): typeof mongoose {
    if (!this.mongooseInstance) {
      throw new Error("MongoDB is not connected.");
    }
    return this.mongooseInstance;
  }
}

export default MongoDBClient.getInstance();
