import * as retreatService from '../models/Retreat.js';
import { logger } from '../utils/logger.js';

// Get all retreats
export const getRetreats = async (req, res) => {
  try {
    const retreats = await retreatService.getAllRetreats();
    
    res.json({
      success: true,
      count: retreats.length,
      retreats,
    });
  } catch (error) {
    logger.error('Error fetching retreats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch retreats',
    });
  }
};

// Get retreat by ID
export const getRetreatById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const retreat = await retreatService.getRetreatById(id);
    
    if (!retreat) {
      return res.status(404).json({
        success: false,
        error: 'Retreat not found',
      });
    }
    
    res.json({
      success: true,
      retreat,
    });
  } catch (error) {
    logger.error('Error fetching retreat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch retreat',
    });
  }
};

// Create retreat
export const createRetreat = async (req, res) => {
  try {
    const retreatData = req.body;
    
    const retreat = await retreatService.createRetreat(retreatData);
    
    res.status(201).json({
      success: true,
      message: 'Retreat created successfully',
      retreat,
    });
  } catch (error) {
    logger.error('Error creating retreat:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(e => e.message).join(', '),
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create retreat',
    });
  }
};

// Update retreat
export const updateRetreat = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const retreat = await retreatService.updateRetreat(id, updateData);
    
    if (!retreat) {
      return res.status(404).json({
        success: false,
        error: 'Retreat not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Retreat updated successfully',
      retreat,
    });
  } catch (error) {
    logger.error('Error updating retreat:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(e => e.message).join(', '),
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update retreat',
    });
  }
};

// Delete retreat
export const deleteRetreat = async (req, res) => {
  try {
    const { id } = req.params;
    
    const retreat = await retreatService.deleteRetreat(id);
    
    if (!retreat) {
      return res.status(404).json({
        success: false,
        error: 'Retreat not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Retreat deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting retreat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete retreat',
    });
  }
};

