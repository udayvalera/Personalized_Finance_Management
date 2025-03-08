import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Users, Clock, Plus, Share2, Heart, X } from 'lucide-react';
import axios from 'axios';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  image_url: string;
  category: string;
  end_date: string;
  creator_id: string;
  creator_name: string;
  supporter_count: number;
  created_at: string;
}

export default function Crowdfunding() {
  const { user, token } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_amount: 0,
    image_url: '',
    category: '',
    end_date: ''
  });

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'technology', label: 'Technology' },
    { id: 'business', label: 'Business' },
    { id: 'education', label: 'Education' },
    { id: 'community', label: 'Community' },
    { id: 'environment', label: 'Environment' }
  ];

  useEffect(() => {
    fetchCampaigns();
  }, [selectedCategory]);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/v1/social/crowdfunding/active', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        
      );
      setCampaigns(response.data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (endDate: string) => {
    const diff = new Date(endDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5050/api/v1/social/crowdfunding', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCampaigns((prevCampaigns) => [response.data.campaign, ...prevCampaigns]);
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        goal_amount: 0,
        image_url: '',
        category: '',
        end_date: ''
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleSupportCampaign = async (campaignId: string, amount: number) => {
    try {
      const response = await axios.post(`http://localhost:5050/api/v1/social/crowdfunding/${campaignId}/support`, { amount }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCampaigns(); // Refresh the list of campaigns
    } catch (error) {
      console.error('Failed to support campaign:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">Community-Powered Finance</h1>
            <p className="text-lg sm:text-xl mb-4 sm:mb-8">Support innovative financial projects or start your own campaign</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Start a Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-4 sm:p-6 m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create a New Campaign</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Amount ($)</label>
                    <input
                      type="number"
                      name="goal_amount"
                      value={formData.goal_amount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.filter(cat => cat.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id}>{category.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading campaigns...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={campaign.image_url}
                    alt={campaign.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 space-x-2">
                    <button 
                      onClick={() => console.log('Share campaign:', campaign.id)}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-gray-700" />
                    </button>
                    <button 
                      onClick={() => console.log('Like campaign:', campaign.id)}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {campaign.title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {campaign.creator_name}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm rounded-full">
                      {campaign.category}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 text-sm sm:text-base">
                    {campaign.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>${campaign.current_amount.toLocaleString()} raised</span>
                        <span>${campaign.goal_amount.toLocaleString()} goal</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${calculateProgress(campaign.current_amount, campaign.goal_amount)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{campaign.supporter_count} supporters</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{calculateTimeLeft(campaign.end_date)} days left</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleSupportCampaign(campaign.id, 10)} // Example: support with $10
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      Support Project
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}