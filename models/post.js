const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },

        post: {
            type: String,
            required: true,
        },

        image: {
            type: String,
        },

        comments: [
            {
                user: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "User",
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                },
                created_at: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        likes: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "User",
                required: true,
            },
        ],

        dislikes: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "User",
                required: true,
            },
        ],
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
