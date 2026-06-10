/**
 * Copyright © 2026 650 Industries.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ReactNode } from 'react';
export type GetStreamingContentOptions = {
    loader?: {
        data?: any;
        /** Unique key for the route. Derived from the route's contextKey */
        key: string;
    };
    metadata?: {
        headNodes: ReactNode[];
    } | null;
    request?: Request;
    /** Assets for hydration bundles and development-only inline CSS. */
    assets?: {
        css: string[];
        /** CSS source to inline into the document head, used by development SSR. */
        inlineCss?: {
            source: string;
            hmrId?: string;
        }[];
        js: string[];
        /** Public href of a favicon generated from `web.favicon` in the app config. */
        favicon?: string;
    };
    /**
     * Render output shape — values mirror `web.output` from the Expo app config.
     * - `'server'` (default): return a `ReadableStream<Uint8Array>` for progressive SSR.
     * - `'static'`: await `stream.allReady` (every Suspense boundary settles) then drain
     *   the stream to a complete HTML string. Used for build-time SSG via the same
     *   streaming renderer.
     */
    output?: 'static' | 'server';
};
/**
 * Streaming SSR renderer using `renderToReadableStream`. Returns a web `ReadableStream`
 * that emits the full HTML document with head injections applied.
 */
export declare function getStreamingContent(location: URL, options: GetStreamingContentOptions & {
    output: 'static';
}): Promise<string>;
export declare function getStreamingContent(location: URL, options?: GetStreamingContentOptions & {
    output?: 'server';
}): Promise<ReadableStream<Uint8Array>>;
export { resolveMetadata } from './metadata';
//# sourceMappingURL=renderStreamingContent.d.ts.map