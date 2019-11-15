import React from 'react'
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete, message,
} from 'antd';
import API from "../../api";

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

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
    constructor(props){
        super(props);
    }
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    handleSubmit = e => {
        e.preventDefault();
        const that = this;
        that.props.form.validateFieldsAndScroll((err, values) => {
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
                formData.append('Identity', '用户');
                formData.append('Usertype', '域用户');
                fetch(url, {
                    method : 'POST',
                    mode : 'cors',
                    body : formData
                }).then(function(res){
                    if(res.ok){
                        res.json().then(function(data){
                            if(data.isinsert===true){
                                message.success(`添加成功.将返回登录页面进行登陆！`);
                                that.props.history.push('/');
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
    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('Password')) {
            callback('两次密码不一致!');
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
    componentDidMount(){
        this.getFirst(); //在渲染前调用
    }
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
    //根据第一级获取第二级
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
                    const productTypeList = response;
                    targetOption.children = productTypeList && productTypeList.map(productTypeList => productTypeList.LaterLevel!=='undefined' ? {
                        value: productTypeList.LaterLevel,
                        label: productTypeList.LaterLevel,
                        isLeaf: selectedOptions.length > productTypeList.Deep - 2,
                    } : '');
                    this.setState({
                        productTypeOptions: [...this.state.productTypeOptions]
                    });
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
            <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{backgroundColor:"white",padding:'10px'}}>
                <Form.Item label="账号（企业邮箱账号）">
                    {getFieldDecorator('Username', {
                        rules: [
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="密码" hasFeedback>
                    {getFieldDecorator('Password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            {
                                validator: this.validateToNextPassword,
                            },
                        ],
                    })(<Input.Password />)}
                </Form.Item>
                <Form.Item label="确认密码" hasFeedback>
                    {getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: '请再次输入你的密码!',
                            },
                            {
                                validator: this.compareToFirstPassword,
                            },
                        ],
                    })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                </Form.Item>
                <Form.Item
                    label={
                        <span>真实姓名&nbsp;
                            <Tooltip title="What do you want others to call you?">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('Realname', {
                        rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="部门">
                    {getFieldDecorator('Department', {
                        rules: [{ type: 'array', required: true, message: '请选择部门' }],
                    })(
                        <Cascader options={this.state.productTypeOptions}
                                  loadData={this.getProductsLoadData}
                                  displayRender={this.productDisplayRender}
                                  expandTrigger="hover"
                                  style={{ width:'100%'}}
                                  placeholder={'选择部门'}
                        />
                    )}
                </Form.Item>
                {/*<Form.Item*/}
                    {/*label="身份"*/}
                {/*>*/}
                    {/*{getFieldDecorator('Identity', {*/}
                        {/*rules: [{ type: 'array', required: true, message: '请选择身份!' }],*/}
                    {/*})(*/}
                        {/*<Cascader options={IdengtitySelection} style={{ width:'100%'}} placeholder={'选择身份'}/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label="Habitual Residence">*/}
                    {/*{getFieldDecorator('residence', {*/}
                        {/*initialValue: ['zhejiang', 'hangzhou', 'xihu'],*/}
                        {/*rules: [*/}
                            {/*{ type: 'array', required: true, message: 'Please select your habitual residence!' },*/}
                        {/*],*/}
                    {/*})(<Cascader options={residences} />)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label="Phone Number">*/}
                    {/*{getFieldDecorator('phone', {*/}
                        {/*rules: [{ required: true, message: 'Please input your phone number!' }],*/}
                    {/*})(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label="Website">*/}
                    {/*{getFieldDecorator('website', {*/}
                        {/*rules: [{ required: true, message: 'Please input website!' }],*/}
                    {/*})(*/}
                        {/*<AutoComplete*/}
                            {/*dataSource={websiteOptions}*/}
                            {/*onChange={this.handleWebsiteChange}*/}
                            {/*placeholder="website"*/}
                        {/*>*/}
                            {/*<Input />*/}
                        {/*</AutoComplete>,*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label="Captcha" extra="We must make sure that your are a human.">*/}
                    {/*<Row gutter={8}>*/}
                        {/*<Col span={12}>*/}
                            {/*{getFieldDecorator('captcha', {*/}
                                {/*rules: [{ required: true, message: 'Please input the captcha you got!' }],*/}
                            {/*})(<Input />)}*/}
                        {/*</Col>*/}
                        {/*<Col span={12}>*/}
                            {/*<Button>Get captcha</Button>*/}
                        {/*</Col>*/}
                    {/*</Row>*/}
                {/*</Form.Item>*/}
                {/*<Form.Item {...tailFormItemLayout}>*/}
                    {/*{getFieldDecorator('agreement', {*/}
                        {/*valuePropName: 'checked',*/}
                    {/*})(*/}
                        {/*<Checkbox>*/}
                            {/*I have read the <a href="">agreement</a>*/}
                        {/*</Checkbox>,*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        注册
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

export default WrappedRegistrationForm