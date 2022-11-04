const { PDFDocument } = require("pdf-lib");

const pdfDocumentFromFile = async (file) => {
  try {
    const result = await PDFDocument.load(await pdfArray(file), {
      ignoreEncryption: true,
    });
    if (result.isEncrypted === false) {
      return { ok: true, result };
    } else {
      return { ok: false, error: "password" };
    }
  } catch (e) {
    return { ok: false, error: "damaged" };
  }
};

const extractPageFromPDFAsPDF = async (srcDoc, page) => {
  const pdfDoc = await PDFDocument.create();
  const copiedPages = await pdfDoc.copyPages(srcDoc, [page]);
  const [firstPage] = copiedPages;
  pdfDoc.insertPage(0, firstPage);
  return pdfDoc;
};

const mergePDF = async (filesDocArray) => {
  if (filesDocArray.length < 2) {
    return filesDocArray[0] || null;
  }
  const mergedPdf = await PDFDocument.create();
  for (let i = 0; i < filesDocArray.length; i++) {
    const fileDoc = filesDocArray[i];
    const pages = await mergedPdf.copyPages(fileDoc, fileDoc.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  return mergedPdf;
};

const pdfArray = async (file) => {
  if (typeof file === Uint8Array) {
    return file;
  }
  const fileURL = URL.createObjectURL(file);
  const data = await fetch(fileURL);
  const fileArray = await data.arrayBuffer();
  return fileArray;
};

const { degrees } = require("pdf-lib");

const rotatePDF = async (pdfDoc, degree) => {
  const pages = pdfDoc.getPages();
  pages.forEach((page) => {
    page.setRotation(degrees(degree));
  });
  return pdfDoc;
};

module.exports = {
  pdfDocumentFromFile,
  extractPageFromPDFAsPDF,
  mergePDF,
  pdfArray,
  rotatePDF,
};
