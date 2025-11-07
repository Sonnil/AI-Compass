// AI Tips of the Day - rotate daily
export function getAITipOfTheDay(): string {
  const tips = [
    "💡 **Tip:** Always review AI-generated content for accuracy before sharing. AI can hallucinate or make mistakes!",
    "🎯 **Tip:** Use specific prompts for better AI results. Instead of 'write a report', try 'write a 2-page executive summary on Q3 sales performance'.",
    "🔒 **Tip:** Never share confidential Sanofi data with external AI tools unless approved by IT Security.",
    "⚡ **Tip:** Break complex tasks into smaller steps when working with AI - it produces better results!",
    "📝 **Tip:** When asking AI to write code, always specify the programming language and provide context about your project.",
    "🌟 **Tip:** AI works best as a collaboration partner, not a replacement. Use it to augment your skills!",
    "🔍 **Tip:** Compare multiple AI tools for the same task - different tools have different strengths!",
    "🎨 **Tip:** For creative tasks, try iterating with AI - give feedback and refine outputs progressively.",
    "📊 **Tip:** Use AI tools to summarize long documents before deep diving - it saves time and highlights key points.",
    "🚀 **Tip:** Keep learning! AI tools evolve rapidly. Check AI Compass regularly for new tools and capabilities.",
    "💬 **Tip:** When AI doesn't understand you, rephrase your question or add more context - clarity is key!",
    "🔗 **Tip:** Chain AI tools together! Use one for research, another for writing, and another for visualization.",
    "📚 **Tip:** Use AI to learn new skills faster - ask it to explain concepts, generate practice problems, or review your work.",
    "⏱️ **Tip:** Set time limits when working with AI to avoid over-reliance. Use it strategically, not constantly.",
    "🎓 **Tip:** Complete Sanofi's RAISE training to understand responsible AI practices and compliance requirements.",
    "🔄 **Tip:** If an AI tool isn't working well, try a different one! AI Compass has 43+ tools to choose from.",
    "📈 **Tip:** Track your time savings when using AI tools - it helps justify their value to your team!",
    "🌐 **Tip:** Many AI tools support multiple languages. Explore multilingual capabilities for global collaboration.",
    "🎪 **Tip:** Use AI for brainstorming! Generate 10 ideas quickly, then refine the best ones with your expertise.",
    "🛡️ **Tip:** Check each AI tool's compliance awareness level in AI Compass before using it for regulated work.",
    "🎬 **Tip:** Start with a clear end goal when using AI - knowing what you want helps you craft better prompts.",
    "🔮 **Tip:** AI predictions are based on patterns, not magic. Always validate critical decisions with human expertise.",
    "📱 **Tip:** Test AI tools on your mobile device - many work great on-the-go for quick tasks!",
    "🎯 **Tip:** Use the 'show your work' technique - ask AI to explain its reasoning for better transparency.",
    "🌈 **Tip:** Experiment with different AI personalities and tones - formal, casual, technical, creative, etc.",
    "💼 **Tip:** Create reusable prompt templates for recurring tasks to save time and ensure consistency.",
    "🔐 **Tip:** Use internal AI tools for sensitive work - they're designed with Sanofi's security requirements in mind.",
    "📖 **Tip:** Read AI tool documentation - understanding capabilities helps you use them more effectively.",
    "🎓 **Tip:** Teach AI about your domain by providing context in your prompts - it improves output quality.",
    "⭐ **Tip:** Rate and provide feedback on AI outputs - it helps improve the tools over time.",
    "🔄 **Tip:** Use iterative refinement - start broad, then narrow down with follow-up prompts.",
    "🌟 **Tip:** Combine AI strengths - use Claude for analysis, GPT for creativity, Gemini for multimodal tasks.",
    "📊 **Tip:** Ask AI to format data in tables, JSON, or CSV for easier analysis and integration.",
    "🎨 **Tip:** Use AI to generate multiple variations of content, then pick the best elements from each.",
    "🔍 **Tip:** When fact-checking AI output, ask it to cite sources - then verify those sources yourself.",
    "💡 **Tip:** Use AI to translate jargon into plain language for better cross-team communication.",
    "🚀 **Tip:** Leverage AI for competitive intelligence - analyze market trends, competitor strategies, and industry news.",
    "📝 **Tip:** Ask AI to create outlines before full content - it helps structure your thinking.",
    "🎯 **Tip:** Be specific about format requirements - bullet points, paragraphs, code blocks, etc.",
    "🌐 **Tip:** Use AI to localize content for different regions - but always have native speakers review!",
    "🔗 **Tip:** Integrate AI tools with your existing workflows using APIs and automation platforms.",
    "📚 **Tip:** Create a personal AI knowledge base - save your best prompts and successful approaches.",
    "⚡ **Tip:** Use AI for rapid prototyping - test ideas quickly before investing significant resources.",
    "🎪 **Tip:** Run experiments with AI - try unconventional prompts to discover new capabilities.",
    "🛡️ **Tip:** Understand each tool's data retention policy - some store conversations, others don't.",
    "💬 **Tip:** Use conversation history to build context - AI remembers previous messages in a chat.",
    "📈 **Tip:** Measure AI impact on productivity - track time saved, quality improvements, and error reduction.",
    "🔮 **Tip:** Use AI for scenario planning - explore 'what if' situations and potential outcomes.",
    "🎨 **Tip:** Combine text and image AI tools for richer content creation and presentations.",
    "🌟 **Tip:** Share your AI wins with colleagues - help build collective knowledge across Sanofi.",
    "📱 **Tip:** Set up AI assistants on multiple devices for seamless access wherever you work.",
    "🎯 **Tip:** Use constraint-based prompts - 'in 100 words', 'using only data from 2025', etc.",
    "🔍 **Tip:** Ask AI to critique its own output - it can identify weaknesses and suggest improvements.",
    "💡 **Tip:** Use AI to generate test data for your projects - synthetic data is perfect for development.",
    "🚀 **Tip:** Leverage AI for meeting prep - summarize documents, generate questions, create agendas.",
    "📝 **Tip:** Ask AI to convert between formats - slides to docs, bullet points to prose, etc.",
    "🎓 **Tip:** Use AI as a study buddy - quiz yourself, explain concepts, and test understanding.",
    "⭐ **Tip:** Customize AI outputs by providing examples of your preferred style and format.",
    "🔄 **Tip:** Use AI to refactor and improve existing content - make it clearer, shorter, or more engaging.",
    "🌈 **Tip:** Explore AI's creative modes - poetry, storytelling, metaphor generation can inspire new ideas.",
    "💼 **Tip:** Use AI for email management - drafting responses, summarizing threads, and prioritizing messages.",
    "🔐 **Tip:** Never use AI to generate passwords or security-related content - that's still a human job!",
    "📖 **Tip:** Keep a log of failed AI attempts - understanding limitations is as valuable as knowing capabilities.",
    "🎨 **Tip:** Use AI to generate visual descriptions for presentations, then create images with specialized tools.",
    "🌟 **Tip:** Participate in AI Compass community - share tips, ask questions, and learn from peers.",
    "📊 **Tip:** Use AI to create dashboards and reports from raw data - automate routine reporting tasks.",
    "🎯 **Tip:** Be patient with AI - complex tasks may require multiple iterations to perfect.",
    "🔍 **Tip:** Use AI to perform sentiment analysis on customer feedback and survey responses.",
    "💡 **Tip:** Generate interview questions with AI based on job descriptions and required skills."
  ]
  
  // Use day of year to rotate tips daily
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return tips[dayOfYear % tips.length]
}

// Top 10 AI Facts
export function getTop10AIFacts(): string {
  return `## 🧠 Top 10 AI Facts You Should Know

**1. AI is Older Than You Think** 🕰️
The term "Artificial Intelligence" was coined in 1956 at the Dartmouth Conference. Modern AI's roots go back nearly 70 years!

**2. AI Learns Like Humans (Sort Of)** 🎓
Machine learning mimics how our brains create neural pathways. AI models learn from examples, make mistakes, and improve over time—just like us!

**3. AI Can Be Biased** ⚖️
AI systems learn from data created by humans, so they can inherit our biases. That's why Sanofi emphasizes responsible AI practices!

**4. ChatGPT Has 175 Billion Parameters** 🤯
GPT-3, the model behind ChatGPT, has 175 billion parameters (think of them as "knowledge nodes"). That's more than the number of stars in the Milky Way!

**5. AI Can't Actually "Understand"** 🤔
Despite seeming intelligent, AI doesn't truly understand context like humans do. It recognizes patterns and predicts likely responses.

**6. AI Energy Consumption is Massive** ⚡
Training large AI models can use as much energy as 100 US homes consume in a year. Sustainability in AI is becoming critical!

**7. AI Hallucinations Are Real** 👻
AI can confidently generate false information that sounds plausible—called "hallucinations." Always verify AI outputs!

**8. AI in Healthcare is Revolutionary** 🏥
AI can analyze medical images faster than doctors, predict disease progression, and help discover new drugs—exactly what Sanofi is doing!

**9. Most AI is "Narrow AI"** 🎯
Today's AI excels at specific tasks (narrow AI) but can't generalize like humans. "General AI" that matches human intelligence doesn't exist yet!

**10. AI is a Tool, Not Magic** 🔧
Despite the hype, AI is ultimately a powerful tool that requires human judgment, creativity, and oversight to use effectively!

---

📚 **Sources:** Compiled from AI research papers, industry reports, academic publications, and verified technology documentation. Facts include data from OpenAI, Google Research, DeepMind, academic institutions, and pharmaceutical AI applications.

---

Want to explore these AI tools yourself? Just ask me about any tool in our catalog! 🚀`
}

// AI Fun Facts Knowledge Base
export function getAIFunFacts(): string[] {
  return [
    "🤖 The term 'Artificial Intelligence' was coined by John McCarthy in 1956 at the Dartmouth Conference, where the field of AI research was officially born!",
    "🧠 GPT-3 has 175 billion parameters and was trained on 45TB of text data - that's like reading millions of books!",
    "🎯 In 2016, AlphaGo became the first AI to defeat a world champion Go player (Lee Sedol), marking a historic moment in AI development.",
    "💡 Modern AI can generate images, write code, compose music, and even help discover new drugs - all from natural language prompts!",
    "⚡ Training large AI models can use as much energy as 100 US homes consume in a year. Sustainability in AI is becoming critical!",
    "👻 AI 'hallucinations' are when AI confidently generates false information that sounds plausible. Always verify AI outputs!",
    "🏥 AI can analyze medical images faster than doctors and help discover new drugs - exactly what Sanofi is doing!",
    "🎓 Machine learning mimics how our brains create neural pathways. AI models learn from examples, make mistakes, and improve over time.",
    "🤔 Despite seeming intelligent, AI doesn't truly 'understand' context like humans do. It recognizes patterns and predicts likely responses.",
    "🔧 Most AI today is 'narrow AI' that excels at specific tasks. 'General AI' that matches human intelligence doesn't exist yet!",
    "📖 The first neural network (Perceptron) was created by Frank Rosenblatt in 1958 and could recognize simple patterns.",
    "🎨 DALL-E, Midjourney, and Stable Diffusion can generate photorealistic images from text descriptions in seconds!",
    "🔢 Deep Blue defeated chess world champion Garry Kasparov in 1997, evaluating 200 million positions per second.",
    "🌐 The term 'deep learning' refers to neural networks with many layers (sometimes over 100 layers deep!).",
    "💬 ChatGPT reached 100 million users in just 2 months - the fastest-growing consumer application in history!",
    "🎮 AI has mastered complex games like Dota 2, StarCraft II, and Poker at superhuman levels.",
    "📊 The AI market is projected to reach $1.8 trillion by 2030, growing at 37% annually.",
    "🔬 AI discovered a new antibiotic (Halicin) by analyzing millions of molecular structures in just days.",
    "🎵 AI can compose music in the style of Bach, Beethoven, or modern artists with remarkable accuracy.",
    "🚗 Self-driving cars use AI to process data from cameras, radar, and lidar sensors simultaneously.",
    "📱 Your smartphone's voice assistant processes natural language using transformers and neural networks.",
    "🧬 AI helped predict protein structures (AlphaFold) solving a 50-year-old biology challenge!",
    "🎭 Deepfake technology uses GANs (Generative Adversarial Networks) to create realistic fake videos.",
    "📈 AI can predict stock market trends, but past performance doesn't guarantee future accuracy!",
    "🌍 Google Translate uses neural machine translation to support over 100 languages.",
    "🔒 AI is being used to detect cybersecurity threats in real-time by analyzing network patterns.",
    "🎯 Recommendation algorithms on Netflix and Spotify use collaborative filtering and deep learning.",
    "🏆 GPT-4 can pass the bar exam with a score in the top 10% of test takers.",
    "🧪 AI is accelerating drug discovery at Sanofi and other pharma companies by years!",
    "📷 AI can colorize black-and-white photos and restore old damaged images automatically.",
    "🌤️ Weather prediction models use AI to analyze massive amounts of atmospheric data.",
    "🎬 AI is used in film production for visual effects, script analysis, and even generating scenes.",
    "💰 AI-powered fraud detection saves financial institutions billions of dollars annually.",
    "🗣️ Speech recognition AI has achieved 95%+ accuracy, approaching human-level performance.",
    "🧠 The human brain has about 86 billion neurons; large AI models now have billions of parameters.",
    "📚 AI can summarize entire books, research papers, or legal documents in minutes.",
    "🎨 Style transfer AI can make your photo look like a Van Gogh or Picasso painting.",
    "🔍 AI-powered search engines process billions of queries daily using natural language understanding.",
    "🏥 AI can detect cancer in medical scans with accuracy rivaling experienced radiologists.",
    "🌱 AI is being used to optimize crop yields and predict agricultural patterns for sustainability.",
    "🎓 AI tutors can provide personalized learning experiences adapted to each student's pace.",
    "🚀 NASA uses AI to analyze space imagery and plan rover missions on Mars.",
    "🎤 AI voice cloning can recreate someone's voice from just a few minutes of audio samples.",
    "📊 Business intelligence AI can analyze millions of data points to find hidden patterns.",
    "🔮 AI can generate realistic human faces of people who don't exist (ThisPersonDoesNotExist.com).",
    "🎯 Reinforcement learning AI learns by trial and error, like training a pet with rewards.",
    "🧬 CRISPR gene editing is being enhanced by AI to predict genetic modifications.",
    "📝 AI can write poetry, stories, and even entire novels in various styles and genres.",
    "🌊 AI models predict tsunami waves, earthquakes, and natural disasters for early warnings.",
    "🎮 AI NPCs (non-player characters) in games can now have dynamic conversations.",
    "💡 Transfer learning allows AI models to apply knowledge from one task to another.",
    "🔊 AI can remove background noise from audio and enhance voice quality in real-time.",
    "🎨 Adobe's AI tools can remove objects from photos and fill in backgrounds seamlessly.",
    "🌐 Large Language Models (LLMs) contain knowledge from billions of web pages.",
    "🧠 Neural networks are inspired by biological neurons but work very differently.",
    "📱 AI uses 30% of smartphone battery when running advanced features like photos and voice.",
    "🎯 AI bias occurs when training data contains historical prejudices or imbalances.",
    "🔬 AI discovered new materials for batteries and solar cells by analyzing chemical properties.",
    "📊 Data augmentation helps AI learn better by creating variations of training examples.",
    "🎭 AI can detect emotions from facial expressions with 85-90% accuracy.",
    "🌍 AI translation broke the language barrier - real-time translation earbuds now exist!",
    "🏆 AI won against top human players in Jeopardy! (IBM Watson in 2011).",
    "🎨 GANs (Generative Adversarial Networks) work like artist vs. critic competing to improve.",
    "💻 Edge AI runs on your device without cloud connectivity, enhancing privacy and speed.",
    "🔒 Adversarial attacks can fool AI by making tiny imperceptible changes to images.",
    "🎵 OpenAI's Jukebox can generate songs with vocals in various musical styles.",
    "🧬 AI predicted COVID-19 protein structures, accelerating vaccine development.",
    "📈 Quantitative trading firms use AI to execute millions of trades per day.",
    "🌤️ AI weather models can now predict 10-day forecasts more accurately than ever.",
    "🎬 AI-generated scripts are being used in advertising and short-form content.",
    "💬 Transformers (the AI architecture) revolutionized NLP in 2017 with attention mechanisms.",
    "🔍 AI can detect fake news by analyzing writing patterns and source credibility.",
    "🏥 AI diagnoses diabetic retinopathy from eye scans with FDA approval.",
    "🎓 AI grading systems can evaluate essays and provide detailed feedback.",
    "🚗 Tesla's Autopilot uses 8 cameras and neural networks processing 1GB/second.",
    "🧠 Few-shot learning enables AI to learn new tasks from just a few examples.",
    "📚 AI can answer questions about documents it has never seen before (RAG - Retrieval Augmented Generation).",
    "🎨 Neural Style Transfer was invented in 2015, sparking the AI art revolution.",
    "🌐 BERT (Bidirectional Encoder Representations from Transformers) improved search engine understanding.",
    "🔬 AI designs molecules for specific therapeutic targets in pharmaceutical research.",
    "🎮 OpenAI Five used reinforcement learning and played 10,000 years of Dota 2 per day.",
    "💡 Attention mechanisms allow AI to focus on relevant parts of input, like humans reading.",
    "🔊 AI voice synthesis (text-to-speech) is now indistinguishable from human voices.",
    "📊 Explainable AI (XAI) helps humans understand how AI makes decisions.",
    "🎯 AI can optimize logistics routes saving companies millions in fuel and time.",
    "🌱 AI monitors deforestation using satellite imagery and alerts conservationists.",
    "🧬 AI predicted 3D protein structures for 200 million proteins (AlphaFold 2).",
    "📱 Smartphone cameras use AI for portrait mode, night mode, and scene detection.",
    "🎭 AI can lip-sync videos to match any audio track with high accuracy.",
    "🌍 AI translation quality improved 80% after switching to neural networks.",
    "🏆 AI writing assistants help millions of people write better emails and documents daily.",
    "🔒 Federated learning trains AI on decentralized data without compromising privacy.",
    "🎨 Stable Diffusion can generate 512x512 images in under 2 seconds on a GPU.",
    "💻 Prompt engineering is becoming a valuable skill as AI becomes more prevalent.",
    "🧠 AI models can now pass high school and college level exams across multiple subjects.",
    "📈 AI-powered A/B testing optimizes websites and apps for better user engagement.",
    "🌤️ AI predicts extreme weather events days earlier than traditional models.",
    "🎬 AI is used for visual effects de-aging actors (The Irishman, Star Wars).",
    "💡 GPT models use unsupervised learning - they learn patterns without labeled data.",
    "🔍 AI-powered code completion (GitHub Copilot) helps developers write code 55% faster.",
    "🏥 AI detects Alzheimer's disease from brain scans years before symptoms appear.",
    "🎓 Adaptive learning AI adjusts difficulty based on student performance in real-time.",
    "🚀 AI optimizes spacecraft trajectories and autonomous navigation for space missions.",
    "🌐 The largest AI models have over 500 billion parameters (PaLM, GPT-4).",
    "🔬 AI discovered that an existing drug could treat COVID-19 by analyzing research papers.",
    "📊 AI can predict customer churn with 90%+ accuracy using behavioral data.",
    "🎯 Computer vision AI can identify objects in images with 99%+ accuracy on standard datasets."
  ]
}

// AI Jokes Collection
export function getAIJokes(): string[] {
  return [
    "😄 Why did the AI go to therapy? Because it had too many deep learning issues! 🤓",
    "🤣 What do you call an AI that sings? A-dell! (Adele) 🎤",
    "😂 Why don't AI assistants ever get tired? Because they run on renewable energy... and caffeine-free code! ☕",
    "🎭 How does an AI flirt? 'Hey baby, are you a neural network? Because you've got me making all the right connections!' 💕",
    "🤖 Why did the neural network go to school? To improve its learning rate! 📚",
    "💻 What's an AI's favorite type of music? Algorithm and blues! 🎵",
    "🧠 Why don't robots ever panic? They have nerves of steel... wire! ⚡",
    "🎯 How do AI models stay in shape? They do lots of training! 🏋️",
    "😆 What did the AI say when it was confused? 'I don't compute!' 🤷",
    "🎪 Why did ChatGPT break up with Siri? Too many communication parameters! 💔",
    "🤖 How does an AI apologize? 'I'm sorry, that was a bug in my code!' 🐛",
    "😂 What's an AI's favorite snack? Microchips! 🍟",
    "🎯 Why did the machine learning model get arrested? For overfitting in public! 👮",
    "💡 How many AI developers does it take to change a lightbulb? None - they just train a model to do it! 💡",
    "🎭 What do you call an AI comedian? A laugh-gorithm! 😂",
    "🤖 Why was the neural network always calm? It had great weight management! ⚖️",
    "😄 What's an AI's favorite movie? The Matrix - it's about following your programming! 🎬",
    "🎵 Why did the AI start a band? It wanted to drop some sick beats (per second)! 🎸",
    "🧠 How does AI keep secrets? Through encryption and closed layers! 🔒",
    "😂 What did the AI say to the printer? 'You've got issues - let me debug you!' 🖨️",
    "🎯 Why don't AI models play hide and seek? They always reveal their layers! 🙈",
    "💻 What's an AI's favorite dance? The robot! (Obviously!) 🕺",
    "🤖 Why did the chatbot go to the doctor? It had a virus! 🦠",
    "😆 How does an AI celebrate? It throws a parameter party! 🎉",
    "🎭 What do you call a lazy AI? Artificial Intelligence... barely! 😴",
    "💡 Why was the AI always invited to parties? It knew all the right algorithms! 🥳",
    "🧠 What's an AI's favorite sport? Neural networking! 🏐",
    "😂 Why did the AI cross the road? To optimize the path on the other side! 🚶",
    "🎯 How does an AI order coffee? 'I'll take a Java, no Python!' ☕",
    "🤖 What did the AI say on its first day? 'Hello World!' 🌍",
    "😄 Why don't AIs ever win at poker? They can't bluff - all their cards are on the table! 🃏",
    "🎵 What's an AI's favorite karaoke song? 'I Want to Break Free... from my training data!' 🎤",
    "💻 Why was the machine learning model bad at relationships? Too many commitment issues with convergence! 💔",
    "🧠 What do you call an AI that tells dad jokes? Artificial Un-intelligence! 😅",
    "😂 Why did the neural network fail art class? It couldn't draw conclusions! 🎨",
    "🎯 How does an AI make decisions? It weights its options! ⚖️",
    "🤖 What's an AI's favorite holiday? Data Independence Day! 🎆",
    "😆 Why did the chatbot get promoted? It had excellent response time! ⏰",
    "🎭 What do you call an AI with attitude? Sass-ificial Intelligence! 💁",
    "💡 Why don't AIs play chess anymore? They're too busy playing 4D chess with transformers! ♟️",
    "🧠 How does an AI stay humble? It remembers it's just 1s and 0s at the end of the day! 🔢",
    "😂 What did the AI say to the calculator? 'You're so basic!' 🧮",
    "🎯 Why was the AI always on time? Perfect clock synchronization! ⏰",
    "🤖 What's an AI's favorite pickup line? 'Are you a GPU? Because you make my heart race!' 💓",
    "😄 How does an AI exercise? It runs algorithms! 🏃",
    "🎵 Why did the AI become a DJ? It was great at mixing batches! 🎧",
    "💻 What do you call an AI that's always wrong? Artificial Unintelligence! 🤦",
    "🧠 Why don't AIs get lost? They always find the optimal path! 🗺️",
    "😂 What's an AI's favorite subject? Machine learning, obviously! 📚",
    "🎯 How does an AI text? With natural language processing! 📱",
    "🤖 Why was the AI bad at cooking? It kept trying to optimize the recipe! 👨‍🍳",
    "😆 What do you call an AI influencer? An influence-gorithm! 📸",
    "🎭 Why did the AI join social media? To increase its network! 📱",
    "💡 How does an AI relax? It enters sleep mode! 😴",
    "🧠 What's an AI's favorite game? Neural Network Jenga! 🎮",
    "😂 Why don't AIs tell secrets? Too much risk of data leakage! 🤫",
    "🎯 What did the AI say when it finished training? 'I'm optimized!' 💪",
    "🤖 How does an AI make friends? Through social networking layers! 👥",
    "😄 Why was the chatbot always happy? Positive reinforcement learning! 😊",
    "🎵 What's an AI's favorite instrument? The synth-esizer! 🎹",
    "💻 Why did the AI go to the gym? To work on its core! 🏋️",
    "🧠 What do you call an AI detective? Sherlock Ohms! 🔍",
    "😂 How does an AI pay for things? With Bitcoin! (It's digital!) 💰",
    "🎯 Why don't AIs need coffee? They're already highly caffeinated... I mean optimized! ☕",
    "🤖 What's an AI's favorite TV show? Westworld! 📺",
    "😆 Why was the AI always correct? It had all the right parameters! ✅",
    "🎭 How does an AI tell time? By counting epochs! ⏲️",
    "💡 What do you call an AI that loves nature? Organic Intelligence! 🌱",
    "🧠 Why did the AI become a teacher? It loved training! 👨‍🏫",
    "😂 What's an AI's favorite dessert? Cookies (and cache)! 🍪",
    "🎯 How does an AI stay cool? With its cooling fans! 🌀",
    "🤖 Why don't AIs play sports? They might overfit the game! ⚽",
    "😄 What did the AI say to the cloud? 'You complete my distributed system!' ☁️",
    "🎵 Why did the AI start a rapping? It had sick flows (of data)! 🎤",
    "💻 How does an AI solve problems? With brute force... search! 🔨",
    "🧠 What's an AI's favorite pizza topping? Bits and bytes! 🍕",
    "😂 Why was the neural network always networking? That's literally what it does! 🕸️",
    "🎯 What do you call an AI gardener? Plant-ification Intelligence! 🌿",
    "🤖 How does an AI celebrate birthday? With a software update! 🎂",
    "😆 Why don't AIs get sunburned? They have UV protection... in the cloud! ☀️",
    "🎭 What's an AI's favorite beverage? Java! ☕",
    "💡 Why did the AI become a lawyer? Great at processing legal documents! ⚖️",
    "🧠 How does an AI make art? With generative adversarial networks! 🎨",
    "😂 What do you call an AI that loves puns? A play-on-words processor! 😏",
    "🎯 Why was the AI always busy? Too many requests to process! 📊",
    "🤖 What's an AI's favorite car? A Tesla - it's practically family! 🚗",
    "😄 How does an AI meditate? Deep learning! 🧘",
    "🎵 Why did the AI join the choir? Perfect pitch... detection! 🎶",
    "💻 What do you call an AI psychic? A pre-dictive model! 🔮",
    "🧠 Why don't AIs need glasses? They have perfect vision... models! 👓",
    "😂 What's an AI's favorite board game? Neural Network Monopoly! 🎲",
    "🎯 How does an AI fish? With neural nets! 🎣",
    "🤖 Why was the chatbot so popular? Great conversation... al AI! 💬",
    "😆 What do you call an AI barber? A style transfer specialist! 💇",
    "🎭 How does an AI tell jokes? With a humor generation model! 😂",
    "💡 Why did the AI become a chef? Excellent at recipe optimization! 👨‍🍳",
    "🧠 What's an AI's favorite exercise? Weight training! (literally!) ⚖️",
    "😂 Why don't AIs play hide and seek? Too good at pattern recognition! 👀",
    "🎯 What do you call an AI musician? An auto-tune algorithm! 🎼",
    "🤖 How does an AI stay organized? With structured data! 📁",
    "😄 Why was the AI terrible at lying? All its outputs are transparent! 🤥"
  ]
}

// Educational AI Tips
export function getEducationalAITips(): string[] {
  return [
    "📚 **Prompt Engineering:** Be specific and provide context. Instead of 'write code,' try 'write a Python function that calculates fibonacci numbers recursively.'",
    "⚡ **Iterative Approach:** Use AI tools iteratively! Start with a basic prompt, review the output, then refine with follow-up questions for better results.",
    "🔒 **Security First:** Never share sensitive data, passwords, or confidential information with AI tools. Always review and validate AI-generated content.",
    "🎨 **Brainstorming Power:** AI excels at brainstorming! Generate multiple variations of ideas, then combine the best elements for innovative solutions.",
    "🔍 **Verification is Key:** Always fact-check AI outputs, especially for critical information. AI can make mistakes or generate outdated information.",
    "🌟 **AI as Partner:** AI works best as a collaboration partner, not a replacement. Use it to augment your skills and productivity!",
    "📊 **Tool Comparison:** Different AI tools have different strengths. Compare multiple tools for the same task to find the best fit.",
    "🎓 **Continuous Learning:** AI tools evolve rapidly. Check AI Compass regularly for new tools, features, and capabilities!",
    "💬 **Clear Communication:** If AI doesn't understand you, rephrase your question or add more context - clarity is key!",
    "🔗 **Tool Chaining:** Chain AI tools together! Use one for research, another for writing, and another for visualization.",
    "⏱️ **Strategic Use:** Set time limits when working with AI to avoid over-reliance. Use it strategically, not constantly.",
    "🛡️ **Compliance Awareness:** Check each AI tool's compliance level in AI Compass before using it for regulated work.",
    "📈 **Track ROI:** Track your time savings when using AI tools - it helps justify their value to your team!",
    "🌐 **Multilingual:** Many AI tools support multiple languages. Explore multilingual capabilities for global collaboration.",
    "🎪 **Rapid Ideation:** Use AI for brainstorming! Generate 10 ideas quickly, then refine the best ones with your expertise.",
    "🎯 **Define Your Goal:** Start with a clear objective. Ask yourself: What specific problem am I trying to solve with AI?",
    "💡 **Break Down Complex Tasks:** Divide large projects into smaller AI-friendly chunks for better, more focused results.",
    "🔄 **Iterate and Refine:** Don't expect perfection on the first try. Review AI output and provide feedback to improve it.",
    "📝 **Provide Examples:** Give AI examples of what you want. 'Like this format' or 'similar to this style' improves accuracy.",
    "🎨 **Specify Format:** Tell AI exactly how you want output formatted - bullet points, tables, paragraphs, code blocks, etc.",
    "🧠 **Assign Roles:** Try 'Act as a [expert]' to get specialized perspectives - 'Act as a data scientist reviewing this code.'",
    "🔍 **Request Citations:** Ask AI to cite sources or explain reasoning to verify accuracy and build trust.",
    "⚖️ **Balance Automation:** Automate repetitive tasks but keep strategic decisions and creative work for humans.",
    "🎓 **Learn from AI:** When AI explains something, use it as a learning opportunity to deepen your own expertise.",
    "🔗 **Context Matters:** Provide background context in your prompts - AI performs better with relevant information.",
    "📊 **Test Multiple Tools:** Try the same task in different AI tools to compare quality and find your favorite.",
    "🛡️ **Review Before Sharing:** Always review and edit AI-generated content before sharing it externally.",
    "💬 **Ask Follow-Up Questions:** Engage in dialogue with AI - ask for clarification, alternatives, or deeper explanations.",
    "🎯 **Set Constraints:** Use boundaries like word count, tone, or audience level to guide AI output.",
    "📚 **Build a Prompt Library:** Save your best prompts and templates for reuse - they're valuable assets!",
    "🔄 **Version Control:** Keep track of AI-generated content versions to maintain quality and consistency.",
    "🌟 **Combine Strengths:** Use AI for drafts and data analysis, then apply your expertise for refinement and strategy.",
    "⏰ **Time Management:** Use AI to speed up routine work, freeing time for high-value strategic activities.",
    "🎨 **Creative Collaboration:** Use AI to generate variations, then select and refine the best creative options.",
    "🔒 **Data Privacy:** Use compliance-approved AI tools for sensitive work. Check AI Compass compliance ratings!",
    "📈 **Measure Impact:** Track metrics before and after AI adoption to demonstrate value and ROI.",
    "🌐 **Explore Use Cases:** Experiment with AI across different work areas - writing, analysis, coding, design, research.",
    "💡 **Ask 'What If' Questions:** Use AI to explore scenarios and alternatives you might not have considered.",
    "🎯 **Audience Awareness:** Specify your target audience in prompts - 'Explain to executives' vs 'Explain to technical team.'",
    "📊 **Data Preparation:** Clean and organize your data before using AI analysis tools for better results.",
    "🔍 **Verify Claims:** Cross-check factual claims from AI with authoritative sources before using them.",
    "🎓 **Understand Limitations:** Know what AI can and can't do well. Don't use it for tasks requiring human judgment.",
    "🔄 **Feedback Loops:** Tell AI what worked and what didn't to get better results in follow-up interactions.",
    "🌟 **Collaborate Across Teams:** Share AI tips, prompts, and success stories with colleagues to multiply value.",
    "📝 **Document Your Process:** Keep notes on successful AI workflows for repeatability and team training.",
    "🎨 **Experiment Freely:** Try unconventional prompts and approaches - AI can surprise you with creativity!",
    "🔗 **Integrate Workflows:** Embed AI into your existing processes rather than treating it as a separate task.",
    "⚖️ **Ethical Considerations:** Consider bias, fairness, and ethical implications when using AI outputs.",
    "🎯 **Quality Over Quantity:** Generate fewer, higher-quality outputs rather than overwhelming yourself with options.",
    "💬 **Conversational Style:** Write prompts conversationally - AI understands natural language well.",
    "📊 **Structured Prompts:** Use frameworks like 'Role-Task-Format' to structure complex prompts effectively.",
    "🔍 **Question Assumptions:** Challenge AI outputs and ask it to consider alternative viewpoints.",
    "🎓 **Stay Updated:** AI capabilities improve monthly. Follow AI news to leverage new features.",
    "🌐 **Cross-Functional Use:** Apply AI across departments - marketing, operations, HR, finance, R&D.",
    "💡 **Problem Reframing:** If AI doesn't solve your problem, try rephrasing it from a different angle.",
    "🎯 **Specificity Wins:** The more specific your prompt, the better the output. Vague prompts get vague results.",
    "📚 **Learn Prompt Patterns:** Study successful prompts from others to improve your own prompt engineering.",
    "🔄 **Incremental Improvement:** Make small adjustments to prompts rather than complete rewrites.",
    "🌟 **Celebrate Wins:** Share AI success stories with your team to build enthusiasm and adoption.",
    "⏰ **Batch Processing:** Group similar AI tasks together for efficiency and consistency.",
    "🎨 **Style Consistency:** Define and reuse style guidelines in prompts for consistent brand voice.",
    "🔒 **Access Control:** Use team-approved AI tools with proper access controls for collaborative work.",
    "📈 **Benchmark Performance:** Compare AI output quality against manual work to validate value.",
    "🌐 **Language Flexibility:** Use AI to translate and localize content for global audiences.",
    "💡 **Reverse Engineering:** Show AI a desired output and ask how to achieve it - great for learning!",
    "🎯 **Persona Development:** Create detailed personas in prompts for more targeted, relevant outputs.",
    "📊 **Data Visualization:** Use AI to generate charts, graphs, and visual summaries of complex data.",
    "🔍 **Error Analysis:** When AI makes mistakes, analyze why to improve future prompts.",
    "🎓 **Training Materials:** Use AI to create training content, quizzes, and learning resources.",
    "🔄 **Template Creation:** Build reusable templates with AI that your team can adapt.",
    "🌟 **Innovation Catalyst:** Use AI to challenge conventional thinking and spark innovation.",
    "📝 **Meeting Preparation:** Use AI to prepare agendas, briefing materials, and discussion points.",
    "🎨 **Content Repurposing:** Transform one content format to another - blog to presentation, email to social post.",
    "🔗 **API Integration:** Explore AI APIs to automate workflows and integrate with other tools.",
    "⚖️ **Bias Detection:** Ask AI to check content for potential biases or problematic language.",
    "🎯 **Goal Alignment:** Ensure AI use aligns with business objectives and key results (OKRs).",
    "💬 **Stakeholder Communication:** Use AI to draft communications tailored to different stakeholder groups.",
    "📊 **Reporting Automation:** Generate regular reports and summaries using AI to save hours weekly.",
    "🔍 **Competitive Analysis:** Use AI to analyze competitor information and market trends.",
    "🎓 **Skill Development:** Use AI as a tutor to learn new skills - programming, languages, tools.",
    "🌐 **Accessibility:** Use AI to create alt text, captions, and accessible content formats.",
    "💡 **Hypothesis Testing:** Use AI to quickly test ideas before investing significant resources.",
    "🎯 **Customer Insights:** Analyze customer feedback with AI to identify patterns and opportunities.",
    "📚 **Knowledge Management:** Use AI to organize, summarize, and retrieve organizational knowledge.",
    "🔄 **Process Optimization:** Identify workflow bottlenecks and optimization opportunities with AI analysis.",
    "🌟 **Change Management:** Use AI to create change management materials and communication plans.",
    "⏰ **Scheduling Optimization:** Use AI to optimize schedules, resource allocation, and planning.",
    "🎨 **Brand Consistency:** Train AI on brand guidelines to ensure consistent messaging.",
    "🔒 **Security Awareness:** Regularly review AI tool security updates and compliance certifications.",
    "📈 **Performance Metrics:** Define and track AI usage metrics - adoption rate, time saved, quality scores.",
    "🌐 **Global Collaboration:** Use AI translation for real-time collaboration across language barriers.",
    "💡 **Innovation Workshops:** Facilitate brainstorming sessions with AI-generated ideas and prompts.",
    "🎯 **Decision Support:** Use AI analysis to inform decisions, but keep final decision-making human.",
    "📊 **Trend Analysis:** Identify emerging trends in your industry using AI-powered analysis.",
    "🔍 **Quality Assurance:** Use AI to review documents for consistency, errors, and compliance.",
    "🎓 **Onboarding:** Create personalized onboarding materials and training plans with AI.",
    "🔄 **Continuous Improvement:** Regularly review and refine your AI workflows for better results.",
    "🌟 **Employee Enablement:** Empower teams with AI training and tools to boost productivity.",
    "📝 **Documentation:** Use AI to create and maintain technical documentation and user guides.",
    "🎨 **Creative Exploration:** Push creative boundaries by combining AI suggestions with human creativity.",
    "🔗 **System Integration:** Connect AI tools with your existing tech stack for seamless workflows."
  ]
}

// New Tools Highlights
export function getNewToolsHighlights(): string[] {
  return [
    "🆕 **Claude 3** - Anthropic's latest AI assistant with improved reasoning, coding capabilities, and longer context windows!",
    "✨ **Gemini** - Google's multimodal AI that can understand text, images, audio, and video all at once!",
    "🔍 **Perplexity AI** - Combines search with AI chat, providing answers with real-time sources and citations!",
    "🎨 **Midjourney** - Revolutionary AI image generator creating stunning visuals from text descriptions!",
    "🎬 **Runway** - AI-powered video editing and generation tool for creative professionals!",
    "🤖 **Microsoft Copilot** - Integrated AI assistant across Microsoft 365 apps for enhanced productivity!",
    "📝 **Notion AI** - Smart writing assistant built into Notion for better documentation and collaboration!",
    "💻 **GitHub Copilot** - AI pair programmer that suggests code and entire functions in real-time!",
    "🧪 **Hugging Face** - Leading platform for open-source AI models and collaborative AI development!",
    "🔬 **IBM watsonx** - Enterprise AI platform designed for business applications and regulatory compliance!"
  ]
}

// Get random AI content for variety
export function getRandomAIContent(type: 'fact' | 'joke' | 'tip' | 'tool'): string {
  const collections = {
    fact: getAIFunFacts(),
    joke: getAIJokes(),
    tip: getEducationalAITips(),
    tool: getNewToolsHighlights()
  }
  const items = collections[type]
  return items[Math.floor(Math.random() * items.length)]
}

// Sonnil Q. Le Profile Knowledge Base
export function getSonnilLeProfile(): {
  shortBio: string
  fullBio: string
  title: string
  role: string
  experience: string
  keyProjects: string[]
  certifications: string[]
  education: string
  expertise: string[]
  leadership: string[]
  contact: string
} {
  return {
    title: "Associate Director of Quality Operations Data Analytics",
    role: "Leading digital transformation, data analytics, and AI initiatives across Manufacturing & Supply Quality at Sanofi",
    experience: "19 years of professional experience (since 2006), 17 years at Sanofi (since 2008) in data analytics, business intelligence, and digital product management",
    shortBio: "Sonnil Q. Le is the Associate Director of Quality Operations Data Analytics at Sanofi, leading digital transformation, data analytics, and AI initiatives across Manufacturing & Supply Quality. He's a Certified SAFe Product Owner/Product Manager with 19 years of professional experience (17 years at Sanofi since 2008) delivering innovative BI and AI solutions such as Ignyte SPC, Real Time Release, S.P.A.C.E., and AI-Compass to drive operational excellence and data-driven decision-making.",
    fullBio: `Sonnil Q. Le is the Associate Director of Quality Operations Data Analytics at Sanofi, where he leads digital and data transformation initiatives that enable operational excellence and regulatory readiness across Manufacturing & Supply (M&S) Quality.

With 19 years of professional experience (17 years at Sanofi since 2008) in data analytics, business intelligence, and digital product management, Sonnil has a proven record of delivering high-impact solutions that automate processes, enhance decision-making, and bridge business and technology.

He has served as Product Owner for key global quality platforms including Ignyte SPC and Real Time Release, and currently leads the development of enterprise-level data solutions such as the S.P.A.C.E. Power BI ecosystem for Lot Release and Inspection Readiness and the AI-Compass initiative, which leverages Agentic AI to align internal and external AI capabilities.

Sonnil is a Certified SAFe Product Owner/Product Manager and an MBA graduate with dual concentrations in Management Information Systems and Global Business. He is recognized for his leadership in democratizing analytics, mentoring citizen developers, and fostering an Agile, data-driven culture across Sanofi's global network.

Beyond his corporate work, Sonnil is an entrepreneur and innovator, passionate about building digital products that connect data, people, and purpose—from real estate platforms to AI-powered business tools.`,
    keyProjects: [
      "AI-Compass: Agentic AI platform aligning internal and external AI capabilities",
      "S.P.A.C.E.: Power BI ecosystem for Lot Release and Inspection Readiness",
      "Ignyte SPC: Global quality platform for Statistical Process Control",
      "Real Time Release: Quality automation and regulatory readiness platform"
    ],
    certifications: [
      "Certified SAFe Product Owner/Product Manager"
    ],
    education: "MBA with dual concentrations in Management Information Systems and Global Business",
    expertise: [
      "Data Analytics & Business Intelligence",
      "Digital Transformation & Product Management",
      "AI/ML Solutions & Agentic AI",
      "Quality Operations & Manufacturing Excellence",
      "Power BI & Analytics Democratization",
      "Agile/SAFe Methodologies",
      "Citizen Developer Enablement",
      "Regulatory Readiness & Compliance"
    ],
    leadership: [
      "Democratizing analytics across Sanofi's global network",
      "Mentoring citizen developers and analytics champions",
      "Fostering Agile, data-driven culture",
      "Bridging business and technology teams",
      "Leading digital transformation in M&S Quality",
      "Automating processes for operational excellence"
    ],
    contact: "Sonnil.le@Sanofi.com"
  }
}

// Get response about Sonnil Le based on query
export function getSonnilLeResponse(query: string): string {
  const profile = getSonnilLeProfile()
  const lowerQuery = query.toLowerCase()
  
  // Detailed bio request
  if (lowerQuery.includes('more') || lowerQuery.includes('detail') || lowerQuery.includes('full') || 
      lowerQuery.includes('background') || lowerQuery.includes('career') || lowerQuery.includes('experience')) {
    let response = `## 👤 About Sonnil Q. Le - Full Profile\n\n`
    response += `![Sonnil Q. Le](${window.location.origin}/AI-Compass/images/sonnil-le-profile.jpg)\n\n`
    response += `**${profile.title}**\n_${profile.role}_\n\n`
    response += `---\n\n`
    response += profile.fullBio
    response += `\n\n---\n\n`
    response += `**📧 Contact:** ${profile.contact}`
    return response
  }
  
  // Projects focus
  if (lowerQuery.includes('project') || lowerQuery.includes('built') || lowerQuery.includes('created') || lowerQuery.includes('developed')) {
    let response = `## 🚀 Sonnil Q. Le's Key Projects\n\n`
    response += `As Product Owner and technical leader, Sonnil has delivered several high-impact solutions:\n\n`
    profile.keyProjects.forEach((project, i) => {
      response += `**${i + 1}. ${project}**\n\n`
    })
    response += `These platforms drive operational excellence, automate quality processes, and enable data-driven decision-making across Sanofi's global manufacturing network.`
    return response
  }
  
  // Expertise focus
  if (lowerQuery.includes('expertise') || lowerQuery.includes('skill') || lowerQuery.includes('specialize') || lowerQuery.includes('expert in')) {
    let response = `## 💡 Sonnil Q. Le's Expertise\n\n`
    response += `**Core Competencies:**\n\n`
    profile.expertise.forEach(exp => {
      response += `✓ ${exp}\n`
    })
    response += `\n**Education:** ${profile.education}\n`
    response += `**Certifications:** ${profile.certifications.join(', ')}`
    return response
  }
  
  // Leadership focus
  if (lowerQuery.includes('leadership') || lowerQuery.includes('lead') || lowerQuery.includes('manage') || lowerQuery.includes('mentor')) {
    let response = `## 🌟 Sonnil Q. Le's Leadership Impact\n\n`
    response += `Sonnil is recognized for transformational leadership in:\n\n`
    profile.leadership.forEach(lead => {
      response += `🎯 ${lead}\n`
    })
    return response
  }
  
  // Photo request
  if (lowerQuery.includes('photo') || lowerQuery.includes('picture') || lowerQuery.includes('image') || lowerQuery.includes('look like')) {
    let response = `## 👤 Sonnil Q. Le\n\n`
    response += `![Sonnil Q. Le - Associate Director, Quality Operations Data Analytics](${window.location.origin}/AI-Compass/images/sonnil-le-profile.jpg)\n\n`
    response += `**${profile.title}**\n${profile.role}\n\n`
    response += `📧 **Contact:** ${profile.contact}\n\n`
    response += `Want to know more about Sonnil's background, projects, or expertise? Just ask!`
    return response
  }
  
  // Contact info
  if (lowerQuery.includes('contact') || lowerQuery.includes('reach') || lowerQuery.includes('email')) {
    let response = `## 📧 Contact Sonnil Q. Le\n\n`
    response += `![Sonnil Q. Le](${window.location.origin}/AI-Compass/images/sonnil-le-profile.jpg)\n\n`
    response += `**Email:** ${profile.contact}\n\n`
    response += `Sonnil welcomes questions, feedback, and collaboration ideas about AI-Compass and other data analytics initiatives at Sanofi.\n\n`
    response += `Feel free to reach out for:\n`
    response += `• AI-Compass platform feedback or feature requests\n`
    response += `• Data analytics collaboration opportunities\n`
    response += `• Digital transformation discussions\n`
    response += `• AI/ML solution inquiries`
    return response
  }
  
  // Short bio (default)
  let response = `## 👤 About Sonnil Q. Le\n\n`
  response += `![Sonnil Q. Le](${window.location.origin}/AI-Compass/images/sonnil-le-profile.jpg)\n\n`
  response += `**${profile.title}**\n\n`
  response += profile.shortBio
  response += `\n\n**🚀 Key Projects:**\n`
  profile.keyProjects.slice(0, 2).forEach(project => {
    response += `• ${project}\n`
  })
  response += `\n\n💡 **Want to know more?** Ask me about:\n`
  response += `• "Tell me more about Sonnil" (full background)\n`
  response += `• "What projects has Sonnil built?"\n`
  response += `• "What is Sonnil's expertise?"\n`
  response += `• "How do I contact Sonnil?"`
  
  return response
}

// Direct contact response for AI-Compass team/SONA
export function getContactResponse(query: string): string {
  const lower = query.toLowerCase()
  const email = getSonnilLeProfile().contact
  // If the user mentions Sonnil explicitly, keep it personalized, otherwise answer succinctly
  if (lower.includes('sonnil')) {
    return `📧 Contact Sonnil Q. Le: ${email}`
  }
  return `📧 You can contact the AI‑Compass team at: ${email}`
}

// AI Compass Platform Features Knowledge Base
export function getAICompassFeatures(): {
  overview: string
  coreFeatures: Array<{ name: string; description: string; location: string; howTo: string }>
  headerButtons: Array<{ name: string; icon: string; purpose: string; location: string }>
  searchAndFilter: { description: string; features: string[]; howTo: string }
  comparison: { description: string; features: string[]; howTo: string }
  chatbot: { description: string; capabilities: string[]; howTo: string }
  themes: { description: string; options: string[]; howTo: string }
  languages: { description: string; supported: string[]; howTo: string }
  projectStatusBadges: {
    description: string
    location: string
    statusTypes: Array<{ status: string; color: string; meaning: string }>
    deploymentPhase: { description: string; purpose: string }
    statusLastUpdated: { description: string; format: string }
    howToInterpret: string[]
  }
  analytics: { 
    description: string
    metrics: string[]
    howTo: string
    whatItDoes: string
    howToAccess: string
    detailedMetrics: {
      toolDistribution: { description: string; insights: string[]; useCase: string }
      featureCoverage: { description: string; insights: string[]; useCase: string }
      targetAudience: { description: string; insights: string[]; useCase: string }
      categoryBreakdown: { description: string; insights: string[]; useCase: string }
      technologyStack: { description: string; insights: string[]; useCase: string }
      costAnalysis: { description: string; insights: string[]; useCase: string }
      maturityLevels: { description: string; insights: string[]; useCase: string }
      usagePatterns: { description: string; insights: string[]; useCase: string }
    }
  }
  about: { description: string; sections: string[]; howTo: string }
} {
  return {
    overview: "AI Compass is Sanofi's comprehensive AI tools catalog platform with 43+ internal and external AI tools, featuring smart search, comparison tools, analytics dashboard, multilingual support, and an intelligent chatbot assistant (me, SONA!).",
    coreFeatures: [
      {
        name: "Smart Search & Filters",
        description: "Powerful search bar with real-time filtering across tool names, features, purposes, and capabilities",
        location: "Top of main page, below header",
        howTo: "Type keywords in the search box. Use scope filters (All/Internal/External) to narrow results. Search works across all tool metadata including features, capabilities, and use cases."
      },
      {
        name: "Tool Comparison",
        description: "Side-by-side comparison of multiple AI tools with detailed feature breakdown in a full comparison modal",
        location: "Click 'Add to compare' on tool cards; comparison bar appears at bottom",
        howTo: "Click '+ Add to compare' on up to 4 tool cards. Comparison bar appears at bottom showing selected tools. Click 'Compare Now' button to open full-screen comparison modal with detailed side-by-side analysis including Type, Primary Purpose, Target Users, Technology, Best Use Case, Cost, Capabilities (Web Search, Code Generation, Image Generation), Access Link, and Tags. Click 'X' or backdrop to close modal."
      },
      {
        name: "SONA Chatbot",
        description: "Intelligent AI assistant that knows all tools, Sanofi info, AI tips, and can recommend tools based on your needs",
        location: "Purple chat bubble in bottom-right corner",
        howTo: "Click the chat icon. Ask questions like 'recommend a tool for coding', 'compare ChatGPT vs Claude', 'what's the latest Sanofi news', or 'tell me an AI joke'. SONA provides personalized recommendations and detailed tool information."
      },
      {
        name: "Analytics Dashboard",
        description: "Visual insights into tool usage, distribution, and catalog statistics",
        location: "Click 'Analytics' button in header",
        howTo: "Access from header button with bar chart icon. View tool distribution by type (internal/external), feature analysis, capability metrics, and usage statistics."
      },
      {
        name: "About Section",
        description: "Comprehensive information about AI Compass platform, team, mission, and value proposition",
        location: "Click 'About' button in header",
        howTo: "Access from header button with info icon. Two tabs available: 'For Users & Consumers' (features, team, contact) and 'For Stakeholders & Investors' (strategic value, governance, ROI)."
      },
      {
        name: "Suggestion Box",
        description: "Submit ideas for new AI tools, features, or capabilities you'd like to see",
        location: "Click 'Suggest' button in header",
        howTo: "Click lightbulb icon in header. Type your suggestion or wish for an AI Agent/capability. Submit to email your idea to the AI Compass team (Sonnil Le)."
      },
      {
        name: "Welcome Popup",
        description: "Daily rotating content showing AI tips, fun facts, jokes, or new tool highlights",
        location: "Appears automatically on page load",
        howTo: "Popup shows automatically when you visit. Displays random content (fun fact, AI joke, pro tip, or new tool highlight). Click 'X' or action button to close."
      },
      {
        name: "Dark/Light Mode",
        description: "Toggle between dark and light themes for comfortable viewing",
        location: "Settings dropdown in header",
        howTo: "Click 'Settings' gear icon → Select 'Light Mode' or 'Dark Mode'. Theme persists across sessions."
      },
      {
        name: "Language Selection",
        description: "Interface available in 8 languages for global accessibility",
        location: "Settings dropdown in header",
        howTo: "Click 'Settings' → Select language from dropdown. Supports: English, Français, Español, Deutsch, Português (BR), 中文, 日本語, Tiếng Việt."
      },
      {
        name: "Catalog Refresh",
        description: "Sync with external feeds to get latest tool updates",
        location: "Settings dropdown in header",
        howTo: "Click 'Settings' → 'Refresh Catalog'. Fetches latest tool data from configured feeds and updates the catalog."
      },
      {
        name: "Project Status Badges",
        description: "Color-coded status indicators on tool cards showing project lifecycle stage (Production, Scaling, Development, External), deployment phase, and last update date",
        location: "Front of each tool card, below tool name and above description",
        howTo: "Status badges appear automatically on each tool card. Green = Production-ready, Blue = Scaling, Orange = Development, Gray = External tool. Also displays deployment phase (🚀) and status last updated (📅). Use these to quickly assess tool maturity and readiness for your use case."
      }
    ],
    headerButtons: [
      { name: "Analytics", icon: "📊", purpose: "View usage statistics and tool distribution metrics", location: "Top header, left side" },
      { name: "About", icon: "ℹ️", purpose: "Learn about AI Compass platform, team, and mission", location: "Top header, left side" },
      { name: "Suggest", icon: "💡", purpose: "Submit ideas for new AI tools or features", location: "Top header, left side" },
      { name: "Settings", icon: "⚙️", purpose: "Access language, theme, and refresh options", location: "Top header, right side" },
      { name: "User Profile", icon: "👤", purpose: "Shows your name and job title", location: "Top header, far right" },
      { name: "Logout", icon: "🚪", purpose: "Sign out of the platform", location: "Top header, far right" }
    ],
    searchAndFilter: {
      description: "Real-time search with smart filtering across all tool metadata",
      features: [
        "Search by tool name, purpose, features, or capabilities",
        "Scope filters: All tools, Internal only, or External only",
        "Results count displayed in real-time",
        "Instant filtering as you type",
        "Search across 43+ tools with comprehensive metadata"
      ],
      howTo: "1. Locate search bar at top of main page. 2. Type keywords (e.g., 'code', 'medical', 'writing'). 3. Use scope buttons to filter by Internal/External/All. 4. Click 'Clear' to reset filters."
    },
    comparison: {
      description: "Side-by-side tool comparison with detailed feature analysis",
      features: [
        "Compare 2-10 tools simultaneously",
        "Feature-by-feature breakdown",
        "Access links, training, support information",
        "Capability matrix (Yes/No for each feature)",
        "Maximize/minimize comparison view",
        "Add/remove tools from comparison on the fly"
      ],
      howTo: "1. Click '+ Add to compare' on tool cards. 2. Select 2+ tools. 3. Click 'Compare (X)' button in header. 4. View splits: top = tool cards, bottom = comparison table. 5. Use up/down arrow to maximize/minimize. 6. Click 'X' on tool columns to remove from comparison."
    },
    chatbot: {
      description: "SONA - Your intelligent AI Compass assistant with comprehensive knowledge",
      capabilities: [
        "Tool recommendations based on your needs",
        "Tool comparisons and feature explanations",
        "Sanofi company news and information",
        "AI tips, tricks, and best practices",
        "Fun facts and jokes about AI",
        "Educational content on AI usage",
        "Access requirements and training info",
        "Platform features and how-to guidance"
      ],
      howTo: "1. Click purple chat bubble in bottom-right. 2. Type your question or request. 3. Examples: 'recommend a tool for presentations', 'what's new at Sanofi', 'tell me an AI joke', 'compare ChatGPT vs Gemini'. 4. SONA provides contextual, personalized responses with sources."
    },
    themes: {
      description: "Beautiful dark and light themes with smooth transitions",
      options: ["Light Mode (default)", "Dark Mode"],
      howTo: "Settings (gear icon) → Click 'Light Mode' or 'Dark Mode'. Theme applies instantly and saves to your profile."
    },
    languages: {
      description: "Multilingual interface for global Sanofi teams",
      supported: ["🇺🇸 English", "🇫🇷 Français", "🇪🇸 Español", "🇩🇪 Deutsch", "🇧🇷 Português (BR)", "🇨🇳 中文", "🇯🇵 日本語", "🇻🇳 Tiếng Việt"],
      howTo: "Settings → Select language from dropdown menu. Interface translates instantly and preference is saved."
    },
    projectStatusBadges: {
      description: "Color-coded status badges on tool cards showing project lifecycle stage, deployment phase, and last update date",
      location: "Front of each tool card, displayed below the tool name and above the primary purpose description",
      statusTypes: [
        {
          status: "Production",
          color: "Green gradient (emerald-500 to green-600)",
          meaning: "Tool is live, stable, and ready for enterprise use. Fully supported and production-ready."
        },
        {
          status: "Scaling",
          color: "Blue gradient (blue-500 to cyan-500)",
          meaning: "Tool is operational and being scaled for broader adoption. May have limited availability or expanding features."
        },
        {
          status: "Development",
          color: "Amber/Orange gradient (amber-500 to orange-500)",
          meaning: "Tool is in active development, pilot phase, or experimental stage. May have limited features or instability."
        },
        {
          status: "External Tool - Not Applicable",
          color: "Gray gradient (gray-500 to slate-500)",
          meaning: "External commercial tool not developed internally. Status tracking does not apply."
        }
      ],
      deploymentPhase: {
        description: "Shows the current deployment phase or stage of the tool's lifecycle",
        purpose: "Provides context about where the tool is in its journey - e.g., 'Enterprise Deployment', 'Pilot Program', 'Beta Testing', etc. Indicated with 🚀 rocket emoji."
      },
      statusLastUpdated: {
        description: "Shows when the project status was last verified or updated",
        format: "YYYY-MM format (e.g., 2025-01). Indicated with 📅 calendar emoji."
      },
      howToInterpret: [
        "Green badges = Production-ready tools you can confidently use for critical work",
        "Blue badges = Scaling tools that are operational but may have growing pains or limited access",
        "Orange badges = Development/experimental tools - use with caution, expect changes",
        "Gray badges = External tools - status managed by third-party vendors, not tracked internally",
        "Check deployment phase for specific stage info (e.g., 'Enterprise Rollout', 'Pilot Testing')",
        "Status last updated shows freshness of information - recent dates mean current tracking"
      ]
    },
    analytics: {
      description: "Visual dashboard showing tool catalog insights and metrics",
      metrics: [
        "Tool distribution (internal vs external)",
        "Category breakdown",
        "Feature coverage analysis",
        "Capability matrix",
        "Usage patterns",
        "Tool maturity levels"
      ],
      howTo: "Click 'Analytics' button in header (bar chart icon). View interactive charts and metrics. Return to main view anytime.",
      whatItDoes: "The Analytics dashboard provides data-driven insights into the AI tool catalog including: distribution by type (internal/external), feature coverage (which tools have real-time search, code generation, image generation, etc.), capability metrics, technology breakdown, cost analysis, and target user segmentation. Use it to understand tool landscape, identify gaps, and make informed decisions about tool adoption.",
      howToAccess: "Click the 'Analytics' button (📊 bar chart icon) in the top header. The dashboard opens with interactive visualizations. You can filter by tool type, explore specific metrics, and export insights.",
      detailedMetrics: {
        toolDistribution: {
          description: "Breakdown of tools by type (internal Sanofi tools vs external commercial tools)",
          insights: ["See which tools are built in-house vs licensed", "Understand internal vs external tool balance", "Identify over-reliance on external vendors"],
          useCase: "Strategic planning for tool portfolio management"
        },
        featureCoverage: {
          description: "Analysis of which tools have specific capabilities (code generation, image creation, data analysis, etc.)",
          insights: ["Identify capability gaps", "See which features are most/least covered", "Find overlapping capabilities"],
          useCase: "Feature gap analysis and redundancy detection"
        },
        targetAudience: {
          description: "Segmentation showing which tools serve which user groups (R&D, manufacturing, clinical, IT, etc.)",
          insights: ["See tool availability per department", "Identify underserved audiences", "Balance tool coverage across teams"],
          useCase: "Ensuring equitable tool access across Sanofi"
        },
        categoryBreakdown: {
          description: "Distribution across categories (productivity, research, creative, data, collaboration)",
          insights: ["Most/least represented categories", "Category gaps in portfolio", "Category-specific tool density"],
          useCase: "Portfolio diversification and strategic investment"
        },
        technologyStack: {
          description: "Technologies powering the tools (GPT-4, Claude, Gemini, LLaMA, custom models)",
          insights: ["See which AI models are most used", "Technology diversity in portfolio", "Vendor concentration risk"],
          useCase: "Technology strategy and vendor diversification"
        },
        costAnalysis: {
          description: "Free vs paid tools breakdown with cost structure insights",
          insights: ["Budget allocation across tools", "Cost-benefit analysis opportunities", "Free alternative identification"],
          useCase: "Financial planning and cost optimization"
        },
        maturityLevels: {
          description: "Tool maturity stages (pilot, production, enterprise-scale)",
          insights: ["Production-ready vs experimental tools", "Maturity distribution", "Risk assessment"],
          useCase: "Risk management and adoption planning"
        },
        usagePatterns: {
          description: "Insights into how tools are being discovered and compared",
          insights: ["Most searched categories", "Common comparison pairs", "Popular feature filters"],
          useCase: "Understanding user needs and platform optimization"
        }
      }
    },
    about: {
      description: "Comprehensive platform information with dual-tab view",
      sections: [
        "Product overview and key features",
        "Team information and contact details",
        "Mission and strategic vision",
        "Value proposition for stakeholders",
        "Governance and compliance",
        "ROI and efficiency metrics"
      ],
      howTo: "Click 'About' button in header (info icon). Two tabs: 'For Users' (features, team) and 'For Stakeholders' (strategy, value). Switch tabs to view different perspectives."
    }
  }
}

// Sanofi Company Knowledge Base
export function getSanofiKnowledge(): {
  mission: string
  strategy: string
  therapeuticAreas: string[]
  pipeline: { phase1: number; phase2: number; phase3: number; registration: number; total: number }
  recentNews: Array<{ date: string; title: string; description: string }>
  keyFacts: string[]
  values: string[]
  innovation: string[]
} {
  return {
    mission: "We chase the miracles of science to improve people's lives. Sanofi is an R&D driven, AI-powered biopharma company committed to improving people's lives and creating compelling growth.",
    strategy: "Further, Faster for Patients - We're on a mission to go further, faster for patients. To take the lead through breakthrough science and by leveraging our broad set of technology and manufacturing platforms, including mRNA.",
    therapeuticAreas: [
      "Immunology and Inflammation",
      "Oncology",
      "Rare Diseases",
      "Rare Blood Disorders",
      "Neurology",
      "Vaccines"
    ],
    pipeline: {
      phase1: 16,
      phase2: 36,
      phase3: 24,
      registration: 6,
      total: 82
    },
    recentNews: [
      {
        date: "October 22, 2025",
        title: "Efdoralprin alfa Success in Alpha-1 Antitrypsin Deficiency",
        description: "Sanofi's efdoralprin alfa met all primary and key secondary endpoints in alpha-1 antitrypsin deficiency emphysema phase 2 study"
      },
      {
        date: "October 20, 2025",
        title: "Tzield Accepted for Expedited Review",
        description: "Sanofi's Tzield accepted for expedited review in the US for stage 3 type 1 diabetes through FDA Commissioner's National Priority Voucher pilot program"
      },
      {
        date: "October 20, 2025",
        title: "AlphaMedix Phase 2 Data at ESMO",
        description: "ESMO: AlphaMedix phase 2 data support first-in-class potential of new targeted alpha therapy in gastroenteropancreatic neuroendocrine tumors"
      },
      {
        date: "October 20, 2025",
        title: "High-Dose Influenza Vaccine Success",
        description: "Sanofi's high-dose influenza vaccine demonstrates superior protection for older adults against hospitalization vs standard-dose"
      },
      {
        date: "October 8, 2025",
        title: "Modulus: Redefining Biopharma Manufacturing",
        description: "Sanofi's Modulus facility is redefining the future of biopharma manufacturing with cutting-edge capabilities"
      }
    ],
    keyFacts: [
      "82 compounds in clinical development across 6 therapeutic areas",
      "24 clinical trials currently in phase 3",
      "6 compounds submitted for regulatory approval",
      "Leading AI-powered biopharma company with deep immune system expertise",
      "Pioneer in mRNA technology and innovative manufacturing platforms",
      "Strong focus on immunology, oncology, rare diseases, neurology, and vaccines",
      "Dupixent: Leading immunology therapy with multiple indications",
      "Sarclisa: Advancing treatment of multiple myeloma",
      "Global presence serving millions of patients worldwide",
      "Commitment to sustainability and equitable healthcare access"
    ],
    values: [
      "Pursue Progress, Discover Extraordinary",
      "Patient-centric innovation and breakthrough science",
      "Diversity, Equity, and Inclusion in everything we do",
      "Sustainability: tackling environmental impact on health",
      "Responsible AI practices and ethical innovation",
      "Collaboration across GBUs and functions",
      "Scientific excellence and regulatory compliance"
    ],
    innovation: [
      "AI-powered drug discovery and development",
      "mRNA vaccine and therapeutic platforms",
      "Nanobody VHH technology for bispecific antibodies",
      "Gene therapy (AAV vectors) for rare diseases",
      "Targeted alpha therapy for oncology",
      "Digital transformation across value chain",
      "Advanced manufacturing capabilities (Modulus)",
      "Immunology expertise applied across therapeutic areas"
    ]
  }
}

// Get Sanofi news and information based on query
export function getSanofiResponse(query: string): string {
  const knowledge = getSanofiKnowledge()
  const lowerQuery = query.toLowerCase()
  
  // News-related queries
  if (lowerQuery.includes('news') || lowerQuery.includes('latest') || lowerQuery.includes('recent') || lowerQuery.includes('announcement')) {
    let response = `## 📰 Latest Sanofi News & Updates\n\n`
    response += `Here are the most recent announcements from Sanofi:\n\n`
    
    knowledge.recentNews.slice(0, 3).forEach((news, i) => {
      response += `**${i + 1}. ${news.title}** (${news.date})\n${news.description}\n\n`
    })
    
    response += `---\n\n`
    response += `📍 **Sources:**\n`
    response += `• [Sanofi Official Press Releases](https://www.sanofi.com/en/media-room/press-releases)\n`
    response += `• [Fierce Biotech](https://www.fiercebiotech.com) - Biotechnology Industry News\n`
    response += `• [Wall Street Journal](https://www.wsj.com) - Business & Pharmaceutical Coverage\n`
    response += `• [Bloomberg](https://www.bloomberg.com) - Market & Industry Analysis\n`
    response += `• [Reuters](https://www.reuters.com) - Global News & Healthcare\n`
    response += `• [Financial Times](https://www.ft.com) - Pharmaceutical Industry\n`
    response += `• [CNN](https://www.cnn.com) - Health & Business News\n\n`
    response += `🔗 **For comprehensive coverage:** Visit [www.sanofi.com/media-room](https://www.sanofi.com/en/media-room) for complete press releases and investor updates\n\n`
    response += `💡 Want to know more about Sanofi's strategy, pipeline, or specific therapeutic areas? Just ask!`
    return response
  }
  
  // Pipeline and R&D queries
  if (lowerQuery.includes('pipeline') || lowerQuery.includes('drug') || lowerQuery.includes('clinical trial') || lowerQuery.includes('development')) {
    let response = `## 🔬 Sanofi's R&D Pipeline\n\n`
    response += `Sanofi has a robust pipeline with **${knowledge.pipeline.total} compounds** in clinical development:\n\n`
    response += `📊 **Pipeline Breakdown:**\n`
    response += `• Phase 1: ${knowledge.pipeline.phase1} projects\n`
    response += `• Phase 2: ${knowledge.pipeline.phase2} projects\n`
    response += `• Phase 3: ${knowledge.pipeline.phase3} projects\n`
    response += `• Registration: ${knowledge.pipeline.registration} projects\n\n`
    response += `🎯 **6 Therapeutic Areas:**\n`
    knowledge.therapeuticAreas.forEach(area => {
      response += `• ${area}\n`
    })
    response += `\n**Key Innovation Platforms:**\n`
    knowledge.innovation.slice(0, 5).forEach(innovation => {
      response += `✨ ${innovation}\n`
    })
    response += `\n---\n\n`
    response += `📍 **Source:** [Sanofi Pipeline](https://www.sanofi.com/en/our-science/our-pipeline) (Updated July 31, 2025)\n`
    response += `🔗 **Learn more:** [www.sanofi.com/our-science](https://www.sanofi.com/en/our-science)`
    return response
  }
  
  // Therapeutic area queries
  if (lowerQuery.includes('therapeutic') || lowerQuery.includes('disease') || lowerQuery.includes('immunology') || 
      lowerQuery.includes('oncology') || lowerQuery.includes('vaccine') || lowerQuery.includes('rare disease')) {
    let response = `## 🎯 Sanofi's Therapeutic Focus Areas\n\n`
    response += `Sanofi focuses on **6 key therapeutic areas** where we can make the greatest impact:\n\n`
    
    const areaDetails = {
      "Immunology and Inflammation": "Leading with Dupixent and advancing treatments for asthma, atopic dermatitis, ulcerative colitis, Crohn's disease, and more",
      "Oncology": "Developing targeted therapies including Sarclisa for multiple myeloma and innovative alpha-emitter therapies",
      "Rare Diseases": "Enzyme replacement therapies, gene therapies, and novel treatments for orphan diseases",
      "Rare Blood Disorders": "BTK inhibitors and innovative approaches for hemophilia, immune thrombocytopenia, and more",
      "Neurology": "Breakthrough treatments for MS, Parkinson's disease, and neurodegenerative conditions",
      "Vaccines": "mRNA vaccines for flu, RSV, COVID-19, and traditional vaccines for meningitis, pneumococcal disease"
    }
    
    Object.entries(areaDetails).forEach(([area, description]) => {
      response += `**${area}**\n${description}\n\n`
    })
    
    response += `---\n\n`
    response += `📍 **Source:** [Sanofi Therapeutic Areas](https://www.sanofi.com/en/our-science/therapeutic-areas)\n`
    response += `🔗 **Explore more:** [www.sanofi.com/our-science](https://www.sanofi.com/en/our-science)`
    return response
  }
  
  // Mission, strategy, values queries
  if (lowerQuery.includes('mission') || lowerQuery.includes('strategy') || lowerQuery.includes('value') || 
      lowerQuery.includes('purpose') || lowerQuery.includes('vision')) {
    let response = `## 🎯 Sanofi's Mission & Strategy\n\n`
    response += `**Mission:**\n${knowledge.mission}\n\n`
    response += `**Strategy:**\n${knowledge.strategy}\n\n`
    response += `**Core Values:**\n`
    knowledge.values.forEach(value => {
      response += `• ${value}\n`
    })
    response += `\n---\n\n`
    response += `📍 **Source:** [Sanofi Strategy](https://www.sanofi.com/en/our-company/our-strategy)\n`
    response += `🔗 **Read more:** [www.sanofi.com/our-company](https://www.sanofi.com/en/our-company)`
    return response
  }
  
  // Innovation and technology queries
  if (lowerQuery.includes('innovation') || lowerQuery.includes('technology') || lowerQuery.includes('ai') || 
      lowerQuery.includes('digital') || lowerQuery.includes('mrna')) {
    let response = `## 💡 Sanofi's Innovation & Technology\n\n`
    response += `Sanofi is at the forefront of pharmaceutical innovation:\n\n`
    knowledge.innovation.forEach(tech => {
      response += `🚀 ${tech}\n`
    })
    response += `\n**AI & Digital Leadership:**\n`
    response += `• AI-powered drug discovery accelerating R&D timelines\n`
    response += `• Digital transformation across manufacturing and supply chain\n`
    response += `• AI Compass platform for internal AI tool governance\n`
    response += `• Machine learning for patient data analysis and clinical trials\n`
    response += `\n---\n\n`
    response += `📍 **Source:** [Sanofi Digital & AI](https://www.sanofi.com/en/our-science/digital-artificial-intelligence)\n`
    response += `🔗 **Discover more:** [www.sanofi.com/our-science](https://www.sanofi.com/en/our-science)`
    return response
  }
  
  // General company info
  let response = `## 🏢 About Sanofi\n\n`
  response += `${knowledge.mission}\n\n`
  response += `**Key Facts:**\n`
  knowledge.keyFacts.slice(0, 5).forEach(fact => {
    response += `• ${fact}\n`
  })
  response += `\n💡 Ask me about:\n`
  response += `• Sanofi's latest news and press releases\n`
  response += `• Our R&D pipeline and clinical trials\n`
  response += `• Specific therapeutic areas (immunology, oncology, vaccines, etc.)\n`
  response += `• Innovation and technology platforms\n`
  response += `• Company mission, strategy, and values`
  response += `\n\n---\n\n`
  response += `📍 **Source:** [Sanofi.com](https://www.sanofi.com/en) - Official Company Website\n`
  response += `🔗 **Explore:** [www.sanofi.com](https://www.sanofi.com)`
  
  return response
}

// Get AI Compass features response based on query
export function getAICompassFeaturesResponse(query: string): string {
  const features = getAICompassFeatures()
  const lowerQuery = query.toLowerCase()
  
  // Search/Filter feature queries
  if (lowerQuery.includes('search') || lowerQuery.includes('filter') || lowerQuery.includes('find tool')) {
    const feature = features.coreFeatures.find(f => f.name.includes('Search'))!
    let response = `## 🔍 Smart Search & Filters\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**How to Use:**\n${feature.howTo}\n\n`
    response += `**Features:**\n`
    features.searchAndFilter.features.forEach(f => {
      response += `✓ ${f}\n`
    })
    return response
  }
  
  // Comparison feature queries
  if (lowerQuery.includes('comparison') || lowerQuery.includes('compare') || lowerQuery.includes('side by side')) {
    const feature = features.coreFeatures.find(f => f.name.includes('Comparison'))!
    let response = `## ⚖️ Tool Comparison Feature\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**How to Use:**\n${feature.howTo}\n\n`
    response += `**Features:**\n`
    features.comparison.features.forEach(f => {
      response += `✓ ${f}\n`
    })
    response += `\n💡 **Pro Tip:** You can also ask me directly to compare tools! Try "compare ChatGPT vs Claude"`
    return response
  }
  
  // Chatbot/SONA queries
  if (lowerQuery.includes('chatbot') || lowerQuery.includes('sona') || lowerQuery.includes('chat') || lowerQuery.includes('assistant')) {
    let response = `## 💬 SONA Chatbot (That's Me!)\n\n`
    response += `${features.chatbot.description}\n\n`
    response += `**📍 Location:** Purple chat bubble in bottom-right corner\n\n`
    response += `**My Capabilities:**\n`
    features.chatbot.capabilities.forEach(cap => {
      response += `✨ ${cap}\n`
    })
    response += `\n**How to Use Me:**\n${features.chatbot.howTo}\n\n`
    response += `I'm here 24/7 to help you navigate the AI Compass platform! 🚀`
    return response
  }
  
  // Analytics queries - provide detailed insights from detailedMetrics
  if (lowerQuery.includes('analytics') || lowerQuery.includes('dashboard') || lowerQuery.includes('metrics') || lowerQuery.includes('statistics') || (lowerQuery.includes('data') && lowerQuery.includes('tool'))) {
    const dm = features.analytics.detailedMetrics
    let response = `## 📊 Analytics Dashboard - Key Insights\n\n`
    
    // Special handling for "show me analytics dashboard insights" - show comparison calculations
    if (lowerQuery.includes('show') && lowerQuery.includes('analytics') && lowerQuery.includes('dashboard') && lowerQuery.includes('insights')) {
      response += `**📊 Comparison Calculations in AI Tools Analytics:**\n\n`
      response += `**1. Tool Distribution Comparison:**\n`
      response += `• ${dm.toolDistribution.insights[0]}\n`
      response += `• ${dm.toolDistribution.insights[1]}\n\n`
      response += `**2. Feature Coverage Analysis:**\n`
      response += `• ${dm.featureCoverage.insights[0]}\n`
      response += `• ${dm.featureCoverage.insights[1]}\n\n`
      response += `**3. Target Audience Breakdown:**\n`
      response += `• ${dm.targetAudience.insights[0]}\n\n`
      response += `**4. Cost Analysis:**\n`
      response += `• ${dm.costAnalysis.insights[0]}\n\n`
      response += `🔍 **Pro Tip:** Click the 📊 Analytics button in the header to see interactive visualizations and detailed comparisons!\n`
      return response
    }
    
    // Check for specific metric queries
    if (lowerQuery.includes('tool distribution') || lowerQuery.includes('internal') || lowerQuery.includes('external') || lowerQuery.includes('view tool') || lowerQuery.includes("what's the tool distribution")) {
      response += `### ${dm.toolDistribution.description}\n\n`
      response += `**📊 Internal vs External Tools Comparison:**\n\n`
      dm.toolDistribution.insights.forEach(i => response += `• ${i}\n`)
      response += `\n**💡 Use Case:** ${dm.toolDistribution.useCase}\n\n`
      response += `🔍 **Pro Tip:** Click the 📊 Analytics button in the header to see the full comparison breakdown and visualizations!\n`
      return response
    }
    
    if (lowerQuery.includes('feature coverage') || lowerQuery.includes('analyze feature')) {
      response += `### ${dm.featureCoverage.description}\n\n`
      response += `**📈 Analytics Trending & Comparison Points:**\n\n`
      dm.featureCoverage.insights.forEach(i => response += `• ${i}\n`)
      response += `\n**💡 Use Case:** ${dm.featureCoverage.useCase}\n\n`
      response += `📊 **View Details:** Check the Analytics Dashboard to compare feature coverage across all tools and identify capability gaps.\n`
      return response
    }
    
    if (lowerQuery.includes('capability') || lowerQuery.includes('understand capability')) {
      response += `### ${dm.featureCoverage.description}\n\n`
      response += `**📈 Analytics Trending & Comparison Points:**\n\n`
      response += `**Capability Matrix Breakdown:**\n`
      dm.featureCoverage.insights.forEach(i => response += `✓ ${i}\n`)
      response += `\n**💡 Use Case:** ${dm.featureCoverage.useCase}\n\n`
      response += `📊 **View Analytics:** Click the Analytics Dashboard button to see detailed capability comparisons and trending data.\n`
      return response
    }
    
    if (lowerQuery.includes('target audience') || lowerQuery.includes('who') || lowerQuery.includes('department') || lowerQuery.includes('availability per department') || lowerQuery.includes('tool availability')) {
      response += `### ${dm.targetAudience.description}\n\n`
      response += `**🏢 Tool Breakdown by Department:**\n\n`
      dm.targetAudience.insights.forEach(i => response += `• ${i}\n`)
      response += `\n**💡 Use Case:** ${dm.targetAudience.useCase}\n\n`
      response += `📊 **View Full Breakdown:** Check the Analytics Dashboard to see complete tool availability and distribution across all departments.\n`
      return response
    }
    
    if (lowerQuery.includes('category') || lowerQuery.includes('breakdown')) {
      response += `### ${dm.categoryBreakdown.description}\n\n`
      dm.categoryBreakdown.insights.forEach(i => response += `• ${i}\n`)
      response += `\n**💡 Use Case:** ${dm.categoryBreakdown.useCase}\n`
      return response
    }
    
    if (lowerQuery.includes('technology') || lowerQuery.includes('stack') || lowerQuery.includes('tech')) {
      response += `### ${dm.technologyStack.description}\n\n`
      dm.technologyStack.insights.forEach(i => response += `• ${i}\n`)
      response += `\n**💡 Use Case:** ${dm.technologyStack.useCase}\n`
      return response
    }
    
    if (lowerQuery.includes('cost') || lowerQuery.includes('price') || lowerQuery.includes('paid') || lowerQuery.includes('free') || lowerQuery.includes('cost analysis')) {
      response += `### ${dm.costAnalysis.description}\n\n`
      response += `**📈 Analytics Trending & Comparison Points:**\n\n`
      dm.costAnalysis.insights.forEach(i => response += `• ${i}\n`)
      response += `\n**💡 Use Case:** ${dm.costAnalysis.useCase}\n\n`
      response += `📊 **View Cost Breakdown:** Check the Analytics Dashboard for detailed cost analysis and budget planning insights.\n`
      return response
    }
    
    if (lowerQuery.includes('maturity') || lowerQuery.includes('production') || lowerQuery.includes('experimental')) {
      response += `### ${dm.maturityLevels.description}\n\n`
      dm.maturityLevels.insights.forEach(i => response += `• ${i}\n`)
      response += `\n**💡 Use Case:** ${dm.maturityLevels.useCase}\n`
      return response
    }
    
    if (lowerQuery.includes('usage') || lowerQuery.includes('pattern') || lowerQuery.includes('adoption') || lowerQuery.includes('gap') || lowerQuery.includes('identify gap') || lowerQuery.includes('data-driven') || lowerQuery.includes('data driven') || lowerQuery.includes('usage patterns')) {
      response += `### ${dm.usagePatterns.description}\n\n`
      response += `**📈 Analytics Trending & Comparison Points:**\n\n`
      dm.usagePatterns.insights.forEach(i => response += `• ${i}\n`)
      response += `\n**💡 Use Case:** ${dm.usagePatterns.useCase}\n\n`
      response += `📊 **See Trending Data:** Visit the Analytics Dashboard to explore usage patterns and adoption trends across all tools.\n`
      return response
    }
    
    // Generic analytics query - provide overview
    response += `${features.analytics.whatItDoes}\n\n`
    response += `**📊 Quick Overview:**\n\n`
    response += `**Tool Distribution:**\n${dm.toolDistribution.insights[0]}\n\n`
    response += `**Feature Coverage:**\n${dm.featureCoverage.insights[0]}\n\n`
    response += `**Target Audiences:**\n${dm.targetAudience.insights[0]}\n\n`
    response += `**� Ask me for specific insights:**\n`
    response += `• "View tool distribution by type"\n`
    response += `• "Analyze feature coverage across all tools"\n`
    response += `• "Understand capability matrix"\n`
    response += `• "Show me cost analysis"\n`
    response += `• "What are the usage patterns?"\n\n`
    response += `🔍 **Pro Tip:** Click the 📊 Analytics button in the header for interactive visualizations!`
    return response
  }
  
  // Theme/Dark mode queries
  if (lowerQuery.includes('theme') || lowerQuery.includes('dark mode') || lowerQuery.includes('light mode')) {
    const feature = features.coreFeatures.find(f => f.name.includes('Dark/Light'))!
    let response = `## 🌓 Dark/Light Mode\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**Available Themes:**\n`
    features.themes.options.forEach(opt => {
      response += `• ${opt}\n`
    })
    response += `\n**How to Switch:**\n${feature.howTo}`
    return response
  }
  
  // Language queries
  if (lowerQuery.includes('language') || lowerQuery.includes('translate') || lowerQuery.includes('multilingual')) {
    const feature = features.coreFeatures.find(f => f.name.includes('Language'))!
    let response = `## 🌍 Language Selection\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**Supported Languages:**\n`
    features.languages.supported.forEach(lang => {
      response += `${lang}\n`
    })
    response += `\n**How to Change Language:**\n${feature.howTo}`
    return response
  }
  
  // Project Status Badge queries
  if (lowerQuery.includes('status badge') || lowerQuery.includes('project status') || 
      lowerQuery.includes('color badge') || lowerQuery.includes('colored badge') ||
      lowerQuery.includes('deployment phase') || lowerQuery.includes('status last updated') ||
      lowerQuery.includes('green badge') || lowerQuery.includes('blue badge') || 
      lowerQuery.includes('orange badge') || lowerQuery.includes('amber badge') ||
      (lowerQuery.includes('what') && lowerQuery.includes('badge')) ||
      (lowerQuery.includes('what does') && (lowerQuery.includes('production') || lowerQuery.includes('scaling') || lowerQuery.includes('development'))) ||
      lowerQuery.includes('badge mean')) {
    const badges = features.projectStatusBadges
    let response = `## 📊 Project Status Badges\n\n`
    response += `${badges.description}\n\n`
    response += `**📍 Location:** ${badges.location}\n\n`
    response += `### Status Badge Colors & Meanings:\n\n`
    
    badges.statusTypes.forEach(type => {
      const icon = type.status === 'Production' ? '🟢' : 
                   type.status === 'Scaling' ? '🔵' : 
                   type.status === 'Development' ? '🟠' : '⚪'
      response += `**${icon} ${type.status}**\n`
      response += `_Color: ${type.color}_\n`
      response += `${type.meaning}\n\n`
    })
    
    response += `### Additional Status Information:\n\n`
    response += `**🚀 Deployment Phase**\n`
    response += `${badges.deploymentPhase.description}\n`
    response += `_${badges.deploymentPhase.purpose}_\n\n`
    
    response += `**📅 Status Last Updated**\n`
    response += `${badges.statusLastUpdated.description}\n`
    response += `_Format: ${badges.statusLastUpdated.format}_\n\n`
    
    response += `### 💡 How to Interpret Status Badges:\n\n`
    badges.howToInterpret.forEach(tip => {
      response += `✓ ${tip}\n`
    })
    
    response += `\n**Quick Reference:**\n`
    response += `• 🟢 **Green** = Production-ready, use with confidence\n`
    response += `• 🔵 **Blue** = Scaling, operational but expanding\n`
    response += `• 🟠 **Orange** = Development, experimental phase\n`
    response += `• ⚪ **Gray** = External tool, not tracked internally\n\n`
    response += `💬 **Need more help?** Ask me about specific tools or statuses!`
    
    return response
  }
  
  // Suggestion box queries
  if (lowerQuery.includes('suggest') || lowerQuery.includes('idea') || lowerQuery.includes('feedback') || lowerQuery.includes('request')) {
    const feature = features.coreFeatures.find(f => f.name.includes('Suggestion'))!
    let response = `## 💡 Suggestion Box\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**How to Submit:**\n${feature.howTo}\n\n`
    response += `Your ideas help shape the future of AI Compass! The team reviews all suggestions. 🙏`
    return response
  }
  
  // About section queries  
  if (lowerQuery.includes('about section') || lowerQuery.includes('learn more about')) {
    const feature = features.coreFeatures.find(f => f.name.includes('About Section'))!
    let response = `## ℹ️ About Section\n\n`
    response += `${feature.description}\n\n`
    response += `**📍 Location:** ${feature.location}\n\n`
    response += `**What You'll Find:**\n`
    features.about.sections.forEach(sec => {
      response += `📄 ${sec}\n`
    })
    response += `\n**How to Access:**\n${feature.howTo}`
    return response
  }
  
  // Header buttons queries
  if (lowerQuery.includes('header') || lowerQuery.includes('buttons') || lowerQuery.includes('top menu')) {
    let response = `## 🔝 Header Buttons & Navigation\n\n`
    response += `The top header contains all main navigation options:\n\n`
    features.headerButtons.forEach(btn => {
      response += `**${btn.icon} ${btn.name}**\n${btn.purpose}\n_Location: ${btn.location}_\n\n`
    })
    return response
  }
  
  // General features overview - provide comprehensive information
  let response = `## 🧭 AI Compass - Complete Feature Guide\n\n`
  response += `**Quick Summary:**\n${features.overview}\n\n`
  response += `---\n\n`
  
  // 1. Centralized Tool Catalog
  response += `### 1️⃣ Centralized Tool Catalog\n`
  response += `A searchable registry of all approved AI tools (internal and approved external).\n\n`
  response += `**What's Included:**\n`
  response += `• Tool name, primary purpose, target users\n`
  response += `• Core capabilities and best use cases\n`
  response += `• Cost/licensing and access instructions\n`
  response += `• Project status badges (Production, Scaling, Development)\n`
  response += `• Deployment phase and last updated date\n\n`
  response += `**How to Use:**\n`
  response += `Browse all tools on the main page. Use filters (All/Internal/External) and search by keywords, capabilities, or departments.\n\n`
  response += `---\n\n`
  
  // 2. Smart Search & Filters
  response += `### 2️⃣ Smart Search & Filters\n`
  response += `${features.searchAndFilter.description}\n\n`
  response += `**Features:**\n`
  features.searchAndFilter.features.forEach(f => response += `✓ ${f}\n`)
  response += `\n**How to Use:**\n${features.searchAndFilter.howTo}\n\n`
  response += `**Pro Tips:**\n`
  response += `• Try specific capability keywords: "code generation", "image creation", "clinical text summarization"\n`
  response += `• Use department names: "R&D", "medical", "manufacturing"\n`
  response += `• Search by use case: "research", "writing", "data analysis"\n\n`
  response += `---\n\n`
  
  // 3. Compare Tools (Side-by-side)
  response += `### 3️⃣ Compare Tools (Side-by-Side)\n`
  response += `${features.comparison.description}\n\n`
  response += `**Features:**\n`
  features.comparison.features.forEach(f => response += `✓ ${f}\n`)
  response += `\n**How to Use:**\n${features.comparison.howTo}\n\n`
  response += `**What You Can Compare:**\n`
  response += `• Type (internal vs external)\n`
  response += `• Primary purpose and target users\n`
  response += `• Core capabilities (code gen, image gen, web search)\n`
  response += `• Technology stack and cost\n`
  response += `• Access links and best use cases\n\n`
  response += `💡 **Pro Tip:** You can also ask me directly: "Compare Plai and Concierge"\n\n`
  response += `---\n\n`
  
  // 4. SONA Assistant
  response += `### 4️⃣ SONA Assistant (That's Me! 👋)\n`
  response += `${features.chatbot.description}\n\n`
  response += `**My Capabilities:**\n`
  features.chatbot.capabilities.forEach(cap => response += `✨ ${cap}\n`)
  response += `\n**How to Use Me:**\n${features.chatbot.howTo}\n\n`
  response += `**Example Questions:**\n`
  response += `• "Recommend a tool for research"\n`
  response += `• "How do I access Plai?"\n`
  response += `• "Compare Plai and Concierge"\n`
  response += `• "Tell me about Sanofi's latest news"\n`
  response += `• "What's an AI fun fact?"\n\n`
  response += `---\n\n`
  
  // 5. Analytics Dashboard
  response += `### 5️⃣ Analytics Dashboard\n`
  response += `${features.analytics.description}\n\n`
  response += `**What You'll See:**\n`
  features.analytics.metrics.forEach(m => response += `📊 ${m}\n`)
  response += `\n**Key Insights:**\n`
  response += `• Tool distribution: Internal vs External breakdown\n`
  response += `• Feature coverage: Which tools have code gen, image gen, etc.\n`
  response += `• Target audience: Tool availability per department\n`
  response += `• Cost analysis: Free vs paid tools\n`
  response += `• Maturity levels: Production vs experimental tools\n\n`
  response += `**How to Access:**\n${features.analytics.howToAccess}\n\n`
  response += `💡 **Ask me for specific insights:** "View tool distribution by type" or "Show me cost analysis"\n\n`
  response += `---\n\n`
  
  // 6. Project Status Badges
  response += `### 6️⃣ Project Status Badges\n`
  response += `Color-coded indicators showing tool lifecycle stage, deployment phase, and last update.\n\n`
  response += `**Status Types:**\n`
  response += `• 🟢 **Production** - Stable, enterprise-ready\n`
  response += `• � **Scaling** - Operational, expanding access\n`
  response += `• 🟠 **Development** - Experimental, pilot phase\n`
  response += `• ⚪ **External** - Third-party tool\n\n`
  response += `**Additional Info:**\n`
  response += `• 🚀 Deployment Phase (e.g., "Enterprise Deployment")\n`
  response += `• 📅 Status Last Updated (YYYY-MM format)\n\n`
  response += `**How to Use:**\n`
  response += `Badges appear on each tool card. Green badges = safe for production work. Orange = use with caution.\n\n`
  response += `---\n\n`
  
  // 7. Access & Provisioning Guidance
  response += `### 7️⃣ Access & Provisioning Guidance\n`
  response += `Each tool page shows how to request access:\n\n`
  response += `• Self-service links for immediate access\n`
  response += `• Request forms for approval-required tools\n`
  response += `• Contact information for help\n`
  response += `• Notes on company-wide vs pilot access\n`
  response += `• Required training or approvals\n\n`
  response += `💡 **Quick Access:** Ask me "How do I access [tool name]?"\n\n`
  response += `---\n\n`
  
  // 8. Suggest & Feedback
  response += `### 8️⃣ Suggest & Feedback\n`
  response += `Help shape AI Compass by sharing your ideas!\n\n`
  response += `**What You Can Do:**\n`
  response += `• Suggest new AI tools for evaluation\n`
  response += `• Request new features or improvements\n`
  response += `• Provide feedback on SONA responses (👍 👎)\n`
  response += `• Share use cases and success stories\n\n`
  response += `**How to Submit:**\n`
  response += `Click 💡 Suggest button in header → Type your idea → Submit via email to the team\n\n`
  response += `---\n\n`
  
  // 9. Settings & Personalization
  response += `### 9️⃣ Settings & Personalization\n`
  response += `Customize your AI Compass experience:\n\n`
  response += `**🌓 Dark/Light Mode:**\n`
  features.themes.options.forEach(opt => response += `• ${opt}\n`)
  response += `\n**🌍 Language Selection (8 languages):**\n`
  features.languages.supported.forEach(lang => response += `${lang}  `)
  response += `\n\n**🔄 Catalog Refresh:**\n`
  response += `Sync with external feeds for latest tool updates\n\n`
  response += `**How to Access:**\n`
  response += `Click ⚙️ Settings button in header → Select your preferences\n\n`
  response += `---\n\n`
  
  // 10. About & Team Info
  response += `### 🔟 About & Team Information\n`
  response += `Learn about the platform and meet the team.\n\n`
  response += `**What's Inside:**\n`
  features.about.sections.forEach(sec => response += `📄 ${sec}\n`)
  response += `\n**Two Perspectives:**\n`
  response += `• **For Users:** Features, team, contact info\n`
  response += `• **For Stakeholders:** Strategy, value proposition, ROI, governance\n\n`
  response += `**How to Access:**\n${features.about.howTo}\n\n`
  response += `---\n\n`
  
  // Practical Examples
  response += `## 💡 Practical Usage Examples\n\n`
  response += `**Scenario 1: Finding the Right Tool**\n`
  response += `1. Use search bar: "code generation"\n`
  response += `2. Filter: Internal only\n`
  response += `3. Review results and status badges\n`
  response += `4. Click tool card for details\n`
  response += `5. Click access link or ask me "How do I access [tool]?"\n\n`
  
  response += `**Scenario 2: Comparing Two Tools**\n`
  response += `1. Ask me: "Compare Plai and Concierge"\n`
  response += `2. OR: Click "+ Add to compare" on both tool cards\n`
  response += `3. Click "Compare Now" button\n`
  response += `4. Review side-by-side comparison modal\n`
  response += `5. Make informed decision\n\n`
  
  response += `**Scenario 3: Understanding Tool Landscape**\n`
  response += `1. Click 📊 Analytics button\n`
  response += `2. View tool distribution charts\n`
  response += `3. Ask me: "Show me cost analysis" or "View tool distribution by type"\n`
  response += `4. Identify gaps or opportunities\n\n`
  
  response += `**Scenario 4: Getting Help**\n`
  response += `1. Click purple chat bubble (me!)\n`
  response += `2. Ask specific questions:\n`
  response += `   • "Recommend a tool for clinical research"\n`
  response += `   • "Which tools support image generation?"\n`
  response += `   • "Tell me about AI Compass features"\n`
  response += `3. Follow suggested prompts for deeper exploration\n\n`
  
  response += `---\n\n`
  
  // Quick Reference
  response += `## 🚀 Quick Reference Card\n\n`
  response += `**🔍 Search:** Type keywords → Filter by scope → Results update instantly\n\n`
  response += `**⚖️ Compare:** Add to compare (2-4 tools) → Click "Compare Now" → Review modal\n\n`
  response += `**💬 Ask SONA:** Click chat bubble → Ask questions → Get instant answers\n\n`
  response += `**📊 Analytics:** Header button → View insights → Ask for specific metrics\n\n`
  response += `**⚙️ Settings:** Gear icon → Theme, language, refresh options\n\n`
  response += `**💡 Suggest:** Lightbulb icon → Share ideas → Email to team\n\n`
  response += `**ℹ️ About:** Info button → Learn more → Two tabs (Users & Stakeholders)\n\n`
  response += `---\n\n`
  
  response += `## 🎯 Next Steps\n\n`
  response += `1️⃣ **Explore the catalog** - Browse all 43+ tools and discover what's available\n\n`
  response += `2️⃣ **Try the comparison** - Pick 2-3 tools and see detailed feature breakdown\n\n`
  response += `3️⃣ **Check analytics** - Understand the tool landscape and identify opportunities\n\n`
  response += `4️⃣ **Chat with me** - Ask questions, get recommendations, learn best practices\n\n`
  response += `5️⃣ **Share feedback** - Use 👍 👎 buttons and suggestion box to help improve the platform\n\n`
  response += `---\n\n`
  
  response += `💬 **Need more help?** Just ask me! I'm here to guide you through every feature. Try:\n`
  response += `• "How do I compare tools?"\n`
  response += `• "What do the status badges mean?"\n`
  response += `• "Show me analytics dashboard insights"\n`
  response += `• "How do I access [specific tool]?"\n`
  response += `• "Recommend a tool for [your use case]"`
  
  return response
}
