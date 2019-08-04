import React from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import axios from 'axios'
import io from "socket.io-client";  

var firebaseConfig = {
  apiKey: "AIzaSyBFHtIia1cJwGNw7cIeu7XdE0L1M-iqrI4",
  authDomain: "messanger-342c4.firebaseapp.com",
  databaseURL: "https://messanger-342c4.firebaseio.com",
  projectId: "messanger-342c4",
  storageBucket: "",
  messagingSenderId: "358219161266",
  appId: "1:358219161266:web:bfda6dbd03e4ce5b"
};
firebase.initializeApp(firebaseConfig);
class App extends React.Component {
  constructor(){
    super();
    this.state={
      db:{
        
      },
      msgs:[],
      register:[],
      messages:[],
      msg:'',
      signup:false,
      Toggleit:false,
      ReciverEmail:'',
      user:false,
      filtered:[],
      showw:false,
      forget:false,
      no:false,
      themee:false,
      currentColor:"blueviolet",
      aboutuss:false,
    }
    this.checkLogin();
    this.socket = io('localhost:8080');
  }
  
  googleLogin(){
    
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result)=> {
      var token = result.credential.accessToken;
      var user = result.user;
      this.setState({
        user:user,
        name:user.displayName,
        email:user.email,
      })
      let obj={name:user.displayName,email:user.email,password:null,image:null,theme:"blueviolet"}
        axios.post('/register',obj).then((res)=>{
      this.props.history.push('/home')

      })

    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
  }
  checkLogin(){
    firebase.auth().onAuthStateChanged((user)=> {
   if (user) {
     
     this.setState({
      user:user,
      name:user.displayName,
      email:user.email,
    })
    this.props.history.push('/home')
    this.getList();

   } else {
     
   }
 });
 }
 logout(){
  firebase.auth().signOut().then(()=> {
    this.setState(
      {user:null}
    )
    localStorage.removeItem('user')
    this.props.history.push("/")
  }).catch(function(error) {
  });
  localStorage.removeItem('user');
  this.setState({
    msg:''
  })
}



  //----------------LOGIN------------------------//
  getValue(e){
    this.setState({[e.target.name]:e.target.value,
      msg:''
    })
    }



    
  saveit(history){
      
     if(this.state.password!==this.state.confirmpass)
    {
        this.setState({
            msg:"Confirmed Password does not match"
        })
    }else{
        let l=this.state.db.register; 
        let obj={name:this.state.name,email:this.state.email,password:this.state.password,image:null,theme:"blueviolet"}
        axios.post('/register',obj).then((res)=>{
            if(res.data=='not ok'){
              this.setState({
                msg:"Email Already Exists"
              })
            }else{
              this.setState({
                msg:"Succesfully Registered",
                user:res.data,
                currentColor:res.data.theme,
                msg:''
            })
            localStorage.setItem('user',this.state.email);
            this.getList();
            this.props.history.push('/home');
            }
          })
    }

}
  login(history){
      let obj={username:this.state.email,password:this.state.userpass}
      axios.post('/login',obj).then((res)=>{
          if(res.data=='no'){
            this.setState({
              msg:"Incorrect Details",
            })
          }else{
              localStorage.setItem('user',this.state.email);
              this.setState({
                user:res.data,
                name:res.data[0].name,
                currentColor:res.data.theme,
              })
              this.getList();
              this.props.history.push('/home');
          }
      })
  }
  showLog(){
    this.state.signup=!this.state.signup;
    this.setState({
        signup:this.state.signup,
    })
  }
  //---------------------------LOGIN END-----------------------
  
  getList(){
    let l=this.state.register;
    let obj={email:this.state.email};
    axios.post('/list',obj).then((res)=>{
      this.setState({
        register:res.data,
        filtered:res.data,
      })      
    })
  }
  getMsg(e){
    this.setState({
      newMsg:e.target.value,
    })
  }
  sendTo(val){
    
    this.state.ReciverEmail=val.email;
    this.state.title=val.name;
    this.getsmall();
    this.showBlock();
    this.getCalls();
  }
  showBlock(){
    this.state.Toggleit=true
    this.setState({
      Toggleit:this.state.Toggleit,
    })
  }
  closeBox(){
    this.state.Toggleit=false;
    this.setState({
      Toggleit:this.state.Toggleit,
    })
  }
  showMsg(){
    let l=this.state.messages;
    let l1=this.state.msgs;
    let obj={SenderEmail:this.state.email,msg:this.state.newMsg,time:new Date().toLocaleTimeString(),date:new Date().toLocaleDateString(),ReciverEmail:this.state.ReciverEmail,status:false}
    this.socket.emit('SEND_MESSAGE',obj);
    this.setState({
      newMsg:''
    })
  }
  getStatus(){
    for(let i=0;i<this.state.messages.length;i++){
    if(this.state.messages[i].SenderEmail==this.state.email)
        {
          return false
        }else
        {
          return true
        }
    }
  }
  getCalls(){
    
    let l=this.state.msgs;
    let obj={ReciverEmail:this.state.ReciverEmail,SenderEmail:this.state.email}
    axios.post('/Msgs',obj).then((res)=>{
      this.setState({
        msgs:res.data,
        })
      })    
  }
  componentDidMount(){
    this.checkLogin2();
    this.checkLogin();
    this.socket.on('RECEIVE_MESSAGE',(data)=>{
    let l=this.state.msgs;
    if((this.state.ReciverEmail==data.ReciverEmail)&&(this.state.email==data.SenderEmail)|| (this.state.ReciverEmail==data.SenderEmail)&&(this.state.email==data.ReciverEmail)){
      l.push(data)
      this.setState({
        msgs:l,
        })
    }else{
      this.setState({
        msgs:l,
      })
    } 
    })
  }
  checkLogin2(){
    let data=localStorage.getItem('user');
      if(data==null)
      {
        this.props.history.push('/');
      }else
      {
        this.props.history.push('/home');
        axios.get('/user/'+data).then((res)=>{
          this.setState({
            user:res.data,
            email:data,
            name:res.data.name,
            currentColor:res.data.theme
          })
          this.getList();
          this.getImg();
        })
      }
  }     
  recived(){
    let l=this.state.msgs;
    let obj={ReciverEmail:this.state.ReciverEmail,SenderEmail:this.state.email}
    axios.post('/RevMsg',obj).then((res)=>{
      let list=l.concat(res.data)
      this.setState({
        msgs:list,
        })
      })    
  }
  value(e){
    let temp=this.state.register;
    if(e.target.value=='')
    {
      this.setState({
        filtered:temp,
      })
    }
    else{
       this.state.filtered=this.state.register
      let arr=[];
      for(let i=0;i<this.state.filtered.length;i++)
      {
        if(this.state.filtered[i].name.includes(e.target.value))
          {
             arr.push(this.state.filtered[i]);
          }      
      }
      this.setState({
        filtered:arr,
      })
    }
  }
  show(){
    this.getImg();
    this.state.themee=false;
    this.state.showw=!this.state.showw;
    this.state.aboutuss=false;
    this.state.noo=false;
    this.setState({
      showw:this.state.showw,
      themee:this.state.themee,
      aboutuss:this.state.aboutuss,
      noo:this.state.noo,
    })
  }
  upload(e){
    let fd=new FormData();
    fd.append("avatar",e.target.files[0]);
    axios.post('/upload/'+this.state.email,fd,{headers:{
      'Content-Type': "multipart/form-data; boundary=---WebKitFormBoundary7MA4YWxkTrZu0gW"
    }}).then((res)=>{
      this.getImg();
      this.setState({
        image:res.data.image,
      })
    })
    }
  getImg(){
    axios.get('/getImg/'+this.state.email).then((res)=>{
      if(res.data.image==null){
        this.setState({
          imageurl:false,
        })  
      }else{
        this.setState({
          imageurl:`/${res.data.image}`,
        })  
      }
      
    })  
  }
  getsmall(){
    axios.get('/getImg/'+this.state.ReciverEmail).then((res)=>{
      if(res.data.image==null){
        this.setState({
          url:false,
        })  
      }else{
        this.setState({
          url:`/${res.data.image}`,
        })  
      }
    })
  }
  getRest(e){
    this.setState({
      forgetemail:e.target.value,
    })    
  }
  resetPassword(){
   let obj={forget:this.state.forgetemail}
    axios.post('/forgetPass',obj).then((res)=>{
      if(res.data=="enter email"){
        this.setState({
          msg:"Enter Email"
        })
      }else if(res.data=="not in database")
      {
        this.setState({
          msg:"User not present"
        })
      }else if(res.data=="recovery email sent"){
        this.setState({
          msg:"Email Sent"
        })
      }
    })
    this.setState({
      msg:"Sending..."
    })
  }
  onchangeit(){
    this.state.forget=false;
    this.setState({
      forget:this.state.forget,
      msg:'',
    })
  }
  onchangeit1(){
    this.state.forget=true;
    this.setState({
      forget:this.state.forget,
    })
  }
  settings(){
    this.state.noo=true;
    this.setState({
      noo:this.state.noo,
    })
  }
  band(){
    this.state.noo=false;
    this.setState({
      noo:this.state.noo,
    })
  }
  band1(){
    this.state.themee=false;
    this.setState({
      themee:this.state.themee,
    })
  }
  deleteit(){
    axios.post('/delete/'+this.state.email).then((res)=>{
      if(res.data=='deleted'){
        localStorage.removeItem('user');  
        this.props.history.push('/');
        this.setState({
          msg:''
        })
      }
    })
  }
  getValue1(e){
    this.setState({
      changed:e.target.value,
    })    
  }
  changeeit(){
    let obj={email:this.state.email,newemail:this.state.changed}
    axios.post('/changed',obj).then((res)=>{
        if(res.data=='updated'){
            this.setState({
              msg:'login with new Email'
            })
        localStorage.removeItem('user');
            this.props.history.push('/');
        }
    })
  }
  changeeit1(){
    if(this.state.check1!==this.state.check2){
      this.setState({
        msg:'Not Match'
      })
    }else{
    let obj={email:this.state.email,check:this.state.check2}
      axios.post('/passchange',obj).then((res)=>{
        this.setState({
          msg:'Login with new Password'
        })
        localStorage.removeItem('user');
        this.props.history.push('/');
      })
    }
  }
  theme(){
    this.state.themee=true;
    this.setState({
      themee:this.state.themee,
    })
  }
  getColor1(e){
    let obj={email:this.state.email,color:e.target.style.backgroundColor}
    axios.post('/updateColor',obj).then((res)=>{
    })
    this.setState({
      currentColor:e.target.style.backgroundColor,
    })
  }
  aboutus(){
    this.state.aboutuss=true;
    this.setState({
      aboutuss:this.state.aboutuss,
    })
  }
  band2(){
    this.state.aboutuss=false;
    this.setState({
      aboutuss:this.state.aboutuss,
    })
  }
  render(){
    return (
      <div>
        <Route path="/reset/:token" render={(props)=><ResetPassword {...props}></ResetPassword>}></Route>
          <Route path="/" exact render={(props)=><Login {...props} forget={this.state.forget} onchangeit1={this.onchangeit1.bind(this)} onchangeit={this.onchangeit.bind(this)} resetPassword={this.resetPassword.bind(this)} getRest={(e)=>{this.getRest(e)}} facebookLogin={()=>{this.facebookLogin()}} googleLogin={(history)=>{this.googleLogin(history)}} showLog={this.showLog.bind(this)} login={(history)=>{this.login(history)}} signup={this.state.signup} getValue={this.getValue.bind(this)} msg={this.state.msg} saveit={(history)=>{this.saveit(history)}}></Login>}/>
        {this.state.user?<div>
          <Route path="/home" exact render={(props)=><Home {...props} aboutuss={this.state.aboutuss} aboutus={this.aboutus.bind(this)} currentColor={this.state.currentColor} getColor1={(e)=>{this.getColor1(e)}} themee={this.state.themee} theme={this.theme.bind(this)} msg={this.state.msg} changeeit={this.changeeit.bind(this)} changeeit1={this.changeeit1.bind(this)} getValue1={(e)=>{this.getValue1(e)}} getValue={(e)=>{this.getValue(e)}} deleteit={this.deleteit.bind(this)} noo={this.state.noo} band={this.band.bind(this)} band2={this.band2.bind(this)} band1={this.band1.bind(this)} settings={this.settings.bind(this)} url={this.state.url} getsmall={this.getsmall.bind(this)} imageurl={this.state.imageurl} getImg={()=>{this.getImg()}} image={this.state.image} upload={(e)=>{this.upload(e)}} showw={this.state.showw} show={this.show.bind(this)} value={(e)=>{this.value(e)}} sender={this.state.email} newMsg={this.state.newMsg} title={this.state.title} getStatus={this.getStatus.bind(this)} logout={this.logout.bind(this)} recived={this.recived.bind(this)} msgs={this.state.msgs} getCalls={this.getCalls.bind(this)}  closeBox={this.closeBox.bind(this)} Toggleit={this.state.Toggleit} sendTo={(val)=>{this.sendTo(val)}} showMsg={this.showMsg.bind(this)} getMsg={this.getMsg.bind(this)} messages={this.state.messages} name={this.state.name} db={this.state.db} register={this.state.filtered} getList={this.getList.bind(this)}></Home>}></Route>
        </div>:null}
      </div>
  );
  }
  
}

export default App;
