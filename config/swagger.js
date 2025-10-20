import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'String Analysis API',
      version: '1.0.0',
      description: 'A RESTful API service that analyzes strings and stores their computed properties including length, palindrome detection, character frequency, and more.',
      contact: {
        name: 'David Smart',
        url: 'https://github.com/divah21',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.railway.app',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Strings',
        description: 'String analysis and management endpoints',
      },
      {
        name: 'Health',
        description: 'Health check and monitoring',
      },
    ],
    components: {
      schemas: {
        StringAnalysis: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'SHA-256 hash of the string',
              example: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
            },
            value: {
              type: 'string',
              description: 'The analyzed string',
              example: 'hello world',
            },
            properties: {
              type: 'object',
              properties: {
                length: {
                  type: 'integer',
                  description: 'Number of characters in the string',
                  example: 11,
                },
                is_palindrome: {
                  type: 'boolean',
                  description: 'Whether the string reads the same forwards and backwards (case-insensitive)',
                  example: false,
                },
                unique_characters: {
                  type: 'integer',
                  description: 'Count of distinct characters',
                  example: 8,
                },
                word_count: {
                  type: 'integer',
                  description: 'Number of words separated by whitespace',
                  example: 2,
                },
                sha256_hash: {
                  type: 'string',
                  description: 'SHA-256 hash for unique identification',
                  example: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
                },
                character_frequency_map: {
                  type: 'object',
                  description: 'Object mapping each character to its occurrence count',
                  example: { h: 1, e: 1, l: 3, o: 2, ' ': 1, w: 1, r: 1, d: 1 },
                },
              },
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'ISO 8601 timestamp of when the string was analyzed',
              example: '2025-10-20T10:00:00Z',
            },
          },
        },
        StringInput: {
          type: 'object',
          required: ['value'],
          properties: {
            value: {
              type: 'string',
              description: 'The string to analyze',
              example: 'hello world',
            },
          },
        },
        StringList: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/StringAnalysis',
              },
            },
            count: {
              type: 'integer',
              description: 'Number of strings returned',
              example: 15,
            },
            filters_applied: {
              type: 'object',
              description: 'Filters that were applied to the query',
              example: { is_palindrome: true, min_length: 5 },
            },
          },
        },
        NaturalLanguageResult: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/StringAnalysis',
              },
            },
            count: {
              type: 'integer',
              example: 3,
            },
            interpreted_query: {
              type: 'object',
              properties: {
                original: {
                  type: 'string',
                  example: 'all single word palindromic strings',
                },
                parsed_filters: {
                  type: 'object',
                  example: { word_count: 1, is_palindrome: true },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'String does not exist in the system',
            },
          },
        },
        Health: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            message: {
              type: 'string',
              example: 'Server is running',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-20T10:00:00Z',
            },
            stats: {
              type: 'object',
              properties: {
                total_strings: {
                  type: 'integer',
                  example: 42,
                },
                palindromes: {
                  type: 'integer',
                  example: 7,
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './docs/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
