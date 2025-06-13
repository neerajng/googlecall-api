import app from "./app";
import Utils from "@googlecall/utils";

const PORT = Utils.getEnv("PORT") || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
