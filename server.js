require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = Number(process.env.PORT || "4000");

async function startServer() {
  try {
    await connectDB(); // await lagao
    console.log("✅ Database connected");

    app.listen(PORT, (err) => {
      if (err) {
        console.log("Server Error", err);
        return process.exit(1);
      }
      console.log("Server is running on port " + PORT);
    });
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
}

startServer();
