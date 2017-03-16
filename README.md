# vue-example-login
>    **觉得不错的话 star 支持下~**  
>    github地址：[https://github.com/doterlin/vue-example-login](https://github.com/doterlin/vue-example-login)
>    演示地址：[https://doterlin.github.io/vue-example-login](https://doterlin.github.io/vue-example-login)

运行：直接打开`index.html`  

## 技术栈
+    [vue.js](https://vuejs.org/v2/guide/) 主框架
+    [vuex](https://vuex.vuejs.org/) 状态管理
+   [vue-router](https://router.vuejs.org/) 路由管理

## 一般过程
在一般的登录过程中，一种前端方案是：
1.   检查状态：进入页面时或者**路由变化时**检查是否有登录状态(保存在`cookie`或者`本地存储`的值)；
2.   如果有登录态则查询登录信息(uid，头像等...)并保存起来；如果没有则跳转到登录页；
3.   在登录页面（或者登录框），校检用户输入信息是否合法；
4.   校检通过后发送登录请求；校检不成功则反馈给用户；
5.   登录成功则从后端数据中取出`session`信息保存登录状态(可能需要跳转);登录不成功则提示用户不成功；
6.   用户做出注销操作时删除登录状态。

下面我根据列出的步骤一一分析如何做代码实现，所有在代码在[https://github.com/doterlin/vue-example-login](https://github.com/doterlin/vue-example-login)中，并带有较详细注释帮助理解代码。

在此之前假设登录页面路由为`/login`，登录后的路由为`/user_info`。这样只需要在`App.vue`放好`router-view`用于存放和渲染这两个路由。
```javascript
// component/App.vue
<template>
<div class="container" id="app">
  <transition name="fade">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </transition>
</div>
</template>
...
```
并做好`vue-router`配置:
```javascript
// js/app.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../component/Login.vue'
import UserInfo from '../component/UserInfo.vue'

Vue.use(VueRouter);
const router = new VueRouter({
  routes: [{
    path: '/login',
    component: Login
  }, {
    path: '/user_info',
    component: UserInfo
  }]
})
...
```

## 检查状态与跳转
在两个时候我们需要检查状态：*1.用户打开页面时；* *2.路由发生变化时；*

首先需要写好一个检查登录态的方法`checkLogin`：
```javascript
// js/app.js
...
var app = new Vue({
  data: {},
  el: '#app',
  render: h => h(App),
  router,
  store,
  methods:{
    checkLogin(){
      //检查是否存在session
      //cookie操作方法在源码里有或者参考网上的即可
      if(!this.getCookie('session')){
        //如果没有登录状态则跳转到登录页
        this.$router.push('/login');
      }else{
        //否则跳转到登录后的页面
        this.$router.push('/user_info');
      }
    }
  }
})
```
  
为了提升用户体验，当用户**打开页面**时前端需要检查他是否已经登录，不需要用户再次登录。这个实现很简单,我们在`vue实例`的`created`钩子里写好：
```javascript
// js/app.js
...
var app = new Vue({
  ...
  created() {
    this.checkLogin();
  },
  methods:{
    checkLogin(){
     ...
    }
  }
})
```
另外，`路由`发生变化时也需要检查登录，以下情景(路由变化)如果我们不检查登录态可能会发生错误：
+   用户在进入页面时存在登录状态，但在做操作时正好登录过期了；
+   用户手动删除了`cookie`/`本地storage`并做操作；
+   用户在未登录的情况下手动输入(或者从收藏夹进入)某个需要登录的路由
+  用户在已登录的情况下进入登录页路由

这些足够成为我们监听路由的理由，实现的话可以利用`vue`的`watch`功能：

```javascript
// js/app.js
...
var app = new Vue({
  ...
  //监听路由检查登录
  watch:{
    "$route" : 'checkLogin'
  },

  //进入页面时
  created() {
    this.checkLogin();
  },

  methods:{
    checkLogin(){
     ...
    }
  }
})
```
至此，我们就完成了`一般过程`中的第1步。接下来实现如何获取用户个人信息。

## 2.获取用户信息
在成功登录后，我们一般需要从后端显示用户的一些信息，比如昵称，头像，等级等等...获取的话很简单，发一个http请求从后端拉取；但是一般这些信息会在多的路由用到（比如uid一般都需要在各个后端接口中作为参数带上），所以需要保存到全局状态中(`vuex`)：
```javascript
// component/App.vue
...
<script>
export default {
  ...
  mounted(){
    //组件开始挂载时获取用户信息
    this.getUserInfo();
  },
  methods: {
    //请求用户的一些信息
    getUserInfo(){
      this.userInfo = {
        nick: 'Doterlin',
        ulevel: 20,
        uid: '10000',
        portrait: 'images/profile.png'
      }

      //获取信息请求
      ts.$http.get(url, {
        //参数
        "params": this.userInfo
      }).then((response) => {
        //Success
        if(response.data.code == 0){
          this.$store.commit('updateUserInfo', this.userInfo); 
        }
      }, (response) => {
        //Error
      });

    }
  }
}
</script>
...
```
当然我们需要在之前配置好，比如在写在`app.js`或者单独写成`store.js`并在`app.js`引入（推荐）：
```javascript
// js/app.js
// Vuex配置
...
const store = new Vuex.Store({
  state: {
    domain:'http://test.example.com', //保存后台请求的地址，修改时方便（比方说从测试服改成正式服域名）
    userInfo: { //保存用户信息
      nick: null,
      ulevel: null,
      uid: null,
      portrait: null
    }
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, newUserInfo) {
      state.userInfo = newUserInfo;
    }
  }
})
...
```

##   输入校验和发送登录请求
为了防止一些不符合预期的字符和过于频繁的请求传到后台，前端要对用户的输入进行校验和防止重复请求。当然不同网站的合法字符不一样，这里只做`为空`时不合法的校验：
```javascript
//component/Login.vue
<template>
<div class="login" id="login">
   ...
    <div class="log-email">
        <input type="text" placeholder="Email" :class="'log-input' + (account==''?' log-input-empty':'')" v-model="account"><input type="password" placeholder="Password" :class="'log-input' + (password==''?' log-input-empty':'')"  v-model="password">
        <a href="javascript:;" class="log-btn" @click="login">Login</a>
    </div>
    ...
</div>
</template>
<script>
import Loading from './Loading.vue'
export default {
  name: 'Login',
  data(){
  	return {
          isLoging: false,
  		account: '',
  		password: ''
  	}
  },
  components:{
    Loading
  },
  methods:{

  	//登录逻辑
  	login(){
  		if(this.account!='' && this.password!=''){
  			this.toLogin();
  		}
  	}

}
</script>
...
```

这里的`this.toLogin`就是登录请求的方法，在`post`密码到后端时不是直接发送，一般会按照后端定的规则加密后在发送，比如`哈希算法`，例子进行了的双重哈希加密，引用了`js/sha1.min.js`，大致实现如下：
```javascript
...
      //登录请求
  	toLogin(){

  		//一般要跟后端了解密码的加密规则
  		//这里例子用的哈希算法来自./js/sha1.min.js
  		let password_sha = hex_sha1(hex_sha1( this.password ));

  		//需要想后端发送的登录参数
  		let loginParam = {
  			account: this.account,
  			password_sha
  		}

          //设置在登录状态
          this.isLoging = true;
      
  		//请求后端
  		this.$http.post( 'example.com/login.php', {
  		param: loginParam).then((response) => {
            if(response.data.code == 1){
              //如果登录成功则保存登录状态并设置有效期
              let expireDays = 1000 * 60 * 60 * 24 * 15;
              this.setCookie('session', response.data.session, expireDays);
              //跳转
              this.$router.push('/user_info'); 
            }
	      }, (response) => {
	        //Error
	      });

...
```

这样就完成了第3,4,5个步骤了。最后一步就是注销。

##  注销
注销时有的需要请求后端有的不需要，关键的事要删除保存的登录状态：
```javascript
// component/UserInfo.vue
...
   logout(){
      //删除cookie并跳到登录页
      this.isLogouting = true;
      //请求后端，比如logout.php
      // this.$http.post('eaxmple.com/logout.php')...
      //成功后删除cookie
      this.delCookie('session');

      //重置loding状态
      this.isLogouting = false;

      //跳转到登录页
      this.$router.push('/login/');
    }
...
```

>   这样就完成简单登录的前端工作，以上为个人实践过并总结下来的。
>   如果不对敬请指教，欢迎讨论。

