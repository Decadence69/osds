import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    message:{
        type: String,
        required: true
    }
})

const Message = mongoose.model("Message", messageSchema);

export default Message;