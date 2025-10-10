/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAT_API_PATH?: string
  readonly VITE_OPENAI_API_KEY?: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
