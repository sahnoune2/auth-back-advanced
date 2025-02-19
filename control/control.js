const users = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const codes = require("../schema/codes");

function generaterandomecode() {
  return Math.random().toString(36).substring(2, 8);
}

exports.emailValidation = async (req, res) => {
  const { email, name, password, phone, address } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "wajihkurousagi@gmail.com",
      pass: "vagm seay dcmo ltnz",
    },
  });

  try {
    const userFound = await users.findOne({ email });

    if (userFound) {
      res.status(400).send({ msg: "u already have an account" });
    } else {
      const code = generaterandomecode();

      const codeUser = await codes.insertOne({
        code,
        email,
        name,
        password,
        phone,
        address,
      });

      const mailOptions = {
        to: email,
        html: `
                  <h1>welcome to our website</h1>
                  <p>please click the link to verify your account</p>
                  <span>${code}</span>
                  
                  `,
      };
      await transporter.sendMail(mailOptions, (error) => {
        if (error) throw error;
      });
      res.status(200).send({ msg: "mail verification sent " });
    }
  } catch (error) {
    res.status(500).send({ msg: "error whhile trying to send the email " });
  }
};

exports.signUp = async (req, res) => {
  const code = req.body.code;
  console.log(code);

  try {
    const userfound = await codes.findOne({ code });
    console.log(userfound != null);

    if (userfound != null) {
      const user = await users.findOne({ email: userfound.email });
      console.log(user);
      if (user) {
        res.status(400).send({ msg: "already have an account" });
      } else {
        const salt = 10;
        const hpassword = bcrypt.hashSync(userfound.password, salt);

        const newuser = new users({
          name: userfound.name,
          email: userfound.email,
          password: hpassword,
          phone: userfound.phone,
          address: userfound.address,
        });

        const token = jwt.sign(
          { id: newuser._id, name: newuser.name },
          "abc123",
          { expiresIn: "7d" }
        );
        await newuser.save();
        await codes.deleteOne({ email: userfound.email });
        res.status(200).send({ msg: "welcome", user: newuser, token });
      }
    } else {
      res.status(400).send({ msg: "code incorrect" });
    }
  } catch (error) {
    res.status(500).send({ msg: "failed to add user", error });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await users.findOne({ email });
    if (!userFound) {
      res.status(400).send({ msg: "u dont have an account,sign up " });
    } else {
      const match = bcrypt.compareSync(password, userFound.password);

      if (!match) {
        res.status(400).send({ msg: "incorrect password" });
      } else {
        const token = jwt.sign(
          { id: userFound._id, name: userFound.name, role: userFound.role },
          "abc123",
          { expiresIn: "7d" }
        );
        res.status(200).send({ msg: "login success", user: userFound, token });
      }
    }
  } catch (error) {
    res.status(500).send({ msg: "error while trying to signIn" });
  }
};

exports.getCurrent = (req, res) => {
  const user = req.user;
  if (user) {
    res.status(200).send({ msg: "u r logged in ", user });
  } else {
    res.status(400).send({ msg: "u need to log in" });
  }
};

exports.updateUser = async (req, res) => {
  const userID = req.body.id;
  const{oldpassword,newpassword}=req.body

  try {
    const userFound = await users.findById(userID);
    if (!userFound) {
      res.status(400).send({ msg: "user not found" });
    } else {
      if(oldpassword && newpassword){
        const salt=10
        const match = bcrypt.compareSync(oldpassword, userFound.password);
        if(match){
          const hpassword=bcrypt.hashSync(newpassword,salt)
          userFound.password=hpassword
          await userFound.save()
          res.status(200).send({ msg: "updated password" });
        }else{
          res.status(400).send({msg:"wrong password"})
        }
      }
      else{
const update = await users.findByIdAndUpdate(
  userID,
  { ...req.body },
  { new: true }
);
res.status(200).send({ msg: "update done" });
      }
      
    }
  } catch (error) {
    res.status(500).send({ msg: "error while trying to update the user" });
  }
};
