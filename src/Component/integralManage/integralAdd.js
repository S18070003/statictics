import React from 'react';
import {
    Form, Input,  Select,  Button, AutoComplete, message,InputNumber
} from 'antd';
import API from '../../api'
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const url= API.URL+'IntegralManage/IntegralAdd.php';
                const formData = new FormData();
                formData.append('IntegralName', values.IntegralName);
                formData.append('Point', values.Point);
                formData.append('Type', values.Type);
                formData.append('Arithmetic', values.Arithmetic);
                formData.append('Unit', values.Unit);
                if(values.BonusPoint==='undefined'){
                    formData.append('BonusPoint', '无');
                }else {
                    formData.append('BonusPoint', values.BonusPoint);
                }
                formData.append('PlusCondition', values.PlusCondition);
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

    handleSelectChange = (value) => {
        if(value==='类型一（总分固定）'){
            this.props.form.setFieldsValue({
                Point:'不确定'
            });
            this.setState({
                selectPointAble:0
            })
        }else if(value==='类型三'){
            this.props.form.setFieldsValue({
                Point:'不确定'
            });
            this.setState({
                selectPointAble:0
            })
        }else {
            this.props.form.setFieldsValue({
                Point:1
            });
            this.setState({
                selectPointAble:1
            })
        }
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
                xs: { span: 39 },
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
                <Form.Item label='积分项名称' callback >
                    {getFieldDecorator('IntegralName', {
                        rules: [{ required: true, message: '请输入积分项名称!', whitespace: true}],
                    })(
                        <Input  style={{ width:'25%'}} placeholder={'请输入项目名称'}/>
                    )}
                </Form.Item>

                <Form.Item label="积分项类型" callback >
                    {getFieldDecorator('Type', {
                        rules: [{
                            required: true, message: '请选择项目类型!',
                        }],
                    })(
                        <Select style={{width:'25%'}} placeholder={'请选择项目类型'}  onChange={this.handleSelectChange}>
                            <Option value="类型一">类型一（总分固定）</Option>
                            <Option value="类型二">类型二（总分不定）</Option>
                            {/*<Option value="类型三">类型三</Option>*/}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="算法">
                    {getFieldDecorator('Arithmetic', {
                        rules: [{
                            required: true, message: '请选择项目的算法!',
                        }],
                    })(
                        <Select  style={{width:'25%'}} placeholder={'请选择项目算法'}>
                            <Option value="算法一">算法一(总分批分)</Option>
                            <Option value="算法二">算法二（按角色得分）</Option>
                            <Option value="算法三">算法三（总价/人数/角色）</Option>
                            <Option value="算法四">算法四（时间天数/角色-积分周期10天）</Option>
                            <Option value="算法五">算法五（时间天数/角色-积分周期1天）</Option>
                        </Select>
                    )}
                </Form.Item>

                <Form.Item
                    label="分值"
                >
                    {getFieldDecorator('Point' )(
                        <InputNumber min={1} max={100} />
                    )}
                </Form.Item>

                <Form.Item label="单位（条件）">
                    {getFieldDecorator('Unit',
                        {
                            rules: [{
                                initialValue: '无'
                            }],
                        })(
                        <Input style={{ width:'25%'}} placeholder={'可选择单位'}/>
                    )}
                </Form.Item>
                <Form.Item
                    label="加分"
                >
                    {getFieldDecorator('BonusPoint')(
                        <InputNumber min={1} max={10} />
                    )}
                    <span className="ant-form-text"> 分</span>
                </Form.Item>

                <Form.Item label="加分条件">
                    {getFieldDecorator('PlusCondition')(
                        <Select  style={{width:'25%'}} placeholder={'可选择项目加分条件'}>
                            <Option value="获奖">获奖</Option>
                            <Option value="自主创新">自主创新</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">添加积分项</Button>
                </Form.Item>
            </Form>
        );
    }
}
const IntegralAdd = Form.create({ name: 'register' })(RegistrationForm);
export default IntegralAdd