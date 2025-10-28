// Simulate streaming effect for responses
export async function* streamResponse(response: string) {
  const words = response.split(/(\s+)/) // Split by spaces, keeping them
  // Add a small delay for the initial response
  await new Promise(resolve => setTimeout(resolve, 150))
  for (let i = 0; i < words.length; i++) {
    yield words.slice(0, i + 1).join('')
    // Adjust delay for speed - faster for shorter words
    const delay = words[i].length > 5 ? 30 : 15
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

// Utility to get a greeting based on the time of day
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}
