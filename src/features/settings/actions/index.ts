"use server";

import { getCurrentUser } from "@/features/auth/actions";
import { prisma } from "@/lib/db";
import {
  DEFAULT_BASE_URL,
  DEFAULT_MODEL,
  type ProviderSettings,
} from "../types";

export type SettingsActionResult = ProviderSettings | { error: string };

/**
 * Read the current user's BYOK provider settings.
 *
 * @returns Base URL, model, and whether an API key is stored, or an error.
 */
export const getProviderSettings = async (): Promise<SettingsActionResult> => {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      llmApiKey: true,
      llmBaseUrl: true,
      llmModel: true,
    },
  });

  if (!dbUser) {
    return { error: "User not found" };
  }

  return {
    baseUrl: dbUser.llmBaseUrl ?? DEFAULT_BASE_URL,
    model: dbUser.llmModel ?? DEFAULT_MODEL,
    hasApiKey: Boolean(dbUser.llmApiKey),
  };
};

/**
 * Save the current user's BYOK provider settings.
 *
 * An empty/omitted `apiKey` keeps the previously stored key. Base URL and model
 * are required.
 *
 * @param input - Provider config to persist.
 * @returns The saved settings, or an error.
 */
export const saveProviderSettings = async (input: {
  apiKey?: string;
  baseUrl: string;
  model: string;
}): Promise<{ ok: true } | { error: string }> => {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const baseUrl = input.baseUrl?.trim();
  const model = input.model?.trim();
  const apiKey = input.apiKey?.trim();

  if (!baseUrl || !model) {
    return { error: "Base URL and model are required" };
  }

  try {
    new URL(baseUrl);
  } catch {
    return { error: "Base URL is not a valid URL" };
  }

  const update: {
    llmBaseUrl: string;
    llmModel: string;
    llmApiKey?: string;
  } = {
    llmBaseUrl: baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`,
    llmModel: model,
  };

  if (apiKey) {
    update.llmApiKey = apiKey;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: update,
  });

  console.log(`[provider-settings] saved for user ${user.id} baseUrl=${update.llmBaseUrl} model=${update.llmModel}`);

  return { ok: true };
};

/**
 * Remove the current user's stored provider settings so runs fall back to the
 * server default (Groq).
 *
 * @returns `{ ok: true }`, or an error.
 */
export const clearProviderSettings = async (): Promise<
  { ok: true } | { error: string }
> => {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      llmApiKey: null,
      llmBaseUrl: null,
      llmModel: null,
    },
  });

  return { ok: true };
};
