//mongoose it connect nodejs with database
import mongoose from 'mongoose'
import colors from 'colors'

const connectDB= async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to mongodb Database ${mongoose.connection.host}`.bgMagenta.white);

    } catch(error){
        console.log(`Mongodb Error ${erro}`.bgRed.white);

    }
};
export default connectDB;