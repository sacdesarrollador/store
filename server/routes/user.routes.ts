import express from "express"
const router = express.Router();
import {User} from "../models/User"
const generateToken = require("../services/generateToken");
const verifyToken = require("../services/verifyToken");

router.get("/", async (req: any, res: any) => {
  await User.find({}, function (error, users) {
    res.json(users);  
  });
});

router.get("/:id", async (req: any, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Login
router.post("/login", async (req: any, res) => {
  const { user_name, password } = req.body;
  console.log(req.body);
  await User.findOne({ user_name: user_name }, (err: any, user: any) => {
    if (err) throw err;
    console.log(user);
    if (!user) {
      res.status(400).json({ msg: "USER_NOT_FOUND", error: true });
    } else {
      user.decryptPassword(password, (err: any, isChecked: any) => {
        if (err) throw err;

        if (!isChecked) {
          res.status(400).json({ msg: "PASSWOR_INCORRECT", error: true });
        } else {
          const token = generateToken(user._id);
          res
            .cookie("store", token)
            .status(200)
            .json({ msg: token, error: false });
        }
      });
    }
  });
});

// Verification Token
router.post("/verification", verifyToken, async (req: any, res: any) => {
  console.log(req.user.id);
  User.findOne({ _id: req.user.id }, (err: any, user: any) => {
    if (err) {
      
    }
    res.status(200).json({ msg: "ALL_CORRECT", error: false, user: user });
  });
});

//Add User
router.post("/new", (req: any, res: any) => {
  const {
    first_name,
    last_name,
    birthday,
    email,
    user_name,
    password,
  } = req.body;

  User.findOne({ email: email }, async (err: any, user: any) => {
    if (err) throw err;
    if (!user) {
      const user = new User({
        first_name,
        last_name,
        birthday,
        email,
        user_name,
        password,
      });

      user.password = await user.encryptPassword(user.password);

      await user.save();

      let token = await generateToken(JSON.stringify(user._id));

      res.json({ status: "User Saved", token: token });
    }else{
      res.json({ res: "Existing User" });
    }
  });
});

// UPDATE a new user
router.put("/edit/:id", async (req, res) => {
  // res.json({res:req.body, params: req.params});

  const {
    first_name,
    last_name,
    birthday,
    email,
    user_name,
    password,
  } = req.body;
  
  const newuser = new User({
    first_name,
    last_name,
    birthday,
    email,
    user_name,
    password,
  });
  
  newuser.password = await newuser.encryptPassword(password);
  
  await User.findOneAndUpdate({_id: req.params.id}, newuser);
  
  res.json({ status: "User Updated" });
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.json({ status: "User Deleted" });
  } catch (error) {
    res.json({ error: error });
  }
});

module.exports = router;
