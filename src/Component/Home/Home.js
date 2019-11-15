import React from 'react';
import { Layout, Menu, Icon} from 'antd';
import './Home.css';
// import Contenttt from '../content/content';
// import Table1 from "../WorkloadView/WorkloadView";
// import Table2 from "../WorkloadReview/WorkloadReview.js";
// import Table21 from "../WorkloadWaitReview/WorkloadWaitReview.js";
// import Table3 from "../WorkloadManage/WorkloadManage.js";
// import Table4 from '../UserManage/CheckAllUser.js';
// import Useradd from '../UserManage/UserAdd.js';
// import IntegralAdd from '../integralManage/integralAdd.js';
// import DepartmentAdd from '../Department/DepartmentAdd.js';
// import DepartmentAll from '../Department/DepartmentAll.js';
// import IntegralCheckAll from '../integralManage/integralCheckAll.js';
// import Person from "../PersonImformation/Person.js";
// import HomeHead from '../HomeHead/HomeHead';
import Text from "antd/es/typography/Text";
import Loadable from "react-loadable";
import Loading from "../loading";
const Help = Loadable({loader: () => import('../Help.js'), loading: Loading, delay: 100});
const Contenttt = Loadable({loader: () => import('../content/content'), loading: Loading, delay: 100});
const Table1 = Loadable({loader: () => import('../WorkloadView/WorkloadView'), loading: Loading, delay: 100});
const Table2 = Loadable({loader: () => import('../WorkloadReview/WorkloadReview.js'), loading: Loading, delay: 100});
const Table21 = Loadable({loader: () => import('../WorkloadWaitReview/WorkloadWaitReview.js'), loading: Loading, delay: 100});
const Table3 = Loadable({loader: () => import('../WorkloadManage/WorkloadManage.js'), loading: Loading, delay: 100});
const Table4 = Loadable({loader: () => import('../UserManage/CheckAllUser.js'), loading: Loading, delay: 100});
const Useradd = Loadable({loader: () => import('../UserManage/UserAdd.js'), loading: Loading, delay: 100});
const IntegralAdd = Loadable({loader: () => import('../integralManage/integralAdd.js'), loading: Loading, delay: 100});
const DepartmentAdd = Loadable({loader: () => import('../Department/DepartmentAdd.js'), loading: Loading, delay: 100});
const DepartmentAll = Loadable({loader: () => import('../Department/DepartmentAll.js'), loading: Loading, delay: 100});
const IntegralCheckAll = Loadable({loader: () => import('../integralManage/integralCheckAll.js'), loading: Loading, delay: 100});
const Person = Loadable({loader: () => import('../PersonImformation/Person.js'), loading: Loading, delay: 100});
const HomeHead = Loadable({loader: () => import('../HomeHead/HomeHead'), loading: Loading, delay: 100});
const { Header, Sider, Content,Footer } = Layout;
const SubMenu = Menu.SubMenu;
 sessionStorage.getItem('Identity');//获取路由
sessionStorage.getItem('chooseView');//获取路由
class Home extends React.Component {
    state = {
        collapsed: false,
        choose:sessionStorage.getItem('chooseView'),
        Identity:sessionStorage.getItem('Identity'),
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    changeChoose=(key)=>{
        sessionStorage.setItem('chooseView',key);
        this.setState({
            choose:key
        })
    };

    memu1=(<Menu
        defaultSelectedKeys={[this.state.choose]}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={this.state.collapsed}
    >
        <Menu.Item key="1" onClick={this.changeChoose.bind(this,'1')}>
            <Icon type="pie-chart" />
            <span>新建工作量</span>
        </Menu.Item>
        <Menu.Item key="2" onClick={this.changeChoose.bind(this,'2')}>
            <Icon type="project" />
            <span>我的工作量</span>
        </Menu.Item>
        <SubMenu key="Person" title={<span><Icon type="user" /><span>个人资料</span></span>}>
            <Menu.Item key="Person" onClick={this.changeChoose.bind(this,'Person')}>个人信息</Menu.Item>
        </SubMenu>
    </Menu>);

    memu2=(<Menu
        defaultSelectedKeys={[this.state.choose]}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={this.state.collapsed}
    >
        <Menu.Item key="1" onClick={this.changeChoose.bind(this,'1')}>
            <Icon type="pie-chart" />
            <span>新建工作量</span>
        </Menu.Item>
        <Menu.Item key="2" onClick={this.changeChoose.bind(this,'2')}>
            <Icon type="project" />
            <span>我的工作量</span>
        </Menu.Item>
        <SubMenu key="3" title={<span><Icon type="desktop" /><span>审查工作量</span></span>}>
            <Menu.Item key="31" onClick={this.changeChoose.bind(this,'31')}>所有工作量</Menu.Item>
            <Menu.Item key="32" onClick={this.changeChoose.bind(this,'32')}>待审核工作量</Menu.Item>
        </SubMenu>
        <SubMenu key="Person" title={<span><Icon type="user" /><span>个人资料</span></span>}>
            <Menu.Item key="Person" onClick={this.changeChoose.bind(this,'Person')}>个人信息</Menu.Item>
        </SubMenu>
    </Menu>);
    memu3=(<Menu
        defaultSelectedKeys={[this.state.choose]}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={this.state.collapsed}
    >
        <Menu.Item key="1" onClick={this.changeChoose.bind(this,'1')}>
            <Icon type="pie-chart" />
            <span>新建工作量</span>
        </Menu.Item>
        <Menu.Item key="2" onClick={this.changeChoose.bind(this,'2')}>
            <Icon type="project" />
            <span>我的工作量</span>
        </Menu.Item>
        {/*<SubMenu key="3" title={<span><Icon type="desktop" /><span>审查工作量</span></span>}>*/}
            {/*<Menu.Item key="31" onClick={this.changeChoose.bind(this,'31')}>所有工作量</Menu.Item>*/}
            {/*<Menu.Item key="32" onClick={this.changeChoose.bind(this,'32')}>待审核工作量</Menu.Item>*/}
        {/*</SubMenu>*/}
        <SubMenu key="4" title={<span><Icon type="appstore" /><span>工作量管理</span></span>}>
            <Menu.Item key="41" onClick={this.changeChoose.bind(this,'41')}>所有人工作量</Menu.Item>
        </SubMenu>
        <SubMenu key="5" title={<span><Icon type="profile" /><span>积分项管理</span></span>}>
            <Menu.Item key="51" onClick={this.changeChoose.bind(this,'51')}>添加积分项</Menu.Item>
            <Menu.Item key="52" onClick={this.changeChoose.bind(this,'52')}>所有积分项</Menu.Item>
        </SubMenu>
        <SubMenu key="6" title={<span><Icon type="team" /><span>组织与人员</span></span>}>
            <Menu.Item key="61" onClick={this.changeChoose.bind(this,'61')}>所有用户</Menu.Item>
            <Menu.Item key="62" onClick={this.changeChoose.bind(this,'62')}>添加用户</Menu.Item>
            <Menu.Item key="63" onClick={this.changeChoose.bind(this,'63')}>所有部门</Menu.Item>
            <Menu.Item key="64" onClick={this.changeChoose.bind(this,'64')}>添加部门</Menu.Item>
        </SubMenu>
        <SubMenu key="Person" title={<span><Icon type="user" /><span>个人资料</span></span>}>
            <Menu.Item key="Person" onClick={this.changeChoose.bind(this,'Person')}>个人信息</Menu.Item>
        </SubMenu>
        <Menu.Item key="Help" onClick={this.changeChoose.bind(this,'Help')}>
            <Icon type="question" />
            <span>帮助</span>
        </Menu.Item>
    </Menu>);

    render() {
        return (
            <div>
                <HomeHead/>
                <div style={{height:'calc(100%)'}}>
                    <Layout >
                        <Sider
                            trigger={null}
                            collapsible
                            collapsed={this.state.collapsed}
                        >
                            {/*<div className="logo" >*/}
                                {/*<img src={logo} alt='homeLogo'/>*/}
                            <div>
                                { ( ()=>{
                                        switch(this.state.Identity){
                                            case '用户': {
                                                return this.memu1;
                                            }
                                            case '审查员': {
                                                return this.memu2;
                                            }
                                            case '管理员': {
                                                return this.memu3;
                                            }
                                            default:return null
                                        }
                                    }
                                )()}
                            </div>
                        </Sider>
                        <Layout>
                            <Header style={{ background: '#fff', padding: 0 }}>
                                <Icon
                                    className="trigger"
                                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                    onClick={this.toggle}
                                />
                               <Text  style={{fontSize:24}}> { ( ()=>{
                                       switch(this.state.choose){
                                           case '1': {
                                               return '工作量提交';
                                           }
                                           case '2': {
                                               return '我的工作量';
                                           }
                                           case '31': {
                                               return '所有审核工作量';
                                           }
                                           case '32': {
                                               return '待审核工作量';
                                           }
                                           case '41': {
                                               return '工作量管理';
                                           }
                                           case '51': {
                                               return '添加积分项';
                                           }
                                           case '52': {
                                               return '所有积分项';
                                           }
                                           case '61': {
                                               return '所有用户';
                                           }
                                           case '62': {
                                               return '添加用户';
                                           }
                                           case '63': {
                                               return '所有部门';
                                           }
                                           case '64': {
                                               return '添加部门';
                                           }
                                           case 'Person': {
                                               return '个人信息';
                                           }
                                           case 'Help': {
                                               return '帮助';
                                           }
                                           default:return null
                                       }
                                   }
                               )()}
                               </Text >
                            </Header>
                            <Content style={{
                                margin: '0', padding: 24
                            }}>
                                {/*这个是表里的内容*/}
                                <div style={{background: '#fff',minHeight:'700px'}}>
                                { ( ()=>{
                                        switch(this.state.choose){
                                            case '1': {
                                                return <Contenttt/>;
                                            }
                                            case '2': {
                                                return <Table1/>;
                                            }
                                            case '31': {
                                                return <Table2/>;
                                            }
                                            case '32': {
                                                return <Table21/>;
                                            }
                                            case '41': {
                                                return <Table3/>;
                                            }
                                            case '51': {
                                                return <IntegralAdd/>;
                                            }
                                            case '52': {
                                                return <IntegralCheckAll/>;
                                            }
                                            case '61': {
                                                return <Table4/>;
                                            }
                                            case '62': {
                                                return <Useradd/>;
                                            }
                                            case '63': {
                                                return <DepartmentAll/>;
                                        }
                                            case '64': {
                                                return <DepartmentAdd/>;
                                            }
                                            case 'Person': {
                                                return <Person/>;
                                            }
                                            case 'Help': {
                                                return <Help/>;
                                            }
                                            default:return null
                                        }
                                    }
                                )()}
                                </div>
                            </Content>
                        </Layout>
                    </Layout>
                    <Footer style={{fontSizeAdjust:true,textAlign:'center',height:'10px'}}>
                        workload statistics© 2018-至今 通信工程团队. 版权所有
                    </Footer>
                </div>
            </div>
        );
    }
}

export default Home