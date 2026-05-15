const express = require("express");
const router = express.Router();

const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ocicinvestment.vercel.app",
  "https://ocicinvestment-kyc.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

router.use(cors(corsOptions));
router.options("*", cors(corsOptions));

const {
  test,
  Delete,
  Decline,
  Approve,
  loginUser,
  createUser,
  deleteUser,
  deleteChat,
  getMessage,
  loginAdmin,
  chatSend,
  getUser,
  sendMail,
  getUsers,
  getOTP,
  userInfo,
  verifyOtp,
  fetchOTP,
  DeleteKyc,
  DeclineKyc,
  ApproveKyc,
  fetchAllKyc,
  fetchKyc,
  citizenId,
  addBalance,
  withdrawBank,
  getAdminChat,
  getAccountLevel,
  withdrawCrypto,
  AdminGetCrypto,
  AdminGetBankR,
  upgradeAccount,
  getBankRecords,
  getNotification,
  getCryptoRecords,
  notificationAdder,
  userNotification,
  getUserVerification,
} = require("../controllers/authController");

router.get("/test", test);
router.post("/Delete", Delete);
router.post("/sendMail", sendMail);
router.post("/Approve", Approve);
router.post("/Decline", Decline);
router.post("/getUser", getUser);
router.get("/getUsers", getUsers);
router.post("/login", loginUser);
router.post("/chatSend", chatSend);
router.post("/register", createUser);
router.post("/adminAuth", loginAdmin);
router.post("/addBalance", addBalance);
router.post("/deleteChat", deleteChat);
router.post("/citizenId", citizenId);
router.post("/userInfo", userInfo);
router.post("/getOTP", getOTP);
router.post("/fetchKyc", fetchKyc);
router.post("/fetchOTP", fetchOTP);
router.post("/DeleteKyc", DeleteKyc);
router.get("/fetchAllKyc", fetchAllKyc);
router.post("/ApproveKyc", ApproveKyc);
router.post("verifyOtp", verifyOtp);
router.post("/DeclineKyc", DeclineKyc);
router.post("/getMessage", getMessage);
router.post("/deleteUser", deleteUser);
router.post("/getAdminChat", getAdminChat);
router.post("/withdrawBank", withdrawBank);
router.post("/AdminGetBankR", AdminGetBankR);
router.post("/upgradeAccount", upgradeAccount);
router.post("/AdminGetCrypto", AdminGetCrypto);
router.post("/withdrawCrypto", withdrawCrypto);
router.post("/getBankRecords", getBankRecords);
router.post("/userMessage", notificationAdder);
router.post("/getAccountLevel", getAccountLevel);
router.post("/getNotification", getNotification);
router.post("/userNotification", userNotification);
router.post("/getCryptoRecords", getCryptoRecords);
router.post("/getUserVerification", getUserVerification);

module.exports = router;
