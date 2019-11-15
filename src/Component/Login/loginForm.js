import {
    Form, Icon, Input, Button, Checkbox,Radio,
} from 'antd';
import * as React from "react";
import {withRouter} from "react-router-dom";
import cookie from "react-cookies";
import API from '../../api.js'
class NormalLoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            LoginTips:'',
            username:cookie.load('username'),
            password:cookie.load('password'),
            remember:cookie.load('remember'),
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                let data = 'username=' + values.username+'&password='+values.password;
                let submitsul='';
                if(values.Usertype==='本地用户'){
                    submitsul = API.URL +'login/login.php'
                }
                else {
                    submitsul = API.URL +'login/login.php';
                }
                fetch(submitsul, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: data,
                }).then(response => response.json())
                    .then(response => {
                            if (response.isLogin === true) {
                                sessionStorage.setItem('isLogin', true);
                                sessionStorage.setItem('username', values.username);
                                sessionStorage.setItem('password',values.password);
                                sessionStorage.setItem('chooseView','1');
                                sessionStorage.setItem('Identity',response.Identity);
                                sessionStorage.setItem('Realname',response.Realname);
                                sessionStorage.setItem('Department',response.FirstDep+(response.SecondDep='null'?'':'/'+response.SecondDep)+
                                    (response.ThirdDep='null'?'':'/'+response.ThirdDep)+(response.ForthDep='null'?'':'/'+response.ForthDep));
                                this.props.history.push('/Home');
                                if(values.remember===true){
                                    const expires = new Date();
                                    expires.setDate(Date.now() + 1000 * 60 * 60 * 24 * 14);//  生存时间为14天
                                    cookie.save('remember', values.remember, {path: '/', expires, maxAge: 1000});
                                    cookie.save('username', values.username, {path: '/', expires, maxAge: 1000});
                                    cookie.save('password', values.password, {path: '/', expires, maxAge: 1000});
                                }else {
                                    // cookie.remove('remember');
                                    // cookie.remove('username');
                                    // cookie.remove('password');
                                }
                            }else if(response.isLogin === false){
                                console.log("2323232323------错了～");
                               this.setState({
                                   LoginTips:'账号或者密码错误！'
                               })
                            }
                        }
                    );
            }
        });
    };
    regist=()=>{
        this.props.history.push('/Registration')
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
            {getFieldDecorator('username', {
                initialValue:this.state.username,
            rules: [{ required: true, message: '请输入账号!' }],
        })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账号" />
        )}
    </Form.Item>
    <Form.Item>
        {getFieldDecorator('password', {
            initialValue:this.state.password,
            rules: [{ required: true,
                message: '请输入密码!',
            }],
        })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
        )}
    </Form.Item>
   <Form.Item style={{height:'5px'}}>
       {getFieldDecorator('Usertype', {
           initialValue: '本地用户',
           required:true
       })(
           <Radio.Group>
               <Radio value={'本地用户'}>本地用户</Radio>
               <Radio value={'域用户'}>域用户</Radio>
           </Radio.Group>
       )}
   </Form.Item>
    <Form.Item style={{height:'10px'}}>
        {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: this.state.remember,
        })(
            <Checkbox> 记住密码</Checkbox>
        )}
        {/*<a className="login-form-forgot" href="">忘记密码</a>*/}
        <Button type="primary" htmlType="submit" className="login-form-button" style={{width:'100%'}}>登陆</Button>
        或 <a onClick={this.regist}>现在注册!</a>
    </Form.Item>
    <Form.Item style={{height:'10px',marginTop:'100px'}} >
     {getFieldDecorator('LoginTips', {
         initialValue: '',
         })(
         <h4 style={{color:'red'}}>{this.state.LoginTips}</h4>
          )}
      </Form.Item>
    </Form>
        );
    }
}

const LoginForm = Form.create({})(NormalLoginForm);

export default withRouter(LoginForm)