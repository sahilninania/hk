if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "../.env" });
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;   

async function main() {
    await mongoose.connect(dbUrl || "mongodb://127.0.0.1:27017/eventrix");
}

main()
    .then(() => {
    console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
});
 
const initDB = async () => {
    await Listing.deleteMany({});                   // Pehla ka koi data agr hoga wanderlust DB ke Listing collection mai tho vo delete ho jaega.
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner : "68d28c6ffffaab0f7573adf3",
    }));
    await Listing.insertMany(initData.data);        // fir hum Listing collection mai initData (jo ki ek object hai) usme data naam ki key ko access karenge.Check data.js ka last part module.exports wala.
    console.log("data was initialized");
};

initDB();

initDB();