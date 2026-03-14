// src/components/SaveRecordingDialog.tsx
import { useState } from "react";
import { Link2, ExternalLink } from "lucide-react";
import type { PendingRecording } from "#/hooks/useRecording";
import { saveRecording } from "#/lib/replay-store";

const EXPLORER_URL = "https://sepolia.basescan.org/tx";

interface Props {
  pending: PendingRecording;
  sessionId: string | null;
  score: number | null;
  txHash?: string | null;
  onDone: () => void;
}

export function SaveRecordingDialog({ pending, sessionId, score, txHash, onDone }: Props) {
  const [saving, setSaving] = useState(false);

  const mins = Math.floor(pending.duration / 60).toString().padStart(2, "0");
  const secs = (pending.duration % 60).toString().padStart(2, "0");

  const handleSave = async () => {
    setSaving(true);
    try {
      const mainBlob = pending.frontBlob ?? pending.blob;
      await saveRecording(mainBlob, pending.duration, pending.mimeType, sessionId, score, pending.backBlob, pending.speedTrack);
    } catch (e) {
      console.error("Failed to save recording", e);
    }
    setSaving(false);
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="rounded-2xl bg-zinc-900 border border-white/10 px-6 py-5 mx-4 w-full max-w-sm">
        <p className="text-white font-bold text-base text-center">Save recording?</p>
        <p className="text-white/40 text-xs text-center mt-1">{mins}:{secs} · Already uploaded to cloud</p>

        {txHash && (
          <a
            href={`${EXPLORER_URL}/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-950/50 border border-emerald-800/40 px-3 py-2 transition hover:bg-emerald-950/70"
          >
            <Link2 size={14} className="shrink-0 text-emerald-400" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-emerald-400">Blockchain verified</p>
              <p className="truncate text-[10px] font-mono text-emerald-400/60">{txHash}</p>
            </div>
            <ExternalLink size={12} className="shrink-0 text-emerald-400/60" />
          </a>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={onDone}
            disabled={saving}
            className="flex-1 rounded-xl bg-white/10 py-3 text-sm font-semibold text-white/70"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save locally"}
          </button>
        </div>
      </div>
    </div>
  );
}
