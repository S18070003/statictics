import React from 'react';
import {Table, Divider, message, Modal, Input, Button, Icon} from 'antd';
import WorkloadDetail from "../isDetail/isDetail.js";
import Highlighter from 'react-highlight-words';
import API from '../../api.js'
class Table3 extends React.Component{
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

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };
    constructor(props){
        super(props);
        this.state={
            tableData:[],  //表格数据
            isDelete:'0',
            filteredInfo: null,
            sortedInfo: null,
        };
    };
    componentDidMount(){
        this.getdata();
    }
    deletedata=(submitTime)=>{
        let data = 'submitTime=' + submitTime;
        const submitsul =API.URL+ 'WorkloadManage/delete_workload.php';
        fetch(submitsul, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: data,
        }).then(response => response.json())
            .then(
                response => {
                    if (response.isDelete === true) {
                        message.success(`工作量删除成功！`);
                        window.location.reload(true);//只有这个刷新页面比较好用
                    }else if(response.isDelete === false){
                        message.success(`工作量删除失败！`);
                        window.location.reload(true);//只有这个刷新页面比较好用
                    }
                }
            )
    }

    getdata=()=>{
        const  url=API.URL+'WorkloadManage/getAllWorkload.php';
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then(response => response.json())
            .then(
                response => {
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
                Department:data[x].Department,
                BonusPoint:data[x].BonusPoint,
                PlusCondition:data[x].PlusCondition='undefined'?'':data[x].PlusCondition
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
    };
    render(){
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [{
            title: '序号',
            dataIndex: 'id',
            key: 'id'
        },{
            title: '姓名',
            dataIndex: 'Name',
            key: 'Name',
            ...this.getColumnSearchProps('Name'),
            sorter: (a, b) => a.Name.length - b.Name.length,
            sortOrder: sortedInfo.columnKey === 'Name' && sortedInfo.order,
        },{
            title: '部门',
            dataIndex: 'Department',
            key: 'Department',
            ...this.getColumnSearchProps('Department'),
            sorter: (a, b) => a.Department.length - b.Department.length,
            sortOrder: sortedInfo.columnKey === 'Department' && sortedInfo.order,
        }, {
            title: '项目名称',
            dataIndex: 'ProjectName',
            key: 'ProjectName',
            ...this.getColumnSearchProps('ProjectName'),
            sorter: (a, b) => a.ProjectName.length - b.ProjectName.length,
            sortOrder: sortedInfo.columnKey === 'ProjectName' && sortedInfo.order,
        }, {
            title: '项目类型',
            dataIndex: 'ProjectType',
            key: 'ProjectType',
            ...this.getColumnSearchProps('ProjectType'),
            sorter: (a, b) => a.ProjectType.length - b.ProjectType.length,
            sortOrder: sortedInfo.columnKey === 'ProjectType' && sortedInfo.order,
        }, {
            title: '加分',
            dataIndex: 'BonusPoint',
            key: 'BonusPoint',
        }, {
            title: '加分条件',
            dataIndex: 'PlusCondition',
            key: 'PlusCondition',
        }, {
            title: '所得积分',
            key: 'GotPoint',
            dataIndex: 'GotPoint',
        }, {
            title: '提交时间',
            key: 'submitTime',
            dataIndex: 'submitTime',
        }, {
            title: '状态',
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
        },{
            title: '评审意见',
            key: 'reviewComment',
            dataIndex: 'reviewComment',
        },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={this.showModal.bind(this,record.submitTime)}>{record.status==='未审查'?'修改':'查看'}</a>
                    <Divider type="vertical" />
                     <a onClick={this.deletedata.bind(this,record.submitTime)}>删除</a>
                    <Modal
                                        title="评审"
                                        visible={this.state.visible}
                                        onok={this.handleOk}
                                        confirmLoading={this.state.confirmLoading}
                                        onCancel={this.handleCancel}
                                        width='50%'
                                        footer={null}
                                        maskStyle={{backgroundColor:'rgba(0,0,0,.20)'}}
                    >
                                 <WorkloadDetail />
                    </Modal>
    </span>
            ),
        }];

        return (
            <Table columns={columns} dataSource={this.state.tableData} rowKey={recode => recode.id} onChange={this.handleChange}/>
        )
    };
}
export default Table3

