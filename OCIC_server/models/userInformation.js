const mongoose = require("mongoose");
const { Schema } = mongoose;

const userInfoSchema = new Schema({
  email: {
    type: String,
    required: false,
  },
  Id: {
    type: String,
    required: false,
  },
  Country: {
    type: String,
    required: false,
  },
  IdProfile: {
    type: String,
    default: "",
  },
});

const userInformationModel = mongoose.model("userInformation", userInfoSchema);
module.exports = userInformationModel;