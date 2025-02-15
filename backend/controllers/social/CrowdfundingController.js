const Campaign = require('../../models/Crowdfunding');
const { validationResult } = require('express-validator');

const crowdfundingController = {
  // Create new campaign
  createCampaign: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, goal_amount, image_url, category, end_date, anonymous, proof } = req.body;
      
      const newCampaign = new Campaign({
        title,
        description,
        goal_amount,
        image_url,
        category,
        end_date,
        creator_id: req.user.id,
        creator_name: anonymous ? 'Anonymous' : req.user.username,
        anonymous,
        proof,
        status: 'pending'
      });

      const savedCampaign = await newCampaign.save();
      res.status(201).json({
        success: true,
        message: 'Campaign submitted for approval',
        campaign: savedCampaign
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating campaign',
        error: error.message
      });
    }
  },

  // Get all active campaigns with pagination
  getAllCampaigns: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const campaigns = await Campaign.find({ status: 'active' })
        .sort({ end_date: 1 })
        .skip(skip)
        .limit(limit)
        .lean();

      res.json({
        success: true,
        count: campaigns.length,
        page,
        totalPages: Math.ceil(await Campaign.countDocuments({ status: 'active' }) / limit),
        campaigns
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching campaigns',
        error: error.message
      });
    }
  },

  // Get single campaign
  getCampaignById: async (req, res) => {
    try {
      const campaign = await Campaign.findById(req.params.id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }
      res.json({ success: true, campaign });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching campaign',
        error: error.message
      });
    }
  },

  // Support a campaign
  supportCampaign: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { amount } = req.body;
      const campaign = await Campaign.findById(req.params.id);

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      if (campaign.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'Campaign is not active'
        });
      }

      if (campaign.creator_id.toString() === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot support your own campaign'
        });
      }

      campaign.current_amount += amount;
      campaign.supporter_count += 1;
      
      // Track supporters
      campaign.supporters = campaign.supporters || [];
      if (!campaign.supporters.includes(req.user.id)) {
        campaign.supporters.push(req.user.id);
      }

      await campaign.save();
      
      res.json({
        success: true,
        message: 'Thank you for your support!',
        updatedCampaign: campaign
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error supporting campaign',
        error: error.message
      });
    }
  },

  // Update campaign (creator only)
  updateCampaign: async (req, res) => {
    try {
      const campaign = await Campaign.findById(req.params.id);
      
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      if (campaign.creator_id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to update this campaign'
        });
      }

      const updates = req.body;
      const allowedUpdates = ['title', 'description', 'image_url', 'category', 'end_date', 'anonymous'];
      const validUpdates = Object.keys(updates).filter(key => allowedUpdates.includes(key));
      
      validUpdates.forEach(update => campaign[update] = updates[update]);
      await campaign.save();

      res.json({
        success: true,
        message: 'Campaign updated successfully',
        campaign
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating campaign',
        error: error.message
      });
    }
  },

  // Delete campaign (creator only)
  deleteCampaign: async (req, res) => {
    try {
      const campaign = await Campaign.findById(req.params.id);
      
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      if (campaign.creator_id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to delete this campaign'
        });
      }

      await campaign.remove();
      res.json({
        success: true,
        message: 'Campaign deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting campaign',
        error: error.message
      });
    }
  }
};

module.exports = crowdfundingController;
