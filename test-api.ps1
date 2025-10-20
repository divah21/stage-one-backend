# API Testing Script
# Save this file and run the commands to test all endpoints

Write-Host "=== String Analysis API Test Script ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
curl -Method GET "$baseUrl/health"
Write-Host ""

# Test 2: Create a string (palindrome)
Write-Host "2. Creating a palindrome string 'racecar'..." -ForegroundColor Yellow
curl -Method POST "$baseUrl/strings" -ContentType "application/json" -Body '{"value":"racecar"}'
Write-Host ""

# Test 3: Create another string
Write-Host "3. Creating string 'hello world'..." -ForegroundColor Yellow
curl -Method POST "$baseUrl/strings" -ContentType "application/json" -Body '{"value":"hello world"}'
Write-Host ""

# Test 4: Try to create duplicate (should fail with 409)
Write-Host "4. Attempting to create duplicate 'hello world' (should fail)..." -ForegroundColor Yellow
curl -Method POST "$baseUrl/strings" -ContentType "application/json" -Body '{"value":"hello world"}'
Write-Host ""

# Test 5: Create more test strings
Write-Host "5. Creating more test strings..." -ForegroundColor Yellow
curl -Method POST "$baseUrl/strings" -ContentType "application/json" -Body '{"value":"a"}'
curl -Method POST "$baseUrl/strings" -ContentType "application/json" -Body '{"value":"noon"}'
curl -Method POST "$baseUrl/strings" -ContentType "application/json" -Body '{"value":"test string with spaces"}'
Write-Host ""

# Test 6: Get specific string
Write-Host "6. Getting specific string 'hello world'..." -ForegroundColor Yellow
curl -Method GET "$baseUrl/strings/hello world"
Write-Host ""

# Test 7: Get all strings
Write-Host "7. Getting all strings..." -ForegroundColor Yellow
curl -Method GET "$baseUrl/strings"
Write-Host ""

# Test 8: Filter palindromes
Write-Host "8. Filtering palindromes only..." -ForegroundColor Yellow
curl -Method GET "$baseUrl/strings?is_palindrome=true"
Write-Host ""

# Test 9: Filter by length
Write-Host "9. Filtering strings with min_length=5..." -ForegroundColor Yellow
curl -Method GET "$baseUrl/strings?min_length=5"
Write-Host ""

# Test 10: Filter by word count
Write-Host "10. Filtering strings with word_count=1..." -ForegroundColor Yellow
curl -Method GET "$baseUrl/strings?word_count=1"
Write-Host ""

# Test 11: Natural language query - single word palindromes
Write-Host "11. Natural language query: 'single word palindromic strings'..." -ForegroundColor Yellow
curl -Method GET "$baseUrl/strings/filter-by-natural-language?query=single word palindromic strings"
Write-Host ""

# Test 12: Natural language query - strings longer than 10
Write-Host "12. Natural language query: 'strings longer than 10 characters'..." -ForegroundColor Yellow
curl -Method GET "$baseUrl/strings/filter-by-natural-language?query=strings longer than 10 characters"
Write-Host ""

# Test 13: Delete a string
Write-Host "13. Deleting string 'test string with spaces'..." -ForegroundColor Yellow
curl -Method DELETE "$baseUrl/strings/test string with spaces"
Write-Host ""

# Test 14: Try to get deleted string (should fail with 404)
Write-Host "14. Attempting to get deleted string (should fail)..." -ForegroundColor Yellow
curl -Method GET "$baseUrl/strings/test string with spaces"
Write-Host ""

# Test 15: Final health check with stats
Write-Host "15. Final health check with stats..." -ForegroundColor Yellow
curl -Method GET "$baseUrl/health"
Write-Host ""

Write-Host "=== All tests completed ===" -ForegroundColor Green
