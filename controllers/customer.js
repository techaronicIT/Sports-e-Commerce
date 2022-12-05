const customerModel = require("../model/customer.js")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../utils/sendMail");
const otpGenerator = require("otp-generator");
const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
});


exports.user_signup = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      battingSide,
      email,
      phone,
      password,
      address,
    } = req.body;
    console.log(req.body);
    // Checking data if exists in data
    const dataExist = await customerModel.findOne({ email: email });
    if (dataExist){
      return res.status(400).send({ message: "email already in use" });
    }
      // Encrypting the password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    // Assigning the data to the model
    const userRequest = {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      battingSide,
      email,
      phone,
      password,
      address,
    };
    // Saving data to the database
    const userData = await customerModel.create(userRequest);
    console.log(userData);
    return res
      .status(201)
      .send({ message: "User signup successfully", data: userData });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.send_otp_toEmail = async (req, res) => {
  try {
    const userMail = req.body.email||req.body.phone;
    if(userMail.includes("@")){
    const userData = await customerModel.findOne({ email: userMail });
    if (!userData) {
      return  "not valid user" ;
    }
  }
  else{
    const userData = await customerModel.findOne({ phone: userMail });
    if (!userData) {
      return "not valid user";  
    }
  }
    // OTP Generation
    let mail_otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    
    const to = userMail;
    const subject = "OTP for Email or phone Verification";
    const text = `Your OTP is ${mail_otp}`;

    console.log(process.env.AUTH_EMAIL, process.env.AUTH_PASS);
    // checking for the mail or phone number
    if(userMail.includes('@')){
        await transporter.sendMail({
          from: process.env.AUTH_EMAIL,
          to: userMail,
          subject: subject,
          text: `Your OTP is ${mail_otp} to login into your account`,
        });
        const salt = await bcrypt.genSalt(10);
        mail_otp = await bcrypt.hash(mail_otp, salt);

      await customerModel.updateOne(
        { email: userMail },
        { $set: { mail_otp: mail_otp } }
      );

    }
    else{
      if(userMail.length == 10){
        var toPhone = "91".concat(userMail);
      }
      const fromPhone = "Kuldeep Solutions";
      console.log(fromPhone, toPhone, text);
      await vonage.message.sendSms(fromPhone, toPhone, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
                // res.send(`Otp Sent To your ${to}` );
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
      });
      const salt = await bcrypt.genSalt(10);
      mail_otp = await bcrypt.hash(mail_otp, salt);

      await customerModel.updateOne(
        { phone: userMail },
        { $set: { mobile_otp: mail_otp } }
      );

  }

    const salt = await bcrypt.genSalt(10);
    mail_otp = await bcrypt.hash(mail_otp, salt);

    await customerModel.updateOne(
      { email: userMail },
      { $set: { mail_otp: mail_otp } }
    );

    return res
      .status(200)
      .send({ setting: { success: "1", message: "otp sent successfully" } });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const userEmail = req.body.email||req.body.phone;
    let userOtp = req.body.otp;
    let dataExist;
    if(userEmail.includes("@")){
       dataExist = await customerModel.findOne({ email: userEmail });
    }
    else{
       dataExist = await customerModel.findOne({ phone: userEmail });
    }
      
    console.log(dataExist);
    if (!dataExist)
      return res.status(404).send({ message: "user dose not exist" });

    const { _id, firstName, lastName } = dataExist;
    let compareOtp = dataExist.mail_otp||dataExist.mobile_otp
    const validOtp =  bcrypt.compare(userOtp , compareOtp)
    .then((err)=>{
      if(err) throw err;
    }).catch(()=> console.log("OTP Matched"));
    const payload = { userId: _id, email: userEmail,phone: userEmail };
    const generatedToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "10080m",
    });
    res.header("jwt-token", generatedToken);
    return res
      .status(200)
      .send({
        message: `${firstName} ${lastName} you are logged in Successfully`,
        Token: generatedToken,
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.userUpdate = async (req, res) => {

  try {
    const userRequest = req.user;
    let userData = await customerModel.findOne({ _id: userRequest.userId });
    let {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      battingSide,
      email,
      phone,
      password,
      address,
    } = req.body;
    console.log("Trying tot update data"+req.body);
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }
    if (address) {
      if (address.shipping) {
        if (address.shipping.street) {
          userData.address.shipping.street = address.shipping.street;
        }
        if (address.shipping.city) {
          userData.address.shipping.city = address.shipping.street;
        }
        if (address.shipping.pinCode) {
          userData.address.shipping.pincode = address.billing.pincode;  //changed pincode spelling
        }
      }
      if (address.billing) {
        if (address.billing.street) {
          userData.address.billing.street = address.billing.street;
        }
        if (address.billing.city) {
          userData.address.billing.city = address.billing.city;
        }
        if (address.billing.pinCode) {
          userData.address.billing.pincode = address.billing.pincode;
        }
      }
    }

    const updatedData = await customerModel.findOneAndUpdate(
      { _id:userRequest.userId },
      {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dateOfBirth: dateOfBirth,
        battingSide: battingSide,
        email: email,
        phone: phone,
        password: password,
        address: userData.address,
      },{new:true}
    );
    return res
      .status(200)
      .send({ message: "user profile update successfully", data: updatedData });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.forgot_password = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await customerModel.findOne({ email: email });
    if (!userData) {
      return res
        .status(400)
        .send({ setting: { success: "0", message: "not valid user" } });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.setNew_password = async (req, res) => {
  try {
    const newPassword = req.body.password;
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);
    const updatedData = await customerModel.findOneAndUpdate(
      { email: req.body.email },
      { password: newPassword }
    );
    return res
      .status(201)
      .send({ message: "password set successfully", data: updatedData });

  } catch (err) {
    return res.status(500).send(err.message);
  }
};
