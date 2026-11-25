import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearProviderSettings,
  getProviderSettings,
  saveProviderSettings,
} from "../actions";
import type { ProviderSettings } from "../types";

type ActionError = {
  error: string;
};

function isActionError(value: unknown): value is ActionError {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as ActionError).error === "string"
  );
}

async function unwrap<T>(result: T | { error: string }): Promise<T> {
  if (isActionError(result)) {
    throw new Error(result.error);
  }

  return result;
}

/** React Query hook that loads the signed-in user's provider settings. */
export const useGetProviderSettings = () => {
  return useQuery({
    queryKey: ["provider-settings"],
    queryFn: async () => unwrap(await getProviderSettings()),
  });
};

/** Mutation hook that saves provider settings and refreshes the cache. */
export const useSaveProviderSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      apiKey?: string;
      baseUrl: string;
      model: string;
    }) => unwrap(await saveProviderSettings(input)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-settings"] });
    },
  });
};

/** Mutation hook that clears stored settings and refreshes the cache. */
export const useClearProviderSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => unwrap(await clearProviderSettings()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-settings"] });
    },
  });
};

export type { ProviderSettings };
