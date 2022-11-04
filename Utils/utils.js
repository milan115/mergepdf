import { toast } from "react-toastify";
const {
  extractPageFromPDFAsPDF,
  pdfDocumentFromFile,
  rotatePDF,
  mergePDF,
} = require("../Utils/pdf-methods.js");

const appSettings = {
  savedFileName: "mergedFile.pdf",
  maxSize: (function () {
    return "10240kb".slice(0, -2) * 1024;
  })(),
};

export function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}

let uuid = 1;

export function addMultipleEventListener(elements, events, action) {
  elements.forEach((elem) => {
    events.forEach((evt) => elem.addEventListener(evt, action));
  });
}

export function removeMultipleEventListener(elements, events, action) {
  elements.forEach((elem) => {
    events.forEach((evt) => elem.removeEventListener(evt, action));
  });
}

export const notify = (expr, message) => {
  switch (expr) {
    case "info":
      return toast.info(message);
    case "success":
      return toast.success(message);
    case "warning":
      return toast.warning(message);
    case "error":
      return toast.error(message);
    default:
      return toast(message);
  }
};

export const getBlob = async (e) => {
  const b64Data = e.target.result;
  const result = await fetch(b64Data);
  const blob = await result.blob();
  return blob;
};

export function ApplyFileValidationRules(e, readerEvt, t) {
  if (checkFileType(readerEvt.type) == false) {
    notify("warning", t("common:file_extension_error"));
    return false;
  }

  if (checkFileSize(readerEvt.size) == false) {
    const fileName = readerEvt.name;
    notify(
      "warning",
      "The file : " +
        fileName +
        " is too large. Please try to upload a file smaller than 10MB size."
    );
    return false;
  }

  return true;
}

export function checkFileType(fileType) {
  if (fileType === "application/pdf") {
    return true;
  } else {
    return false;
  }
}

export function checkFileSize(fileSize) {
  if (fileSize < appSettings.maxSize) {
    return true;
  } else {
    return false;
  }
}

export const handleFileSelect = (
  e,
  setFilesCount,
  setNewBlob,
  t,
  mountedRef
) => {
  let files;
  if (typeof e.dataTransfer === "undefined") {
    if (!e.target.files) return;
    files = e.target.files;
  } else {
    if (!e.dataTransfer.files) return;
    files = e.dataTransfer.files;
  }

  if (mountedRef.current) {
    setFilesCount(files.length);
  }

  for (let i = 0, f; (f = files[i]); i++) {
    if (f) {
      let reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = ((readerEvt) => {
        return function (evt) {
          if (ApplyFileValidationRules(evt, readerEvt, t)) {
            getBlob(evt).then((blob) => {
              const fileName = readerEvt.name;
              if (mountedRef.current) {
                setNewBlob((prev) => [...prev, { blob, fileName }]);
              }
            });
          } else {
            if (mountedRef.current) {
              setFilesCount((prev) => prev - 1);
            }

            if (e.target.value) {
              e.target.value = null;
            }
          }
        };
      })(f);
    } else {
      notify("error", "File is not defined");
    }
  }
};

export async function generatePages(newBlob, mountedRef, addPage) {
  let damagedFilesNames = [];
  let protectedFilesNames = [];

  for (const nb of newBlob) {
    await (async (nb) => {
      const { ok, result: srcDoc, error } = await pdfDocumentFromFile(nb.blob);

      if (ok) {
        for (const page of range(0, srcDoc.getPages().length - 1)) {
          const extractPageAsPDF = await extractPageFromPDFAsPDF(srcDoc, page);
          const base64DataUri = await extractPageAsPDF.saveAsBase64({
            dataUri: true,
          });
          const result = await fetch(base64DataUri);
          const blob = await result.blob();
          const rotation = extractPageAsPDF.getPage(0).getRotation().angle;
          const width = extractPageAsPDF.getPage(0).getWidth();
          const height = extractPageAsPDF.getPage(0).getHeight();
          let id = uuid++;
          addPage({
            id,
            order: id,
            blob,
            rotation,
            width,
            height,
          });
          if (!mountedRef.current) {
            break;
          }
        }
      } else {
        if (error === "password") {
          protectedFilesNames.push(nb.fileName);
        } else if (error === "damaged") {
          damagedFilesNames.push(nb.fileName);
        } else {
          notify("error", "An unknown error occurred. Please try again later.");
        }
      }
    })(nb);
  }

  if (mountedRef.current) {
    if (protectedFilesNames.length > 0) {
      notify(
        "error",
        <div>
          <h4>Something went wrong</h4>
          <p>Password-protected file(s):</p>
          <ul>
            {protectedFilesNames.map((elem, i) => {
              return <li key={i}> {elem} </li>;
            })}
          </ul>
          <p>Please unlock the file(s) and try again.</p>
        </div>
      );
    }

    if (damagedFilesNames.length > 0) {
      notify(
        "error",
        <div>
          <h4>Something went wrong</h4>
          <p>Corrupted file(s): </p>
          <ul>
            {damagedFilesNames.map((elem, i) => {
              return <li key={i}> {elem} </li>;
            })}
          </ul>
          <p>Please make a new copy of the file(s) and try again.</p>
        </div>
      );
    }
  }
}

export const handleSave = async (pages) => {
  const filesDocArray = [];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { ok, result: pdfDoc, error } = await pdfDocumentFromFile(page.blob);

    if (ok) {
      const rotationAngleBefore = pdfDoc.getPage(0).getRotation().angle;
      if (rotationAngleBefore != page.rotation) {
        const rotatedPDF = await rotatePDF(pdfDoc, page.rotation);
        filesDocArray.push(rotatedPDF);
      } else {
        filesDocArray.push(pdfDoc);
      }
    } else {
      notify("error", "An unknown error occurred. Please try again later.");
    }
  }

  if (filesDocArray.length !== 0) {
    const mergedPdf = await mergePDF(filesDocArray);
    const mergedPdfFile = await mergedPdf.save();

    download(mergedPdfFile, appSettings.savedFileName, "application/pdf");
  }
};

const download = (file, filename, type) => {
  const link = document.createElement("a");
  link.download = filename;
  let binaryData = [];
  binaryData.push(file);
  link.href = URL.createObjectURL(new Blob(binaryData, { type: type }));
  link.click();
};

export const rotateLeft = (prevRotation) => {
  let newRotation = 0;
  if (prevRotation === 0) {
    newRotation = 270;
  } else if (prevRotation === 270) {
    newRotation = 180;
  } else if (prevRotation === 180) {
    newRotation = 90;
  } else if (prevRotation === 90) {
    newRotation = 0;
  }
  return newRotation;
};

export const rotateRight = (prevRotation) => {
  let newRotation = 0;
  if (prevRotation === 0) {
    newRotation = 90;
  } else if (prevRotation === 90) {
    newRotation = 180;
  } else if (prevRotation === 180) {
    newRotation = 270;
  } else if (prevRotation === 270) {
    newRotation = 0;
  }
  return newRotation;
};
