import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(`mongodb+srv://dinhvanhoang30041998:Hg12210112@cluster0.jkyhkvc.mongodb.net/food-del`).then(() => {
        console.log("DB Connected!!!");
    })
}

