const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Conversation",
            required: true,
        },
        senderId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
