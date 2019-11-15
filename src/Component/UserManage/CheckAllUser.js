import React from 'react';
import {Table, Divider, message, Select, Input, Button, Icon, Modal} from 'antd';
import Highlighter from 'react-highlight-words';
import API from '../../api.js'
import AlterUser from "./AlterUser";
const { Option } = Select;
class Table4 extends React.Component{
    constructor(props){
        super(props);
        this.state={
            tableData:[],  //表格数据
            NewIdentity:'',
            filteredInfo: null,
            sortedInfo: null,
            visible: false,
            confirmLoading: false,
            record:''
        };
    };
    componentDidMount(){
        this.getdata();
    }

    getIdentity=(e)=>{
        this.setState({
            NewIdentity:e
        })
    };
    alteruser=(Username)=>{
        const Identity=this.state.NewIdentity;
        const  url1=API.URL+'UserManage/alteruser.php?Username='+Username+'&Identity='+Identity;
        fetch(url1, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then(response => response.json())
            .then(data => {
                    if(data.isAlter===true) {
                        message.success(` 权限更改成功.`);
                        window.location.reload(true);//只有这个刷新页面比较好用
                    }else if(data.isAlter===false){
                        message.error(` 权限更改失败.`);
                        window.location.reload(true);//只有这个刷新页面比较好用
                    }
                }
            )
    };

    deleteuser(Username){
        const  url=API.URL+'UserManage/deleteUser.php?Username='+Username;
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then(response => response.json())
            .then(
                response => {
                    if(response.isDelete===true) {
                        message.success(` 删除成功.`);
                        window.location.reload(true);//只有这个刷新页面比较好用
                    }else if(response.isDelete===false){
                        message.error(` 删除失败.`);
                        window.location.reload(true);//只有这个刷新页面比较好用
                    }
                }
            )
    }

    getdata=()=>{
        const  url=API.URL+'UserManage/checkAllUser.php';
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
                id:x+1,
                Username:data[x].Username,
                Password:data[x].Password,
                Identity:data[x].Identity,
                Department:data[x].FirstDep+(data[x].SecondDep==null || data[x].SecondDep==='undefined'?'':'/'+data[x].SecondDep)+
                    (data[x].ThirdDep==null || data[x].ThirdDep==='undefined'?'':'/'+data[x].ThirdDep)+(data[x].ForthDep==null || data[x].ForthDep==='undefined'?'':'/'+data[x].ForthDep),
                Realname:data[x].Realname,
            }
        }
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
    showModal=(e)=>{
        this.setState({
            visible: true,
            record:e
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
            dataIndex: 'Realname',
            key: 'Realname',
            ...this.getColumnSearchProps('Realname'),
            sorter: (a, b) => a.Realname - b.Realname,
            sortOrder: sortedInfo.columnKey === 'Realname' && sortedInfo.order,
        },{
            title: '用户名',
            dataIndex: 'Username',
            key: 'Username',
            render: text => <p>{text}</p>,
        },
        //     {
        //     title: '密码',
        //     dataIndex: 'Password',
        //     key: 'Password',
        // },
            {
            title: '部门',
            dataIndex: 'Department',
            key: 'Department',
            filters: [{
                text: '财务部门',
                value: '财务部门',
            }, {
                text: '后勤部门',
                value: '后勤部门',
            }, {
                text: '管理部门',
                value: '管理部门',
            }],
            filteredValue: filteredInfo.Department || null,
            onFilter: (value, record) => record.Department.indexOf(value) === 0,
            sorter: (a, b) => a.Department.length - b.Department.length,
            sortOrder: sortedInfo.columnKey === 'Department' && sortedInfo.order,
        },{
            title: '身份',
            dataIndex: 'Identity',
            key: 'Identity',
            filters: [{
                text: '管理员',
                value: '管理员',
            }, {
                text: '审查员',
                value: '审查员',
            }, {
                text: '用户',
                value: '用户',
            }],
            filteredValue: filteredInfo.Identity || null,
            onFilter: (value, record) => record.Identity.indexOf(value) === 0,
            // render: (text, record) =>(
            //     <Select placeholder="请选择项目类型"  defaultValue={record.Identity} onChange={this.getIdentity.bind()}>
            //         <Option value="用户">用户</Option>
            //         <Option value="审查员">审查员</Option>
            //         <Option value="管理员">管理员</Option>
            //     </Select>
            // ),
        },{
            title: '用户类型',
            dataIndex: 'Usertype',
            key: 'Usertype',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
            {/*<a  onClick={this.alteruser.bind(this,record.Username)}>修改</a>*/}
            <a  onClick={this.showModal.bind(this,record)}>修改</a>
                <Divider type="vertical" />
                <a onClick={this.deleteuser.bind(this,record.Username)}>删除</a>
                     <Modal
                         title={'修改'}
                         visible={this.state.visible}
                         // onok={this.handleOk}
                         confirmLoading={this.state.confirmLoading}
                         onCancel={this.handleCancel}
                         // width='50%'
                         footer={null}
                         maskStyle={{backgroundColor:'rgba(0,0,0,.1)'}}
                     >
                  <AlterUser id={this.state.record} username={record.Username}/>
            </Modal>
         </span>

            ),
        }];
        return (
            <Table columns={columns} dataSource={this.state.tableData} rowKey={recode => recode.id} onChange={this.handleChange}/>

        )
    };
}
export default Table4