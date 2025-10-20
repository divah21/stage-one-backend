import StringAnalyzer from '../utils/stringAnalyzer.js';
import { AppError } from '../middlewares/errorHandler.js';
import logger from '../utils/logger.js';

class StringService {
  constructor() {
    this.stringsStore = new Map();
  }

  createString(value) {
    logger.info(`Analyzing new string: "${value}"`);
    
    const analyzedString = StringAnalyzer.analyzeString(value);
    
    if (this.stringsStore.has(analyzedString.id)) {
      logger.warn(`String already exists with hash: ${analyzedString.id}`);
      throw new AppError('String already exists in the system', 409);
    }

    this.stringsStore.set(analyzedString.id, analyzedString);
    logger.info(`String stored successfully with ID: ${analyzedString.id}`);
    
    return analyzedString;
  }

  getStringByValue(value) {
    logger.info(`Looking up string: "${value}"`);
    
    const hash = StringAnalyzer.computeSHA256(value);
    const analyzedString = this.stringsStore.get(hash);
    
    if (!analyzedString) {
      logger.warn(`String not found with hash: ${hash}`);
      throw new AppError('String does not exist in the system', 404);
    }
    
    return analyzedString;
  }

  getAllStrings(filters = {}) {
    logger.info(`Fetching all strings with filters:`, filters);
    
    let results = Array.from(this.stringsStore.values());

    if (filters.is_palindrome !== undefined) {
      results = results.filter(str => 
        str.properties.is_palindrome === filters.is_palindrome
      );
    }

    if (filters.min_length !== undefined) {
      results = results.filter(str => 
        str.properties.length >= filters.min_length
      );
    }

    if (filters.max_length !== undefined) {
      results = results.filter(str => 
        str.properties.length <= filters.max_length
      );
    }

    if (filters.word_count !== undefined) {
      results = results.filter(str => 
        str.properties.word_count === filters.word_count
      );
    }

    if (filters.contains_character !== undefined) {
      results = results.filter(str => 
        str.value.includes(filters.contains_character)
      );
    }

    logger.info(`Found ${results.length} strings matching filters`);

    return {
      data: results,
      count: results.length,
      filters_applied: filters
    };
  }

  filterByNaturalLanguage(query) {
    logger.info(`Processing natural language query: "${query}"`);
    
    const parsedFilters = StringAnalyzer.parseNaturalLanguage(query);
    
    if (Object.keys(parsedFilters).length === 0) {
      throw new AppError('Unable to parse natural language query', 400);
    }

    if (parsedFilters.min_length !== undefined && 
        parsedFilters.max_length !== undefined && 
        parsedFilters.min_length > parsedFilters.max_length) {
      throw new AppError('Query parsed but resulted in conflicting filters', 422);
    }

    const results = this.getAllStrings(parsedFilters);

    return {
      data: results.data,
      count: results.count,
      interpreted_query: {
        original: query,
        parsed_filters: parsedFilters
      }
    };
  }

  deleteStringByValue(value) {
    logger.info(`Attempting to delete string: "${value}"`);
    
    const hash = StringAnalyzer.computeSHA256(value);
    
    if (!this.stringsStore.has(hash)) {
      logger.warn(`String not found for deletion with hash: ${hash}`);
      throw new AppError('String does not exist in the system', 404);
    }

    this.stringsStore.delete(hash);
    logger.info(`String deleted successfully with hash: ${hash}`);
    
    return true;
  }

  getStats() {
    return {
      total_strings: this.stringsStore.size,
      palindromes: Array.from(this.stringsStore.values()).filter(
        s => s.properties.is_palindrome
      ).length
    };
  }
}

export default new StringService();
