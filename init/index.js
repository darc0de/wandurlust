

const mongoose = require("mongoose");
// require data
const initData = require('./data.js');
// require model
const Listing = require('../models/listing.js');

const dbUrl = process.env.ATLAS_URL;

main().then((res)=> {
    console.log("Connected to db");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb+srv://darshan-first:P4sIQEcvAlKJd530@cluster0.eqwphzy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

const initDb = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "67e197e5e9ee2c8ed546857e"}));
    await Listing.insertMany(initData.data); // initData.data = sampleListing
    console.log("Data was initialized");
}

initDb();
