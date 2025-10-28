// Quick test for text extraction

const testQuery = "translate this for me to french: Translate texts in more than 25 languages directly in your favourite code editor powered by DeepL. This extension provides all the necessary integrations to easily translate texts without leaving your code editor."

console.log('Testing text extraction...\n')
console.log('Query:', testQuery)
console.log('\n--- Pattern Tests ---')

// Pattern 1: "translate this for me to [lang]: text"
let match = testQuery.match(/translate\s+(?:this|the following|text)?\s*(?:for me)?\s*(?:to|into)\s+\w+\s*[:\-]?\s*(.+)/i)
if (match && match[1]) {
  console.log('✅ Pattern 1 matched!')
  console.log('Extracted text:', match[1].trim())
  console.log('Text length:', match[1].trim().length)
} else {
  console.log('❌ Pattern 1 failed')
}

// Test target language detection
const langMatch = testQuery.match(/to\s+french|in\s+french|français|en\s+français/i)
if (langMatch) {
  console.log('\n✅ Target language detected: French')
} else {
  console.log('\n❌ Target language not detected')
}

console.log('\n--- Expected Output ---')
console.log('Text to translate: "Translate texts in more than 25 languages directly in your favourite code editor powered by DeepL. This extension provides all the necessary integrations to easily translate texts without leaving your code editor."')
console.log('Target language: French (fr)')
