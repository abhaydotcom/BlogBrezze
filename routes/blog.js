const {Router}=require('express')
 const multer=require('multer');
 const path=require('path');
const router=Router();
const Blog=require("../models/blog")
const Comment=require("../models/comments")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
     const fileName=`${Date.now()}-${file.originalname}`;
     cb(null,fileName)
    }
  }) 

  const upload= multer({storage:storage})

router.get('/addNew',(req,res)=>{
    return res.render('addBlog',{
        user:req.user
    })
})

router.get('/:id',async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate('createdBy');
    const comments =await Comment.find({}).populate("createdBy")
    return res.render("blog",{
        user:req.user,
        blog,
        comments,
    })
}) 

router.post('/',upload.single("coverImage"),(req,res)=>{
    const {title,body}=req.body;
   const blog= Blog.create({
        body,
        title,
        coverImageURL:`/uploads/${req.file.filename}`,
        createdBy:req.user._id,
    })
    return res.redirect(`/`)
})


router.post('/comment/:blogId', (req,res)=>{
        Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id
    });
    return res.redirect(`/blog/${req.params.blogId}`)
})




module.exports= router;
