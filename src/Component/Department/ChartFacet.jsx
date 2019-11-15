import React, { Component } from 'react';
import { Chart, Tooltip, Facet, Legend, Coord } from 'bizcharts';
import { DataView } from '@antv/data-set';
import {Button, Divider, Icon, Input, message, Select, Table} from "antd";
import Highlighter from 'react-highlight-words';
import API from '../../api.js'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/tree';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
const { Option } = Select;
export default class CustomChart extends Component {
    static displayName = 'CustomChart';
    static propTypes = {};
    static defaultProps = {};
    constructor(props) {
        super(props);
        this.state = {
            tableData:[],
            Data:[],
            filteredInfo: null,
            sortedInfo: null,
        };
    }
    componentDidMount() {
        this.getdata();
    }
    // componentDidUpdate(){
    //     this.createCharts();
    // }
    // createCharts() {
    //     const myBar = echarts.init(document.getElementById('generalSituationMain'));
    //     // 绘制图表
    //     myBar.hideLoading();
    //     myBar.setOption({
    //         tooltip: {
    //             trigger: 'item',
    //             triggerOn: 'mousemove'
    //         },
    //         series:[
    //             {
    //                 type: 'tree',
    //                 data: this.state.Data2,
    //                 left: '2%',
    //                 right: '2%',
    //                 top: '8%',
    //                 bottom: '20%',
    //                 symbol: 'emptyCircle',
    //                 orient: 'vertical',
    //                 expandAndCollapse: true,
    //                 label: {
    //                     normal: {
    //                         position: 'top',
    //                         rotate: -90,
    //                         verticalAlign: 'middle',
    //                         align: 'right',
    //                         fontSize: 9
    //                     }
    //                 },
    //                 leaves: {
    //                     label: {
    //                         normal: {
    //                             position: 'bottom',
    //                             rotate: -90,
    //                             verticalAlign: 'middle',
    //                             align: 'left'
    //                         }
    //                     }
    //                 },
    //                 animationDurationUpdate: 750
    //             }
    //         ]
    //     });
    //     window.onresize = function () {
    //         myBar.resize();
    //     }
    // }

    getdata(){
        const  url= API.URL+'DepartmentManage/checkAllDepartment.php';
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then(response => response.json())
            .then(response => {
                    if(response && response.length>0) {
                        const data1=[];
                        // this.handleGetData1(response,data1);
                        this.handleGetData(response);
                        this.setState({
                            Data:response
                        })
                        // this.setState({
                        //     Data2:response
                        // })
                    }
                }
            )
    }
    handleGetData = (data) =>{
        for(let x = 0,le =data.length; x<le;x +=1){
            data[x] = {
                ...data[x],
                id:x+1,
                FirstLevel:data[x].FirstLevel,
                SecondLevel:data[x].SecondLevel,
                ThirdLevel:data[x].ThirdLevel,
                ForthLevel:data[x].ForthLevel,
                DepartmentIntroduction:data[x].DepartmentIntroduction,
                gender: '男',
                count: 40,
            }
        }
    };
    handleGetData1 = (data,data1) =>{
        for(let x = 0,le =data.length; x<le;x +=1){
            data1[x].id=x+1;
            data1[x]['FirstLevel']=data[x]['FirstLevel'];
            if(data[x]['SecondLevel']!=='undefined'){
                data1[x]['SecondLevel']=data[x]['SecondLevel'];
            }
            if(data[x]['ThirdLevel']!=='undefined'){
                data1[x]['ThirdLevel']=data[x]['ThirdLevel'];
            }
            if(data[x]['ForthLevel']!=='undefined'){
                data1[x]['ForthLevel']=data[x]['ForthLevel'];
            }
            data1[x]['DepartmentIntroduction']=data[x]['DepartmentIntroduction'];
            data1[x]['gender']='男';
            data1[x]['count']=40;
        }
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
    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };
    deleteDepartment=(First,Second,Third,Forth)=>{
        const  url= API.URL+'DepartmentManage/deleteDepartment.php';
        const formData = new FormData();
        formData.append('FirstLevel', First);
        formData.append('SecondLevel', Second);
        formData.append('ThirdLevel', Third);
        formData.append('ForthLevel', Forth);
        fetch(url, {
            method: 'POST',
            mode : 'cors',
            body:formData
        }).then(response => response.json())
            .then(
                response => {
                    console.log(response);
                    if(response.isDelete===true) {
                        message.success(` 删除成功.`);
                        window.location.reload(true);//只有这个刷新页面比较好用
                    }else if(response.isDelete===false){
                        message.error(` 删除失败.`);
                        window.location.reload(true);//只有这个刷新页面比较好用
                    }
                }
            )
    };
    render() {
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const scale = {
            cut: {
                sync: true,
            },
            mean: {
                sync: true,
                tickCount: 5,
            },
        };
        const columns = [{
            title: '序号',
            dataIndex: 'id',
            key: 'id'
        },{
            title: '事业部',
            dataIndex: 'FirstLevel',
            key: 'FirstLevel',
            ...this.getColumnSearchProps('FirstLevel'),
            sorter: (a, b) => a.FirstLevel.length - b.FirstLevel.length,
            sortOrder: sortedInfo.columnKey === 'FirstLevel' && sortedInfo.order,
        },{
            title: '二级单位',
            dataIndex: 'SecondLevel',
            key: 'SecondLevel',
            // ...this.getColumnSearchProps('SecondLevel'),
            // sorter: (a, b) => a.SecondLevel.length - b.SecondLevel.length,
            // sortOrder: sortedInfo.columnKey === 'SecondLevel' && sortedInfo.order,
            render:text=>(
                <p>{text==='undefined'?'':text}</p>
            )
        }, {
            title: '三级单位',
            dataIndex: 'ThirdLevel',
            key: 'ThirdLevel',
            // ...this.getColumnSearchProps('ThirdLevel'),
            // sorter: (a, b) => a.ThirdLevel.length - b.ThirdLevel.length,
            // sortOrder: sortedInfo.columnKey === 'ThirdLevel' && sortedInfo.order,
            render:text=>(
                <p>{text==='undefined'?'':text}</p>
            )
        },  {
            title: '四级单位',
            dataIndex: 'ForthLevel',
            key: 'ForthLevel',
            render:text=>(
                <p>{text==='undefined'?'':text}</p>
            )
        },{
            title: '部门介绍',
            dataIndex: 'DepartmentIntroduction',
            key: 'DepartmentIntroduction',
            render:text=>(
                <p>{text==='undefined'?'':text}</p>
            )
            // render: (text, record) =>(
            //     <Select placeholder="请选择项目类型"  defaultValue={record.Identity} onChange={this.getIdentity.bind()}>
            //         <Option value="用户">用户</Option>
            //         <Option value="审查员">审查员</Option>
            //         <Option value="管理员">管理员</Option>
            //     </Select>
            // ),
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
              <a onClick={this.deleteDepartment.bind(this,record.FirstLevel,record.SecondLevel,record.ThirdLevel,record.ForthLevel)}>删除</a>
                </span>
            ),
        }];
        return (
            <div >
                {/*<div id="generalSituationMain" style={{width:'200px',height:'300px'}}> </div>*/}
                <Chart data={this.state.Data} height={400} scale={scale} style={{width:'60%',margin:'0 auto'}}>
                <h3>中海油官网组织机构主要分为以下机构：</h3>
                <h3>    采油部门，储存等等。。。。</h3>
                <Tooltip showTitle={false} />
                {/*提示信息*/}
                <Legend />
                {/*图例*/}
                <Coord type="theta" />
                {/*坐标*/}
                <Facet
                    type="tree"
                    fields={['FirstLevel', 'SecondLevel','ThirdLevel','ForthLevel']}
                    line={{ stroke: '#c0d0e0' }}
                    lineSmooth
                    eachView={(view, facet) => {
                        const data2 = facet.data;
                        const dv = new DataView();
                        dv.source(data2).transform({
                            type: 'percent',
                            field: 'count',
                            dimension: 'gender',
                            as: 'percent',
                        });
                        view.source(dv, {
                            percent: {
                                formatter(val) {
                                    // return `${(val * 100).toFixed(2)}%`;
                                },
                            },
                        });
                        view
                            .intervalStack()
                            .position('percent')
                            // .color('gender');
                    }}
                />
            </Chart>
                <Table columns={columns} dataSource={this.state.Data} rowKey={recode => recode.id} onChange={this.handleChange} />
            </div>
        );
    }
}