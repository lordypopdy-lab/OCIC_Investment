const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const OtpModel = require("../models/OtpModel");
const chatModel = require("../models/chatModel");
const bankModel = require("../models/bankModel");
const cryptoModel = require("../models/cryptoModel");
const adminMessage = require("../models/adminMessage");
const userInfomation = require("../models/userInformation");

const nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config();

const { sendWithdrawalEmail } = require("../helpers/mailer");

const accountUpgradeModel = require("../models/accountLevel");
const { hashPassword, comparePassword } = require("../helpers/auth");

const mongoose = require("mongoose");

const { sendAdderEmail } = require("../helpers/adder_mailer");

const { sendEmail } = require("../utils/emailService.js");

const sendMail = async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required!" });
    }
    if (!message) {
      return res.status(400).json({ error: "Message is required!" });
    }

    const subject = "ForexPluse Notification 🔔";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${email}`);

    return res.json({ success: "Email sent and record updated successfully!" });
  } catch (error) {
    console.error("❌ sendMail error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const DeclineKyc = async (req, res) => {
  const { kycDecline } = req.body;

  const kycDec = await OtpModel.updateOne(
    { _id: kycDecline },
    { $set: { kycStatus: "Declined" } },
  );
  if (kycDec) {
    return res.json({
      success: "Kyc Declined Successfully!",
    });
  }

  return res.json({
    error: "Error Declining Kyc",
  });
};

const DeleteKyc = async (req, res) => {
  const { kycAction } = req.body;
  const deleteAction = await OtpModel.deleteOne({ _id: kycAction });

  if (deleteAction) {
    return res.json({
      success: "Kyc Request deleted succesfully!",
    });
  }

  return res.json({
    error: "Error Deleting Kyc Request",
  });
};

const ApproveKyc = async (req, res) => {
  const { kycApprove } = req.body;

  const kycDec = await OtpModel.updateOne(
    { _id: kycApprove },
    { $set: { kycStatus: "verified" } },
  );
  if (kycDec) {
    return res.json({
      success: "Kyc verified Successfully!",
    });
  }

  return res.json({
    error: "Error Approving Kyc",
  });
};

const fetchAllKyc = async (req, res) => {
  const kyc = await OtpModel.find({});
  return res.json({
    kyc: kyc,
  });
};

const fetchKyc = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      error: "Email Required!",
    });
  }

  const ifVerifiedOtp = await OtpModel.findOne({ email: email });

  if (ifVerifiedOtp && ifVerifiedOtp.kycStatus === "Verified") {
    return res.json({
      status: "Verified",
    });
  }

  if (ifVerifiedOtp && ifVerifiedOtp.kycStatus === "Inreview") {
    return res.json({
      status: "Inreview",
    });
  }

  return res.json({
    status: "Unverified",
  });
};

const fetchOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      error: "Email Required!",
    });
  }

  const ifVerifiedOtp = await OtpModel.findOne({ email: email });

  if (ifVerifiedOtp && ifVerifiedOtp.status === "Verified") {
    return res.json({
      status: "Verified",
    });
  }

  return res.json({
    status: "Unverified",
  });
};

const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.json({
      error: "Please Enter OTP Code before submiting!",
    });
  }

  const ifCorrect = await OtpModel.findOne({ Otp: otp });
  if (!ifCorrect) {
    return res.json({
      error: "Incorrect OTP, Please Re-Check Yout E-Mail for New OTP",
    });
  }

  await OtpModel.updateOne({ Otp: otp }, { $set: { status: "Verified" } });
  return res.status(200).json({
    success: "Successfuly Verified OTP",
  });
};

const getOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      error: "email is required to request for OTP",
    });
  }

  // Generate OTP
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

  const otp = generateOTP();

  // Email Template
  const emailHTML = `
    <div>
      <p>Hi <b>${email}</b>,</p>
      <p>Your verification code is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn’t request this, ignore the email.</p>
      <br/>
      <p>Thanks,</p>
      <p><b>Your App Team</b></p>
    </div>
  `;

  try {
    // Send using Resend
    const sent = await sendEmail(email, "Your OTP Code", emailHTML);

    if (!sent) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    // Save or update OTP in DB
    const ifExist = await OtpModel.findOne({ email });

    if (ifExist) {
      await OtpModel.updateOne({ email }, { $set: { Otp: otp } });

      return res.json({
        message: "OTP Sent Successfully!",
        OTP: otp,
      });
    }

    await OtpModel.create({ email, Otp: otp });

    return res.json({
      message: "OTP Sent Successfully!",
      OTP: otp,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

const citizenId = async (req, res) => {
  const { email, imgSrc } = req.body;

  const checkIF = await OtpModel.findOne({ email: email });

  console.log(email);

  if (checkIF) {
    await OtpModel.updateOne(
      { email: email },
      { $set: { kycStatus: "Inreview", kycPic: imgSrc } },
    );
    const updateUserPic = await userInfomation.updateOne(
      { email: email },
      { $set: { IdProfile: imgSrc } },
    );
    const updateUser = await User.updateOne(
      { email: email },
      { $set: { citizenId: `${imgSrc}`, verification: `Inreview` } },
    );
    if (updateUser && updateUserPic) {
      return res.json({
        success: "Success",
      });
    }
  } else {
    await OtpModel.create({
      email: email,
      Otp: "",
      status: "Unverified",
      kycStatus: "Inreview",
      kycPic: imgSrc,
    });

    const updateUserPic = await userInfomation.updateOne(
      { email: email },
      { $set: { IdProfile: imgSrc } },
    );
    const updateUser = await User.updateOne(
      { email: email },
      { $set: { citizenId: `${imgSrc}`, verification: `Inreview` } },
    );
    if (updateUser && updateUserPic) {
      return res.json({
        success: "Success",
      });
    }
  }
};

const userInfo = async (req, res) => {
  const { email, Id, Country } = req.body;
  const check = await userInfomation.findOne({ email });
  if (check) {
    const update = await userInfomation.updateOne(
      { email: email },
      { $set: { email: `${email}`, Id: `${Id}`, Country: `${Country}` } },
    );
    if (update) {
      return res.json({
        message: "Updated",
      });
    }
  }
  const create = await userInfomation.create({
    email,
    Id,
    Country,
  });
  if (create) {
    return res.json({
      message: "success",
    });
  }
};

const getUserVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const otpStatus = await OtpModel.findOne({ email });

    if (!otpStatus) {
      return res.json({
        status: "failed",
        message: "No record found",
      });
    }

    return res.json({
      status: "success",
      data: otpStatus,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userID } = req.body;

    const deletedUser = await User.findByIdAndDelete(userID);

    if (!deletedUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.json({ success: true, msg: "User deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getAccountLevel = async (req, res) => {
  const { ID } = req.body;
  const ifExist = await accountUpgradeModel.findOne({ userID: ID });

  if (ifExist) {
    return res.json({
      Level: ifExist,
    });
  }
};

const upgradeAccount = async (req, res) => {
  try {
    const { ID, ULevel } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ID)) {
      return res.json({ error: "Invalid user ID format" });
    }

    const checkUser = await User.findById(ID);
    if (!checkUser) {
      return res.status(404).json({ error: "User ID not found" });
    }

    const ifExist = await accountUpgradeModel.findOne({ userID: ID });

    if (!ifExist) {
      await accountUpgradeModel.create({
        userID: ID,
        accountLevel: ULevel,
      });

      return res.json({
        success: `User ${ID} has been upgraded to ${ULevel}`,
      });
    }

    if (ifExist.accountLevel === ULevel) {
      return res.json({
        error: `User account is already at ${ifExist.accountLevel}`,
      });
    }

    await accountUpgradeModel.updateOne(
      { userID: ID },
      { $set: { accountLevel: ULevel } },
    );

    return res.json({
      success: `User ${ID} has been upgraded to ${ULevel}`,
    });
  } catch (error) {
    console.error("Error upgrading account:", error);
    return res.json({ error: "Internal server error" });
  }
};

const getMessage = async (req, res) => {
  const { ID } = req.body;

  const getNoti = await adminMessage.findOne({ userID: ID });

  if (getNoti) {
    return res.json(getNoti);
  }

  return res.json({ data: "No data" });
};

const getNotification = async (req, res) => {
  const { ID } = req.body;
  const getNoti = await adminMessage.findOne({ userID: ID });

  if (getNoti) {
    return res.json(getNoti);
  }

  return res.json({ data: "No data" });
};

const Delete = async (req, res) => {
  const { isDelete } = req.body;

  const checkBank = await bankModel.findOne({ _id: isDelete });
  const checkCrypto = await cryptoModel.findOne({ _id: isDelete });

  if (checkBank) {
    await bankModel.deleteOne({ _id: isDelete });
    return res.json({
      success: "Transaction Deleted Successfully!",
    });
  }

  if (checkCrypto) {
    await cryptoModel.deleteOne({ _id: isDelete });
    return res.json({
      success: "Transaction Deleted Successfully!",
    });
  }

  return res.json({
    error: "Unidentify transaction ID",
  });
};

const Approve = async (req, res) => {
  const { isApprove } = req.body;

  const checkBank = await bankModel.findOne({ _id: isApprove });
  const checkCrypto = await cryptoModel.findOne({ _id: isApprove });

  if (checkBank) {
    await bankModel.updateOne(
      { _id: isApprove },
      { $set: { status: "Approved" } },
    );
    return res.json({
      success: "Transaction approved Successfully!",
    });
  }

  if (checkCrypto) {
    await cryptoModel.updateOne(
      { _id: isApprove },
      { $set: { status: "Approved" } },
    );
    return res.json({
      success: "Transaction Approved Successfully!",
    });
  }

  return res.json({
    error: "Unidentify transaction ID",
  });
};

const Decline = async (req, res) => {
  const { isDecline } = req.body;

  const checkBank = await bankModel.findOne({ _id: isDecline });
  const checkCrypto = await cryptoModel.findOne({ _id: isDecline });

  if (checkBank) {
    await bankModel.updateOne(
      { _id: isDecline },
      { $set: { status: "Declined" } },
    );
    return res.json({
      success: "Transaction Declined Successfully!",
    });
  }

  if (checkCrypto) {
    await cryptoModel.updateOne(
      { _id: isDecline },
      { $set: { status: "Declined" } },
    );
    return res.json({
      success: "Transaction Declined Successfully!",
    });
  }

  return res.json({
    error: "Unidentify transaction ID",
  });
};

const userNotification = async (req, res) => {
  const { id, value } = req.body;
  if (!id) {
    return res.json({
      error: "userID and notification field is required! to send Message",
    });
  }

  if (!value) {
    return res.json({
      error: "userID and notification field is required! to send Message",
    });
  }

  check01 = await adminMessage.findOne({ userID: id });
  if (check01) {
    await adminMessage.updateOne(
      { userID: id },
      { $set: { notification: value } },
    );
    return res.json({
      success: "Notification sent",
    });
  }

  await adminMessage.create({
    userID: id,
    notification: value,
  });

  return res.json({
    success: "Notification sent",
  });
};

const notificationAdder = async (req, res) => {
  const { id, value } = req.body;

  if (!id) {
    return res.json({
      error: "userID and message field is required! to send Message",
    });
  }

  if (!value) {
    return res.json({
      error: "userID and message field is required! to send Message",
    });
  }

  check01 = await adminMessage.findOne({ userID: id });
  if (check01) {
    await adminMessage.updateOne(
      { userID: id },
      { $set: { submitMessage: value } },
    );
    return res.json({
      success: "message sent",
    });
  }

  await adminMessage.create({
    userID: id,
    submitMessage: value,
  });

  return res.json({
    success: "message sent",
  });
};

const deleteChat = async (req, res) => {
  const { id } = req.body;
  const deleted = await chatModel.deleteOne({ _id: id });
  if (deleted) {
    return res.json({
      success: "Chat Deleted",
    });
  }
};

const chatSend = async (req, res) => {
  const { value, from, email } = req.body;

  if (!value) {
    return res.json({
      error: "Message field is required",
    });
  }

  if (!from) {
    return res.json({
      error: "unidentified User",
    });
  }

  if (!email) {
    return res.json({
      error: "Email Not Found",
    });
  }
  const createNewChat = await chatModel.create({
    from: from,
    email: email,
    message: value,
    tmp_stp: new Date(),
  });

  if (createNewChat) {
    const chat = await chatModel.find({ email: email });
    return res.json({
      chat: chat,
    });
  }
};

const getAdminChat = async (req, res) => {
  const { email } = req.body;

  const getChat = await chatModel.find({ email: email });
  if (getChat) {
    return res.json({
      chat: getChat,
    });
  }

  res.json({
    message: "No Chat Available",
  });
};

const AdminGetCrypto = async (req, res) => {
  const { email } = req.body;
  const ifAdmin = await Admin.findOne({ email: email });
  if (ifAdmin) {
    const bankR = await cryptoModel.find();
    return res.json(bankR);
  }

  return res.json({
    error: "Unidentify Admin 404",
  });
};

const AdminGetBankR = async (req, res) => {
  const { email } = req.body;

  const ifAdmin = await Admin.findOne({ email: email });
  if (ifAdmin) {
    const bankR = await bankModel.find();
    return res.json(bankR);
  }

  return res.json({
    error: "Unidentify Admin 404",
  });
};

const getCryptoRecords = async (req, res) => {
  const { email } = req.body;
  const find = await cryptoModel.find({ email: email });

  if (find) {
    return res.json(find);
  }

  return res.json({});
};

const getBankRecords = async (req, res) => {
  const { email } = req.body;

  const find = await bankModel.find({ email: email });

  if (find) {
    return res.json(find);
  }

  return res.json({});
};

const getUser = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.json({
      error: "unidentyfied user",
    });
  }
  return res.json(user);
};

const withdrawCrypto = async (req, res) => {
  const { email, value, walletAddress } = req.body;

  if (!value || value <= 10) {
    return res.json({
      error: "Amount must be provided and must be greater than 10",
    });
  }

  if (!walletAddress) {
    return res.json({
      error: "A valid wallet address is required",
    });
  }

  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    return res.status(404).json({
      error: "Invalid request, Unidentify user",
    });
  }

  if (findUser.deposit >= value) {
    await cryptoModel.create({
      amount: value,
      email: email,
      cryptoAddress: walletAddress,
      reg_date: new Date(),
    });

    await User.updateOne({ email: email }, { $inc: { deposit: -value } });
    sendWithdrawalEmail(email, value);
    return res.json({
      success: "withdrawal request sent",
    });
  }

  if (findUser.profit >= value) {
    await cryptoModel.create({
      amount: value,
      cryptoAddress: walletAddress,
      email: email,
      reg_date: new Date(),
    });

    await User.updateOne({ email: email }, { $inc: { profit: -value } });
    sendWithdrawalEmail(email, value);
    return res.json({
      success: "withdrawal request sent",
    });
  }

  if (findUser.bonuse >= value) {
    await cryptoModel.create({
      amount: value,
      cryptoAddress: walletAddress,
      email: email,
      reg_date: new Date(),
    });

    await User.updateOne({ email: email }, { $inc: { bonuse: -value } });
    sendWithdrawalEmail(email, value);
    return res.json({
      success: "withdrawal request sent",
    });
  }

  if (findUser.deposit <= value) {
    return res.json({
      error: "Insufficient Balance!",
    });
  }

  if (findUser.profit <= value) {
    return res.json({
      error: "Insufficient Balance!",
    });
  }

  if (findUser.bonuse <= value) {
    return res.json({
      error: "Insufficient Balance!",
    });
  }
};

const withdrawBank = async (req, res) => {
  const { email, value, bank_name, account_name, account_number, swift_code } =
    req.body;

  if (!value || value <= 10) {
    return res.json({
      error: "Amount is required and must be greater than 10",
    });
  }

  if (!bank_name) {
    return res.json({
      error: "Bank name must be provided, to sign Withdrawal",
    });
  }

  if (!account_name) {
    return res.json({
      error: "Account Name must be provided, to sign Withdrawal",
    });
  }

  if (!account_number) {
    return res.json({
      error: "Account number must be provided, to sign Withdrawal",
    });
  }

  if (!swift_code) {
    return res.json({
      error: "Swift-Code must be provided, to sign Withdrawal",
    });
  }

  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    return res.status(404).json({
      error: "Invalid request, Unidentify user",
    });
  }

  console.log(findUser.deposit);
  if (findUser.deposit >= value) {
    await bankModel.create({
      amount: value,
      bank: bank_name,
      name: account_name,
      swiftCode: swift_code,
      email: email,
      reg_date: new Date(),
    });

    await User.updateOne({ email: email }, { $inc: { deposit: -value } });
    sendWithdrawalEmail(email, value);
    return res.json({
      success: "withdrawal request sent",
    });
  }

  if (findUser.profit >= value) {
    await bankModel.create({
      amount: value,
      bank: bank_name,
      name: account_name,
      swiftCode: swift_code,
      email: email,
      reg_date: new Date(),
    });

    await User.updateOne({ email: email }, { $inc: { profit: -value } });
    sendWithdrawalEmail(email, value);
    return res.json({
      success: "withdrawal request sent",
    });
  }

  if (findUser.bonuse >= value) {
    await bankModel.create({
      amount: value,
      bank: bank_name,
      name: account_name,
      swiftCode: swift_code,
      email: email,
      reg_date: new Date(),
    });

    await User.updateOne({ email: email }, { $inc: { bonuse: -value } });
    sendWithdrawalEmail(email, value);
    return res.json({
      success: "withdrawal request sent",
    });
  }

  if (findUser.deposit <= value) {
    return res.json({
      error: "Insufficient Balance!",
    });
  }

  if (findUser.profit <= value) {
    return res.json({
      error: "Insufficient Balance!",
    });
  }

  if (findUser.bonuse <= value) {
    return res.json({
      error: "Insufficient Balance!",
    });
  }
};

const addBalance = async (req, res) => {
  const { id, value, type } = req.body;

  if (!id) {
    return res.json({
      error: "user ID must be provided!",
    });
  }

  if (!value || value < 1) {
    return res.json({
      error: "value to be added is needed and must be greater than 0",
    });
  }

  const findUser = await User.findOne({ _id: id });

  if (type == "deposit") {
    sendAdderEmail(findUser.email, value, type);
    await User.updateOne({ _id: id }, { $set: { deposit: value } });
    return res.status(200).json({
      success: "Deposit Balance Added Successfully!",
    });
  }

  if (type == "bonuse") {
    sendAdderEmail(findUser.email, value, type);
    await User.updateOne({ _id: id }, { $set: { bonuse: value } });
    return res.status(200).json({
      success: "Bonuse Balance Added Successfully!",
    });
  }

  if (type == "profit") {
    sendAdderEmail(findUser.email, value, type);
    await User.updateOne({ _id: id }, { $set: { profit: value } });
    return res.status(200).json({
      success: "Profit Balance Added Successfully!",
    });
  }
};

const getUsers = async (req, res) => {
  const users = await User.find();
  if (User.countDocuments < 1) {
    return res.status(404).json({
      message: "No User Found",
    });
  }

  return res.json(users);
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({
        error: "email is required",
      });
    }

    //Check if password is goood
    if (!password || password.length < 6) {
      return res.json({
        error: "password is required and should be atleast six(6) characters",
      });
    }

    //Check if user exist
    const user = await Admin.findOne({ email });
    const adminCount = await Admin.countDocuments();
    if (!user && adminCount < 1) {
      const hashedPassword = await hashPassword(password);
      await Admin.create({
        name: "Admin",
        email: "example@gmail.com",
        password: hashedPassword,
        req_date: new Date(),
      });
      return res.json({
        new: "New admin created Contact lordy-popdy for Details!",
      });
    }
    //Check if password match
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        { name: user.name, email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) throw error;
          res.cookie("token", token).json(user);
        },
      );
    }
    if (!match) {
      return res.json({
        error:
          "password not match our database, password should be atleast six(6) character",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    //Check if password match
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        { name: user.name, email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) throw error;
          res.cookie("token", token).json(user);
        },
      );
    }
    if (!match) {
      return res.json({
        error:
          "password not match our database, password should be atleast six(6) character",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const test = async (req, res) => {
  return res.status(200).json({ message: "Connected Succesfully!" });
};

const createUser = async (req, res) => {
  const {
    name,
    email,
    country,
    currency,
    account,
    password,
    comfirm_password,
  } = req.body;
  try {
    //Check if name was taken
    if (!name) {
      return res.json({
        error: "name is required",
      });
    }

    //check if email is provided
    if (!email) {
      return res.json({
        error: "email is required!",
      });
    }

    //check if country is provided
    if (!country) {
      return res.json({
        error: "country is required!",
      });
    }

    //check if currency is provided
    if (!currency) {
      return res.json({
        error: "currency is required!",
      });
    }

    //check if country is provided
    if (!account) {
      return res.json({
        error: "account is required!",
      });
    }

    //Check if password is goood
    if (!password || password.length < 6) {
      return res.json({
        error: "password is required and should be atleast six(6) characters",
      });
    }

    //Check comfirmPassword
    if (password !== comfirm_password) {
      return res.json({
        error: "Comfirm password must match password",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "email is taken",
      });
    }

    // const adminTotalUserUpdate = await Admin.updateOne(
    //   { adminEmail: "bitclubcontract@gmail.com" },
    //   { $inc: { totalUser: 1 } }
    // );

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name: name,
      email: email,
      country: country,
      currency: currency,
      account: account,
      password: hashedPassword,
      req_date: new Date(),
    });

    console.log(user);
    if (user) {
      return res.json(user);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  test,
  Delete,
  Approve,
  getOTP,
  getUser,
  sendMail,
  Decline,
  verifyOtp,
  fetchOTP,
  DeleteKyc,
  DeclineKyc,
  ApproveKyc,
  fetchAllKyc,
  fetchKyc,
  getUsers,
  chatSend,
  userInfo,
  deleteChat,
  loginUser,
  citizenId,
  getMessage,
  deleteUser,
  createUser,
  loginAdmin,
  addBalance,
  getAdminChat,
  withdrawBank,
  AdminGetBankR,
  upgradeAccount,
  getAccountLevel,
  getNotification,
  AdminGetCrypto,
  withdrawCrypto,
  getBankRecords,
  getCryptoRecords,
  userNotification,
  notificationAdder,
  getUserVerification,
};
