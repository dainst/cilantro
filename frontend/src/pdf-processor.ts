import * as PDFJS from 'pdfjs-dist/webpack';
import { PDFDocumentProxy } from 'pdfjs-dist';

export default class PDFProcessor {
    private static async toUint8Array(file: File) {
        const buffer = await new Response(file).arrayBuffer();
        return new Uint8Array(buffer);
    }

    private static async getDetails(proxy: PDFDocumentProxy) {
        const destinations = await proxy.getDestinations();
        const js = await proxy.getJavaScript();
        const meta = await proxy.getMetadata();
        const outline = await proxy.getOutline();

        return {
            destinations, js, meta, outline
        };
    }

    static async processFilePath(pdfPath: string, full = true) {
        const content = await PDFJS.getDocument(pdfPath).promise;

        let details = {};
        if (full === true) {
            details = this.getDetails(content);
        }
        return { content, details };
    }

    static async processFileObject(pdfFile: File, full = true) {
        const arr = await this.toUint8Array(pdfFile);
        const content = await PDFJS.getDocument({ data: arr }).promise;

        let details = {};
        if (full === true) {
            details = await this.getDetails(content);
        }
        return { content, details };
    }
}
