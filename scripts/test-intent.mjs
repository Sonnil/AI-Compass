const query = 'Explain quantum computing to me';
const lowerQuery = query.toLowerCase();

const hasActionKeyword = /\b(recommend|suggest|find|need|looking for|about)\b/i.test(query);
const hasToolKeyword = /\b(tool|app|software)\b/i.test(query);
const hasTopicKeyword = /\b(data|analytics|productivity|creative|research|collaboration|writing|analysis)\b/i.test(query);

console.log('Query:', query);
console.log('hasActionKeyword:', hasActionKeyword);
console.log('hasToolKeyword:', hasToolKeyword);
console.log('hasTopicKeyword:', hasTopicKeyword);

// Check what triggers recommendTool
if ((hasActionKeyword && hasToolKeyword) || (hasActionKeyword && hasTopicKeyword)) {
  console.log('\n❌ Would trigger: recommendTool (line 124)');
} else if (!hasActionKeyword && hasTopicKeyword) {
  console.log('\n❌ Would trigger: recommendTool (line 128)');
} else {
  console.log('\n✅ No tool call - should go to external AI agent');
}

// Check if "computing" appears anywhere
console.log('\nContains "computing"?', query.includes('computing'));
console.log('Contains "quantum"?', query.includes('quantum'));
