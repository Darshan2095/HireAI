import PDFParser from "pdf2json";

type PdfTextRun = { T: string };
type PdfTextItem = { R: PdfTextRun[] };
type PdfPage = { Texts: PdfTextItem[] };
type PdfParseResult = { Pages: PdfPage[] };

export const extractTextFromPDF = async (buffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => reject(err));

    pdfParser.on("pdfParser_dataReady", (pdfData: PdfParseResult) => {
      let text = "";

      pdfData.Pages.forEach((page) => {
        page.Texts.forEach((textItem) => {
          text += decodeURIComponent(textItem.R[0].T) + " ";
        });
      });

      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
};