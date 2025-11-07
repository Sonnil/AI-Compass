
import { getRandomAIContent, getSonnilLeProfile, getSanofiResponse, getAICompassFeaturesResponse, getSonnilLeResponse, getAITipOfTheDay } from './knowledge.js';
import { callAiChat } from '../../services/aiChatClient.js';
import { TRANSLATIONS, GREETINGS, SONA_INTRO, HELP_RESPONSES, THANKS_RESPONSES, GOODBYE_RESPONSES, translateText, SUPPORTED_LANGUAGES } from './translations.js';
import { getLearningInsights } from './learning.js';
import type { Msg, UserProfile, ToolResult, LanguageCode } from './types.js';
import { detectLanguage } from './intents.js';

// Multilingual greetings
const GREETINGS_RESPONSES = {
  en: [
    "Hello! 👋 I'm SONA, your AI assistant for the AI Compass. How can I help you today?",
    "Hi there! 😊 I'm here to help you discover and learn about AI tools. What would you like to know?",
    "Hey! 🌟 Welcome to AI Compass. I can help you find tools, compare options, or answer questions about AI. What interests you?",
    "Greetings! 🤖 I'm SONA, your guide to AI tools at Sanofi. Ask me anything!",
    "Hello! 💙 Ready to explore AI tools? I can help you find exactly what you need!"
  ],
  fr: [
    "Bonjour! 👋 Je suis SONA, votre assistante pour AI Compass. Comment puis-je vous aider aujourd'hui?",
    "Salut! 😊 Je suis là pour vous aider à découvrir et à en savoir plus sur les outils d'IA. Que souhaitez-vous savoir?",
    "Hey! 🌟 Bienvenue sur AI Compass. Je peux vous aider à trouver des outils, à comparer des options ou à répondre à des questions sur l'IA. Qu'est-ce qui vous intéresse?",
    "Salutations! 🤖 Je suis SONA, votre guide des outils d'IA chez Sanofi. Demandez-moi n'importe quoi!",
    "Bonjour! 💙 Prêt à explorer les outils d'IA? Je peux vous aider à trouver exactement ce dont vous avez besoin!"
  ],
  es: [
    "¡Hola! 👋 Soy SONA, tu asistente de IA para AI Compass. ¿Cómo puedo ayudarte hoy?",
    "¡Hola! 😊 Estoy aquí para ayudarte a descubrir y aprender sobre herramientas de IA. ¿Qué te gustaría saber?",
    "¡Hey! 🌟 Bienvenido a AI Compass. Puedo ayudarte a encontrar herramientas, comparar opciones o responder preguntas sobre IA. ¿Qué te interesa?",
    "¡Saludos! 🤖 Soy SONA, tu guía de herramientas de IA en Sanofi. ¡Pregúntame lo que sea!",
    "¡Hola! 💙 ¿Listo para explorar herramientas de IA? ¡Puedo ayudarte a encontrar exactamente lo que necesitas!"
  ],
  de: [
    "Hallo! 👋 Ich bin SONA, Ihr KI-Assistent für AI Compass. Wie kann ich Ihnen heute helfen?",
    "Hallo! 😊 Ich bin hier, um Ihnen zu helfen, KI-Tools zu entdecken und kennenzulernen. Was möchten Sie wissen?",
    "Hey! 🌟 Willkommen bei AI Compass. Ich kann Ihnen helfen, Tools zu finden, Optionen zu vergleichen oder Fragen zu KI zu beantworten. Was interessiert Sie?",
    "Grüße! 🤖 Ich bin SONA, Ihr Leitfaden für KI-Tools bei Sanofi. Fragen Sie mich alles!",
    "Hallo! 💙 Bereit, KI-Tools zu erkunden? Ich kann Ihnen helfen, genau das zu finden, was Sie brauchen!"
  ],
  pt: [
    "Olá! 👋 Eu sou SONA, sua assistente de IA para o AI Compass. Como posso ajudar hoje?",
    "Olá! 😊 Estou aqui para ajudá-lo a descobrir e aprender sobre ferramentas de IA. O que você gostaria de saber?",
    "Ei! 🌟 Bem-vindo ao AI Compass. Posso ajudá-lo a encontrar ferramentas, comparar opções ou responder a perguntas sobre IA. O que lhe interessa?",
    "Saudações! 🤖 Eu sou SONA, seu guia de ferramentas de IA na Sanofi. Pergunte-me qualquer coisa!",
    "Olá! 💙 Pronto para explorar ferramentas de IA? Posso ajudá-lo a encontrar exatamente o que você precisa!"
  ],
  zh: [
    "你好！👋 我是SONA，AI Compass的AI助手。我今天能帮你什么？",
    "你好！😊 我在这里帮助你发现和学习AI工具。你想知道什么？",
    "嘿！🌟 欢迎来到AI Compass。我可以帮你找到工具，比较选项，或者回答关于AI的问题。你对什么感兴趣？",
    "你好！🤖 我是SONA，你在赛诺菲的AI工具指南。问我任何问题！",
    "你好！💙 准备好探索AI工具了吗？我可以帮你找到你需要的！"
  ],
  ja: [
    "こんにちは！👋 私はSONA、AI CompassのAIアシスタントです。今日はどういったご用件でしょうか？",
    "こんにちは！😊 AIツールについて発見し、学ぶお手伝いをします。何を知りたいですか？",
    "ヘイ！🌟 AI Compassへようこそ。ツールの検索、オプションの比較、AIに関する質問のお手伝いができます。何に興味がありますか？",
    "ご挨拶申し上げます！🤖 私はSONA、サノフィのAIツールのガイドです。何でも聞いてください！",
    "こんにちは！💙 AIツールを探求する準備はできましたか？必要なものを正確に見つけるお手伝いをします！"
  ],
  vi: [
    "Xin chào! 👋 Tôi là SONA, trợ lý AI của bạn cho AI Compass. Hôm nay tôi có thể giúp gì cho bạn?",
    "Chào bạn! 😊 Tôi ở đây để giúp bạn khám phá và tìm hiểu về các công cụ AI. Bạn muốn biết điều gì?",
    "Này! 🌟 Chào mừng đến với AI Compass. Tôi có thể giúp bạn tìm công cụ, so sánh các lựa chọn hoặc trả lời các câu hỏi về AI. Bạn quan tâm đến điều gì?",
    "Chào mừng! 🤖 Tôi là SONA, hướng dẫn của bạn về các công cụ AI tại Sanofi. Hãy hỏi tôi bất cứ điều gì!",
    "Xin chào! 💙 Sẵn sàng khám phá các công cụ AI chưa? Tôi có thể giúp bạn tìm thấy chính xác những gì bạn cần!"
  ]
};

const HOW_ARE_YOU_RESPONSES = {
    en: [
        "I'm doing great, thank you for asking! 😊 I'm here and ready to help you explore AI tools. What would you like to know?",
        "I'm functioning perfectly and excited to assist you! 🤖 How can I help you with AI tools today?",
        "I'm excellent, thanks! 💙 As an AI assistant, I'm always ready to help. What brings you here today?",
        "Doing wonderful! 🌟 I'm here to help you discover the perfect AI tools. What are you looking for?",
        "I'm great! Thanks for asking! 😊 Now, how can I assist you with AI tools today?"
    ],
    fr: [
        "Je vais très bien, merci de demander! 😊 Je suis là et prête à vous aider à explorer les outils d'IA. Que souhaitez-vous savoir?",
        "Je fonctionne parfaitement et je suis ravie de vous aider! 🤖 Comment puis-je vous aider avec les outils d'IA aujourd'hui?",
        "Je vais parfaitement bien, merci! 💙 En tant qu'assistante IA, je suis toujours prête à aider. Qu'est-ce qui vous amène ici aujourd'hui?",
        "Merveilleusement bien! 🌟 Je suis là pour vous aider à découvrir les outils d'IA parfaits. Que recherchez-vous?",
        "Je vais bien! Merci d'avoir demandé! 😊 Maintenant, comment puis-je vous aider avec les outils d'IA aujourd'hui?"
    ],
    es: [
        "¡Estoy muy bien, gracias por preguntar! 😊 Estoy aquí y lista para ayudarte a explorar herramientas de IA. ¿Qué te gustaría saber?",
        "¡Estoy funcionando perfectamente y emocionada de ayudarte! 🤖 ¿Cómo puedo ayudarte con las herramientas de IA hoy?",
        "¡Excelente, gracias! 💙 Como asistente de IA, siempre estoy lista para ayudar. ¿Qué te trae por aquí hoy?",
        "¡Maravillosamente! 🌟 Estoy aquí para ayudarte a descubrir las herramientas de IA perfectas. ¿Qué estás buscando?",
        "¡Estoy bien! ¡Gracias por preguntar! 😊 Ahora, ¿cómo puedo ayudarte con las herramientas de IA hoy?"
    ],
    de: [
        "Mir geht es gut, danke der Nachfrage! 😊 Ich bin hier und bereit, Ihnen bei der Erkundung von KI-Tools zu helfen. Was möchten Sie wissen?",
        "Ich funktioniere einwandfrei und freue mich, Ihnen zu helfen! 🤖 Wie kann ich Ihnen heute mit KI-Tools helfen?",
        "Ausgezeichnet, danke! 💙 Als KI-Assistentin bin ich immer bereit zu helfen. Was führt Sie heute hierher?",
        "Wunderbar! 🌟 Ich bin hier, um Ihnen zu helfen, die perfekten KI-Tools zu entdecken. Wonach suchen Sie?",
        "Mir geht es gut! Danke der Nachfrage! 😊 Nun, wie kann ich Ihnen heute mit KI-Tools helfen?"
    ],
    pt: [
        "Estou ótima, obrigada por perguntar! 😊 Estou aqui e pronta para ajudá-lo a explorar as ferramentas de IA. O que você gostaria de saber?",
        "Estou funcionando perfeitamente e animada para ajudá-lo! 🤖 Como posso ajudá-lo com as ferramentas de IA hoje?",
        "Excelente, obrigada! 💙 Como assistente de IA, estou sempre pronta para ajudar. O que o traz aqui hoje?",
        "Maravilhosamente! 🌟 Estou aqui para ajudá-lo a descobrir as ferramentas de IA perfeitas. O que você está procurando?",
        "Estou bem! Obrigada por perguntar! 😊 Agora, como posso ajudá-lo com as ferramentas de IA hoje?"
    ],
    zh: [
        "我很好，谢谢你的关心！😊 我在这里，准备好帮助你探索AI工具。你想知道什么？",
        "我运行得非常完美，很高兴能帮助你！🤖 今天我能帮你什么关于AI工具的事情？",
        "我很好，谢谢！💙 作为一个AI助手，我随时准备提供帮助。你今天来这里是为了什么？",
        "太棒了！🌟 我在这里帮助你发现完美的AI工具。你在找什么？",
        "我很好！谢谢你的关心！😊 现在，我能帮你什么关于AI工具的事情？"
    ],
    ja: [
        "元気です、ありがとうございます！😊 AIツールを探求するお手伝いをします。何を知りたいですか？",
        "完璧に機能しており、お手伝いできることを嬉しく思います！🤖 今日はAIツールでどのようにお手伝いできますか？",
        "素晴らしいです、ありがとう！💙 AIアシスタントとして、いつでもお手伝いする準備ができています。今日はどういったご用件で？",
        "素晴らしいです！🌟 完璧なAIツールを見つけるお手伝いをします。何をお探しですか？",
        "元気です！ありがとうございます！😊 さて、今日はAIツールでどのようにお手伝いできますか？"
    ],
    vi: [
        "Tôi rất khỏe, cảm ơn bạn đã hỏi! 😊 Tôi ở đây và sẵn sàng giúp bạn khám phá các công cụ AI. Bạn muốn biết điều gì?",
        "Tôi đang hoạt động hoàn hảo và rất hào hứng được hỗ trợ bạn! 🤖 Hôm nay tôi có thể giúp gì cho bạn về các công cụ AI?",
        "Tôi rất tuyệt, cảm ơn! 💙 Là một trợ lý AI, tôi luôn sẵn sàng giúp đỡ. Điều gì đưa bạn đến đây hôm nay?",
        "Tuyệt vời! 🌟 Tôi ở đây để giúp bạn khám phá các công cụ AI hoàn hảo. Bạn đang tìm kiếm điều gì?",
        "Tôi khỏe! Cảm ơn bạn đã hỏi! 😊 Bây giờ, tôi có thể hỗ trợ gì cho bạn về các công cụ AI hôm nay?"
    ]
};

const IDENTITY_RESPONSES = {
    en: "I am **SONA** (Sanofi Organizational Navigation Assistant) 🤖\n\nI'm an intelligent AI agent created by Sonnil Q. Le to help Sanofi employees navigate the AI Compass platform and discover the right AI tools for their work.\n\n**What I can do:**\n\n**1️⃣ AI Tool Discovery & Guidance** 🔍\n• Smart tool recommendations from 43+ tools based on your needs\n• Detailed side-by-side tool comparisons in comparison modal\n• Knowledge of Sanofi's AI ecosystem and all platform features\n• Help you find the perfect tool for any task\n\n**2️⃣ Platform Features Assistance** 🎯\n• Guide you through search, filters, and comparison features\n• Explain analytics dashboard with tool distribution insights\n• Show you how to use the suggestion box to submit ideas\n• Help with multilingual interface (8 languages) and dark mode\n\n**3️⃣ Multilingual Translation** 🌐\n• Translate between 8 languages (EN, FR, ES, DE, PT, ZH, JA, VI)\n• Common phrase lookups with fast local responses\n• Real-time translation assistance\n\n**4️⃣ Machine Learning & Personalization** 🧠\n• Learn from your feedback (👍/👎 ratings)\n• Improve recommendations over time\n• Adaptive responses based on conversation patterns\n• Remember your preferences\n\n**5️⃣ Knowledge & Insights** 💡\n• Answer questions about Sanofi's AI tools and strategies\n• Share AI tips, facts, and best practices\n• Provide information about the AI Compass team\n• Explain how to use any feature on the platform\n\n**My Mission:**\nTo make AI tool discovery easy, personalized, and productive for everyone at Sanofi — in any language. 🌍✨\n\nHow can I help you today?",
    fr: "Je suis **SONA** (Sanofi Omni-helpful Navigator & Agent) 🤖 - votre assistante IA pour la plateforme AI Compass!\n\n**Ce que je peux faire:**\n✨ Vous aider à trouver des outils d'IA\n🔍 Rechercher et filtrer des outils\n⚖️ Comparer différents outils\n📚 Répondre aux questions sur l'IA\n🌍 Prise en charge de 8 langues\n\nComment puis-je vous aider aujourd'hui?",
    es: "¡Soy **SONA** (Sanofi Omni-helpful Navigator & Agent) 🤖 - tu asistente de IA para la plataforma AI Compass!\n\n**Lo que puedo hacer:**\n✨ Ayudarte a encontrar herramientas de IA\n🔍 Buscar y filtrar herramientas\n⚖️ Comparar diferentes herramientas\n📚 Responder preguntas sobre IA\n🌍 Soporte en 8 idiomas\n\n¿Cómo puedo ayudarte hoy?",
    de: "Ich bin **SONA** (Sanofi Omni-helpful Navigator & Agent) 🤖 - Ihre KI-Assistentin für die AI Compass Plattform!\n\n**Was ich kann:**\n✨ Ihnen helfen, KI-Tools zu finden\n🔍 Tools suchen und filtern\n⚖️ Verschiedene Tools vergleichen\n📚 Fragen zu KI beantworten\n🌍 Unterstützung für 8 Sprachen\n\nWie kann ich Ihnen heute helfen?",
    pt: "Eu sou **SONA** (Sanofi Omni-helpful Navigator & Agent) 🤖 - sua assistente de IA para a plataforma AI Compass!\n\n**O que eu posso fazer:**\n✨ Ajudá-lo a encontrar ferramentas de IA\n🔍 Pesquisar e filtrar ferramentas\n⚖️ Comparar diferentes ferramentas\n📚 Responder a perguntas sobre IA\n🌍 Suporte em 8 idiomas\n\nComo posso ajudá-lo hoje?",
    zh: "我是 **SONA** (Sanofi Omni-helpful Navigator & Agent) 🤖 - AI Compass 平台的 AI 助手！\n\n**我能做什么：**\n✨ 帮助你找到AI工具\n🔍 搜索和筛选工具\n⚖️ 比较不同的工具\n📚 回答关于AI的问题\n🌍 支持8种语言\n\n今天我能帮你什么？",
    ja: "私は **SONA** (Sanofi Omni-helpful Navigator & Agent) 🤖 - AI Compass プラットフォームの AI アシスタントです！\n\n**私にできること：**\n✨ AIツールの検索を支援\n🔍 ツールの検索とフィルタリング\n⚖️ 異なるツールの比較\n📚 AIに関する質問への回答\n🌍 8言語のサポート\n\n今日はどのようにお手伝いできますか？",
    vi: "Tôi là **SONA** (Sanofi Omni-helpful Navigator & Agent) 🤖 - trợ lý AI của bạn cho nền tảng AI Compass!\n\n**Tôi có thể làm gì:**\n✨ Giúp bạn tìm các công cụ AI\n🔍 Tìm kiếm và lọc các công cụ\n⚖️ So sánh các công cụ khác nhau\n📚 Trả lời các câu hỏi về AI\n🌍 Hỗ trợ 8 ngôn ngữ\n\nTôi có thể giúp gì cho bạn hôm nay?"
};

// Who built you / creator responses
const BUILDER_RESPONSES = {
    en: "I was built by **Sonnil Q. Le** and the **AI‑Compass** team at Sanofi. 🚀",
    fr: "J'ai été créée par **Sonnil Q. Le** et l'équipe **AI‑Compass** chez Sanofi. 🚀",
    es: "Fui creada por **Sonnil Q. Le** y el equipo de **AI‑Compass** en Sanofi. 🚀",
    de: "Ich wurde von **Sonnil Q. Le** und dem **AI‑Compass**‑Team bei Sanofi entwickelt. 🚀",
    pt: "Fui criada por **Sonnil Q. Le** e pela equipe **AI‑Compass** na Sanofi. 🚀",
    zh: "我由 **Sonnil Q. Le** 和 Sanofi 的 **AI‑Compass** 团队构建。🚀",
    ja: "私は **Sonnil Q. Le** と Sanofi の **AI‑Compass** チームによって作られました。🚀",
    vi: "Tôi được xây dựng bởi **Sonnil Q. Le** và đội ngũ **AI‑Compass** tại Sanofi. 🚀"
};

const ACKNOWLEDGMENT_RESPONSES = {
    en: [
        "Great! 😊 Is there anything else I can help you with? I'm here for:\n• Tool recommendations\n• Tool comparisons\n• Sanofi & AI Compass info\n• AI tips and facts",
        "Perfect! 👍 What else would you like to explore?\n• Find AI tools for your needs\n• Compare different tools\n• Learn about our platform\n• Ask me anything about AI!",
        "Awesome! ✨ Feel free to ask me:\n• 'What's a good tool for [purpose]?'\n• 'Compare [tool] and [tool]'\n• 'Tell me about Sanofi'\n• Or anything else!",
    ],
    fr: [
        "Super! 😊 Y a-t-il autre chose que je puisse faire pour vous? Je suis là pour:\n• Recommandations d'outils\n• Comparaisons d'outils\n• Infos sur Sanofi & AI Compass\n• Astuces et faits sur l'IA",
        "Parfait! 👍 Que souhaitez-vous explorer d'autre?\n• Trouver des outils d'IA pour vos besoins\n• Comparer différents outils\n• En savoir plus sur notre plateforme\n• Demandez-moi n'importe quoi sur l'IA!",
        "Génial! ✨ N'hésitez pas à me demander:\n• 'Quel est un bon outil pour [but]?'\n• 'Comparer [outil] et [outil]'\n• 'Parlez-moi de Sanofi'\n• Ou toute autre chose!",
    ],
    es: [
        "¡Genial! 😊 ¿Hay algo más en lo que pueda ayudarte? Estoy aquí para:\n• Recomendaciones de herramientas\n• Comparaciones de herramientas\n• Información sobre Sanofi y AI Compass\n• Consejos y datos sobre IA",
        "¡Perfecto! 👍 ¿Qué más te gustaría explorar?\n• Encontrar herramientas de IA para tus necesidades\n• Comparar diferentes herramientas\n• Aprender sobre nuestra plataforma\n• ¡Pregúntame cualquier cosa sobre IA!",
        "¡Impresionante! ✨ No dudes en preguntarme:\n• '¿Cuál es una buena herramienta para [propósito]?'\n• 'Comparar [herramienta] y [herramienta]'\n• 'Háblame de Sanofi'\n• ¡O cualquier otra cosa!",
    ],
    de: [
        "Großartig! 😊 Kann ich Ihnen sonst noch bei etwas helfen? Ich bin hier für:\n• Werkzeugempfehlungen\n• Werkzeugvergleiche\n• Infos zu Sanofi & AI Compass\n• KI-Tipps und Fakten",
        "Perfekt! 👍 Was möchten Sie sonst noch erkunden?\n• Finden Sie KI-Tools für Ihre Bedürfnisse\n• Vergleichen Sie verschiedene Tools\n• Erfahren Sie mehr über unsere Plattform\n• Fragen Sie mich alles über KI!",
        "Fantastisch! ✨ Fragen Sie mich gerne:\n• 'Was ist ein gutes Werkzeug für [Zweck]?'\n• 'Vergleiche [Werkzeug] und [Werkzeug]'\n• 'Erzählen Sie mir von Sanofi'\n• Oder alles andere!",
    ],
    pt: [
        "Ótimo! 😊 Há mais alguma coisa em que eu possa ajudar? Estou aqui para:\n• Recomendações de ferramentas\n• Comparações de ferramentas\n• Informações sobre a Sanofi e o AI Compass\n• Dicas e fatos sobre IA",
        "Perfeito! 👍 O que mais você gostaria de explorar?\n• Encontrar ferramentas de IA para suas necessidades\n• Comparar diferentes ferramentas\n• Aprender sobre nossa plataforma\n• Pergunte-me qualquer coisa sobre IA!",
        "Incrível! ✨ Sinta-se à vontade para me perguntar:\n• 'Qual é uma boa ferramenta para [propósito]?'\n• 'Comparar [ferramenta] e [ferramenta]'\n• 'Fale-me sobre a Sanofi'\n• Ou qualquer outra coisa!",
    ],
    zh: [
        "太好了！😊 还有什么我可以帮忙的吗？我在这里提供：\n• 工具推荐\n• 工具比较\n• 关于赛诺菲和AI Compass的信息\n• AI技巧和趣闻",
        "完美！👍 你还想探索什么？\n• 根据你的需求找到AI工具\n• 比较不同的工具\n• 了解我们的平台\n• 问我任何关于AI的问题！",
        "太棒了！✨ 随时问我：\n• '有什么好的工具可以用于[目的]？'\n• '比较[工具]和[工具]'\n• '告诉我关于赛诺菲的信息'\n• 或者其他任何事情！",
    ],
    ja: [
        "素晴らしい！😊 他に何かお手伝いできることはありますか？私はここにいます：\n• ツールの推奨\n• ツールの比較\n• サノフィとAI Compassに関する情報\n• AIのヒントと事実",
        "完璧です！👍 他に何を探求したいですか？\n• あなたのニーズに合ったAIツールを見つける\n• 異なるツールを比較する\n• 私たちのプラットフォームについて学ぶ\n• AIについて何でも聞いてください！",
        "素晴らしい！✨ 気軽に聞いてください：\n• '[目的]に適したツールは何ですか？'\n• '[ツール]と[ツール]を比較する'\n• 'サノフィについて教えてください'\n• その他何でも！",
    ],
    vi: [
        "Tuyệt vời! 😊 Tôi có thể giúp gì khác không? Tôi ở đây để:\n• Đề xuất công cụ\n• So sánh công cụ\n• Thông tin về Sanofi & AI Compass\n• Mẹo và sự thật về AI",
        "Hoàn hảo! 👍 Bạn muốn khám phá điều gì khác?\n• Tìm công cụ AI cho nhu cầu của bạn\n• So sánh các công cụ khác nhau\n• Tìm hiểu về nền tảng của chúng tôi\n• Hỏi tôi bất cứ điều gì về AI!",
        "Tuyệt vời! ✨ Hãy hỏi tôi:\n• 'Công cụ nào tốt cho [mục đích]?'\n• 'So sánh [công cụ] và [công cụ]'\n• 'Hãy cho tôi biết về Sanofi'\n• Hoặc bất cứ điều gì khác!",
    ]
};

const FALLBACK_RESPONSE = `I appreciate your question, but I'm not trained on that specific topic. 🤔

I'm **SONA**, specialized in helping you navigate Sanofi's AI tools and the AI Compass platform. Here's what I'm trained to help you with:

🔍 **AI Tool Discovery**
   • "Find a tool for data analysis"
   • "Recommend a tool for manufacturing"
   • "What tools are available for R&D?"

⚖️ **Tool Comparison**
   • "Compare Concierge and ChatGPT"
   • "What's the difference between Newton and Plai?"

📊 **Analytics & Insights**
   • "Show me analytics dashboard insights"
   • "What's the tool distribution?"
   • "Analyze feature coverage across all tools"
   • "Show me cost analysis"

🌐 **Translation** (8 languages)
   • "Translate 'quality control' to French"

📚 **Knowledge Base**
   • "Tell me about Sanofi"
   • "What features does AI Compass have?"
   • "Who built SONA?"

Try asking me about AI tools, or rephrase your question! 😊`;


export async function generateIntelligentResponse(query: string, history: Msg[], userProfile: UserProfile, toolResult?: ToolResult): Promise<string> {
    console.log('🤖 SONA: Generating response for query:', query);

    try {
        if (!query || query.trim() === '') {
            return "Hi! I'm SONA, your AI assistant. How can I help you today? 😊";
        }

        const detectedLang = detectLanguage(query);
        const lowerTrimmed = query.trim().toLowerCase();

        // Translation intent should be handled before generic greeting detection to avoid false positives on words like "hello"
        const translationResponse = await maybeHandleTranslation(query);
        if (translationResponse) return translationResponse;

    // General translation capability queries (e.g., "can you do translation", "do you translate")
    if (/(can\s+you\s+do\s+translation|can\s+you\s+translate|do\s+you\s+translate|translation\??|translations\??|help\s+me\s+translate|translate\s+text\b|translate\s+languages\b|what\s+languages\s+(do\s+you\s+)?(support|translate)|which\s+languages\s+(can\s+you\s+)?(translate|support))/i.test(lowerTrimmed)) {
        const supportedList = Object.values(SUPPORTED_LANGUAGES).join(', ');
        return `Yes — I can translate common phrases between these languages: ${supportedList}.

Try:
• "translate bonjour to english"
• "how do you say quality in spanish"
• "translate hello into french"`;
    }

        // Analytics Dashboard queries - must come BEFORE tool recommendations to prevent false matches
        // Match: "can you do analytics", "tell me about analytics", "data analytics", "tell about the analytics", "show analytics"
        if (/(can\s+you\s+do|do\s+you\s+(have|provide|support)|does\s+.*\s+have|tell\s+(me\s+)?about|show\s+(me\s+)?|explain|what\s+(is|are)|describe)\s+(the\s+)?(data\s+)?analytics(\s+dashboard)?/i.test(lowerTrimmed) || 
            (lowerTrimmed.includes('analytics') && !lowerTrimmed.includes('tool') && !lowerTrimmed.includes('recommend'))) {
            return getAICompassFeaturesResponse(query + ' analytics');
        }

        // AI Compass capability queries (search, filters, etc.) - check before tool recommendations
        if (/(can\s+you\s+do|do\s+you\s+(have|provide|support)|does\s+.*\s+have)\s+(search|filter|comparison|dashboard|dark\s*mode)/i.test(lowerTrimmed)) {
            return getAICompassFeaturesResponse(query);
        }

        // Out-of-scope: weather queries (provide a friendly explanation instead of generic fallback)
        if (/(weather|forecast|temperature|rain|sunny|cloudy|windy)\b/i.test(lowerTrimmed)) {
            return "I don't have live weather data access. I specialize in AI tools, comparisons, and Sanofi/AI Compass info. Want a tool recommendation or a quick compare instead?";
        }

        // Rating queries: clarify limitation and steer to recommendation
        if (/(highest|top|best)\s+(rated|rating|score)(s)?\b|\b(highest|top)\s+rating\b/i.test(lowerTrimmed)) {
            return "I don’t track star ratings. I can recommend tools based on your audience or task. For example: 'recommend a tool for shop floor quality inspection'.";
        }

    if (/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening|bonjour|hola|hallo|olá)\b/i.test(lowerTrimmed)) {
            const greetings = GREETINGS_RESPONSES[detectedLang];
            const greetingLine = greetings[Math.floor(Math.random() * greetings.length)];
            const intro = SONA_INTRO[detectedLang] || SONA_INTRO.en;
            const capabilities = [
                '• Find the perfect AI tool for your needs',
                '• Translate text between 8 languages 🌐',
                '• Compare different tools',
                '• Learn about Sanofi and AI Compass',
                '• Share AI facts and jokes'
            ].join('\n');
            const joke = getRandomAIContent('joke');
            return `${greetingLine}\n\n${intro} I can recommend tools, compare options, answer questions, and even chat casually.\n\nI can help you:\n${capabilities}\n\nWhat would you like to know?\n\n---\n\n**😄 AI Joke of the Moment:**\n${joke}`;
        }

        if (/^(how are you|how r u|how are u|how's it going|how is it going|how do you do|what's up|wassup|sup)[\?!\.]*$/i.test(lowerTrimmed)) {
            const responses = HOW_ARE_YOU_RESPONSES[detectedLang];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        // Identity / name intent (more flexible matching)
        if (/(who\s+are\s+you|what\s+(are|is)\s+(you|sona)|tell me about (yourself|sona)|introduce (yourself|sona)|who\s+is\s+sona|what('?s| is) your name|your name\??)/i.test(lowerTrimmed)) {
            return IDENTITY_RESPONSES[detectedLang];
        }

        // Who built you / creator intent
        if (/(who\s+(built|made|created|developed)\s+(you|sona)|who\s+is\s+your\s+(creator|maker)|who\s+built\s+sona|built\s+by\s+who)/i.test(lowerTrimmed)) {
            const base = BUILDER_RESPONSES[detectedLang] || BUILDER_RESPONSES.en;
            const contact = getSonnilLeProfile().contact;
            return `${base}\n\n📧 Contact: ${contact}`;
        }

        if (/^(help|what can you do|what do you do|what are your capabilities|what are your features)[\?!\.]*$/i.test(lowerTrimmed)) {
            return IDENTITY_RESPONSES[detectedLang];
        }

        if (/^(thank you|thanks|thx|ty|thank u|merci|gracias|danke|obrigado|谢谢|ありがとう|cảm ơn)[\!\.]*$/i.test(lowerTrimmed)) {
            const responses = THANKS_RESPONSES[detectedLang];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        if (/^(bye|goodbye|see you|see ya|later|cya|talk to you later|ttyl|au revoir|adiós|auf wiedersehen|adeus|再见|さようなら|tạm biệt)[\!\.]*$/i.test(lowerTrimmed)) {
            const responses = GOODBYE_RESPONSES[detectedLang];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        if (/^(ok|okay|alright|got it|sure|fine|cool|k)[\!\.]*$/i.test(lowerTrimmed)) {
            const responses = ACKNOWLEDGMENT_RESPONSES[detectedLang];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        // Handle tool results
        if (toolResult && toolResult.ok) {
            console.log('📦 [generateIntelligentResponse] Formatting tool result:', toolResult)
            return formatToolResult(toolResult);
        }
        if (toolResult && !toolResult.ok) {
            console.log('⚠️ [generateIntelligentResponse] Tool result error:', toolResult)
            return `I had trouble with that request. ${toolResult.error} Please try again or ask me something else.`;
        }
        console.log('ℹ️ [generateIntelligentResponse] No toolResult, proceeding to knowledge base')

        // Knowledge base: Sonnil profile
        if (/(sonnil\b|who\s+is\s+sonnil|tell\s+me\s+about\s+sonnil)/i.test(lowerTrimmed)) {
            return getSonnilLeResponse(query);
        }

        // Joke requests
        if (/\b(tell\s+me\s+a\s+joke|give\s+me\s+a\s+joke|joke\s*!|share\s+a\s+joke|got\s+any\s+jokes)\b/i.test(lowerTrimmed)) {
            const joke = getRandomAIContent('joke');
            return `${joke}\n\n😄 Want another? Just ask!`;
        }

        // Knowledge base: Analytics Dashboard specific queries (from suggested actions)
        if (/(view|show|display|see|analyze|check|understand|identify|make)\s+(tool\s+distribution|feature\s+coverage|capability|usage\s+patterns|tool\s+maturity|category\s+breakdown|internal\s+(vs|versus)\s+external|gaps\s+in\s+the\s+tool|data[-\s]driven\s+decisions)/i.test(lowerTrimmed)) {
            // Force analytics context by appending "analytics" to ensure knowledge.ts routes correctly
            return getAICompassFeaturesResponse(query + ' analytics');
        }

        // Knowledge base: AI Compass features and how-to (require explicit AI Compass mention to avoid false positives like 're-search')
        if (/(ai[-\s]*compass)/i.test(lowerTrimmed) && /(feature(s)?|\bsearch(es)?\b|\bfilter(s)?\b|comparison|compare\b|analytics|dashboard|chatbot|assistant|about\b|language|dark\s*mode|suggest(ion)?\s*box|settings)/i.test(lowerTrimmed)) {
            return getAICompassFeaturesResponse(query);
        }

        // Knowledge base: Sanofi info (mission, news, pipeline, innovation)
        if (/(sanofi|mission|strategy|pipeline|therapeutic|vaccine|innovation|mrna|dupixent|sarclisa|press|news|latest)/i.test(lowerTrimmed)) {
            return getSanofiResponse(query);
        }


        // Add a specific check for "compare" or "difference" intent if no tool call was made
        if ((lowerTrimmed.includes('compare') || lowerTrimmed.includes('difference between')) && !toolResult) {
            return "Of course! I can compare tools for you. Which tools are you interested in comparing? For example, you can ask me to 'compare Concierge and ChatGPT'.";
        }

        // Add a specific check for recommendation intent if no tool call was made
        if (/(recommend|suggest|which|what)\b.*\btool(s)?\b.*\b(for|to)\b/i.test(lowerTrimmed) && !toolResult) {
            return "I can recommend tools for that. Could you share the specific task or audience? For example: 'recommend a tool for manufacturing quality inspection.'";
        }

        // Generic "find tool" requests without specific context
        if (/\b(find|show|give)\b.*\b(perfect|good|best)?\s*(ai\s+)?tool/i.test(lowerTrimmed) && !toolResult) {
            return "I'd love to help you find the perfect AI tool! What kind of work are you trying to accomplish? For example:\n• 'Find a tool for data analysis'\n• 'I need a tool for productivity'\n• 'Show me tools for R&D research'";
        }

        // Try external agent via secure API before falling back
        try {
            const external = await Promise.race([
                callAiChat([...history, { role: 'user', content: query } as Msg]),
                new Promise<string>((_, rej) => setTimeout(() => rej(new Error('timeout')), 6000))
            ]);
            if (external && external.length > 0) {
                return external;
            }
        } catch {
            // ignore and proceed to friendly fallback
        }

        // Fallback response (friendly guide + small content)
        const fallbackBase = FALLBACK_RESPONSE;
        if (Math.random() < 0.5) {
            const contentType = ['fact', 'joke', 'tip'][Math.floor(Math.random() * 3)] as 'fact' | 'joke' | 'tip';
            const randomContent = getRandomAIContent(contentType);
            // Add a small "experienced agent" touch by optionally appending today's AI tip when English is detected
            const maybeTip = detectedLang === 'en' ? `\n\n${getAITipOfTheDay()}` : '';
            return `${fallbackBase}\n\n---\n\n**💡 Meanwhile, here's something interesting:**\n${randomContent}${maybeTip}`;
        }
        return fallbackBase;

    } catch (error) {
        console.error('🤖 SONA ERROR:', error);
        return "Hi! I encountered an issue processing your request. Please try again or ask me something else! 😊";
    }
}

function formatToolResult(toolResult: ToolResult): string {
    if (toolResult.meta?.toolName === 'recommendTool') {
        const tools = toolResult.data as any[];
        if (tools.length > 0) {
            let response = `Great question! Here are the top tools I recommend based on **highest average capability** for your needs:\n\n`;
            tools.forEach((tool, index) => {
                response += `${index + 1}. **${tool.name}**\n`;
                response += `   📋 *Purpose:* ${tool.primaryPurpose}\n`;
                if (tool.bestUseCase) {
                    response += `   💡 *Best for:* ${tool.bestUseCase}\n`;
                }
                if (tool.type) {
                    response += `   🏷️ *Type:* ${tool.type === 'internal' ? 'Internal Tool' : 'External Tool'}\n`;
                }
                response += `\n`;
            });
            response += "💬 You can click on any tool in the main view to see more details, or ask me to compare specific tools!\n\n";
            response += "📈 **Pro Tip:** Check the 📊 Analytics Dashboard to see trending tools and compare capability scores across all tools.";
            return response;
        } else {
            return `I couldn't find specific tools matching that request. Could you try rephrasing? For example:\n\n• "What tool is good for productivity?"\n• "Find me a tool for data analysis"\n• "Recommend something for collaboration"\n\nOr browse all available tools in the catalog above! 📚`;
        }
    }

    if (toolResult.meta?.toolName === 'compareTools') {
        const tools = toolResult.data as any[];
        const category = toolResult.meta?.toolInput?.category;

        if (tools.length === 0) {
            return "I couldn't find those tools. Please check the tool names and try again.";
        }

        let header = category ? `📊 **Comparison of ${category} Tools**\n\n` : `📊 **Detailed Comparison: ${tools.map(t => t.name).join(' vs ')}**\n\n`;
        let response = header;

        tools.forEach((tool, index) => {
            response += `**${index + 1}. ${tool.name}** ${tool.type === 'internal' ? '🏢 Internal' : '🌐 External'}\n`;
            response += `   📋 *Purpose:* ${tool.primaryPurpose || 'Not specified'}\n`;
            response += `   👥 *Target Users:* ${tool.targetUsers || 'Not specified'}\n`;
            response += `   💡 *Best Use Case:* ${tool.bestUseCase || 'Not specified'}\n`;
            response += `\n`;
        });
        return response;
    }

    if (typeof toolResult.data === 'string') {
        return toolResult.data;
    }

    if (typeof toolResult.data === 'object' && toolResult.data.name) {
        const tool = toolResult.data;
        let response = `📱 **${tool.name}**\n\n`;
        response += `📋 *Purpose:* ${tool.primaryPurpose || 'Not specified'}\n`;
        response += `👥 *Target Users:* ${tool.targetUsers || 'Not specified'}\n`;
        response += `💡 *Best Use Case:* ${tool.bestUseCase || 'Not specified'}\n`;
        response += `🏷️ *Type:* ${tool.type === 'internal' ? 'Internal Tool' : 'External Tool'}\n`;
        return response;
    }

    return "I found some information, but I'm not sure how to display it. Can you try a different question?";
}

// Helper: detect and perform translation requests (supports multiple phrasings)
async function maybeHandleTranslation(query: string): Promise<string | null> {
    const q = query.trim();

    // Pattern A: "translate [this] (to|into|in) <language>: <text>" or with dash/em-dash
    // e.g., "translate to french: <text>", "translate this in French: <text>"
    const pLangWithColon = /\btranslate\b\s+(?:this\s+)?(to|into|in)\s+([a-zA-ZÀ-ÿ]{2,})\s*[:\-–—]\s*([\s\S]+)$/i;
    const mA = q.match(pLangWithColon);
    if (mA) {
        const langNameOrCode = mA[2].trim().toLowerCase();
        const target = LANGUAGE_NAME_TO_CODE[langNameOrCode];
        if (!target) {
            const supported = Object.keys(LANGUAGE_NAME_TO_CODE).filter(k => k.length > 2).slice(0, 8).join(', ');
            return `I can translate common phrases. Supported languages: ${supported}.`;
        }
        const phrase = mA[3].trim();
        const out = await tryTranslateOrExternal(phrase, target);
        if (out) return out;
    }

    // Pattern B: text first then language (for short phrases, no colon)
    // e.g., "translate 'hello' to french", "how do you say quality in spanish"
    const pTextThenLang = /(translate|how\s+do\s+you\s+say)\s+["']?(.+?)["']?\s+(to|into|in)\s+([a-zA-ZÀ-ÿ]{2,})\s*$/i;
    const mB = q.match(pTextThenLang);
    if (mB && !q.includes(':')) { // Only use this pattern if there's no colon (which Pattern A should handle)
        const phrase = mB[2].trim();
        const langNameOrCode = mB[4].trim().toLowerCase();
        const target = LANGUAGE_NAME_TO_CODE[langNameOrCode];
        if (!target) {
            const supported = Object.keys(LANGUAGE_NAME_TO_CODE).filter(k => k.length > 2).slice(0, 8).join(', ');
            return `I can translate common phrases. Supported languages: ${supported}.`;
        }
        const out = await tryTranslateOrExternal(phrase, target);
        if (out) return out;
    }

    return null;
}

async function tryTranslateOrExternal(phrase: string, target: LanguageCode): Promise<string | null> {
    const displayLang = LANGUAGE_CODE_TO_NAME[target];
    
    // First try dictionary and built-in API translation (now enabled with timeout)
    const result = await translateText(phrase, target);
    if (result.translation && result.translation.length > 0) {
        return `"${phrase}" in ${displayLang}: "${result.translation}"`;
    }
    
    // If unavailable, try external AI agent as last resort
    try {
        const prompt = `Translate the following text to ${displayLang}. Return only the translation without explanations or quotes.\n\n${phrase}`;
        const external = await Promise.race([
            callAiChat([{ role: 'user', content: prompt } as Msg]),
            new Promise<string>((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000))
        ]);
        if (external && typeof external === 'string' && external.trim().length > 0) {
            return `"${phrase}" in ${displayLang}: "${external.trim()}"`;
        }
    } catch {
        // Fall through if timeout or error
    }
    
    // All attempts failed
    const supportedList = Object.values(SUPPORTED_LANGUAGES).join(', ');
    return `I can translate common phrases. For longer text, I'm having trouble accessing translation services.\n\nSupported languages: ${supportedList}\n\nTry:\n• Shorter phrases (e.g., "translate hello to ${displayLang.toLowerCase()}")\n• Common words from my dictionary`;
}

// Language name/code maps with simple synonyms
const LANGUAGE_NAME_TO_CODE: Record<string, LanguageCode> = {
    en: 'en', english: 'en',
    fr: 'fr', french: 'fr', français: 'fr', francais: 'fr',
    es: 'es', spanish: 'es', español: 'es', espanol: 'es',
    de: 'de', german: 'de', deutsch: 'de',
    pt: 'pt', portuguese: 'pt', português: 'pt', portugues: 'pt',
    zh: 'zh', chinese: 'zh', 中文: 'zh',
    ja: 'ja', japanese: 'ja', 日本語: 'ja',
    vi: 'vi', vietnamese: 'vi', tiếng: 'vi', viet: 'vi'
};

const LANGUAGE_CODE_TO_NAME: Record<LanguageCode, string> = {
    en: 'English', fr: 'French', es: 'Spanish', de: 'German', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', vi: 'Vietnamese'
};
