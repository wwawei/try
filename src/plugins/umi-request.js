import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import request from 'umi-request';
import {baseUrl} from "../server";
// import qs from 'qs'

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  console.log('request请求拦截',url,options);
  //1抓取本地token，携带在请求头里
  let user = window.localStorage.getItem('user');
  // user = user ? qs.parse(user) : '';
  user = user ? JSON.parse(user) : '';
  options.headers={'token': user.token}

  return (
    {
      url,
      options
    }
  );
});

// 提前对响应做异常处理
request.interceptors.response.use(async (response) => {

  const codeMaps = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
  };

  console.log(codeMaps[response.status]);
  console.log('request响应拦截',response);

  const data = await response.clone().json();//克隆响应对象做解析处理

  let router=new Router();
  //token过期: 返回值2,当前路由不是login时跳转
  if (data.err === 2 && !router.history.location.pathname.includes('/login')) {
    console.log('token 失败 跳转到login',router);
    window.location.href=baseUrl+'/login?path='+router.history.location.pathname

    /*router.history.push({  //hash 模式可以，history模式有问题
      pathname: '/login',
      search: "path="+router.history.location.pathname
    })*/
  }

  return response;
});


React.request = request;//request绑到对象包上
React.Component.prototype.request = request; // request绑定到Component类的原型   组件|this.request
window.request = request;  //×   希望全局使用request , 使用webpack 来配置
export default request;