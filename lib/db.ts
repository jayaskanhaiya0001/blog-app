import mongoose from 'mongoose';    
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://jayaskanhaiya0001:Kan987@#@cluster0.q2q05kw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
};

export default connectDB;