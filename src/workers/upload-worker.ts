// src/workers/upload-worker.ts
// Handles S3 PUT uploads off the main thread.

interface UploadMsg {
	type: "upload";
	id: number;
	url: string;
	blob: Blob;
}

interface AbortMsg {
	type: "abort";
}

type WorkerMsg = UploadMsg | AbortMsg;

self.onmessage = async (e: MessageEvent<WorkerMsg>) => {
	const msg = e.data;

	if (msg.type === "upload") {
		try {
			const res = await fetch(msg.url, { method: "PUT", body: msg.blob });
			const etag = res.headers.get("ETag");
			self.postMessage({ type: "done", id: msg.id, status: res.status, etag });
		} catch (err) {
			self.postMessage({
				type: "error",
				id: msg.id,
				error: err instanceof Error ? err.message : String(err),
			});
		}
	}
};
