"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useClearProviderSettings,
  useGetProviderSettings,
  useSaveProviderSettings,
} from "@/features/settings/hooks/settings";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Dialog for the user's own OpenAI-compatible provider (OpenRouter, OpenCode,
 * etc.).
 *
 * Stores API key, base URL, and model per user. The key never round-trips to
 * the client after saving — only `hasApiKey` is returned.
 */
export default function ProviderSettingsDialog({ open, onOpenChange }: Props) {
  const { data: settings, isPending, error: settingsError } = useGetProviderSettings();
  const save = useSaveProviderSettings();
  const clear = useClearProviderSettings();

  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");

  useEffect(() => {
    if (!settings) return;
    setBaseUrl(settings.baseUrl);
    setModel(settings.model);
    setApiKey("");
  }, [settings]);

  const handleSave = async () => {
    try {
      const result = await save.mutateAsync({ apiKey, baseUrl, model });
      if (result) {
        toast.success("Provider settings saved");
        onOpenChange(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    }
  };

  const handleClear = async () => {
    try {
      await clear.mutateAsync();
      toast.success("Reset to default provider");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset settings");
    }
  };

  const error =
    save.error?.message ??
    clear.error?.message ??
    (settingsError instanceof Error ? settingsError.message : undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Model Provider</DialogTitle>
          <DialogDescription>
            Use your own OpenAI-compatible API key (OpenRouter, OpenCode, etc.).
            Falls back to the default provider when empty.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="provider-api-key">API key</Label>
            <Input
              id="provider-api-key"
              type="password"
              autoComplete="off"
              placeholder={
                isPending
                  ? "Loading..."
                  : settings?.hasApiKey
                    ? "Saved — leave blank to keep"
                    : "sk-or-..."
              }
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="provider-base-url">Base URL</Label>
            <Input
              id="provider-base-url"
              placeholder="https://openrouter.ai/api/v1/"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="provider-model">Model</Label>
            <Input
              id="provider-model"
              placeholder="openai/gpt-oss-120b"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClear}
            disabled={clear.isPending || save.isPending}
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={save.isPending || clear.isPending || isPending}
          >
            {save.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
