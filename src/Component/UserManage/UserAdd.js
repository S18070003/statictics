import React from 'react';
import {
    Form, Input, Cascader, Button, message, Select,
} from 'antd';
import API from '../../api.js'
const Option =Select;
const residences = [{
    value: '后勤',
    label: '后勤',
}, {
    value: '财务',
    label: '财务',
    children: [{
        value: '项目财务',
        label: '项目财务',
    },{
        value: '人力财务',
        label: '人力财务',
    }],
}];

const IdengtitySelection = [{
    value: '用户',
    label: '用户',
}, {
    value: '审查员',
    label: '审查员',
},{
    value: '管理员',
    label: '管理员',
}];

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        productTypeOptions:[],//产品类型option
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const url=API.URL+'UserManage/userAdd.php';
                const formData = new FormData();
                formData.append('Realname', values.Realname);
                formData.append('Username', values.Username);
                formData.append('Password', values.Password);
                formData.append('FirstDep', values.Department[0]);
                formData.append('SecondDep', values.Department[1]);
                formData.append('ThirdDep', values.Department[2]);
                formData.append('ForthDep', values.Department[3]);
                formData.append('Identity', values.Identity);
                formData.append('Usertype', values.Usertype);
                fetch(url, {
                    method : 'POST',
                    mode : 'cors',
                    body : formData
                }).then(function(res){
                    if(res.ok){
                        res.json().then(function(data){
                            if(data.isinsert===true){
                                message.success(`添加成功.`);
                            }
                        })
                    }else{
                        message.error(`添加失败.`);
                    }
                }, function(e){
                    message.error(`添加失败.`);
                })
            }
        });
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('Password')) {
            callback('两次密码不一致');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

//级联第一级数据
    getFirst= () => {
        const  url=API.URL+'UserManage/getFirst.php';
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then(response => response.json())
            .then(response=>{
                const productTypeList = response;
                const productTypeOption = productTypeList&&productTypeList.map(productTypeList=>productTypeList.FirstLevel? {
                                    value:productTypeList.FirstLevel,
                                    label:productTypeList.FirstLevel,
                                    isLeaf:false,
                }:"");
                this.setState({
                    productTypeOptions:productTypeOption
                });
            }).catch(error=>{
            console.log(error);
        })
    };
    componentDidMount(){
        this.getFirst(); //在渲染前调用
    }

   //根据第一级获取之后的层级
    getProductsLoadData=(selectedOptions)=>{
        const targetOption = selectedOptions[selectedOptions.length - 1];
        const deep=selectedOptions.length - 1;
        const  url=API.URL+'UserManage/getLater.php';
        const data='select='+selectedOptions[deep].value+'&deep='+selectedOptions.length;
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body:data
        }).then(response => response.json())
            .then(response=>{
                if(response[0].LaterLevel!=='undefined') {
                    const productTypeList = response;
                    targetOption.children = productTypeList && productTypeList.map(productTypeList => productTypeList.LaterLevel ? {
                        value: productTypeList.LaterLevel,
                        label: productTypeList.LaterLevel,
                        isLeaf: selectedOptions.length > productTypeList.Deep - 2,
                    } : "");
                    this.setState({
                        productTypeOptions: [...this.state.productTypeOptions]
                    });
                }
            }).catch(error=>{
            console.log(error);
        });
    };
//级联选择后的界面渲染
    productDisplayRender = (label) => {
        return label[label.length - 1];
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label='真实姓名'>
                    {getFieldDecorator('Realname', {
                        rules: [{ required: true, message: '请输入真实姓名!', whitespace: true}],
                    })(
                        <Input  style={{ width:'25%'}} />
                    )}
                </Form.Item>
                <Form.Item
                    label="账号"
                >
                    {getFieldDecorator('Username', {
                        rules: [{
                            required: true, message: '请输入账号',
                        }],
                    })(
                        <Input type="username" style={{ width:'25%'}} />
                    )}
                </Form.Item>

                <Form.Item
                    label="密码"
                >
                    {getFieldDecorator('Password', {
                        rules: [{
                            required: true, message: 'Please input your password!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password"  style={{ width:'25%'}}/>
                    )}
                </Form.Item>
                <Form.Item
                    label="确认密码"
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: '请确认密码!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} style={{ width:'25%'}}/>
                    )}
                </Form.Item>
                {/*<Form.Item*/}
                    {/*label="部门"*/}
                {/*>*/}
                    {/*{getFieldDecorator('Department', {*/}
                        {/*// initialValue: ['后勤', '财务', '管理'],*/}
                        {/*rules: [{ type: 'array', required: true, message: '请选择部门' }],*/}
                    {/*})(*/}
                        {/*<Cascader options={residences} style={{ width:'25%'}} placeholder={'选择部门'}/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                <Form.Item label="部门">
                    {getFieldDecorator('Department', {
                        rules: [{ type: 'array', required: true, message: '请选择部门' }],
                    })(
                        <Cascader options={this.state.productTypeOptions}
                                  loadData={this.getProductsLoadData}
                                  displayRender={this.productDisplayRender}
                                  expandTrigger="hover"
                                  style={{ width:'25%'}}
                                  placeholder={'选择部门'}
                        />
                    )}
                </Form.Item>
                <Form.Item
                    label="身份"
                >
                    {getFieldDecorator('Identity', {
                        rules: [{ type: 'array', required: true, message: '请选择身份!' }],
                    })(
                        <Cascader options={IdengtitySelection} style={{ width:'25%'}} placeholder={'选择身份'}/>
                    )}
                </Form.Item>
                <Form.Item
                    label="用户类型"
                >
                    {getFieldDecorator('Usertype', {
                        rules: [{ type: 'string', required: true, message: '请选择身份!' }],
                    })(
                        <Select placeholder="请选择项目类型" style={{ width:'25%'}}>
                            <Option value="本地用户">本地用户</Option>
                            <Option value="域用户">域用户</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">添加用户</Button>
                </Form.Item>
            </Form>
        );
    }
}

const Useradd = Form.create({ name: 'register' })(RegistrationForm);

export default Useradd