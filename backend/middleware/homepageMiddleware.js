// backend/middleware/homepageMiddleware.js

const MAX_TEXT = 5000;
const MAX_TITLE = 255;

function cleanText(v) {
  if (v === undefined || v === null) return "";
  // rapihin whitespace & cegah input aneh
  return String(v)
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

exports.validateAimBody = (req, res, next) => {
  const content = cleanText(req.body?.content);
  const orderNumber = req.body?.order_number;

  if (!content) return res.status(400).json({ message: "content wajib diisi" });
  if (content.length > MAX_TEXT) {
    return res.status(400).json({ message: `content maksimal ${MAX_TEXT} karakter` });
  }

  const n = parseInt(orderNumber, 10);
  if (orderNumber !== undefined && (Number.isNaN(n) || n < 1 || n > 999)) {
    return res.status(400).json({ message: "order_number harus angka 1-999" });
  }

  // set hasil bersih ke body supaya controller tinggal pakai
  req.body.content = content;
  req.body.order_number = Number.isNaN(n) ? 1 : n;

  next();
};

exports.validateVisionMissionBody = (req, res, next) => {
  const vision_title = cleanText(req.body?.vision_title) || "Vision";
  const vision_text = cleanText(req.body?.vision_text);
  const mission_title = cleanText(req.body?.mission_title) || "Mission";
  const mission_text = cleanText(req.body?.mission_text);

  if (!vision_text) return res.status(400).json({ message: "vision_text wajib diisi" });
  if (!mission_text) return res.status(400).json({ message: "mission_text wajib diisi" });

  if (vision_title.length > MAX_TITLE || mission_title.length > MAX_TITLE) {
    return res.status(400).json({ message: `title maksimal ${MAX_TITLE} karakter` });
  }
  if (vision_text.length > MAX_TEXT || mission_text.length > MAX_TEXT) {
    return res.status(400).json({ message: `text maksimal ${MAX_TEXT} karakter` });
  }

  req.body.vision_title = vision_title;
  req.body.vision_text = vision_text;
  req.body.mission_title = mission_title;
  req.body.mission_text = mission_text;

  next();
};