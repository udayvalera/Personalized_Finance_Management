const express = require("express");
const router = express.Router();

const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend, getPendingRequests } = require("../controllers/social/friendController");
const { 
  createCampaign,
  getActiveCampaigns,
  getPendingCampaigns,
  moderateCampaign,
  supportCampaign
} = require("../controllers/social/CrowdfundingController");

router.post("/sendFriendRequest", sendFriendRequest);
router.post("/acceptFriendRequest", acceptFriendRequest);
router.post("/rejectFriendRequest", rejectFriendRequest);
router.get("/getPendingRequests", getPendingRequests);

// Crowdfunding routes
router.post("/crowdfunding", createCampaign);
router.get("/crowdfunding/active", getActiveCampaigns);
router.get("/crowdfunding/pending", getPendingCampaigns);
router.put("/crowdfunding/:campaignId/moderate", moderateCampaign);
router.post("/crowdfunding/:campaignId/support", supportCampaign);

module.exports = router;
