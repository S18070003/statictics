import React from 'react';
import './Login.css';

import logo from '../../Statict/image/homehead/manage.png';
import RegistrationForm from "./RegistrationForm.js";

class Registration extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{height: '100%'}}>
                <div className='loginHeader'>
                    <img src={logo} alt='logo'/>
                </div>
                <div className='loginBody' style={{background:'#f7f8fa'}}>
                    <div style={{margin:'0 auto',width:'300px',fontSize:'28px',height:'50px',textAlign: 'center'}}> 用户注册</div>
                    <div style={{width:'500px',margin:'0 auto'}}><RegistrationForm history={this.props.history}/></div>
                </div>
                <div className='loginFooter'>
                    <p>workload statistics© 2018-至今 通信工程团队. 版权所有</p>
                </div>
            </div>
        )
    }
}
export default  Registration