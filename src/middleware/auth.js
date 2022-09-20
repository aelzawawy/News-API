const jwt = require("jsonwebtoken");
const Reporter = require("../models/reporters");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    //veify the token with the keyWord
    const decode = jwt.verify(token, "secretWord");
    const reporter = await Reporter.findById({ _id: decode._id }); //_id => declared in module file
    req.reporter = reporter;
    next();
  } catch (e) {
    res.send({ Error: "please authenticate" });
  }
};
module.exports = auth;
