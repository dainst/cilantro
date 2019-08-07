import * as PDFJS from 'pdfjs-dist/webpack';
import {
    PDFDocumentProxy, PDFInfo, PDFMetadata, PDFTreeNode
} from 'pdfjs-dist';

export default class ProcessedPDF {
    private proxy: PDFDocumentProxy;
    private destinations?: any[];
    private meta?: { info: PDFInfo; metadata: PDFMetadata; };
    private outline?: PDFTreeNode[];

    constructor(proxy: PDFDocumentProxy) {
        this.proxy = proxy;
    }

    async getDetails() {
        this.destinations = await this.proxy.getDestinations();
        this.meta = await this.proxy.getMetadata();
        this.outline = await this.proxy.getOutline();
    }

    get numPages(): number {
        return this.proxy.numPages;
    }

    get metaData(): any {
        if (this.meta === undefined) return {};
        return this.meta.info;
    }
}

export async function byFilePath(pdfPath: string, auth: string, full = true) {
    const content = await PDFJS.getDocument(
        { url: pdfPath, httpHeaders: { Authorization: auth } }
    ).promise;

    const result = new ProcessedPDF(content);
    if (full) {
        await result.getDetails();
    }
    return result;
}

export async function byFileObject(pdfFile: File, full = true) {
    const arr = await toUint8Array(pdfFile);
    const content = await PDFJS.getDocument({ data: arr }).promise;

    const result = new ProcessedPDF(content);
    if (full) {
        await result.getDetails();
    }
    return result;
}

async function toUint8Array(file: File) {
    const buffer = await new Response(file).arrayBuffer();
    return new Uint8Array(buffer);
}
