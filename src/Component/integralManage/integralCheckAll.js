import React from 'react';
import {Table,  message,  Input, Button, Icon} from 'antd';
import Highlighter from 'react-highlight-words';
import API from '../../api.js'
class IntegralCheckAll extends React.Component{
    deleteIntegral(IntegralName){
        const  url=API.URL+'IntegralManage/deleteIntegral.php?IntegralName='+IntegralName;
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
    constructor(props){
        super(props);
        this.state={
            tableData:[],  //表格数据
            filteredInfo: null,
            sortedInfo: null,
        };
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
    componentDidMount(){
        this.getdata();
    };
    getdata=()=>{
        const  url=API.URL+'IntegralManage/checkAllIntegral.php';
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
                Unit:data[x].Unit==='undefined'?'':data[x].Unit,
                BonusPoint:data[x].BonusPoint==='undefined'?'':data[x].BonusPoint,
                PlusCondition:data[x].PlusCondition==='undefined'?'':data[x].PlusCondition,
            }
        }
    };
    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };
    render(){
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const  columns = [{
            title: '序号',
            dataIndex: 'id',
            key: 'id'
        },{
            title: '积分项名称',
            dataIndex: 'IntegralName',
            key: 'IntegralName',
            ...this.getColumnSearchProps('IntegralName'),
            sorter: (a, b) => a.IntegralName - b.IntegralName,
            sortOrder: sortedInfo.columnKey === 'IntegralName' && sortedInfo.order,
        },{
            title: '分值',
            dataIndex: 'Point',
            key: 'Point',
        }, {
            title: '类型',
            dataIndex: 'Type',
            key: 'Type',
            filters: [{
                text: '类型一',
                value: '类型一',
            }, {
                text: '类型二',
                value: '类型二',
            }],
            filteredValue: filteredInfo.Type || null,
            onFilter: (value, record) => record.Type.indexOf(value) === 0,
            render:(text,record)=>(
                ( ()=>{
                        switch(text){
                            case "类型一":return '类型一（总分固定）';
                            case "类型二":return '类型二（总分不定）';
                            default:return null;
                        }
                    }
                )()
            )
        },  {
            title: '算法',
            dataIndex: 'Arithmetic',
            key: 'Arithmetic',
            render:(text,record)=>(
                ( ()=>{
                        switch(text){
                            case "算法一":return '算法一(总分批分)';
                            case "算法二":return '算法二（按角色得分）';
                            case "算法三":return '算法三（总价/人数/角色）';
                            case "算法四":return '算法四（时间天数/角色-积分周期10天）';
                            case "算法五":return '算法五（时间天数/角色-积分周期1天）';
                            default:return null;
                        }
                    }
                )()
            )
        },{
            title: '单位',
            dataIndex: 'Unit',
            key: 'Unit',
        },{
            title: '加分',
            dataIndex: 'BonusPoint',
            key: 'BonusPoint',
        },{
            title: '加分条件',
            dataIndex: 'PlusCondition',
            key: 'PlusCondition',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
      {/*<a href="javascript:">Invite {record.Name}</a>;*/}
                    {/*<a onClick={this.alteruser.bind(this,record.Username)}>修改</a>*/}
                    {/*<Divider type="vertical" />*/}
                    <a onClick={this.deleteIntegral.bind(this,record.IntegralName)}>删除</a>
         </span>
            ),
        }];
        return (
            <Table columns={columns} dataSource={this.state.tableData} rowKey={recode => recode.id}  onChange={this.handleChange}/>
        )
    };
}
export default IntegralCheckAll