import React from 'react'
import user from './user.png'
import small from './small.png'
import back from './back.png'
import send from './send.png' 
import search from './search.png'
import menu from './menu.png'
import add from './add.png';
import IMG_20181028_225614 from './IMG_20181028_225614.jpg'
import ScrollToBottom from 'react-scroll-to-bottom';
const colory={"background-color":"royalblue"}
const colory1={"background-color":"lightsteelblue"}
const colory2={"background-color":"lightseagreen"}
const colory3={"background-color":"lightyellow"}
const colory4={"background-color":"lawngreen"}
const colory5={"background-color":"lightslategray"}

export function Home(props) {  
    const colorfull={"background-color":`${props.currentColor}`}  
        return (
            <div>
                <div className="blank">
                    <div className="cen">
                    <label className="plus">+</label>TAP ON CHATS FOR FUNFULL CHATING
                    </div>
                </div>
                <div className={props.aboutuss?"semi":"semi hideit"}>
                    <div className="band" onClick={()=>{props.band2()}}>&times;</div>
                    <div className="back">
                        <img className="photo rad" src={IMG_20181028_225614}/>
                        <h2 className="proo">VAIBHAV GEHANI</h2>
                        <div className="diss">we believe everyone deserves to have a website or online store. Innovation and simplicity makes us happy: our goal is to remove any technical or financial barriers that can prevent business owners from making their own website. We're excited to help you on your journey!</div>
                    </div>
                </div>
                <img className="navbar" onClick={()=>{props.show()}} src={menu}/>
                <div className={props.showw?"background show":"background hideit"}>
                    <div className="semi">
                        <div className="back">
                        <img className="photo" src={props.imageurl?props.imageurl:user}/>
                        </div>
                <label className="pic"><input type="file" className="choose" title="Profile pic" name="myimage" onChange={(e)=>{props.upload(e)}}/><img className="addd" src={add}/></label>
                        <div className="dataaa">
                        <h1 className="profile-name">{props.name}</h1>
                        <div className="about dis" onClick={()=>{props.aboutus()}}>About Us</div>
                        <div className="themes dis" onClick={()=>{props.theme()}}>CHAT THEME</div>
                        <h2 className="set dis" onClick={()=>{props.settings()}}>Profile Settings</h2>
                        <div className="logoutt dis" onClick={()=>{props.logout()}}>LOG OUT</div>
                        </div>
                    </div>
                </div>
                <div className={props.themee?"semi":"semi hideit"}>
                    <div className="band" onClick={()=>{props.band1()}}>&times;</div>
                    <div className="back"><div className="textt">Change Chat themes !!</div></div>
                    <div className="">
                        <div className="colors1">
                        <div className="div1" style={colory} onClick={(e)=>{props.getColor1(e)}}><div className="top1">RoyalBlue</div></div>
                        <div className="div1" style={colory1} onClick={(e)=>{props.getColor1(e)}}><div className="top1 whitee">SteelBlue</div></div>
                        <div className="div1" style={colory2} onClick={(e)=>{props.getColor1(e)}}><div className="top1">SeaGreen</div></div>
                        </div><br/>
                        <div className="colors1">
                        <div className="div1" style={colory3} onClick={(e)=>{props.getColor1(e)}}><div className="top1 lightt">Lightyellow</div></div>
                        <div className="div1" style={colory4} onClick={(e)=>{props.getColor1(e)}}><div className="top1">Lawngreen</div></div>
                        <div className="div1" style={colory5} onClick={(e)=>{props.getColor1(e)}}><div className="top1">Slategray</div></div>
                    </div>    
                        </div>
                        
                </div>
                <div className={props.Toggleit?"msg-part":"hideit"}>
                    <div className="user-bar"><img className="small1" src={props.url?props.url:small}/><label>{props.title}</label></div>
                    <img onClick={()=>{props.closeBox()}} src={back} className="btn-close"/>
                    <div style={colorfull} className="chat-theme1" >
                    <ScrollToBottom className="chat-theme">
                    <div className="msgs">
                        {props.msgs.map((val,i)=>(<div className="caller"><div className={props.sender==val.SenderEmail?"box right":"box left"}><div key={i} className="call">{val.msg}</div><label className="time">{val.time}</label></div></div>))}
                    </div>
                    </ScrollToBottom>
                    </div>
                    <div className="msg-box"><input placeholder="Type a message" value={props.newMsg} className="msg-input" onChange={(e)=>{props.getMsg(e)}}/><img className="send-btn" src={send} onClick={()=>{props.showMsg()}}/></div>
                </div>
                <div className="Sidebar">
                    <div className="inp"><input placeholder="Search.." onChange={(e)=>{props.value(e)}} className="searchbar"/><img src={search}/></div>
                    <ul className="list">{props.register.map((val,i)=>(<div className="main-box" onClick={(e)=>{props.sendTo(val)}} key={i}><div className="data"><img className="side-image" src={val.image?`http://localhost:8080/${val.image}`:small}/><div className="name-part">{val.name}</div><div className="email-part">{val.email}</div></div></div>))}</ul>
                </div>
                <div className={props.noo?"semi":"semi hideit"}>
                    <div className="band" onClick={()=>{props.band()}}>&times;</div>
                    <div className="back">
                        <div className="textt">Settings changed will be Permenent !!</div>
                        <div className="changeit">
                            <div className="em">Change Email:</div>
                            <input placeholder="Enter new email" type="email" onChange={(e)=>{props.getValue1(e)}} className="place"/>
                            <button className="change" onClick={()=>{props.changeeit()}}>Change</button>
                        </div>
                        <div className="changeit">
                            <div className="em">Change Password:</div>
                            <input placeholder="Enter new Password" name="check1" type="password" onChange={(e)=>{props.getValue(e)}} className="place mar"/>
                            <input placeholder="Enter confirm Password" name="check2" type="password" onChange={(e)=>{props.getValue(e)}} className="place"/>                            
                            <button className="change" onClick={()=>{props.changeeit1()}}>Change</button>
                        </div>
                        <div className="Error color">{props.msg}</div>
                        <div className="delete">
                            <div className="del">Delete Account ?</div>
                                <button className="login-btn colorr" onClick={()=>{props.deleteit()}}>Delete</button>
                            </div>
                    </div>
                </div>
            </div>
        )
    }


export default Home
