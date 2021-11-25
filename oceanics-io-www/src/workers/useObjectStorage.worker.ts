import { DOMParser } from "xmldom";
import type { FileSystem, SharedWorkerGlobalScope } from "./shared";
const ctx: SharedWorkerGlobalScope = self as any;

/**
 * Make HTTP request to S3 service for metadata about available
 * assets.
 * 
 * Use `xmldom.DOMParser` to parse S3 metadata as JSON file descriptors,
 * because window.DOMParser is not available in Web Worker 
 */
async function getFileSystem(url: string): Promise<FileSystem> {

    const parser = new DOMParser();
    const text = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    }).then(response => response.text());

    const xmlDoc = parser.parseFromString(text, "text/xml");
    const [result] = Object.values(xmlDoc.children).filter(
        (x) => x.nodeName === "ListBucketResult"
    );
    const nodes = Array.from(result.children);
    return {
        objects: nodes.filter(
            ({ tagName }) => tagName === "Contents"
        ).map(node => Object({
            key: node.childNodes[0].textContent,
            updated: node.childNodes[1].textContent,
            size: node.childNodes[3].textContent,
        })),
        collections: nodes.filter(
            ({ tagName }) => tagName === "CommonPrefixes"
        ).map(node => Object({
            key: node.childNodes[0].textContent
        }))
    };
}

/**
 * Get image data from S3, the Blob-y way. 
 */
const fetchImageBuffer = async (url: string): Promise<Float32Array> => {
    const blob = await fetch(url).then(response => response.blob());
    const arrayBuffer: string | ArrayBuffer | null = await (new Promise(resolve => {
        var reader = new FileReader();
        reader.onloadend = () => { resolve(reader.result); };
        reader.readAsArrayBuffer(blob);
    }));
    if (arrayBuffer instanceof ArrayBuffer) {
        return new Float32Array(arrayBuffer);
    } else {
        throw TypeError("Result is not ArrayBuffer type")
    }
}

ctx.onconnect = ({ports}: MessageEvent) => {
    const [port] = ports
    port.onmessage = async ({data}: MessageEvent) => {
    switch (data.type) {
        case "status":
            port.postMessage({
                type: "status",
                data: "ready",
            });
            return;
        case "index":
            port.postMessage({
                type: "data",
                data: await getFileSystem(data.url),
            });
            return;
        case "blob":
            port.postMessage({
                type: "data",
                data: await fetchImageBuffer(data.url),
            });
            return
    }
}
}