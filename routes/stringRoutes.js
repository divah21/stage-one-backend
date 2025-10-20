import express from 'express';
import stringController from '../controllers/stringController.js';
import StringValidation from '../validation/stringValidation.js';

const router = express.Router();

router.get('/health', stringController.healthCheck);

router.get(
  '/strings/filter-by-natural-language',
  StringValidation.validateNaturalLanguageQuery,
  stringController.filterByNaturalLanguage
);

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

router.get(
  '/strings/:string_value',
  stringController.getStringByValue
);

router.delete(
  '/strings/:string_value',
  stringController.deleteString
);

export default router;
