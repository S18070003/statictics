import React from 'react';
import {Form} from "antd";
import API from '../../api.js'
class Person extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            Username:sessionStorage.getItem('username'),
            PassWord:sessionStorage.getItem('password'),
            Identity:sessionStorage.getItem('Identity'),
            Realname:sessionStorage.getItem('Realname'),
            Department:sessionStorage.getItem('Department'),
        };
    }
    componentDidMount(){
        // this.getPersondata();
    }
    getPersondata(){
        const require='username='+sessionStorage.getItem('username');
        const  url=API.URL+'Person/getPersonImformation.php';
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: require,
        }).then(response => response.json())
            .then(
                response => {
                    if(response && response.length>0) {
                        this.setState({
                            Username:response[0].Username ,
                            Password:response[0].Password,
                            Identity:response[0].Identity,
                            Department:response[0].FirstDep+(response[0].SecondDep==null?'':'/'+response[0].SecondDep)+
                                  (response[0].ThirdDep==null?'':'/'+response[0].ThirdDep)+(response[0].ForthDep==null?'':'/'+response[0].ForthDep),
                            Realname:response[0].Realname,
                        })
                    }
                }
            )
    }

    render(){
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (<div>
            <Form {...formItemLayout} style={{fontSize:'40px'}}>
                <Form.Item label="姓名" >
                    <p>{this.state.Realname}</p>
                </Form.Item>
                <Form.Item label="账户" >
                    <p>{this.state.Username}</p>
                </Form.Item>
                <Form.Item label="密码" >
                    <p>{this.state.PassWord}</p>
                </Form.Item>
                <Form.Item label="部门" >
                    <p>{this.state.Department}</p>
                </Form.Item>
                <Form.Item label="身份" >
                    <p>{this.state.Identity}</p>
                </Form.Item>
            </Form>
        </div>)
    };
}
export default Person