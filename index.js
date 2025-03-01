const express=require('express')
const app=express();
const path=require('path')
const PORT=9000;
const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const { checkForAuthenticationCookies } = require('./middlewares/auth');
const Blog=require('./models/blog')
 
mongoose.connect('mongodb://localhost:27017/BlogBreeze')
.then(e=>console.log("Mongodb Connected "))
.catch(e=>console.log("Error while connecting to mongodb",e));


 
app.use(express.urlencoded({extended:false}))   
app.use(cookieParser());
app.use(checkForAuthenticationCookies("token"))
app.use(express.static(path.resolve("./public")))

app.set("view engine","ejs")
app.set('views',path.resolve('./views'))    

app.use('/user',userRoute) 
app.use('/blog',blogRoute)
 
 

app.get('/',async(req,res)=>{
    const allBlogs=await Blog.find({}) 
  res.render("home",{
    user:req.user,
    blogs:allBlogs
  } )
})
 
 


app.listen(PORT,()=>console.log(`Server Started at the PORT of ${PORT}`))