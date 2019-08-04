import React from 'react';
import Axios from 'axios';
class ResetPassword extends React.Component{
    constructor(props){
        super(props);
        this.state={
            message:'',
        }
    }
    componentDidMount(){
        let obj={token:this.props.match.params}
        Axios.get('/resetit',obj).then((res)=>{
            this.setState({
                user:res.data,
            })
        })
    }
    getInput(e){
        this.setState({
            pass:e.target.value,
            message:''
        })
    }
    getInput1(e){
        this.setState({
            repeatpass:e.target.value,
            message:''
        })
    }
    passreset(e){
        if(this.state.pass!=this.state.repeatpass){
            this.setState({
                message:'Password does not match'
            })
        }else{
            let obj={user:this.state.user,pass:this.state.pass}
            Axios.post('/resetPassViaEmail',obj).then((res)=>{
                if(res.data=='password Reset'){
                    this.setState({
                        message:'password updated'
                    })
                }
            })
            
        }
    }
    render(){
        return <div className="whole">
            <div className="reset-box">
            <div className="login-head"><h1>Reset Form</h1></div>
            <div className="fields">
            <label>New Password</label>
                <div className="login-input ">
                <i className="fa fa-lock"></i>
                <input placeholder="Type your Password" type="password" name="userpass" onChange={(e)=>{this.getInput(e)}}/>
            </div>    
            </div>
            <div className="fields">
            <label>Confirm new Password</label>
                <div className="login-input ">
                <i className="fa fa-lock"></i>
                <input placeholder="Type your Password" type="password" name="userpass" onChange={(e)=>{this.getInput1(e)}}/>
            </div>
            </div>
            <div className="Error">{this.state.message}</div>
            <button className="login-btn pads top" type="submit" onClick={(e)=>{this.passreset(e)}}>Reset</button>
            </div>
        </div>
        
    }
}
export default ResetPassword;