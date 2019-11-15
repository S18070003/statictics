import React, { Component } from 'react';
import { HashRouter as Router,Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from './Component/loading.js';
import './App.css';
const Login = Loadable({
    loader: () => import('./Component/Login/Login'),
    loading: Loading,
    delay: 100
});
const Home = Loadable({
    loader: () => import('./Component/Home/Home'),
    loading: Loading,
    delay: 100
});
const Registration = Loadable({
    loader: () => import('./Component/Registration/Registration'),
    loading: Loading,
    delay: 100
});
class App extends Component {
    updateRoute =() =>{
        console.log('路由更新了');
    };
  render() {
    return (
        <Router history={this.props.history} onUpdate={this.updateRoute}>
          <div style={{height:'100%'}}>
            <Route exact path="/" component={Login}/>
            <Route path="/Home" component={Home}/>
            <Route path="/Registration" component={Registration}/>
          </div>
        </Router>
    );
  }
}

export default App;
