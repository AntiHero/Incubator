import mongoose from 'mongoose';

const connectToDb = async (uri: string) => {
  await mongoose.connect(uri);
};

export default connectToDb;
