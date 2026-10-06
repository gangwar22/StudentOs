import mongoose from 'mongoose';

export const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('MongoDB configuration is missing. Set MONGODB_URI before starting the server.');
  }

  try {
    const options = /^mongodb\+srv:\/\//i.test(mongoUri) && !/[?&]authSource=/i.test(mongoUri)
      ? { authSource: 'admin' }
      : {};
    await mongoose.connect(mongoUri, options);
    console.log('✅ Connected to MongoDB Atlas (Learning_Data)');
  } catch (error) {
    if (error?.code === 18 || /authentication failed/i.test(error?.message || '')) {
      console.error('MongoDB authentication failed. Check the database user, password, authSource, and URL-encode reserved characters in MONGODB_URI credentials.');
    } else {
      console.error(`MongoDB connection failed: ${error.message}`);
      console.error('Check MONGODB_URI and Atlas network access settings.');
    }
    throw error;
  }
};
