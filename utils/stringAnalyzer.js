import crypto from 'crypto';

class StringAnalyzer {
  static computeSHA256(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  static isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/\s/g, '');
    return cleaned === cleaned.split('').reverse().join('');
  }

  static countUniqueCharacters(str) {
    return new Set(str).size;
  }

  static countWords(str) {
    return str.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  static getCharacterFrequencyMap(str) {
    const frequencyMap = {};
    for (const char of str) {
      frequencyMap[char] = (frequencyMap[char] || 0) + 1;
    }
    return frequencyMap;
  }

  static analyzeString(value) {
    const sha256_hash = this.computeSHA256(value);
    
    return {
      id: sha256_hash,
      value: value,
      properties: {
        length: value.length,
        is_palindrome: this.isPalindrome(value),
        unique_characters: this.countUniqueCharacters(value),
        word_count: this.countWords(value),
        sha256_hash: sha256_hash,
        character_frequency_map: this.getCharacterFrequencyMap(value)
      },
      created_at: new Date().toISOString()
    };
  }

  static parseNaturalLanguage(query) {
    const lowerQuery = query.toLowerCase();
    const filters = {};

    if (/palindrom/i.test(query)) {
      filters.is_palindrome = true;
    }

    const singleWordMatch = /single[\s-]word|one[\s-]word/i.test(query);
    if (singleWordMatch) {
      filters.word_count = 1;
    }

    const twoWordMatch = /two[\s-]word/i.test(query);
    if (twoWordMatch) {
      filters.word_count = 2;
    }

    const longerThanMatch = query.match(/longer than (\d+)/i);
    if (longerThanMatch) {
      filters.min_length = parseInt(longerThanMatch[1]) + 1;
    }

    const shorterThanMatch = query.match(/shorter than (\d+)/i);
    if (shorterThanMatch) {
      filters.max_length = parseInt(shorterThanMatch[1]) - 1;
    }

    const containsLetterMatch = query.match(/contain(?:s|ing)?\s+(?:the\s+)?(?:letter\s+)?([a-z])/i);
    if (containsLetterMatch) {
      filters.contains_character = containsLetterMatch[1].toLowerCase();
    }

    if (/first vowel|letter a/i.test(query)) {
      filters.contains_character = 'a';
    }

    return filters;
  }
}

export default StringAnalyzer;
