import stringService from '../services/stringService.js';
import logger from '../utils/logger.js';

class StringController {
  async createString(req, res, next) {
    try {
      const { value } = req.body;
      logger.info('Processing POST /strings request');
      
      const analyzedString = stringService.createString(value);
      
      res.status(201).json(analyzedString);
      logger.info(`Successfully created string with ID: ${analyzedString.id}`);
    } catch (error) {
      logger.error(`Error in createString controller: ${error.message}`);
      next(error);
    }
  }

  async getStringByValue(req, res, next) {
    try {
      const { string_value } = req.params;
      logger.info(`Processing GET /strings/${string_value}`);
      
      const analyzedString = stringService.getStringByValue(string_value);
      
      res.status(200).json(analyzedString);
      logger.info(`Successfully retrieved string: ${string_value}`);
    } catch (error) {
      logger.error(`Error in getStringByValue controller: ${error.message}`);
      next(error);
    }
  }

  async getAllStrings(req, res, next) {
    try {
      logger.info('Processing GET /strings request');
      
      const filters = req.parsedQuery || {};
      const result = stringService.getAllStrings(filters);
      
      res.status(200).json(result);
      logger.info(`Successfully retrieved ${result.count} strings`);
    } catch (error) {
      logger.error(`Error in getAllStrings controller: ${error.message}`);
      next(error);
    }
  }

  async filterByNaturalLanguage(req, res, next) {
    try {
      const { query } = req.query;
      logger.info(`Processing natural language query: "${query}"`);
      
      const result = stringService.filterByNaturalLanguage(query);
      
      res.status(200).json(result);
      logger.info(`Successfully processed natural language query`);
    } catch (error) {
      logger.error(`Error in filterByNaturalLanguage controller: ${error.message}`);
      next(error);
    }
  }

  async deleteString(req, res, next) {
    try {
      const { string_value } = req.params;
      logger.info(`Processing DELETE /strings/${string_value}`);
      
      stringService.deleteStringByValue(string_value);
      
      res.status(204).send();
      logger.info(`Successfully deleted string: ${string_value}`);
    } catch (error) {
      logger.error(`Error in deleteString controller: ${error.message}`);
      next(error);
    }
  }

  async healthCheck(req, res) {
    const stats = stringService.getStats();
    res.status(200).json({
      status: 'success',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      stats: stats
    });
  }
}

export default new StringController();
