import PDFParser from "pdf2json";

type PdfTextRun = { T: string };
type PdfTextItem = { R: PdfTextRun[] };
type PdfPage = { Texts: PdfTextItem[] };
type PdfParseResult = { Pages: PdfPage[] };

const safeDecodeText = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const extractTextFromPDF = async (buffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => reject(err));

    pdfParser.on("pdfParser_dataReady", (pdfData: PdfParseResult) => {
      let text = "";

      pdfData.Pages.forEach((page) => {
        page.Texts.forEach((textItem) => {
          const run = textItem.R[0]?.T;

          if (typeof run === "string" && run.length > 0) {
            text += safeDecodeText(run) + " ";
          }
        });
      });

      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
};