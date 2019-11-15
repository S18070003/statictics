import React, { Component } from 'react';
import { Avatar, Badge ,Menu, Dropdown} from 'antd';
import './HomeHead.css'
import logo from "../../Statict/image/homehead/manage.png";

class CommonHeader extends Component{
    constructor(props){
        super(props);
        this.state = {
            Identity:sessionStorage.getItem('Identity'),
            name:sessionStorage.getItem('username'),
            Realname:sessionStorage.getItem('Realname')
        }
    }

    componentWillMount() {
        if(!sessionStorage.getItem('isLogin')){
            alert("请重新登陆后访问网站");
            window.location.href="./"
        }
    }

    logout = () => {
        sessionStorage.clear();
        window.location.href="./"
    };

    render() {
        const menu = (
            <Menu>
                <Menu.Item key="3">
                    <a target="_blank" rel="noopener noreferrer" onClick={this.logout}>退出</a>
                </Menu.Item>
                {/*<Menu.Divider />*/}
                {/*<Menu.Item key="3" disabled>3rd menu item（disabled）</Menu.Item>*/}
            </Menu>
        )
        return (
            <div className='homeHeader'>
                <div className='homeHeaderLeft'>
                    <img src={logo} alt='homeLogo'/>
                </div>
                <div className='homeHeaderRight'>
                    <div className='homeHeaderRightFirst'>
                        你好!{this.state.Identity}  {sessionStorage.getItem('Realname')}
                        <Dropdown overlay={menu}>
                            <Badge count={0}><Avatar shape="square" icon="user" /></Badge>
                        </Dropdown>
                    </div>
                </div>
            </div>
        );
    }
}
export default CommonHeader