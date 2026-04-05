import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const pageWidth = 595.28;
const pageHeight = 841.89;
const margin = 48;
const contentWidth = pageWidth - margin * 2;

const wrapText = (text: string, font: { widthOfTextAtSize: (value: string, size: number) => number }, size: number) => {
  const paragraphs = text.split(/\r?\n/);
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);

    if (words.length === 0) {
      lines.push("");
      continue;
    }

    let line = words[0];

    for (let index = 1; index < words.length; index += 1) {
      const nextLine = `${line} ${words[index]}`;
      if (font.widthOfTextAtSize(nextLine, size) > contentWidth) {
        lines.push(line);
        line = words[index];
      } else {
        line = nextLine;
      }
    }

    lines.push(line);
  }

  return lines;
};

export const generateResumePDF = async (resume: any) => {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let cursorY = pageHeight - margin;

  const startNewPage = (title = "HireAI Resume Report (continued)") => {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    cursorY = pageHeight - margin;

    currentPage.drawText(title, {
      x: margin,
      y: cursorY,
      size: 18,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    cursorY -= 36;
  };

  const drawTextBlock = (label: string, value: unknown) => {
    const text = value === null || value === undefined || value === "" ? "N/A" : String(value);
    const labelSize = 12;
    const valueSize = 11;
    const lineGap = 6;

    if (cursorY < margin + 60) {
      startNewPage();
    }

    currentPage.drawText(label, {
      x: margin,
      y: cursorY,
      size: labelSize,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    cursorY -= 20;

    const wrappedLines = wrapText(text, fontRegular, valueSize);
    for (const line of wrappedLines) {
      if (cursorY < margin) {
        startNewPage();
      }

      currentPage.drawText(line, {
        x: margin,
        y: cursorY,
        size: valueSize,
        font: fontRegular,
        color: rgb(0.2, 0.2, 0.2),
      });

      cursorY -= valueSize + lineGap;
    }

    cursorY -= 10;
  };

  currentPage.drawText("HireAI Resume Report", {
    x: margin,
    y: cursorY,
    size: 22,
    font: fontBold,
    color: rgb(0.05, 0.05, 0.05),
  });

  cursorY -= 32;

  drawTextBlock("Score", resume.score);
  drawTextBlock("Feedback", resume.feedback);
  drawTextBlock("Skills", resume.skills);
  drawTextBlock("Technologies", resume.technologies);
  drawTextBlock("Experience", resume.experience);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};