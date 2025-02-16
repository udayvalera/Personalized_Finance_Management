const User = require("../../models/User");

exports.sendFriendRequest = async (req, res) => {
  try {
    const { targetUsername } = req.body;
    const sender = await User.findById(req.user.id);
    const receiver = await User.findOne({ username: targetUsername });

    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.username === targetUsername) {
      return res
        .status(400)
        .json({ message: "Cannot send friend request to yourself" });
    }

    if (sender.friends.includes(receiver.username)) {
      return res.status(400).json({ message: "Already friends" });
    }

    await Promise.all([
      User.findByIdAndUpdate(sender._id, {
        $addToSet: { pendingRequests: receiver.username },
      }),
      User.findByIdAndUpdate(receiver._id, {
        $addToSet: { pendingRequests: sender.username },
      }),
    ]);

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requesterUsername } = req.body;
    const accepter = await User.findById(req.user.id);
    const requester = await User.findOne({ username: requesterUsername });

    await Promise.all([
      User.findByIdAndUpdate(accepter._id, {
        $pull: { pendingRequests: requesterUsername },
        $addToSet: { friends: requesterUsername },
      }),
      User.findByIdAndUpdate(requester._id, {
        $pull: { pendingRequests: accepter.username },
        $addToSet: { friends: accepter.username },
      }),
    ]);

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectFriendRequest = async (req, res) => {
  try {
    const { requesterUsername } = req.body;
    const rejecter = await User.findById(req.user.id);
    const requester = await User.findOne({ username: requesterUsername });

    await Promise.all([
      User.findByIdAndUpdate(rejecter._id, {
        $pull: { pendingRequests: requesterUsername },
      }),
      User.findByIdAndUpdate(requester._id, {
        $pull: { pendingRequests: rejecter.username },
      }),
    ]);

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("pendingRequests");

    res.status(200).json(user.pendingRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("friends");
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
