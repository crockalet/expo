import type { File } from './File';
/**
 * A lazy, range-based slice of a {@link File} that implements the `Blob` interface.
 *
 * Unlike `Blob`, `FileSlice` does not read any data at construction time.
 * The underlying bytes are fetched on demand when a consumption method
 * (`arrayBuffer`, `text`, `bytes`, `stream`) is called, and only the
 * requested byte range is read from disk.
 *
 * Each consumption call opens its own `FileHandle`, so concurrent reads
 * from the same slice (or different slices of the same file) are safe.
 *
 * Calling `slice()` on a `FileSlice` produces a new `FileSlice` with
 * composed offsets -- no data is copied or read.
 */
export declare class FileSlice implements Blob {
    private readonly source;
    private readonly _start;
    private readonly _end;
    readonly type: string;
    get [Symbol.toStringTag](): string;
    constructor(source: File, start: number, end: number, contentType: string);
    get size(): number;
    arrayBuffer(): Promise<ArrayBuffer>;
    bytes(): Promise<Uint8Array<ArrayBuffer>>;
    text(): Promise<string>;
    slice(start?: number, end?: number, contentType?: string): Blob;
    stream(): ReadableStream<Uint8Array<ArrayBuffer>>;
    formData(): ReturnType<Response['formData']>;
    json(): Promise<any>;
}
//# sourceMappingURL=FileSlice.d.ts.map