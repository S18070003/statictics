import React from 'react';
import { Table, message,Modal,Input,Form,Button,Radio,Icon } from 'antd';
import Highlighter from 'react-highlight-words';
import API from '../../api.js'
import LineWrap from '../LineWrap/LineWrap.js';
import '../WorkloadWaitReview/WorkloadWaitReview.css';
const { TextArea } = Input;
const RadioGroup = Radio.Group;

class Table21 extends React.Component{
    constructor(props){
        super(props);
        this.state={
            tableData:[],  //表格数据
            isDelete:'0' ,
            visible: false,
            confirmLoading: false,
            ModalText:[],
            ReviewResult:'',
            reviewComment:'',
            NowSubmitTime:'',
            searchText:'',
            filteredInfo: null,
            sortedInfo: null,
            checker:sessionStorage.getItem('Realname')
        };
    };
    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };
    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
                             setSelectedKeys, selectedKeys, confirm, clearFilters,
                         }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => { this.searchInput = node; }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    搜索
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    重置
                </Button>
            </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },

        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };
    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    handleSubmitReview = () => {
        const submitsul = API.URL+'WorkloadWaitReview/submitReview.php';
        let data='submitTime='+this.state.NowSubmitTime+'&ReviewResult='+this.state.ReviewResult+'&reviewComment='+this.state.reviewComment;
        fetch(submitsul, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: data,
        })
            .then(response => response.json())
            .then(response => {
                    if (response.isReview===true) {
                        message.success(`评审成功！`);
                        window.location.reload(true);//只有这个刷新页面比较好用
                    }else if(response.isReview===false){
                        message.success(`评审失败！`);
                    }
                })
    };
    ChangeReviewResult = (e) => {
        this.setState({
            ReviewResult: e.target.value,
        });
    };
    changeComment = (e) => {
        this.setState({
            reviewComment: e.target.value,
        });
    };
    //展示评审的内容
    showModal = (submitTime) => {
        this.setState({
            visible: true,
            NowSubmitTime:submitTime
        });
        let data = 'submitTime=' + submitTime;
        const submitsul =API.URL+'WorkloadWaitReview/getReviewdata.php';
        fetch(submitsul, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: data,
        }).then(response => response.json())
            .then(response => {
                    if (response && response.length>0) {
                        this.handleGetReviewData(response);
                        this.setState({
                            ModalText:response
                        })
                    }
                }
            )
    };
    handleGetReviewData = (data) =>{
        for(let x = 0,le =data.length; x<le;x +=1){
            data[x] = {
                ...data[x],
                key:data[x].id,
                id:x+1,
                ProjectName:data[x].ProjectName,
                ProjectType:data[x].ProjectType,
                GotPoint:data[x].GotPoint,
                submitTime:data[x].submitTime,
                TaskDescri:data[x].TaskDescri,
                status:data[x].status,
            }
        }
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
    };
    componentDidMount(){
        this.getdata();
    }
    getdata=()=>{
        const  url=API.URL+'WorkloadWaitReview/getWaitReview.php';
        const data='checker='+this.state.checker;
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body:data,
        }).then(response => response.json())
            .then(response => {
                    if(response && response.length>0) {
                        this.handleGetData(response);
                        this.setState({
                            tableData:response,
                        })
                    }else {
                        this.setState({
                            tableData:[],
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
                TaskDescri:data[x].TaskDescri,
                FileName:data[x].FileName,
                FilePath:data[x].FilePath,
                submitTime:data[x].submitTime,
                status:data[x].status,

                Department:data[x].Department,
                BonusPoint:data[x].BonusPoint,
                PlusCondition:data[x].PlusCondition='undefined'?'':data[x].PlusCondition
            }
        }
    };
    deletedata=(submitTime)=>{
        let data = 'submitTime=' + submitTime;
        const submitsul =API.URL+ 'WorkloadWaitReview/delete_workload.php';
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
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [{
            title: '序号',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '姓名',
            dataIndex: 'Name',
            key: 'Name',
            ...this.getColumnSearchProps('Name'),
            sorter: (a, b) => a.Name.length - b.Name.length,
            sortOrder: sortedInfo.columnKey === 'Name' && sortedInfo.order,
        }, {
            title: '部门',
            dataIndex: 'Department',
            key: 'Department',
            ...this.getColumnSearchProps('Department'),
            sorter: (a, b) => a.Name.length - b.Name.length,
            sortOrder: sortedInfo.columnKey === 'Department' && sortedInfo.order,
        },{
            title: '项目名称',
            dataIndex: 'ProjectName',
            key: 'ProjectName',
        }, {
            title: '项目类型',
            dataIndex: 'ProjectType',
            key: 'ProjectType',
            ...this.getColumnSearchProps('ProjectType'),
        },  {
            title: '加分',
            key: 'BonusPoint',
            dataIndex: 'BonusPoint',
        }, {
            title: '加分原因',
            key: 'PlusCondition',
            dataIndex: 'PlusCondition',
        },{
            title: '所得积分',
            key: 'GotPoint',
            dataIndex: 'GotPoint',
        }, {
            title: '任务描述',
            key: 'TaskDescri',
            className:'td-hover',
            dataIndex: 'TaskDescri',
            render: (text,record) =>(
                <LineWrap title={text} lineClampNum={2} />
            )
        },{
            title: '文件',
            key: 'FileName',
            dataIndex: 'FileName',
            render: (text,record) =>(
                <a href={record.FilePath}>{text==='null'|| text==='undefined'?'':text}</a>
            )
        },{
            title: '提交时间',
            key: 'submitTime',
            dataIndex: 'submitTime',
        },{
            title: '审查状态',
            key: 'status',
            dataIndex: 'status',
            filters: [{
                text: '未审查',
                value: '未审查',
            }, {
                text: '通过',
                value: '通过',
            }],
            filteredValue: filteredInfo.status,
            onFilter: (value, record) => record.status.indexOf(value) === 0,
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
      {/*<a href="javascript:">Invite {record.Name}</a>;*/}
                    <a onClick={this.showModal.bind(this,record.submitTime)}>{record.status==='未审查'?'评审':'评审结果'}</a>
                    {/*<Divider type="vertical" />*/}
                    {/*<a onClick={this.deletedata.bind(this,record.submitTime)}>查看</a>*/}
                    <Modal
                        title="评审"
                        visible={this.state.visible}
                        onok={this.handleOk}
                        confirmLoading={this.state.confirmLoading}
                        onCancel={this.handleCancel}
                        footer={null}
                        header={null}
                        maskStyle={{backgroundColor:'rgba(0,0,0,.20)'}}
                    >
           <Form>
               <Form.Item label="评审结果" id={'ReviewResult'}>
                   <RadioGroup title='评审结果' onChange={this.ChangeReviewResult} value={this.state.ReviewResult}>
                       <Radio.Button value={'通过'}>通过</Radio.Button>
                        <Radio.Button value={'不通过'}>不通过</Radio.Button>
                    </RadioGroup>
               </Form.Item>
                 <Form.Item label="评审意见" id={'comment'}>
                        <TextArea placeholder="简要描述任务完成情况，不超过300字" autosize={{ minRows: 2, maxRows: 6 }} maxLength={'300'}
                                  style={{height: '50px' , width:'100%',overflow:'hidden'}} onChange={this.changeComment}
                        />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 6 }} style={{marginLeft:'20%' }}>
                    <Button type="primary" htmlType="submit" onClick={this.handleSubmitReview}>{record.status==='未审查'?'提交评审':'修改评审'}</Button>
                </Form.Item>
           </Form>
        </Modal>
    </span>
            ),
        }];
        return (
            <Table columns={columns} size={"middle"} dataSource={this.state.tableData} rowKey={recode => recode.id} bordered onChange={this.handleChange}/>
        )
    };
}
export default Table21