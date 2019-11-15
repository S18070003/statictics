import React from 'react';
import './WorkloadView.css';
import { Table, Divider, message, Modal} from 'antd';
import WorkloadDetail from '../isDetail/isDetail.js';
import API from '../../api.js'
import Text from "antd/es/typography/Text";
class Table1 extends React.Component{
    columns = [{
        title: '序号',
        dataIndex: 'id',
        key: 'id'
    },
    //     {
    //     title: '姓名',
    //     dataIndex: 'Name',
    //     key: 'Name',
    // },
        {
        title: '项目名称',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
    }, {
        title: '项目类型',
        dataIndex: 'ProjectType',
        key: 'ProjectType',
    }, {
        title: '加分',
        dataIndex: 'BonusPoint',
        key: 'BonusPoint',
    },{
        title: '加分原因',
        dataIndex: 'PlusCondition',
        key: 'PlusCondition',
    },{
        title: '所得积分',
        key: 'GotPoint',
        dataIndex: 'GotPoint',
    }, {
        title: '文件',
        key: 'FileName',
        dataIndex: 'FileName',
        width:'200px',
        render:(text,record) => (
            <a  href={record.FilePath}>{text==='null'|| text==='undefined'?'':text}</a>
        ),
    },{
        title: '提交时间',
        key: 'submitTime',
        dataIndex: 'submitTime',
    },
        {
            title: '审核人',
            key: 'checker',
            dataIndex: 'checker',
        },
        {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
    },{
        title: '评审意见',
        key: 'reviewComment',
        dataIndex: 'reviewComment',
    },{
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <span>
      {/*<a href="javascript:">Invite {record.Name}</a>;*/}
       <a onClick={this.showModal.bind(this,record.submitTime)}>{record.status==='未审查'?'修改':'查看'}</a>
            <Divider type="vertical" />
      <a onClick={this.deletedata.bind(this,record.submitTime)}>删除</a>
                <Modal
                    title={record.status==='未审查'?'修改':'查看'}
                    visible={this.state.visible}
                    onok={this.handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                    width='50%'
                    footer={null}
                    maskStyle={{backgroundColor:'rgba(0,0,0,.20)'}}
                >
                    <WorkloadDetail/>
                 </Modal>
    </span>
        ),
    }];

    constructor(props){
        super(props);
        this.state={
            tableData:[],  //表格数据
            isDelete:'0',
            detailData:[],
            NowSubmitTime:'',
            AllPassPoint:0,
            AllWaitPoint:0,
        };
    };

    componentDidMount(){
        this.getdata();
    }
    getdata=()=>{
        const require='username='+sessionStorage.getItem('username');
        const  url=API.URL+'WorkloadView/getdata.php';
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: require,
        }).then(response => response.json())
            .then(response => {
                    if(response && response.length>0) {
                        this.handleGetData(response);
                        this.setState({
                            tableData:response,
                        })
                    }
                }
            )
    };
    handleGetData = (data) =>{
        for(let x = 0,le =data.length; x<le;x +=1){
            data[x] = {
                ...data[x],
                key:data[x].id,
                id:x+1,
                ProjectName:data[x].ProjectName,
                ProjectType:data[x].ProjectType,
                GotPoint:data[x].GotPoint,
                submitTime:data[x].submitTime,
                status:data[x].status,
                reviewComment:data[x].reviewComment,
                Department:data[x].Department,
                BonusPoint:data[x].BonusPoint,
                PlusCondition:data[x].PlusCondition='undefined'?'':data[x].PlusCondition
            };
            if(data[x].status==='未审查'){
                let A=parseFloat(data[x].GotPoint);
                let B=parseFloat(this.state.AllWaitPoint);
                this.setState({
                    AllWaitPoint:A+B
                })
            }else {
                let A=parseFloat(data[x].GotPoint);
                let B=parseFloat(this.state.AllWaitPoint);
                this.setState({
                    AllPassPoint:B+A
                })
            }
        }
    };
    showModal=(submitTime)=>{
        sessionStorage.setItem('DetailSubmitTime',submitTime);
        this.setState({
            visible: true,
            NowSubmitTime:submitTime
        })
    };
    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
        window.location.reload(true);//只有这个刷新页面比较好用
    };
    deletedata=(submitTime)=>{
        let data = 'submitTime=' + submitTime;
        const submitsul = API.URL+ 'WorkloadView/delete_workload.php';
        fetch(submitsul, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: data,
        }).then(response => response.json())
            .then(response => {
                    if (response.isDelete === true) {
                        message.success(`工作量删除成功！`);
                        window.location.reload(true);//只有这个刷新页面比较好用
                    }else if(response.isDelete === false){
                        message.success(`工作量删除失败！`);
                        window.location.reload(true);//只有这个刷新页面比较好用
                    }
                }
            )
    };
    render(){
        return (<div>
            <Table columns={this.columns} dataSource={this.state.tableData} bordered rowKey={recode => recode.id} />
            <Text style={{fontSize:15,marginLeft:'15%'}}>获取的总积分为 {this.state.AllPassPoint}，待审核的积分为 {this.state.AllWaitPoint}</Text>
        </div>)
    };
}
export default Table1