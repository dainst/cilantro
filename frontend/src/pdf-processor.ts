import * as PDFJS from 'pdfjs-dist/webpack';
import { PDFDocumentProxy } from 'pdfjs-dist';

export async function processFilePath(pdfPath: string, full = true) {
    const content = await PDFJS.getDocument(pdfPath).promise;

    let details = {};
    if (full === true) {
        details = getDetails(content);
    }
    return { content, details };
}

export async function processFileObject(pdfFile: File, full = true) {
    const arr = await toUint8Array(pdfFile);
    const content = await PDFJS.getDocument({ data: arr }).promise;

    let details = {};
    if (full === true) {
        details = await getDetails(content);
    }
    return { content, details };
}

async function toUint8Array(file: File) {
    const buffer = await new Response(file).arrayBuffer();
    return new Uint8Array(buffer);
}

async function getDetails(proxy: PDFDocumentProxy) {
    const destinations = await proxy.getDestinations();
    const js = await proxy.getJavaScript();
    const meta = await proxy.getMetadata();
    const outline = await proxy.getOutline();

    return {
        destinations, js, meta, outline
    };
}