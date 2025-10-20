import { AppError } from '../middlewares/errorHandler.js';

class StringValidation {
  static validateCreateString(req, res, next) {
    const { value } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError('Invalid request body', 400));
    }

    if (value === undefined || value === null) {
      return next(new AppError('Missing "value" field', 400));
    }

    if (typeof value !== 'string') {
      return next(new AppError('Invalid data type for "value" (must be string)', 422));
    }

    next();
  }

  static validateQueryParams(req, res, next) {
    const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;

    try {
      if (is_palindrome !== undefined) {
        if (is_palindrome !== 'true' && is_palindrome !== 'false') {
          throw new AppError('Invalid value for is_palindrome (must be true or false)', 400);
        }
        req.parsedQuery = req.parsedQuery || {};
        req.parsedQuery.is_palindrome = is_palindrome === 'true';
      }

      if (min_length !== undefined) {
        const minLen = parseInt(min_length);
        if (isNaN(minLen) || minLen < 0) {
          throw new AppError('Invalid value for min_length (must be positive integer)', 400);
        }
        req.parsedQuery = req.parsedQuery || {};
        req.parsedQuery.min_length = minLen;
      }

      if (max_length !== undefined) {
        const maxLen = parseInt(max_length);
        if (isNaN(maxLen) || maxLen < 0) {
          throw new AppError('Invalid value for max_length (must be positive integer)', 400);
        }
        req.parsedQuery = req.parsedQuery || {};
        req.parsedQuery.max_length = maxLen;
      }

      if (word_count !== undefined) {
        const wordCnt = parseInt(word_count);
        if (isNaN(wordCnt) || wordCnt < 0) {
          throw new AppError('Invalid value for word_count (must be positive integer)', 400);
        }
        req.parsedQuery = req.parsedQuery || {};
        req.parsedQuery.word_count = wordCnt;
      }

      if (contains_character !== undefined) {
        if (typeof contains_character !== 'string' || contains_character.length !== 1) {
          throw new AppError('Invalid value for contains_character (must be single character)', 400);
        }
        req.parsedQuery = req.parsedQuery || {};
        req.parsedQuery.contains_character = contains_character;
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  static validateNaturalLanguageQuery(req, res, next) {
    const { query } = req.query;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return next(new AppError('Missing or invalid "query" parameter', 400));
    }

    next();
  }
}

export default StringValidation;
