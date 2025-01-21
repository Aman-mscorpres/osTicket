const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./TEMP/");
  },
  filename: function (req, file, cb) {
    cb(null, `FILE_${Date.now()}_${Math.round(Math.random() * 1e9)}.${file.mimetype.split("/")[1]}`);
  },
});

const imageUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      e = Error("Only .png, .jpg, .jpeg format allowed!");
      e.name = "MulterError";
      return cb(e);
    }
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (
    ext === ".png" ||
    ext === ".jpg" ||
    ext === ".jpeg" ||
    ext === ".pdf" ||
    ext === ".csv" ||
    ext === ".xlsx" ||
    ext === ".zip" ||
    ext === ".rar" ||
    ext === ".doc" ||
    ext === ".docx" ||
    ext === ".ppt" ||
    ext === ".pptx" ||
    ext === ".txt"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    e = Error("Only .png, .jpg, .jpeg, .pdf, .csv, .xlsx, .zip, .rar, .doc, .docx, .ppt, .pptx, .txt, .pdf format allowed!");
    e.name = "MulterError";
    return cb(e);
  }
};

const fileUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const csvFileUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "text/csv") {
      cb(null, true);
    } else {
      cb(null, false);
      e = Error("Only .csv format allowed!");
      e.name = "MulterError";
      return cb(e);
    }
  },
});

const upload = {
  csvFileUpload: csvFileUpload,
  imageUpload: imageUpload,
  fileUpload: fileUpload,
};

module.exports = upload;
