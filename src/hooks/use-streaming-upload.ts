// src/hooks/use-streaming-upload.ts
import { useCallback, useEffect, useRef } from "react";
import { client } from "#/server/orpc/client";
import UploadWorker from "#/workers/upload-worker?worker";

const MIN_PART_SIZE = 5 * 1024 * 1024;

function fmtBytes(n: number) {
	if (n < 1024) return `${n}B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)}KB`;
	return `${(n / (1024 * 1024)).toFixed(2)}MB`;
}

interface UploadState {
	key: string;
	uploadId: string;
	partNumber: number;
	parts: { ETag: string; PartNumber: number }[];
	buffer: Blob[];
	bufferSize: number;
	totalBytes: number;
	chunkCount: number;
	inflightParts: number;
}

type PendingResolve = (result: { etag: string | null; status: number }) => void;

export function useStreamingUpload() {
	const stateRef = useRef<UploadState | null>(null);
	const workerRef = useRef<Worker | null>(null);
	const pendingRef = useRef<Map<number, PendingResolve>>(new Map());
	const nextIdRef = useRef(0);

	useEffect(() => {
		const worker = new UploadWorker();
		workerRef.current = worker;

		worker.onmessage = (e) => {
			const { type, id, status, etag, error } = e.data;
			const resolve = pendingRef.current.get(id);
			if (!resolve) return;
			pendingRef.current.delete(id);

			if (type === "done") {
				resolve({ etag, status });
			} else {
				console.error(`[StreamUpload] Worker error for id=${id}:`, error);
				resolve({ etag: null, status: 0 });
			}
		};

		return () => {
			worker.terminate();
			workerRef.current = null;
		};
	}, []);

	const uploadViaWorker = useCallback(
		(
			url: string,
			blob: Blob,
		): Promise<{ etag: string | null; status: number }> => {
			return new Promise((resolve) => {
				const worker = workerRef.current;
				if (!worker) {
					resolve({ etag: null, status: 0 });
					return;
				}
				const id = nextIdRef.current++;
				pendingRef.current.set(id, resolve);
				worker.postMessage({ type: "upload", id, url, blob });
			});
		},
		[],
	);

	const flushPart = useCallback(
		async (state: UploadState) => {
			if (state.buffer.length === 0) return;

			const blob = new Blob(state.buffer, { type: "application/octet-stream" });
			const partNum = state.partNumber;
			state.buffer = [];
			state.bufferSize = 0;
			state.partNumber++;
			state.inflightParts++;

			console.log(
				`[StreamUpload] Part ${partNum}: ${fmtBytes(blob.size)} (total=${fmtBytes(state.totalBytes)})`,
			);

			try {
				const { url } = await client.getPartUrl({
					key: state.key,
					uploadId: state.uploadId,
					partNumber: partNum,
				});
				const { etag, status } = await uploadViaWorker(url, blob);
				console.log(
					`[StreamUpload] Part ${partNum}: status=${status} ETag=${etag}`,
				);
				if (etag) {
					state.parts.push({ ETag: etag, PartNumber: partNum });
				} else {
					console.warn(`[StreamUpload] Part ${partNum}: missing ETag`);
				}
			} catch (err) {
				console.error(`[StreamUpload] Part ${partNum} failed:`, err);
			} finally {
				state.inflightParts--;
			}
		},
		[uploadViaWorker],
	);

	const start = useCallback(
		async (
			sessionId: string,
			camera: "front" | "back",
			contentType: string,
		) => {
			console.log(`[StreamUpload] Init: session=${sessionId} camera=${camera}`);
			try {
				const { uploadId, key } = await client.initVideoUpload({
					sessionId,
					camera,
					contentType,
				});
				console.log(
					`[StreamUpload] Ready: key=${key} uploadId=${uploadId.slice(0, 12)}...`,
				);
				stateRef.current = {
					key,
					uploadId,
					partNumber: 1,
					parts: [],
					buffer: [],
					bufferSize: 0,
					totalBytes: 0,
					chunkCount: 0,
					inflightParts: 0,
				};
			} catch (err) {
				console.error("[StreamUpload] Init failed:", err);
			}
		},
		[],
	);

	const pushChunk = useCallback(
		(chunk: Blob) => {
			const state = stateRef.current;
			if (!state) return;

			state.buffer.push(chunk);
			state.bufferSize += chunk.size;
			state.totalBytes += chunk.size;
			state.chunkCount++;

			if (state.chunkCount % 10 === 0) {
				console.log(
					`[StreamUpload] Chunk #${state.chunkCount}: buffer=${fmtBytes(state.bufferSize)}/${fmtBytes(MIN_PART_SIZE)} total=${fmtBytes(state.totalBytes)}`,
				);
			}

			if (state.bufferSize >= MIN_PART_SIZE && state.inflightParts === 0) {
				flushPart(state);
			}
		},
		[flushPart],
	);

	const finish = useCallback(async (): Promise<boolean> => {
		const state = stateRef.current;
		if (!state) {
			console.warn("[StreamUpload] finish() called with no active upload");
			return false;
		}

		console.log(
			`[StreamUpload] Finishing: ${state.parts.length} parts done, buffer=${fmtBytes(state.bufferSize)}, total=${fmtBytes(state.totalBytes)}`,
		);

		while (state.inflightParts > 0) {
			await new Promise((r) => setTimeout(r, 100));
		}

		try {
			if (state.buffer.length > 0) {
				console.log(
					`[StreamUpload] Flushing final ${fmtBytes(state.bufferSize)}...`,
				);
				await flushPart(state);
				while (state.inflightParts > 0) {
					await new Promise((r) => setTimeout(r, 100));
				}
			}

			if (state.parts.length === 0) {
				console.warn("[StreamUpload] No parts uploaded, aborting");
				await client.abortVideoUpload({
					key: state.key,
					uploadId: state.uploadId,
				});
				return false;
			}

			console.log(
				`[StreamUpload] Completing: ${state.parts.length} parts, ${fmtBytes(state.totalBytes)}`,
			);
			await client.completeVideoUpload({
				key: state.key,
				uploadId: state.uploadId,
				parts: state.parts,
			});
			console.log("[StreamUpload] Done!");
			return true;
		} catch (err) {
			console.error("[StreamUpload] Complete failed:", err);
			try {
				await client.abortVideoUpload({
					key: state.key,
					uploadId: state.uploadId,
				});
			} catch {}
			return false;
		} finally {
			stateRef.current = null;
		}
	}, [flushPart]);

	const abort = useCallback(async () => {
		const state = stateRef.current;
		if (!state) return;
		console.log(`[StreamUpload] Aborting: key=${state.key}`);
		try {
			await client.abortVideoUpload({
				key: state.key,
				uploadId: state.uploadId,
			});
		} catch {}
		stateRef.current = null;
	}, []);

	return { start, pushChunk, finish, abort };
}
