const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        members: [
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

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
