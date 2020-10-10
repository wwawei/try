import React from 'react';
import axios from 'axios';
import {BrowserRouter as Router} from 'react-router-dom';
import {baseurl} from '../server'

// 添加一个请求的拦截器
axios.interceptors.response.use(function(response) {

    console.log('axios响应拦截',response);
  
    let router=new Router();   // {history,default:组件本身,xxxx}
  
    //token过期: 返回值2,当前路由不是login时跳转
    if (response.data.err === 2 && !router.history.location.pathname.includes('/login')) {
  
      console.log('token 失败 跳转到login',router);
  
      //历史记录模式跳转
      window.location.href=baseUrl+'/login?path='+router.history.location.pathname
  
      //hash 模式可以，history模式有问题
  
      /*router.history.push({
        pathname: '/login',
        search: "path="+router.history.location.pathname
      })*/
  
    }
    return response;
  
  }, function(error) {
  
    return Promise.reject(error);
  });
  
  
  React.axios = axios;//axios绑到对象包上  组件.axios | React.axios
  React.Component.prototype.axios = axios; // axios绑定到Component类的原型   组件|this.axios
  // window.axios = axios;  //×   希望全局使用axios , 使用webpack 来配置
  export default axios;