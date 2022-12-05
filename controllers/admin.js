const adminModel = require("../model/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



let checkAdmin = async (email)=>{
    try{
        const adminData = await adminModel.findOne({email:email});
        return adminData;      
    }catch(err){
        return err;
    }
}
let validatePhoneNumber =(input_str)=>{
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/; 
    return re.test(input_str);
}
exports.admin_signup = async (req,res) =>{
    try{
        let {firstName,lastName,email,phoneNumber,password,address} = req.body;
        if(!validatePhoneNumber(phoneNumber.toString())){
            return res.status(400).send({message:"Invalid phone number"});
        }
        if(await checkAdmin(email.toString())){
            return res.status(400).send({message:"Admin already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt);
        const userData = {firstName,lastName,email,phoneNumber,password,address};
        const dataCreated = await adminModel.create(userData);
        return res.status(201).send({message:"Admin created successfully",data:dataCreated});
    }catch(err){
        return res.status(500).send(err.message);
    }
}

exports.admin_login = async (req,res) =>{
    try{
        const adminEmail = req.body.email;
        const adminPassword = req.body.password;
        const adminData = await adminModel.findOne({email:adminEmail});
        if(adminData){
            const {_id,firstName,lastName,password} = adminData;
            const validPassword = await bcrypt.compare(adminPassword,password);
            if(!validPassword){
                return res.status(400).send({message:"Invalid Password"});
            };
            let payload = {userId:_id,email:adminEmail};
            const generatedToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {   
                expiresIn: "10080m",
              });
            res.header("jwt-token",generatedToken);
            return res.status(201).send({message:`${firstName} ${lastName} You are logged in`,token:generatedToken});
        }else{
            return res.status(400).send({message:"Invalid credentials"});
        };
    }catch(err){
        return res.status(400).send(err.message);
    };
}

exports.admin_update = async (req,res) =>{
    try{
        const adminRequest = req.user;
        const adminData = await adminModel.findOne({_id:adminRequest.userId});
        let {firstName,lastName,email,phoneNumber,password,address} = req.body;    //bt mistake type was written, changed by email
        if(password){
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password,salt);
        }
        if(address){
            if(address.street){
                adminData.address.street = address.street;
            };
            if(address.city){
                adminData.address.city = address.city;
            };
            if(address.pinCode){
                adminData.address.pinCode = address.pinCode;
            };
        }
        const newAdminData = await adminModel.findOneAndUpdate({_id:adminData._id},{firstName:firstName,lastName:lastName,email:email,password:password,phoneNumber:phoneNumber,address:adminData.address},{new:true});
        return res.status(201).send({message:"Admin data updated successfully",UpdatedData:newAdminData});
    }catch(err){
        return res.status(500).send(err.message);
    };
}

exports.get_admin = async (req,res)=>{
    try{
        const adminId = req.user.userId;
        const adminData = await adminModel.findOne({_id:adminId});
        return res.status(200).send({setting:{success:"1",message:"admin data",data:adminData}});
    }catch(err){
        return res.status(500).send(err.message);
    };
};