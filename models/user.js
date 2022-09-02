const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        bio: {
            type: String,
        },

        profilePicture: {
            type: String,
            default: "",
        },

        coverPicture: {
            type: String,
            default: "",
        },

        followings: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "User",
                required: true,
            },
        ],

        followers: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "User",
                required: true,
            },
        ],

        city: {
            type: String,
            default: "",
        },

        from: {
            type: String,
            default: "",
        },

        relationship: {
            type: String,
            enum: ["single", "married", "in a relationship"],
            default: "single",
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

userSchema.methods.generateToken = function () {
    const token = jwt.sign({ id: this.id }, process.env.SecretKey);
    return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
