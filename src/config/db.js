import mongoose from "mongoose";

export async function connectDB() {
  try {
    const mongoUrl = process.env.MONGODB_URI || "mongodb+srv://marcovenegasch_db_user:DlMrVvAP7wvVziMj@cluster0.hslxwfn.mongodb.net/?appName=Cluster0";
    await mongoose.connect(mongoUrl, {
      dbName: process.env.MONGODB_DBNAME || "PROYECTOFINAL",
    });
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
}