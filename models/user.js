const {Schema,model}=require("mongoose")
const { createHmac,randomBytes, hash } = require('crypto');
const { error } = require("console");
const { createTokenForUser } = require("../services/auth");

 

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
  
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        default:'/images/default.png'
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }
},{timestamps:true})


userSchema.pre('save',function(next){
    const user=this;

    if(!user.isModified("password"))return;

    const salt=randomBytes(16).toString();

    const hashedPassword=createHmac('sha256',salt)
                       .update(user.password)
                       .digest("hex");

                       this.salt=salt;
                       this.password=hashedPassword;

                       next();
})
 
userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    const user=await this.findOne({email})
    if(!user) throw new Error("User not found")
       
    const salt=user.salt;
    const hashPassword=user.password;

    const useProvidedHash=createHmac("sha256",salt)
    .update(password)
    .digest('hex')
 
    if(hashPassword!==useProvidedHash)throw new Error("Password incorrect")

    const token=createTokenForUser(user);

    return token
})
 
const user=model('user',userSchema)
   
module.exports=user;    