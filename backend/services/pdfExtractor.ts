import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/**
 * Extracts plain text from a base64 encoded PDF string or Buffer.
 * Safely handles data URL prefixes, malformed data, and returns clean text.
 */
export async function extractTextFromPdf(base64OrBuffer: string | Buffer): Promise<{
  text: string;
  pageCount: number;
  info?: any;
}> {
  try {
    let buffer: Buffer;

    if (Buffer.isBuffer(base64OrBuffer)) {
      buffer = base64OrBuffer;
    } else if (typeof base64OrBuffer === 'string') {
      // Clean possible data URI header (e.g. data:application/pdf;base64,...)
      const cleaned = base64OrBuffer.replace(/^data:[^;]+;base64,/, '').trim();
      buffer = Buffer.from(cleaned, 'base64');
    } else {
      throw new Error('Unsupported input type for PDF extraction.');
    }

    if (!buffer || buffer.length === 0) {
      return { text: '', pageCount: 0 };
    }

    const data = await pdfParse(buffer);
    const rawText = data?.text || '';

    // Clean up excessive whitespace while preserving line structure
    const cleanedText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return {
      text: cleanedText,
      pageCount: data?.numpages || 1,
      info: data?.info,
    };
  } catch (err: any) {
    console.warn('[PDF Extractor] Error extracting text from PDF:', err?.message || err);
    // Return empty string on parsing failure rather than crashing
    return {
      text: '',
      pageCount: 0,
    };
  }
}
