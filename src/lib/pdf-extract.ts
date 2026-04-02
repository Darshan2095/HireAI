import PDFParser from "pdf2json";

export const extractTextFromPDF = async (buffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => reject(err));

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      let text = "";

      pdfData.Pages.forEach((page: any) => {
        page.Texts.forEach((textItem: any) => {
          text += decodeURIComponent(textItem.R[0].T) + " ";
        });
      });

      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
};