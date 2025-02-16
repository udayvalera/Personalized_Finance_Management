const Campaign = require("../../models/Crowdfunding");
const { validationResult } = require("express-validator");

// Create a new campaign
exports.createCampaign = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    description,
    goal_amount,
    image_url,
    category,
    end_date,
    proof,
    anonymous,
  } = req.body;

  try {
    const newCampaign = new Campaign({
      title,
      description,
      goal_amount,
      image_url,
      category,
      end_date,
      creator_id: anonymous ? null : req.user.id, // Set creator_id if not anonymous
      creator_name: anonymous ? null : req.user.name, // Set creator_name if not anonymous
      anonymous,
      proof,
      status: "pending", // Campaigns are created with a 'pending' status
    });

    await newCampaign.save();
    res
      .status(201)
      .json({
        message: "Campaign created successfully!",
        campaign: newCampaign,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all active campaigns (visible to the public)
exports.getActiveCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "active" });
    res.status(200).json(campaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get campaigns for moderation (only accessible by moderators)
exports.getPendingCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "pending" });
    res.status(200).json(campaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve or reject a campaign (moderator action)
exports.moderateCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const { status } = req.body; // 'active', 'suspended', or 'completed'

  if (!["active", "suspended", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    campaign.status = status;
    await campaign.save();

    res
      .status(200)
      .json({
        message: `Campaign status updated to ${status} successfully!`,
        campaign,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Support a campaign (users can donate to a campaign)
exports.supportCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.status !== "active") {
      return res
        .status(404)
        .json({ message: "Campaign not found or not active" });
    }

    campaign.current_amount += amount;
    campaign.supporter_count += 1;

    // Check if the campaign has reached its goal
    if (campaign.current_amount >= campaign.goal_amount) {
      campaign.status = "completed";
    }

    await campaign.save();

    res.status(200).json({ message: "Thank you for your support!", campaign });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
