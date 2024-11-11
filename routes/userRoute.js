const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const session = require("express-session");
const {
  registerLoad,
  register,
  loginLoad,
  login,
  loadDashboard,
  logout,
  saveChat,
} = require("../controllers/userController");
const { isAllowed } = require("../middlewares/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Image Only"), false);
  }
};

const upload = multer({ storage, fileFilter: filter });
router.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

router
  .route("/register")
  .get(registerLoad)
  .post(upload.single("image"), register);

router.route("/login").get(loginLoad).post(login);
router.route("/logout").get(isAllowed, logout);

router.route("/dashboard").get(isAllowed, loadDashboard);
router.post("/saveChat", isAllowed, saveChat);

module.exports = router;
