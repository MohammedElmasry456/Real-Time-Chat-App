const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const userModel = require("../models/userModel");
const chatModel = require("../models/chatModel");

exports.registerLoad = asyncHandler(async (req, res) => {
  res.render("register");
});

exports.register = asyncHandler(async (req, res) => {
  req.body.image = "images/" + req.file.filename;
  req.body.password = await bcryptjs.hash(req.body.password, 12);
  const user = await userModel.create(req.body);
  res.render("register", { message: "user created successfully" });
});

exports.login = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await userModel.findOne({ email });
  if (!user || !(await bcryptjs.compare(password, user.password))) {
    res.render("login", { message: `Error in Email Or Password` });
  }
  req.session.user = user;
  res.redirect("/dashboard");
});

exports.loginLoad = asyncHandler(async (req, res) => {
  res.render("login");
});

exports.logout = asyncHandler(async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

exports.loadDashboard = asyncHandler(async (req, res) => {
  res.render("dashboard", {
    message: req.session.user,
    users: await userModel.find({ _id: { $nin: [req.session.user._id] } }),
  });
});

exports.saveChat = asyncHandler(async (req, res) => {
  const chat = await chatModel.create({
    receiver_id: req.body.receiver_id,
    sender_id: req.body.sender_id,
    message: req.body.message,
  });
  res.status(200).send({
    status: "success",
    message: "chat created successfully",
    data: chat,
  });
});

exports.deleteMessage = asyncHandler(async (req, res) => {
  await chatModel.findByIdAndDelete(req.body.message_Id);
  res.status(200).send({
    status: "success",
    message: "message deleted successfully",
  });
});

exports.updateMessage = asyncHandler(async (req, res) => {
  const chat = await chatModel.findByIdAndUpdate(
    req.body.message_Id,
    { message: req.body.newMsg },
    { new: true }
  );
  res.status(200).send({
    status: "success",
    message: "message deleted successfully",
  });
});
