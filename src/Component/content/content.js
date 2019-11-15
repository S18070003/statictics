import React from 'react';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './content.css';
import {
    Form, Select, InputNumber,
     Button, Upload, Icon,Cascader,
    DatePicker, Input,message
} from 'antd';
import moment from 'moment';
import API from '../../api.js'
const { TextArea } = Input;
const { Option } = Select;
const {  RangePicker } = DatePicker;

class Contentt extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            StartDate:'',
            EndDate:'',
            mode: ['date', 'date'],
            value: [],
            name:sessionStorage.getItem('Realname'),
            FileName:sessionStorage.getItem('File'),
            Department:sessionStorage.getItem('Department'),
            Option:[],
            TemPoint:'',
            GotPoint:'',
            TotalPeople:'',
            ToatalMoney:'',
            Rank:"",
            Day:'',
            PlusConditionShow:'隐藏',
            BonusPoint:'无',
            getBonusPoint:0,
                    fileList:[],     //文件列表
        }
    }

    handlePanelChange = (value, mode) => {
        this.setState({
            value,
            mode: [
                mode[0] === 'date' ? 'date' : mode[0],
                mode[1] === 'date' ? 'date' : mode[1],
            ],
        });
    };

    handleChange = (value) => {
        this.setState({ value })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const submitsul = API.URL+ 'WorkloadSubmit/submit.php';
        this.props.form.validateFields((err, values) => {
            let StartDate=moment(this.state.value[0]).format('YYYY-MM-DD');
            let EndDate=moment(this.state.value[1]).format('YYYY-MM-DD');
           let rooturl=API.URL;
           let FilePath=rooturl+this.state.uploadPath;
            // if(this.state.FileName===''){
            //     FilePath='';
            // }
            let data='Username='+sessionStorage.getItem('username')+'&Name='+this.state.name+'&ProjectName='+values.ProjectName+'&StartDate='+StartDate+'&EndDate='+EndDate+'&ProjectType='+values.ProjectType
                         +'&TotalPoint='+values.TotalPoint+'&TotalPeople='+values.TotalPeople+'&MyselfRank='+values.MyselfRank+ '&GotPoint='+this.state.GotPoint
                        +'&TaskDescri='+values.TaskDescri+'&FilePath='+FilePath+'&FileName='+this.state.filename+'&checker='
                        +values.checker+'&Role='+values.Role+'&TotalMoney='+values.TotalMoney+'&TotalDay='+values.TotalDay+'&Department='+this.state.Department
                         +'&BonusPoint='+values.BonusPoint+'&PlusCondition='+values.PlusCondition+'&TaskDifficult='+values.TaskDifficult+'&NextState='+values.NextState;
            if (!err) {
                console.log(data)
                fetch(submitsul, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: data,
                }).then(response => response.json())
                    .then(
                        response => {
                            if (response.isinsert===true) {
                                message.success(`工作量提交成功！`);
                            }else if(response.isinsert===false){
                                console.log("2323232323------错了～");
                            }
                        })
            }
        });
    };
    getChecker=()=>{
        let url=  API.URL+'WorkloadSubmit/getchecker.php';
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then(response => response.json())
            .then(
                response => {
                    if (response && response.length>0) {
                        this.handleGetData(response);
                        this.setState({
                            Option:response,
                        })
                    }else {
                        console.log("2323232323------错了～");
                    }
                })
    };
    handleGetData = (data) =>{
        for(let x = 0,le =data.length; x<le;x +=1){
            data[x] = {
                ...data[x],
                value:data[x].value,
                label:data[x].lable,
            }
        }
    };
    onChangeType=(value)=>{
        let IntegralName=value[0];
        // console.log(IntegralName);
        let data='IntegralName='+IntegralName;
        let url= API.URL+'WorkloadSubmit/getTotalPoint.php';
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body:data
        }).then(response => response.json())
            .then(
                response => {
                    if (response && response.length>0) {
                        this.setState({
                            TemPoint:response[0].Point,
                            Arithmetic:response[0].Arithmetic,
                            BonusPoint:response[0].BonusPoint,
                            PlusCondition:response[0].PlusCondition,
                            GotPoint:'',
                            PlusConditionShow:'隐藏',
                            getBonusPoint:0
                        });
                    }else {
                        console.log("2323232323------错了～");
                    }
                });
        this.setState({
            // GotPoint:'',
        }, () => {
            this.math();
        });
    };
    getType=()=>{
        let url= API.URL+'WorkloadSubmit/getType.php';
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then(response => response.json())
            .then(
                response => {
                    if (response && response.length>0) {
                        this.setState({
                            TypeData:response,
                        })
                    }else {
                        console.log("2323232323------错了～");
                    }
                })
    };
    //算法三不清晰，这里不完全
    changeTotalMoney=(e)=>{
        this.setState({
            TotalMoney:e
        }, () => {
            this.math();
        });
    };
    getTotalPeople=(e)=>{
        this.setState({
            TotalPeople:e
        }, () => {
            this.math();
        });
    };
    getDay=(e)=>{
        this.setState({
            Day:e,
        }, () => {
            this.math();
        });
    };
    changeRole=(e)=>{
        this.setState({
            Role:e
        }, () => {
            this.math();
        });
    };
    getRank=(event5)=>{
        this.setState({
            Rank:event5
        }, () => {
            this.math();
        });
    };
    changePulseCondition=()=>{
        this.math();
    };
    changeBonusPoint=(value)=>{
        if(value!=='无'){
            this.setState({
                PlusConditionShow:'显示',
                getBonusPoint:parseInt(value)
            }, () => {
                this.math();
            });
        }else {
            this.setState({
                PlusConditionShow:'隐藏',
                getBonusPoint:0
            }, () => {
                this.math();
            });
        }
    };
    getGotPoint1=(T,n,i)=>{
        let A=2/(n+1)-(i-1)*2/[n*(n+1)];
        let x=parseInt(this.state.getBonusPoint) ;
        let B=T*A+x;     //加额外分
        this.setState({
            GotPoint:B.toFixed(2)
        });
    };
    math(){
        let T=this.state.TemPoint;
        let n=this.state.TotalPeople;
        let i=this.state.Rank;
        let R=this.state.Role;
        let M=this.state.TotalMoney;
        let D=this.state.Day;
        let x=parseInt(this.state.getBonusPoint) ;
        //只有算法一有加分，其他没有加分。
        //算法三不完善，没有角色和角色权重分配。
        if(this.state.Arithmetic==='算法一'){
            if(T>0&&n>0&&i>0){
                this.getGotPoint1(T,n,i);
            }
        }
        if(this.state.Arithmetic==='算法二'){
            if(R==='第一负责人'){
                this.setState({
                    GotPoint:15+x
                });
            }else if(R==='第二负责人'){
                this.setState({
                    GotPoint:10+x
                });
            }else if(R==='骨干'){
                this.setState({
                    GotPoint:5+x
                });
            }else if (R==='成员') {
                this.setState({
                    GotPoint: 3+x
                });
            }else if (R==='主讲') {
                this.setState({
                    GotPoint: 2+x
                });
            }else if (R==='辅助ppt') {
                this.setState({
                    GotPoint: 2+x
                });
            }else{
                this.setState({
                    GotPoint:'',
                });
            }
        }
        if(this.state.Arithmetic==='算法三'){
            if(M>0&&n>0){
                let A=M/n*0.03+x;
                this.setState({
                    GotPoint: A.toFixed(2),
                });
            }
        }
        if(this.state.Arithmetic==='算法四'){
            if(R==='负责人'){
                let A=0.2*D+x;
                this.setState({
                    GotPoint: A.toFixed(2),
                });
            }else if(R==='其他人'){
                let A=0.05*D+x;
                this.setState({
                    GotPoint: A.toFixed(2),
                });
            }else if(R==='现场出海'){
                let A=0.2*D+x;
                this.setState({
                    GotPoint: A.toFixed(2),
                });
            }else if(R==='室内组装测试'){
                let A=0.01*D+x;
                this.setState({
                    GotPoint: A.toFixed(2),
                });
            }else {
                this.setState({
                    GotPoint:'',
                });
            }
        }
        if(this.state.Arithmetic==='算法五'){
            let A=0.2*D+x;
            this.setState({
                GotPoint: A.toFixed(2),
            });
        }
    };
    beforeUpload = (file) => {
        let fileArr = [];
    //获取新的上传列表
        fileArr.push(file);
    //进行赋值保存
        this.setState(preState => ({
            fileList:fileArr,
            uploadPath:'',
            filename:''
        }))
    };
    // 文件上传改变事件
    updateChange = (info) => {
        if (info.file.status === 'done') {
    //上传成功后将后台返回来的文件地址进行获取--info.file.response
             if (info.file.response) {
                this.setState(preState => ({
                        uploadPath : info.file.response,
                        filename:info.fileList[0].name
                    })
                )
            }
             // console.log(info)
            sessionStorage.setItem('File',info.fileList[0].name);
            message.success('上传成功！');
        } else if (info.file.status === 'error') {
//上传失败进行提示
            message.error('上传失败！');
        }
    };
    // 移除文件
    removeFile = () => {
        this.setState(preState => ({
            fileList:[],
                uploadPath : '',
                filename:''
        })
    )};

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const Dragger = Upload.Dragger;
        const select1=(
            <Form.Item label="角色" id={'Role'}>
                {getFieldDecorator('Role')(
                    <Select  style={{ width: 120 }} onChange={this.changeRole}>
                        <Option value="第一负责人" >第一负责人</Option>
                        <Option value="第二负责人" >第二负责人</Option>
                        <Option value="骨干" >骨干</Option>
                        <Option value="成员" >成员</Option>
                    </Select>
                )}
            </Form.Item>
        );
        const select2=(
            <Form.Item label="角色" id={'Role'} style={{ display:this.state.Arithmetic==='算法一'?'none':'block'}}>
                {getFieldDecorator('Role')(
                    <Select  style={{ width: 120 }} onChange={this.changeRole}>
                        <Option value="负责人">负责人</Option>
                        <Option value="其他人" >其他人</Option>
                    </Select>
                )}
            </Form.Item>
        );
        const {fileList} = this.state;
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label={'项目名称'}>
                    {getFieldDecorator('ProjectName', {
                        rules: [{
                                required:true,
                                type: 'string',
                                 message:'请输入项目名称'
                        }]
                    })(
                        <Input placeholder="请输入项目名称" allowClear
                               style={{height: '25px' , width:'25%'}}
                        />
                    )}
                </Form.Item>
                <Form.Item label="起止日期" >{
                    getFieldDecorator('date',{
                        rules:[{
                            required:true
                        }]
                    })(
                        <RangePicker
                            placeholder={['开始时间', '结束时间']}
                            format='YYYY-MM-DD'
                            value={this.state.value}
                            mode={this.state.mode}
                            onChange={this.handleChange}
                            onPanelChange={this.handlePanelChange}
                        />
                    )}

                </Form.Item>
                <Form.Item label="项目类型"  hasFeedback>
                    {getFieldDecorator('ProjectType', {
                        rules: [{
                                required: true,
                                message:'请选择项目类型'
                        },
                        ],
                    })(
                        <Cascader id='checker' onClick={this.getType}  options={this.state.TypeData} size={'large'} style={{width:'30%'}}
                                  onChange={this.onChangeType} placeholder={'选择项目类型'}
                                  showSearch={true}/>
                    )}
                </Form.Item>
                <Form.Item label="总积分" style={{ display:this.state.Arithmetic==='算法一'?'block':'none'}}>
                    {getFieldDecorator('TotalPoint', {
                         initialValue: this.state.TemPoint,
                    })(
                        <Input placeholder="请输入总积分"
                               style={{height: '25px' , width:'25%'}}
                               disabled={true}
                        />
                    )}
                </Form.Item>
                <Form.Item label="合同总价" id={'TotalMoney'} style={{ display:this.state.Arithmetic==='算法三'?'block':'none'}}>
                    {getFieldDecorator('TotalMoney',{
                        initialValue:this.state.TotalMoney,
                    })(
                        <InputNumber min={1} max={10} onChange={this.changeTotalMoney}/>
                    )}
                    <span>万元</span>
                </Form.Item>
                <Form.Item label="参与总人数" style={{ display:this.state.Arithmetic==='算法一'?'block':(this.state.Arithmetic==='算法三'?'block':'none')}}>
                    {getFieldDecorator('TotalPeople',{
                        initialValue:this.state.TotalPeople,
                    })(
                        <InputNumber min={1} max={10}  onChange={this.getTotalPeople}
                        />
                    )}{
                    <span className="ant-form-text"> 人</span>
                }
                </Form.Item>
                <Form.Item label="总天数" id={'TotalDay'}  style={{ display:this.state.Arithmetic==='算法四'?'block':(this.state.Arithmetic==='算法五'?'block':'none')}} >
                    {getFieldDecorator('TotalDay',{
                        initialValue:this.state.Day,
                    })(
                        <InputNumber min={1} max={10}  onChange={this.getDay}/>
                    )}
                    <span> 天</span>
                </Form.Item>
                {(() => {
                        switch (this.state.Arithmetic) {
                            //关于算法二和算法四的特殊处理，等录入了真实的项目积分后进行更改
                            case '算法二': {
                                return select1;
                            }
                            case '算法四': {
                                return select2;
                            }
                            default:
                                return null
                        }
                    }
                )()
                }
                <Form.Item label="当前完成人排名" id={'MyselfRank'} style={{ display:this.state.Arithmetic==='算法一'?'block':'none'}}>
                    {getFieldDecorator('MyselfRank',{
                        initialValue:this.state.Rank
                    })(
                        <InputNumber min={1} max={10} onChange={this.getRank}/>
                    )}
                </Form.Item>
                <Form.Item label="加分" style={{ display:this.state.BonusPoint==='无'?'none':'block'}}>
                    {getFieldDecorator('BonusPoint',{
                        //initialValue:this.state.getBonusPoint,
                        rules:[{
                            required:true
                        }]
                    })(
                            (() => {
                                    switch (this.state.BonusPoint) {
                                        //关于算法二和算法四的特殊处理，等录入了真实的项目积分后进行更改
                                        case 'undefined': {
                                            return (  <Select  style={{ width: 120 }}  onChange={this.changeBonusPoint}>
                                                         <Option key="无" value="无">无</Option>
                                                     </Select>
                                                    );
                                        }
                                        default:
                                            return (
                                                <Select  style={{ width: 120 }}  onChange={this.changeBonusPoint}>
                                                    <Option key="无" value="无">无</Option>
                                                    <Option key={this.state.BonusPoint} value={this.state.BonusPoint}>{this.state.BonusPoint}</Option>
                                                </Select>)
                                    }
                                }
                            )()
                    )}
                </Form.Item>
                <Form.Item label="加分原因" style={{ display:this.state.PlusConditionShow==='显示'?'block':'none'}}>
                    {getFieldDecorator('PlusCondition',{
                        rules:[{
                            required:this.state.PlusConditionShow==='显示'
                        }]
                    })(
                        <Select  style={{ width: 120 }} onChange={this.changePulseCondition}>
                            <Option key='获奖' value="获奖">获奖</Option>
                            <Option key='科技创新' value="科技创新" >科技创新</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="应得积分">
                    {getFieldDecorator('GotPoint')(
                        <p>{this.state.GotPoint}</p>
                    )}
                </Form.Item>
                <Form.Item label="任务描述" id={'TaskDescri'}>
                    {getFieldDecorator('TaskDescri', {
                        rules: [{
                                type: 'string'
                        }]
                    })(
                        <TextArea placeholder="简要描述任务完成情况，不超过300字" autosize={{ minRows: 2, maxRows: 6 }}
                                  style={{height: '50px' , width:'100%',overflow:'hidden'}}
                        />
                    )}
                </Form.Item>
                <Form.Item label="工作难点" id={'TaskDifficult'}>
                    {getFieldDecorator('TaskDifficult', {
                        rules: [{
                            type: 'string'
                        }]
                    })(
                        <TextArea placeholder="简要描述任务工作难点，不超过300字" autosize={{ minRows: 2, maxRows: 6 }}
                                  style={{height: '50px' , width:'100%',overflow:'hidden'}}
                        />
                    )}
                </Form.Item>


                <Form.Item label="下期动态" id={'NextState'}>
                    {getFieldDecorator('NextState', {
                        rules: [{
                            type: 'string'
                        }]
                    })(
                        <TextArea placeholder="简要描述下期动态，不超过300字" autosize={{ minRows: 2, maxRows: 6 }}
                                  style={{height: '50px' , width:'100%',overflow:'hidden'}}
                        />
                    )}
                </Form.Item>
                {/*<Form.Item label='文件提交'>*/}
                    {/*{getFieldDecorator('flie',{*/}
                        {/*rules:[{*/}
                            {/*required:true,*/}
                            {/*message:'请提交相关文件压缩包'*/}
                        {/*}]*/}
                    {/*})(*/}
                        {/*<Upload*/}
                        {/*//    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,"   //上传文件类型--这个是excel类型*/}
                            {/*action = {'http://47.103.14.3/statictics/upload_file.php?username=' +this.state.name}   //上传文件地址*/}
                                {/*fileList = {fileList}   //上传文件列表*/}
                                {/*beforeUpload={this.beforeUpload}   //上传之前触发事件*/}
                                {/*onChange={this.updateChange}   //上传状态改变事件*/}
                                {/*onRemove = {this.removeFile}   //移除文件事件*/}
                                {/*>*/}
                                {/*<div>上传文件</div>*/}
                                {/*</Upload>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                <Form.Item label='文件提交'>
                    {getFieldDecorator('flie',{
                        rules:[{
                            required:false,
                            message:'请提交相关文件压缩包'
                        }]
                    })(
                        <Dragger
                            name={'file'}
                            action = { API.URL+'upload_file.php?username=' +sessionStorage.getItem('Realname')}   //上传文件地址
                            fileList = {fileList}   //上传文件列表
                            beforeUpload={this.beforeUpload}   //上传之前触发事件
                            onChange={this.updateChange}   //上传状态改变事件
                            onRemove = {this.removeFile}   //移除文件事件
                        >
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">点击或拖动文件上传</p>
                            <p className="ant-upload-hint">请提交文件的压缩包</p>
                        </Dragger>
                    )}
                </Form.Item>
                {/*<Form.Item label="审核人"  hasFeedback>*/}
                    {/*{getFieldDecorator('checker', {*/}
                        {/*rules: [{*/}
                            {/*required: true,*/}
                            {/*message:'请选择审核人'*/}
                        {/*},*/}
                        {/*],*/}
                    {/*})(*/}
                        {/*<UploadComponent/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}

                <Form.Item label="审核人"  hasFeedback>
                    {getFieldDecorator('checker', {
                        rules: [{
                                required: true,
                                message:'请选择审核人'
                        },
                        ],
                    })(
                        <Cascader id='checker' onClick={this.getChecker} options={this.state.Option} size={'large'} style={{width:'30%'}}
                                  placeholder={'选择审核人'} showSearch={true}/>
                    )}
                </Form.Item>

                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form.Item>
            </Form>
        );
    }
}

 const Contenttt = Form.create({})(Contentt);
///好神奇啊
export default Contenttt;