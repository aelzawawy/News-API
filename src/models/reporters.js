const mongoose = require("mongoose");
const validator = require("validator");
const { isValidPassword } = require("mongoose-custom-validators");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const reporterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  age: {
    type: Number,
    default: 20, //default value
    validate(value) {
      if (value <= 0) {
        throw new Error("Age is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: isValidPassword,
      message:
        "Password must be at least 10 chars:\n1 uppercase letter,\n1 lowercase letter,\n1 number,\nand 1 special character",
    },
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^(010|011|012|015)([0-9]{8})$/.test(value);
      },
      message: "Phone number must start with (010|011|012|015), and of length 11",
    },
  },
  image: {
    type: Buffer,
  },
});

////// virtual RELATION
reporterSchema.virtual("newsRelation", {
  localField: "_id",
  foreignField: "reporter",
  ref: "News",
});

// Hashing passwords
reporterSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcryptjs.hash(this.password, 8);
});

// Statics allow us to create a function that we can call on our model
reporterSchema.statics.findByCredentials = async (email, password) => {
  const reporter = await Reporter.findOne({ email });

  if (!reporter) {
    throw new Error("Email error");
  }

  const isMatch = await bcryptjs.compare(password, reporter.password);

  if (!isMatch) {
    throw new Error("Wrong password");
  }
  return reporter;
};

// token
reporterSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id.toString() }, "secretWord");
  return token;
};

const Reporter = mongoose.model("Reporter", reporterSchema); // Must come last
module.exports = Reporter;
