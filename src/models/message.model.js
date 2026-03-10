const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
{
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true
  },

  sender: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    username: {
      type: String,
      required: true
    }
  },

  content: {
    type: String,
    required: true,
    trim: true
  }

},
{
  timestamps: true
}
);



messageSchema.index({ projectId: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);