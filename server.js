const crypto=require('crypto');
const express=require('express');
const session=require('express-session')
const server=express();
const fs=require('fs');
const nodemailer=require('nodemailer');
var multer  = require('multer');
const bodyparser=require('body-parser');
let router=express.Router();
const mongoose=require('mongoose');
const saltRounds=10;
const cors=require('cors');
const Bcrypt=require('bcrypt')
server.use(bodyparser.json());
server.use(bodyparser.urlencoded({extended: true}));
server.use(express.static('uploads'));
server.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true,cookie:{secure:false}}));
const storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null,'./uploads');
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
});
const upload=multer({storage:storage})
var server1=server.listen(8080,()=>{
    console.log("Server Started");
})
var io=require('socket.io')(server1,{origin:'*:*'});
const Schema=mongoose.Schema;
server.use(cors())

io.on('connection',(socket)=>{
    socket.on('SEND_MESSAGE',function(data){
        let m=new Msg();
    m.ReciverEmail=data.ReciverEmail;
    m.time=data.time;
    m.date=data.date;
    m.SenderEmail=data.SenderEmail;
    m.msg=data.msg;
    m.status=data.status;
    m.save().then((doc)=>{})
        io.emit('RECEIVE_MESSAGE',data);
    })
})
const bodySchema=new Schema({
    name:String,
    email:String,
    password:String,
    image:String,
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    theme:String,
})
const bodySchema1=new Schema({
    SenderEmail:String,
    msg:String,
    time:String,
    date:String,
    ReciverEmail:String,
    status:Boolean,
})
server.get('/getEmails',(req,res)=>{
    Reg.find({}).then((doc)=>{
        res.json(doc);
    })
})
server.get('/resetit',(req,res)=>{
    Reg.findOne({token:req.body.token}).then((doc)=>{
        res.json(doc);
    })
})
server.post('/updateColor',(req,res)=>{
    Reg.findOneAndUpdate({email:req.body.email},{theme:req.body.color}).then((doc)=>{
        
    })
})
server.post('/resetPassViaEmail',(req,res)=>{
    Bcrypt.hash(req.body.pass,saltRounds,function(err,hash){
        Reg.findOneAndUpdate({email:req.body.user.email},{$set:{password:hash,resetPasswordExpire:null,resetPasswordToken:null}}).then((doc)=>{
            res.send('password Reset');
        })
    })
    
})
server.post('/upload/:email', upload.single('avatar'), function (req, res, next) {
     Reg.findOneAndUpdate({email:req.params.email},{image:req.file.filename},{new:true}).then((doc)=>{
         res.json(doc);
     })
  })


server.get('/getImg/:email',(req,res)   =>{
    Reg.findOne({email:req.params.email}).then((doc)=>{
        res.json(doc)
    })
})
const Reg=mongoose.model('REGISTER',bodySchema);
const Msg=mongoose.model('MESSAGE',bodySchema1);
mongoose.connect('mongodb://localhost:27017/messanger',{useNewUrlParser:true})
server.post('/register',(req,res)=>{
    let temp=0;
    Reg.find({}).then((doc)=>{
        for(let i=0;i<doc.length;i++){
            if(doc[i].email==req.body.email){
                temp=1;
                break;
            }
        }
    
    if(temp==1){
        res.send('not ok')
    }else if(temp==0)
    {
        Bcrypt.hash(req.body.password,saltRounds,function(err,hash){
            let r=new Reg();
            r.name=req.body.name;
            r.email=req.body.email;
            r.password=hash;
            r.resetPasswordExpire=null;
            r.resetPasswordToken=null;
            r.theme=req.body.theme;
            r.image=req.body.image;
            r.save().then((doc)=>{
                res.json(doc);
            })
        })
    }
    
})
})
function checkAuth(req,res,next){
    if(req.session.user){
        
        next();
    }else{
        res.redirect('/');
    }
}
server.post('/logout',(req,res)=>{
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
        
    });
})
server.get('/user/:email',(req,res)=>{
    Reg.findOne({email:req.params.email}).then((doc)=>{
        res.json(doc)
    })
})
server.post('/login',(req,res)=>{
    Reg.find({email:req.body.username}).then((doc)=>{
            if(doc.length==0){
                res.send('no')
            }
            Bcrypt.compare(req.body.password,doc[0].password,function(err,result){
                if(result==true){
                    res.json(doc) 
                }else{
                res.send('no')
                }
            })
    })
})
server.post('/delete/:email',(req,res)=>{
    Reg.deleteOne({email:req.params.email}).then((doc)=>{
        res.send('deleted');
    })
})
server.post('/changed',(req,res)=>{
    Reg.findOneAndUpdate({email:req.body.email},{email:req.body.newemail}).then((doc)=>{
        res.send('updated')
    })
})
server.post('/passchange',(req,res)=>{
    Bcrypt.hash(req.body.check,saltRounds,function(err,hash){
        Reg.findOneAndUpdate({email:req.body.email},{password:hash}).then((doc)=>{
            res.send('updatedd')
        })
    })
})
server.post('/forgetPass',(req,res)=>{
    if(req.body.forget==''){
        res.json("enter email")
    }
    Reg.findOne({email:req.body.forget}).then((doc)=>{
        if(doc==null){
            res.json("not in database");
        }else{
            const token=crypto.randomBytes(20).toString('hex');
            Reg.findOneAndUpdate({email:doc.email},{$set:{resetPasswordToken:token,resetPasswordExpire:Date.now()+360000}},{new:true}).then((docs)=>{
                
            })
            const transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'webchatap@gmail.com',
                    pass:'jaimatade123'
                }
            }) 
            const mailoptions={
                from:'webchatApp',
                to:`${doc.email}`,
                subject:"Link To reset Password",
                text:
                'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'+
                'Please click on the following link, or paste this into your browser to complete the process within one hour \n\n'+
                `http://localhost:3000/reset/${token}\n\n`+
                'If you did not request this, please ignore this email and your password will remain unchanged.\n',
            };
            transporter.sendMail(mailoptions,function(err,response){
                if(err){
                }else{
                    res.status(200).json('recovery email sent');
                }
            })
        }
    })
})
server.post('/list',(req,res)=>{
    Reg.find({email:{$ne:req.body.email}}).then((doc)=>{
        res.json(doc);
    })
})
server.post('/upload',(req,res)=>{
    Reg.find({email:req.body.emailId}).then((doc)=>{
        let r=new Reg();
        r.image.data=fs.readFileSync(req.body.image);
        r.image.contentType='image/png';
        r.save().then((doc)=>{
        })  
    })
})

server.post('/addMsg',(req,res)=>{
})

server.post('/Msgs',(req,res)=>{
    Msg.find({$or:[{ReciverEmail:req.body.ReciverEmail,SenderEmail:req.body.SenderEmail},{ReciverEmail:req.body.SenderEmail,SenderEmail:req.body.ReciverEmail}]}).then((doc)=>{
        res.json(doc);
    })
})

server.post('/RevMsg',(req,res)=>{
    Msg.find({ReciverEmail:req.body.SenderEmail,SenderEmail:req.body.ReciverEmail}).then((doc)=>{
        res.json(doc);
    })
})

