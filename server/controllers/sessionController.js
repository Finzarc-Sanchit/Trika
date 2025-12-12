import * as sessionService from '../models/Session.js';
import { logger } from '../utils/logger.js';

// Get all sessions
export const getSessions = async (req, res) => {
  try {
    const { category } = req.query;
    const filters = category ? { category } : {};
    
    const sessions = await sessionService.getAllSessions(filters);
    
    res.json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    logger.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sessions',
    });
  }
};

// Get session by ID
export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await sessionService.getSessionById(id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }
    
    res.json({
      success: true,
      session,
    });
  } catch (error) {
    logger.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session',
    });
  }
};

// Create session
export const createSession = async (req, res) => {
  try {
    const sessionData = req.body;
    
    const session = await sessionService.createSession(sessionData);
    
    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      session,
    });
  } catch (error) {
    logger.error('Error creating session:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Session with this value already exists',
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(e => e.message).join(', '),
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create session',
    });
  }
};

// Update session
export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const session = await sessionService.updateSession(id, updateData);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Session updated successfully',
      session,
    });
  } catch (error) {
    logger.error('Error updating session:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(e => e.message).join(', '),
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update session',
    });
  }
};

// Delete session
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await sessionService.deleteSession(id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete session',
    });
  }
};

