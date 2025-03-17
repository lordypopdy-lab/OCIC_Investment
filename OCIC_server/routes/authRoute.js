const express = require("express");
const router = express.Router();
const cors = require("cors");

const corsOptions = {
    origin: 'https://tradevite.vercel.app', 
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  };

  //https://tradevite.vercel.app
  
  router.use(cors(corsOptions));
  router.options('*', cors(corsOptions)); 

const { test, Delete, Decline, Approve, loginUser, createUser, deleteChat, getMessage, loginAdmin, chatSend, getUser, getUsers, addBalance , withdrawBank, getAdminChat, withdrawCrypto, AdminGetCrypto, AdminGetBankR, getBankRecords, getNotification, getCryptoRecords, notificationAdder, userNotification} = require("../controllers/authController");

router.get('/test', test);
router.post("/Delete", Delete);
router.post("/Approve", Approve);
router.post("/Decline", Decline);
router.post("/getUser", getUser);
router.get("/getUsers", getUsers);
router.post('/login', loginUser);
router.post("/chatSend", chatSend);
router.post('/register', createUser);
router.post('/adminAuth', loginAdmin);
router.post('/addBalance', addBalance);
router.post("/deleteChat", deleteChat);
router.post("/getMessage", getMessage);
router.post("/getAdminChat", getAdminChat);
router.post("/withdrawBank", withdrawBank);
router.post("/AdminGetBankR", AdminGetBankR);
router.post("/AdminGetCrypto", AdminGetCrypto);
router.post("/withdrawCrypto", withdrawCrypto);
router.post("/getBankRecords", getBankRecords);
router.post("/userMessage", notificationAdder);
router.post("/getNotification", getNotification);
router.post("/userNotification", userNotification);
router.post("/getCryptoRecords", getCryptoRecords);


module.exports = router;