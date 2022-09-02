const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Conversation = require("../models/conversation");
const Message = require("../models/message");

router.post("/:id", auth, async (req, res) => {
    try {
        if (req.user.id == req.params.id) {
            res.status(400).json({ msg: "You cant chat with yourself" });
            return;
        }
        var conversation = await Conversation.findOne({
            $or: [
                { members: [req.user.id, req.params.id] },
                { members: [req.params.id, req.user.id] },
            ],
        });
        if (!conversation) {
            conversation = new Conversation({
                members: [req.user.id, req.params.id],
            });
        }
        await conversation.save();

        const message = await Message.create({
            conversationId: conversation.id,
            senderId: req.user.id,
            message: req.body.message,
        });

        const createdMessage = await Message.findById(message.id).populate(
            "senderId"
        );

        res.status(200).json(createdMessage);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const coversations = await Conversation.find({
            members: { $in: [req.user.id] },
        }).sort("-created_at");
        res.status(200).json(coversations);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        if (req.user.id == req.params.id) {
            res.status(400).json({ msg: "You cant chat with yourself" });
            return;
        }
        var conversation = await Conversation.findOne({
            $or: [
                { members: [req.user.id, req.params.id] },
                { members: [req.params.id, req.user.id] },
            ],
        });

        if (!conversation) {
            conversation = new Conversation({
                members: [req.user.id, req.params.id],
            });
        }
        await conversation.save();

        const messages = await Message.find({
            conversationId: conversation.id,
        }).populate("senderId");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
