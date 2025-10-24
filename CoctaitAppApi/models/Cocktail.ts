import mongoose, {model} from "mongoose";
import User from "./User";
import {Cocktails} from "../types.db";

const Schema = mongoose.Schema;

const CocktailSchema = new Schema<Cocktails>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
            validator: async (value: mongoose.Types.ObjectId) => {
                const user = await User.findById(value);
                return Boolean(user);
            },
            message: 'User not found',
        }
    },
    title:{
        type: String,
        required: true,
    },
    image:String,
    recipe:{
        type: String,
        required: true,
    },
    isPublished:{
        type: Boolean,
        default: false,
        required: true,
    },
    ingredients:[{
        name:{ type: String, required: true },
        amount: {type: String, required: true},
    }],
    ratings: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        }
    }]
});

CocktailSchema.virtual('averageRating').get(function() {
    if (this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / this.ratings.length;
});

CocktailSchema.virtual('ratingsCount').get(function() {
    return this.ratings.length;
});

CocktailSchema.set('toJSON', { virtuals: true });
CocktailSchema.set('toObject', { virtuals: true });

const Cocktail = model<Cocktails>("Cocktail", CocktailSchema);

export default Cocktail;
