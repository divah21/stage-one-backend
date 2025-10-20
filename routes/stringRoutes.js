import express from 'express';
import stringController from '../controllers/stringController.js';
import StringValidation from '../validation/stringValidation.js';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check server status and get statistics about stored strings
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Health'
 */
router.get('/health', stringController.healthCheck);

/**
 * @swagger
 * /strings/filter-by-natural-language:
 *   get:
 *     summary: Filter strings using natural language
 *     description: Query strings using plain English descriptions
 *     tags: [Strings]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Natural language query (e.g., "single word palindromic strings")
 *         example: single word palindromic strings
 *     responses:
 *       200:
 *         description: Successfully filtered strings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NaturalLanguageResult'
 *       400:
 *         description: Unable to parse natural language query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Query parsed but resulted in conflicting filters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/strings/filter-by-natural-language',
  StringValidation.validateNaturalLanguageQuery,
  stringController.filterByNaturalLanguage
);

/**
 * @swagger
 * /strings:
 *   get:
 *     summary: Get all strings with optional filters
 *     description: Retrieve all analyzed strings with optional filtering by various criteria
 *     tags: [Strings]
 *     parameters:
 *       - in: query
 *         name: is_palindrome
 *         schema:
 *           type: boolean
 *         description: Filter by palindrome status
 *         example: true
 *       - in: query
 *         name: min_length
 *         schema:
 *           type: integer
 *         description: Minimum string length
 *         example: 5
 *       - in: query
 *         name: max_length
 *         schema:
 *           type: integer
 *         description: Maximum string length
 *         example: 20
 *       - in: query
 *         name: word_count
 *         schema:
 *           type: integer
 *         description: Exact word count
 *         example: 2
 *       - in: query
 *         name: contains_character
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 1
 *         description: Single character to search for (must be exactly 1 character)
 *         example: a
 *     responses:
 *       200:
 *         description: List of strings matching the filters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StringList'
 *       400:
 *         description: Invalid query parameter values or types
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create and analyze a new string
 *     description: Analyzes a string and stores its computed properties
 *     tags: [Strings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StringInput'
 *     responses:
 *       201:
 *         description: String successfully created and analyzed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StringAnalysis'
 *       400:
 *         description: Invalid request body or missing "value" field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: String already exists in the system
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Invalid data type for "value" (must be string)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/strings',
  StringValidation.validateQueryParams,
  stringController.getAllStrings
);

router.post(
  '/strings',
  StringValidation.validateCreateString,
  stringController.createString
);

/**
 * @swagger
 * /strings/{string_value}:
 *   get:
 *     summary: Get a specific analyzed string
 *     description: Retrieve a previously analyzed string by its value
 *     tags: [Strings]
 *     parameters:
 *       - in: path
 *         name: string_value
 *         required: true
 *         schema:
 *           type: string
 *         description: The string value to retrieve
 *         example: hello world
 *     responses:
 *       200:
 *         description: String found and returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StringAnalysis'
 *       404:
 *         description: String does not exist in the system
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a string
 *     description: Remove a previously analyzed string from the system
 *     tags: [Strings]
 *     parameters:
 *       - in: path
 *         name: string_value
 *         required: true
 *         schema:
 *           type: string
 *         description: The string value to delete
 *         example: hello world
 *     responses:
 *       204:
 *         description: String successfully deleted (no content)
 *       404:
 *         description: String does not exist in the system
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/strings/:string_value',
  stringController.getStringByValue
);

router.delete(
  '/strings/:string_value',
  stringController.deleteString
);

export default router;
