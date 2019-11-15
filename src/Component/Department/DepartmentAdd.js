import React from 'react';
import {
    Form, Input, Button,  message,
} from 'antd';
import TextArea from "antd/es/input/TextArea";
import API from '../../api.js';
class RegistrationForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const url= API.URL+'DepartmentManage/DepartmentAdd.php';
                const formData = new FormData();
                formData.append('FirstLevel', values.FirstLevel);
                formData.append('SecondLevel', values.SecondLevel);
                formData.append('ThirdLevel', values.ThirdLevel);
                formData.append('ForthLevel', values.ForthLevel);
                formData.append('DepartmentIntroduction', values.DepartmentIntroduction);
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
    render() {
        const { getFieldDecorator } = this.props.form;
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
                <Form.Item label='事业部' id={'FirstLevel'}>
                    {getFieldDecorator('FirstLevel', {
                        rules: [{ required: true, message: '请输入事业部名称!', whitespace: true}],
                    })(
                        <Input  style={{ width:'25%'}} />
                    )}
                </Form.Item>
                <Form.Item label="二级单位">
                    {getFieldDecorator('SecondLevel', {
                        rules: [{
                            required: false, message: '请输入二级单位名称',
                        }],
                    })(
                        <Input  style={{ width:'25%'}} />
                    )}
                </Form.Item>

                <Form.Item label="三级单位">
                    {getFieldDecorator('ThirdLevel', {
                        rules: [{
                            required: false, message: '请输入三级单位名称',
                        }],
                    })(
                        <Input  style={{ width:'25%'}}/>
                    )}
                </Form.Item>
                <Form.Item label="四级单位">
                    {getFieldDecorator('ForthLevel', {
                        rules: [{
                            required: false, message: '请输入四级单位名称!',
                        }],
                    })(
                        <Input  onBlur={this.handleConfirmBlur} style={{ width:'25%'}}/>
                    )}
                </Form.Item>
                <Form.Item label="部门描述" >
                    {getFieldDecorator('DepartmentIntroduction', {
                        rules: [{
                            type: 'string'
                        }]
                    })(
                        <TextArea placeholder="请输入部门介绍" autosize={{ minRows: 2, maxRows: 6 }}
                                  style={{height: '50px' , width:'60%',overflow:'hidden'}}
                        />
                    )}
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">添加部门</Button>
                </Form.Item>
            </Form>
        );
    }
}

const DepartmentAdd = Form.create({ name: 'register' })(RegistrationForm);
export default DepartmentAdd