import React from 'react';
import './isDetail.css';
import {
    Form, Select, InputNumber,
    Button, Upload, Icon,
    DatePicker, Input, message
} from 'antd';
import moment from 'moment';
import API from '../../api.js';
const { TextArea } = Input;
const { Option } = Select;
const {  RangePicker } = DatePicker;

class Detail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            StartDate:'',
            EndDate:'',
            DetailStartDate:'',
            DetailEndDate:'',
            mode: ['date', 'date'],
            value: [],
            name:sessionStorage.getItem('username'),
            FileName:sessionStorage.getItem('File'),
            tempdeleteFile:sessionStorage.getItem('File')!=='null'?'显示':'隐藏',
            TypeData:[],
            PlusConditionShow:'隐藏',
            getBonusPoint:0
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
        this.setState({
            DetailStartDate:value[0],//存时间
            DetailEndDate:value[1],
        });
        // console.log('改变后时间');
        //         // console.log(moment(value[0]).format('YYYY-MM-DD'));
        //         // console.log(moment(value[1]).format('YYYY-MM-DD'));
    }

    handleUpdate = (e) => {
        e.preventDefault();
        const submitsul = API.URL+'WorkloadDetail/updateWorkload.php';
        this.props.form.validateFields((err, values) => {
            let StartDate=moment(this.state.DetailStartDate).format('YYYY-MM-DD');
            let EndDate=moment(this.state.DetailEndDate).format('YYYY-MM-DD');
            let rooturl=API.URL;
            let FilePath=rooturl+this.state.uploadPath;
            let data='ProjectName='+values.ProjectName+'&StartDate='+StartDate+'&EndDate='+EndDate+'&ProjectType='+values.ProjectType
                +'&TotalPoint='+values.TotalPoint+'&TotalPeople='+values.TotalPeople+'&MyselfRank='+values.MyselfRank+ '&GotPoint='+this.state.GotPoint
                +'&TaskDescri='+values.TaskDescri+'&FilePath='+FilePath+'&FileName='+sessionStorage.getItem('File')+'&checker='
                +values.checker+'&Role='+values.Role+'&TotalMoney='+values.TotalMoney+'&TotalDay='+values.TotalDay+'&submitTime='+this.state.submitTime
                +'&BonusPoint='+values.BonusPoint+'&PlusCondition='+values.PlusCondition+'&TaskDifficult='+values.TaskDifficult+'&NextState='+values.NextState;
             // console.log(data);
            if (!err) {
                fetch(submitsul, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: data,
                }).then(response => response.json())
                    .then(response => {
                        // console.log(response)
                            if (response.isupdate===true) {
                                message.success(`工作量更新成功！`);
                                window.location.reload(true);//只有这个刷新页面比较好用
                            }else if(response.isupdate===false){
                                console.log("2323232323------错了～");
                            }
                        })
            }
        });
    };

    componentDidMount(){
        let SubmitTime = sessionStorage.getItem('DetailSubmitTime');
        this.getDetail(SubmitTime);
        this.getType();
        this.getChecker();
    }
    getDetail=(SubmitTime)=>{
        let data = 'submitTime=' + SubmitTime;
        const submitsul =API.URL+ 'WorkloadDetail/getSelfWorkloadDetail.php';
        fetch(submitsul, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: data,
        }).then(response => response.json())
            .then(
                response => {
                    if (response && response.length>0) {
                        this.handleGetDetailData(response);
                    }
                }
            )
    };

    handleGetDetailData=(data)=>{
        if(data[0].TotalPoint==='undefined'){
                data[0].TotalPoint=''
        }
        if(data[0].TotalPeople==='undefined'){
            data[0].TotalPeople=''
        }
        if(data[0].Rank==='undefined'){
            data[0].Rank=''
        }
        if(data[0].TotalMoney==='undefined'){
            data[0].TotalMoney=''
        }
        if(data[0].TotalDay==='undefined'){
            data[0].TotalDay=''
        }
        this.setState({
                Name:data[0].Name,
                ProjectName:data[0].ProjectName,
                DetailStartDate:moment(data[0].StartDate),
                DetailEndDate:moment(data[0].EndDate),
                ProjectType:data[0].ProjectType,

                TotalPeople:data[0].TotalPeople,
                Rank:data[0].MyselfRank,
                GotPoint:data[0].GotPoint,
                TaskDescri:data[0].TaskDescri,
                FileName:data[0].FileName,
                FilePath:data[0].FilePath,
                status:data[0].status,
                submitTime:data[0].submitTime,

                TaskDifficult:data[0].TaskDifficult,
                 NextState:data[0].NextState,
            
                Role:data[0].Role,
                TotalDay:data[0].TotalDay,
                TotalMoney:data[0].TotalMoney,
                checker:data[0].checker,

                 Department:data[0].Department,
                getBonusPoint:data[0].BonusPoint,
                BonusPoint:data[0].BonusPoint,
                PlusCondition:data[0].PlusCondition,
            },()=>{
                this.iniChangeType(this.state.ProjectType);
                if(this.state.getBonusPoint!=='无'){
                    this.setState({
                        PlusConditionShow:'显示'
                    })
                  }
            }
        );
    };

    getChecker=()=>{
        let url=API.URL+'WorkloadDetail/getchecker.php';
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then(response => response.json())
            .then(
                response => {
                    if (response && response.length>0) {
                        let options = response.map((item)=>{
                            return (
                                <Option key={item.value} value = {item.value}>
                                    {item.value}
                                </Option>
                            )
                        });
                        this.setState({
                            CheckerData:options,
                        })
                    }else {
                        console.log("2323232323------错了～");
                    }
                })
    };
    iniChangeType=(value)=>{
        let data='IntegralName='+value;
        let url=API.URL+'WorkloadDetail/getTotalPoint.php';
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
                        });
                    }else {
                        console.log("2323232323------错了～");
                    }
                });
    };
    onChangeType=(value)=>{
        this.setState({
            TemPoint:'',
            TotalPeople:'',
            Role:'',
            Rank:'',
            TotalMoney:'',
            TotalDay:'',
            getBonusPoint:0,
            PlusConditionShow:'隐藏',
            GotPoint:''
        }, () => {
            let data='IntegralName='+value;
            let url=API.URL+'WorkloadDetail/getTotalPoint.php';
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
                            });
                        }else {
                            console.log("2323232323------错了～");
                        }
                    });
        })
    };
    getType=()=>{
        let url=API.URL+'WorkloadDetail/getType.php';
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then(response => response.json())
            .then(
                response => {
                    if (response && response.length>0) {
                       let options = response.map((item)=>{
                            return (
                                <Option key={item.value} value = {item.value}>
                                    {item.value}
                                </Option>
                            )
                        });
                        this.setState({
                            TypeData:options,
                        })
                    }else {
                        console.log("2323232323------错了～");
                    }
                })
    };
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
    deleteFile=()=>{
        this.setState({
            tempdeleteFile:'隐藏',
            FileName:'null'
        })
    };

    beforeUpload = (file) => {
        let fileArr = [];
//获取新的上传列表
        fileArr.push(file);
//进行赋值保存
        this.setState(preState => ({
            fileList:fileArr,
            uploadPath:''
        }))
    };
    // 文件上传改变事件
    updateChange = (info) => {
        if (info.file.status === 'done') {
//上传成功后将后台返回来的文件地址进行获取--info.file.response
            if (info.file.response) {
                this.setState(preState => ({
                        uploadPath : info.file.response,
                        tempdeleteFile:'隐藏',
                        fileName:info.fileList[0].name
                    })
                )
            }
            this.setState( {
                    fileName:info.fileList[0].name
                });
            // console.log(info.fileList[0].name);
            // console.log(this.state.FileName);
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
                FileName:'null',
                tempdeleteFile:'隐藏'
            })
        )
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const props = {
            name: 'file',
            multiple: true,
            action:  API.URL+'upload_file.php?username=' +this.state.name,
            // {/*文件上传接口和需要的传参*/}
            onChange(info) {
                const status = info.file.status;
                if (status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                    sessionStorage.setItem('File',info.file.name);
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                    sessionStorage.setItem('File',info.file.name);
                }
            }
        };
        const select1=(
            <Form.Item label="角色" id={'Role'}>
                {getFieldDecorator('Role',{
                    initialValue:this.state.Role
                })(
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
            <Form.Item label="角色" id={'Role'} >
                {getFieldDecorator('Role',{
                    initialValue:this.state.Role
                })(
                    <Select  style={{ width: 120 }} onChange={this.changeRole}>
                        <Option value="负责人">负责人</Option>
                        <Option value="其他人" >其他人</Option>
                    </Select>
                )}
            </Form.Item>
        );
        const {fileList} = this.state;
        return (
            <Form {...formItemLayout} onSubmit={this.handleUpdate}>
                <Form.Item label={'项目名称'}>
                    {getFieldDecorator('ProjectName', {
                        initialValue:this.state.ProjectName,
                        rules: [{
                                type: 'string'
                            }]
                    })(
                        <Input placeholder="请输入项目名称" allowClear
                               style={{height: '25px' , width:'25%'}}
                        />
                    )}
                </Form.Item>

                <Form.Item label="起止日期" >
                    <RangePicker
                         placeholder={['开始时间', '结束时间']}
                        value={[this.state.DetailStartDate,this.state.DetailEndDate]}
                        mode={this.state.mode}
                        onChange={this.handleChange}
                        onPanelChange={this.handlePanelChange}
                    />
                </Form.Item>

                <Form.Item label="项目类型"  hasFeedback>
                    {getFieldDecorator('ProjectType',{
                     initialValue:this.state.ProjectType,
                    })(
                        <Select id='checker'   size={'large'} style={{width:'30%'}}
                                  onChange={this.onChangeType} placeholder={'选择项目类型'}
                                  showSearch={true}>
                            {this.state.TypeData}
                        </Select>
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
                        initialValue:this.state.TotalMoney
                    })(
                        <InputNumber min={1} max={10} onChange={this.changeTotalMoney}/>
                    )}
                    <span>万元</span>
                </Form.Item>
                <Form.Item label="参与总人数" style={{ display:this.state.Arithmetic==='算法一'?'block':(this.state.Arithmetic==='算法三'?'block':'none')}}>
                    {getFieldDecorator('TotalPeople',{
                        initialValue:this.state.TotalPeople
                    })(
                        <InputNumber min={1} max={10} onChange={this.getTotalPeople}
                        />
                    )}{
                    <span className="ant-form-text"> 人</span>
                }
                </Form.Item>

                <Form.Item label="当前完成人排名" id={'MyselfRank'} style={{ display:this.state.Arithmetic==='算法一'?'block':'none'}}>
                    {getFieldDecorator('MyselfRank',{
                        initialValue:this.state.Rank
                    })(
                        <InputNumber min={1} max={10} onChange={this.getRank}/>
                    )}
                </Form.Item>
                <Form.Item label="总天数" id={'TotalDay'}  style={{ display:this.state.Arithmetic==='算法四'?'block':(this.state.Arithmetic==='算法五'?'block':'none')}} >
                    {getFieldDecorator('TotalDay',{
                        initialValue:this.state.TotalDay
                    })(
                        <InputNumber min={1} max={10}  onChange={this.getDay}/>
                    )}
                    <span> 天</span>
                </Form.Item>

                {(() => {
                        switch (this.state.Arithmetic) {
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
                <Form.Item label="加分" style={{ display:this.state.getBonusPoint==='无'?'none':'block'}}>
                    {getFieldDecorator('BonusPoint',{
                        initialValue:this.state.getBonusPoint,
                        rules:[{
                            required:true
                        }]
                    })(
                        <Select  style={{ width: 120 }}  onChange={this.changeBonusPoint}>
                            <Option key="无" value="无">无</Option>
                            <Option key={this.state.BonusPoint} value={this.state.BonusPoint} >{this.state.BonusPoint}</Option>
                        </Select>
                    )}
                </Form.Item>

                <Form.Item label="加分原因" style={{ display:this.state.PlusConditionShow==='显示'?'block':'none'}}>
                    {getFieldDecorator('PlusCondition',{
                        initialValue: this.state.PlusCondition,
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
                    {getFieldDecorator('GotPoint',{
                        initialValue:this.state.GotPoint
                    })(
                        <p>{this.state.GotPoint}</p>
                    )}
                </Form.Item>
                <Form.Item label="任务描述" id={'TaskDescri'}>
                    {getFieldDecorator('TaskDescri', {
                        initialValue: this.state.TaskDescri,
                        rules: [
                            {
                                type: 'string'
                            }
                        ]
                    })(
                        <TextArea placeholder="简要描述任务完成情况，不超过300字" autosize={{ minRows: 2, maxRows: 6 }} maxLength={'300'}
                                  style={{height: '50px' , width:'100%',overflow:'hidden'}}
                        >{this.state.TaskDescri}</TextArea>
                    )}
                </Form.Item>

                <Form.Item label="工作难点" id={'TaskDifficult'}>
                   {getFieldDecorator('TaskDifficult', {
                       initialValue:this.state.TaskDifficult,
                        rules: [{
                            type: 'string'
                        }]
                     })(
                           <TextArea placeholder="简要描述任务工作难点，不超过300字" autosize={{ minRows: 2, maxRows: 6 }}
                                          style={{height: '50px' , width:'100%',overflow:'hidden'}}
                                       />
                    )}
                </Form.Item>
                <Form.Item label='下期动态'>
                    {getFieldDecorator('NextState', {
                        initialValue:this.state.NextState,
                        rules: [{
                               type: 'string'
                        }]
                    })(
                              <TextArea placeholder="简要描述下期动态，不超过300字" autosize={{ minRows: 2, maxRows: 6 }}
                                            style={{height: '50px' , width:'100%',overflow:'hidden'}}
                                 />
                    )}
                </Form.Item>
                <Form.Item label='文件提交'>
                        <a href={this.state.FilePath} style={{display:this.state.FileName!=='null'&&this.state.FileName!=='undefined'?'block':'none'}}>{this.state.FileName}</a>
                    {  this.state.status==='未审查'? <Button onClick={this.deleteFile}
                                                 style={{left:15,display:this.state.FileName!=='null'&&this.state.FileName!=='undefined'?'block':'none'}}>
                        删除文件
                    </Button>:''}
                    {this.state.status==='未审查'?<Upload style={{display:this.state.FileName==='null'||this.state.FileName==='undefined'?'block':'none'}}
                             name={'file'}
                             action = {API.URL+'upload_file.php?username=' +sessionStorage.getItem('Realname')}   //上传文件地址
                             fileList = {fileList}   //上传文件列表
                             beforeUpload={this.beforeUpload}   //上传之前触发事件
                             onChange={this.updateChange}   //上传状态改变事件
                             onRemove = {this.removeFile}   //移除文件事件
                    >
                        <Button >
                            <Icon type="upload" /> Click to Upload
                        </Button>
                    </Upload>:''}
                </Form.Item>
                <Form.Item label="审核人"  hasFeedback>
                    {getFieldDecorator('checker',{
                        initialValue:this.state.checker,
                    })(
                        <Select id='checker'   size={'large'} style={{width:'30%'}}
                                 placeholder={'选择项目类型'}
                                showSearch={true}>
                            {this.state.CheckerData}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Button type="primary" htmlType="submit" style={{display:this.state.status==='未审查'?'block':'none'}}>修改</Button>
                </Form.Item>
            </Form>
        );
    };
}

const WorkloadDetail = Form.create({})(Detail);
///好神奇啊
export default WorkloadDetail;