const express = require("express");
const router = express.Router();

const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend, getPendingRequests } = require("../controllers/social/friendController");

router.post("/sendFriendRequest", sendFriendRequest);
router.post("/acceptFriendRequest", acceptFriendRequest);
router.post("/rejectFriendRequest", rejectFriendRequest);
router.post("/cancelFriendRequest", cancelFriendRequest);
router.post("/removeFriend", removeFriend);
router.get("/getPendingRequests", getPendingRequests);

module.exports = router;