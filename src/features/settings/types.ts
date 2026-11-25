/** Base URL used when the user has not configured a provider yet. */
export const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1/";

/** Model id used when the user has not configured a provider yet. */
export const DEFAULT_MODEL = "openai/gpt-oss-120b";

/**
 * Provider settings returned to the client.
 *
 * The API key itself is never sent to the client — only whether one exists.
 */
export type ProviderSettings = {
  baseUrl: string;
  model: string;
  hasApiKey: boolean;
};
