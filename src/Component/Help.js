import React from 'react';
import { Table, Divider, Tag } from 'antd';
const columns = [
    {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: '类型（逻辑大类）',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '积分项目类型详细描述',
        dataIndex: 'description',
        key: 'description',
        width:"50%"
    },
    {
        title: '影响因素',
        key: 'factor',
        dataIndex: 'factor',
    }
];
const data = [
    {
        key: '1',
        type: '类型一(总分固定)',
        description: '项目的总分是固定的，项目定了，总分就定了，' +
            '每个人的得分按照批分规则（一般是一个公式，不同的类型，批分公式可能不同，' +
            '导致积分规则不同）进行批分；个人得分影响因素：项目总分值（固定值）、完成人排名；',
        factor: '1、项目总分值（固定）\n' +
            '2、完成总人数\n' +
            '3、完成人排名',
    },
    {
        key: '2',
        type: '类型二(总分不定)',
        description: '项目总分是不固定的，每个人的得分根据项目中的角色得分，' +
            '每个角色的分值在这种项目中是固定的；个人得分影响因素：项目中的角色权重；',
        factor: '1、完成人角色',
    },
    // {
    //     key: '3',
    //     type: '类型三',
    //     description: '项目总分不固定，根据项目金额确定（因为是生产项目，跟产值挂钩）；' +
    //         '每个人的得分因素有：项目总分值、角色权重、总人数；具体公式：' +
    //         '（项目合同价/总人数/计算单位）*角色权重。',
    //     factor: '1、项目总分值（不固定，可人工算、可人工指定）\n' +
    //         '2、完成总人数\n' +
    //         '3、完成人角色',
    // },
];
const columns1 = [
    {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: '规则名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '规则',
        dataIndex: 'rule',
        key: 'rule',
    },
    {
        title: '计算参数',
        key: 'factor',
        dataIndex: 'factor',
    },
    {
        title: '适用单位',
        key: 'unit',
        dataIndex: 'unit',
    },
    {
        title: '备注',
        key: 'extra',
        dataIndex: 'extra',
    }
];
const data1 = [
    {
        key: '1',
        name: '算法一（总分批分）',
        rule: 'Ai=2/（n+1）-(i-1) 2/[n(n+1)]\n' +
            'i为参加积分员工的排序，n为参与项目的所有员工数。',
        factor: '1、项目总分值（固定）\n' +
            '2、完成总人数\n' +
            '3、完成人排名',
        unit:'完井中心',
        extra:''
    },
    {
        key: '2',
        name: '算法二（按角色得分）',
        rule: '负责人：15分\n' +
            '第二负责人：10分\n' +
            '骨干人员：5分\n' +
            '参与人员：3分',
        factor: '1、完成人角色',
        unit:'完井中心',
        extra:''
    },{
        key: '3',
        name: '算法三（总价/人数/角色）',
        rule: 'A=（项目合同价/总人数/计算单位）*角色权重',
        factor: '1、合同总价\n' +
            '2、完成总人数\n' +
            '3、完成人角色权重',
        unit:'通用',
        extra:'计算单位为“十万元”'
    },{
        key: '4',
        name: '算法四（时间天数/角色-积分周期10天）',
        rule: 'A=项目持续天数/10*角色权重',
        factor: '1、总天数\n' +
            '2、完成人角色权重',
        unit:'完井中心',
        extra:'积分周期10天'
    },{
        key: '5',
        name: '算法五（时间天数/角色-积分周期1天）',
        rule: '1、总天数\n' +
            '2、完成人角色权重',
        factor: '1、项目总分值（固定）\n' +
            '2、完成总人数\n' +
            '3、完成人排名',
        unit:'完井中心',
        extra:'积分周期1天'
    }];
class Help extends React.Component{
    render() {
        const title = () => (<p style={{textAlign:'center',fontSize:'20px'}}>积分类型说明</p>);
        const title1 = () => (<p style={{textAlign:'center',fontSize:'20px'}}>算法类型说明</p>);
        return(
            <div style={{padding:'0 50px'}}>
                <Table columns={columns} dataSource={data} pagination={false} title={title} />
                <Table columns={columns1} dataSource={data1} pagination={false} title={title1}/>
            </div>
        )
    }
}
export default Help