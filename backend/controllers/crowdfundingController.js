const Campaign = require('../models/campaignModel');
const { validationResult } = require('express-validator');

// @desc    Create a new campaign
// @route   POST /api/crowdfunding
// @access  Private
exports.createCampaign = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, goal_amount, category, end_date } = req.body;
        
        const newCampaign = new Campaign({
            title,
            description,
            goal_amount,
            current_amount: 0,
            category,
            end_date: new Date(end_date),
            creator_id: req.user._id
        });

        const savedCampaign = await newCampaign.save();
        res.status(201).json(savedCampaign);
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ message: 'Server error while creating campaign' });
    }
};

// @desc    Update a campaign
// @route   PUT /api/crowdfunding/:id
// @access  Private (Creator only)
exports.updateCampaign = async (req, res) => {
    try {
        const { title, description, goal_amount, category, end_date } = req.body;
        
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        if (campaign.creator_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this campaign' });
        }

        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                goal_amount,
                category,
                end_date: new Date(end_date)
            },
            { new: true }
        );

        res.json(updatedCampaign);
    } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).json({ message: 'Server error while updating campaign' });
    }
};

// @desc    Delete a campaign
// @route   DELETE /api/crowdfunding/:id
// @access  Private (Creator or Admin)
exports.deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        if (campaign.creator_id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this campaign' });
        }

        await Campaign.findByIdAndDelete(req.params.id);
        res.json({ message: 'Campaign removed successfully' });
    } catch (error) {
        console.error('Error deleting campaign:', error);
        res.status(500).json({ message: 'Server error while deleting campaign' });
    }
};
