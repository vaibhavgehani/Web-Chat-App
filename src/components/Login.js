import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React from 'react'
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import google from './google.png'
import webapp from './mainlogo.png'
export function Login(props){
        return (
            <div className="flip-card-inner">
                <div className="fixedd"><img className="logoo" src={webapp}/><label className="sign">WebChat</label></div>
                <div className={props.forget?"forgetpass":"hideit"}>
                    <div className="cross" onClick={()=>{props.onchangeit()}}>&times;</div>
                    <h1 className="login-head">Forget Password</h1>
                    <h3 className="para">Enter Your Email for Password Reset.</h3>
                    <div className="login-input pads">
                        <i class="fa fa-envelope"></i>                        
                        <input placeholder="Your Email" onChange={(e)=>{props.getRest(e)}} name="email" type="email" required/>
                    </div>
                    <h4 className="pads space">*An Email will be send to your following email-address for reset your password and follow the given instructions.</h4>
                    <div className="Error">{props.msg}</div>
                    <button className="login-btn pads top" type="submit" onClick={()=>{props.resetPassword()}}>Reset</button>
                </div>
                <div className={props.signup?"registration":"hideit"}>
                    <div className="verify">
                        <div className="login-head"><h1>Sign Up</h1></div>
                        <div className="form">
                        <div className="login-input pad"> 
                        <i class="fa fa-user-plus"></i>
                        <input placeholder="Your Name" name="name" onChange={(e)=>{props.getValue(e)}} type="text" required/>
                        </div>
                        <div className="login-input pad">
                        <i class="fa fa-envelope"></i>                        
                        <input placeholder="Your Email" onChange={(e)=>{props.getValue(e)}} name="email" type="email" required/>
                        </div>
                        <div className="login-input pad">
                        <i class="fa fa-lock"></i>                                                    
                        <input placeholder="Password" name="password" onChange={(e)=>{props.getValue(e)}} type="password"/>
                        </div>
                        <div className="login-input pad">
                        <i class="fa fa-unlock-alt"></i>                                                    
                        <input placeholder="Repeat Your Password" name="confirmpass" onChange={(e)=>{props.getValue(e)}} type="password"/>
                        </div>
                        <div className="Error">{props.msg}</div>
                        <input type="checkbox" required/><label className="statement">I agree all statements in <a href="#">Terms and Service</a>.</label><br/>                       
                        <button className="login-btn padding" type="submit" onClick={()=>{props.saveit(props.history)}}>Register</button>
                        </div>
                        <hr/>
                        <div className="reg-footer">
                            <label>Already a Member?</label>
                            <label className="log" onClick={()=>{props.showLog()}}>Log in</label>
                        </div>
                    </div>
                </div>
                <div className="login-box">
                    <div className="login-head"><h1>Login</h1></div>
                    <div className="login-data">
                        <div>
                            <label>Username</label>
                            <div className="login-input">
                            <i className="fa fa-user-o" ></i>
                            <input placeholder="Type your username" type="text" name="email" onChange={(e)=>{props.getValue(e)}}/>
                            </div>
                            <label>Password</label>
                            <div className="login-input">
                            <i className="fa fa-lock"></i>
                            <input placeholder="Type your Password" type="password" name="userpass" onChange={(e)=>{props.getValue(e)}}/>
                            </div>
                            <label className="forget" onClick={()=>{props.onchangeit1()}}>Forget password?</label><br/><br/>
                            <div className="Error1">{props.msg}</div>                            
                            <button className="login-btn" onClick={()=>{props.login()}}>LOGIN</button>
                        </div>
                    </div>
                    <div className="login-foot">
                        <label>Or Sign Up Using</label>
                        <div className="social-logo">
                            <img onClick={()=>(props.googleLogin())} title="Google" src={google}/>
                        </div>
                        <hr/>
                        <label>Have not account yet?</label><br/><br/>
                        <label className="sign-up" onClick={()=>{props.showLog()}}>SIGN UP</label>
                    </div>
                </div>
            </div>
        )
    }


export default Login
