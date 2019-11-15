import React from 'react';
import './Login.css';

import logo from '../../Statict/image/homehead/manage.png';
import biglogo from '../../Statict/image/login/biglogo.jpg';
import LoginForm from "./loginForm.js";

class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{height: '100%'}}>
                <div className='loginHeader'>
                    <img src={logo} alt='logo'/>
                </div>
                <div className='loginBody'>
                    <div className='loginBodyLeft'>
                        <div className='loginBoxTitle'>用户登陆</div>
                        <LoginForm/>
                    </div>
                    <div className='loginBodyMiddle'></div>
                    <div className='loginBodyRight'>
                        <div className='loginBodyRightTitle'>工作量统计系统</div>
                        <div className='loginBodyRightPic'><img src={biglogo} alt='biglogo'/></div>
                    </div>
                </div>
                <div className='loginFooter'>
                 <p>workload statistics© 2018-至今 通信工程团队. 版权所有</p>
                </div>
            </div>
        )
    }
}
    export default  Login