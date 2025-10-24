import express from "express";
import mongoose from "mongoose";
import { imagesUpload } from "../multer";
import Cocktail from "../models/Cocktail";
import auth from "../middleware/auth";
import permit from "../middleware/permit";
import { RequestWithUser } from "../types.db";

const cocktailsRouter = express.Router();

cocktailsRouter.get("/", async (req, res) => {
    try {
        const filter: Record<string, unknown> = {};

        if (req.query.user) {
            filter.user = req.query.user;
        } else {
            filter.isPublished = true;
        }

        const cocktails = await Cocktail.find(filter)
            .populate("user", "username displayName avatar")
            .sort({ _id: -1 });

        res.send(cocktails);
    } catch {
        res.sendStatus(500);
    }
});

cocktailsRouter.get("/my", auth, async (req, res) => {
    const userReq = req as RequestWithUser;
    try {
        const cocktails = await Cocktail.find({ user: userReq.user._id })
            .populate("user", "username displayName avatar")
            .sort({ _id: -1 });

        res.send(cocktails);
    } catch {
        res.sendStatus(500);
    }
});

cocktailsRouter.get("/unpublished", auth, permit("admin"), async (req, res) => {
    try {
        const cocktails = await Cocktail.find({ isPublished: false })
            .populate("user", "username displayName avatar")
            .sort({ _id: -1 });

        res.send(cocktails);
    } catch {
        res.sendStatus(500);
    }
});

cocktailsRouter.get("/:id", async (req, res) => {
    try {
        const cocktail = await Cocktail.findById(req.params.id)
            .populate("user", "username displayName avatar")
            .populate("ratings.user", "username displayName avatar");

        if (!cocktail) {
            return res.status(404).send({ error: "Cocktail not found" });
        }

        res.send(cocktail);
    } catch {
        res.sendStatus(500);
    }
});

cocktailsRouter.post("/", auth, imagesUpload.single("image"), async (req, res) => {
    const userReq = req as RequestWithUser;
    try {
        const { title, recipe, ingredients } = userReq.body;

        const cocktail = await Cocktail.create({
            user: userReq.user._id,
            title,
            recipe,
            isPublished: false,
            ingredients: JSON.parse(ingredients),
            image: userReq.file ? userReq.file.filename : null,
            ratings: []
        });

        res.send({
            ...cocktail.toJSON(),
            message: "Ваш коктейль находится на рассмотрении модератора"
        });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send({ error: error.message });
        }
        res.sendStatus(500);
    }
});

cocktailsRouter.patch("/:id/publish", auth, permit("admin"), async (req, res) => {
    try {
        const cocktail = await Cocktail.findByIdAndUpdate(
            req.params.id,
            { isPublished: true },
            { new: true }
        ).populate("user", "username displayName avatar");

        if (!cocktail) {
            return res.status(404).send({ error: "Cocktail not found" });
        }

        res.send(cocktail);
    } catch {
        res.sendStatus(500);
    }
});

cocktailsRouter.post("/:id/rate", auth, async (req, res) => {
    const userReq = req as RequestWithUser;
    try {
        const { rating } = userReq.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).send({ error: "Rating must be between 1 and 5" });
        }

        const cocktail = await Cocktail.findById(userReq.params.id);

        if (!cocktail) {
            return res.status(404).send({ error: "Cocktail not found" });
        }

        const existingRatingIndex = cocktail.ratings.findIndex(
            r => r.user.toString() === userReq.user._id.toString()
        );

        if (existingRatingIndex !== -1) {
            cocktail.ratings[existingRatingIndex].rating = rating;
        } else {
            cocktail.ratings.push({
                user: userReq.user._id,
                rating
            });
        }

        await cocktail.save();

        const updatedCocktail = await Cocktail.findById(userReq.params.id)
            .populate("user", "username displayName avatar")
            .populate("ratings.user", "username displayName avatar");

        res.send(updatedCocktail);
    } catch {
        res.sendStatus(500);
    }
});

cocktailsRouter.delete("/:id", auth, async (req, res) => {
    const userReq = req as RequestWithUser;
    try {
        const cocktail = await Cocktail.findById(userReq.params.id);

        if (!cocktail) {
            return res.status(404).send({ error: "Cocktail not found" });
        }

        if (userReq.user.role !== "admin" &&
            cocktail.user.toString() !== userReq.user._id.toString()) {
            return res.status(403).send({ error: "You can only delete your own cocktails" });
        }

        await Cocktail.findByIdAndDelete(userReq.params.id);

        res.send({ message: "Cocktail deleted successfully" });
    } catch {
        res.sendStatus(500);
    }
});

export default cocktailsRouter;
