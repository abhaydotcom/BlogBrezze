const crypto = require('crypto');



function hashPassword(password){
    const salt=crypto.randomBytes(16).toString("hex");
    const hash=crypto.pbkdf2Sync(password,salt,100000,64,"sha512").toString('hex')

    return {salt,hash}
}

const password="abhay";

let {salt ,hash}=hashPassword(password);
console.log("Salt before verify",salt)
console.log("Hash before verify",hash)

//Verifies User



function hashPassword1(password,salt){
    
    const hash1=crypto.pbkdf2Sync(password,salt,100000,64,"sha512").toString('hex')

    return hash1
}
 
 
const hash1=hashPassword1(password,salt)


if(hash1===hash)console.log("Correct Password",hash1)
    else{
        console.log("Error Bhai")
    }