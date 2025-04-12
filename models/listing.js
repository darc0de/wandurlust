
const mongoose = require("mongoose")
const Schema = mongoose.Schema; // for not writing mongoose.schema for again and again
const Review = require('./review.js');
const User = require('./user.js');
const { number, required } = require("joi");


const listingSchema = Schema({  // listingSchema is Schema
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        filename: {type: String},
        url: {
            type: String,
            default: "https://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/nebula_blue.s2014.png",
            set: (v) => v === " " ? "https://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/nebula_blue.s2014.png" : v,
        }
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },

    geomentry: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        }, 

        coordinates: {
            type: [Number], 
            required: true
        }
    }
});

// Listing is Model  
const Listing = mongoose.model("Listing", listingSchema);   

// --------------------------------------//
    listingSchema.post('findOneAndDelete', async(listing) => {
        if(listing.reviews.length){
            const result = await Review.deleteMany({_id: { $in: listing.reviews}});
            console.log(result);
        }
    });
// --------------------------------------//


module.exports = Listing;