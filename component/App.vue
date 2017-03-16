//整个应用的根组件

<template>
<div class="container" id="app">
  <transition name="fade">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </transition>
</div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return {
      isLogin: false,
      userInfo: { //保存用户信息
        nick: null,
        ulevel: null,
        uid: null,
        portrait: null
      }
    }
  },
  mounted(){
    //组件开始挂载时获取用户信息
    this.getUserInfo();
  },

  methods: {
    //请求用户的一些信息
    getUserInfo(){

      //发送http请求获取，这里写死作演示
      this.userInfo = {
        nick: 'Doterlin',
        ulevel: 20,
        uid: '10000',
        portrait: 'images/profile.png'
      }

      //实例开发中这里会向服务端请求数据
      //如下(用了vue-resource):
      /*ts.$http.get(url, {
        //参数
        "params":{}
      }).then((response) => {
        //Success
      }, (response) => {
        //Error
      });*/

      //提交mutation到Store
      this.$store.commit('updateUserInfo', this.userInfo); 
    }
  }
}
</script>

<style>
body,ul,ol,p,h1,h2,h3,h4,h5,dl,dd,form,input,textarea,td,th,button,strong,em,select,video,canvas{margin:0;padding:0;}
li{list-style:none;vertical-align:top;}
table{ border-collapse:collapse;}
textarea{resize:none;overflow:auto;}
img{ border:none; vertical-align:middle;}
em{ font-style:normal;}
a{ text-decoration:none;}
a,input{ -webkit-tap-highlight-color:rgba(0,0,0,0);/*ios android去除自带阴影的样式*/}
input{outline:0px;}
body{background:#f1f1f1; margin: 0; padding: 0; font-family:'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;}
.container{padding-top: 40px; width:1170px; margin: 0 auto; padding-bottom: 20px; overflow: hidden;}
.left{display: inline-block;}
.block{display: block;}
.bold{font-weight: bold; color: #3C3C3C;}

.dib{display: inline-block;}
.ml20{margin-left: 20px;}
.ml19{margin-left: 19px;}
.ml10{margin-left: 10px;}
.mt10{margin-top: 10px;}
.fs12{font-size: 12px;}
.btn-loading{background-color: #a5f0e6 !important;}

.input{width: 278px; padding: 0 10px; margin: 0 auto; margin-top:25px;background: #fff;color: #333; height: 39px; line-height: 39px; border-radius: 5px; border: 1px solid #E3E3E3;}
.empty{border: 1px solid #f97a7a;}
.btn-lg{ display: block;width:300px; margin: 0 auto;background: #50E3CE;color: #fff;height: 41px;line-height: 41px;border-radius: 5px;margin-top:20px; text-align: center;}

.icons{background:url(../images/icons.png) no-repeat; display: inline-block;}
.login-fb{height:29px;width:13px;background-position:0 0;}
.close{height:16px;width:16px;background-position:-13px 0;}
.info{height:18px;width:18px;background-position:-29px 0;}
.info-focus{height:18px;width:18px;background-position:-47px 0;}
.star{height:24px;width:25px;background-position:-65px 0;}
.star-sm{height:18px;width:18px; background-position: -48px -1px;background-size: 360px 22px;}
.login-vk{height:15px;width:27px;background-position:-90px 0;}
.login-email{height:17px;width:29px;background-position:-117px 0;}
.login-tw{height:23px;width:29px;background-position:-146px 0;}
.diamond{height:22px;width:29px;background-position:-175px 0;}
.diamond-sm{height: 18px;width: 21px;background-position: -127px 1px;background-size: 360px 23px;}
.process-i2{height:30px;width:30px;background-position:-204px 0;}
.login-kakao{height:28px;width:31px;background-position:-234px 0;}
.process-i3{height:31px;width:31px;background-position:-265px 0;}
.process-i1{height:29px;width:31px;background-position:-296px 0;}
.icon_level_1{height:15px;width:15px;background-position:-333px 3px;}
.icon_level_2{height:15px;width:15px;background-position:-353px 3px;}
.icon_level_4{height:15px;width:15px;background-position:-393px 4px;}
.icon_level_5{height:15px;width:15px;background-position:-411px 3px;}
.icon_level_3{height:15px;width:15px;background-position:-375px 3px;}
.icon_level_6{height:15px;width:15px;background-position:-430px 3px;}
.icon-prev{height:18px;width:9px;background-position:-451px 0;}
.icon-next{height:18px;width:9px;background-position:-466px 0;}

/* transition animate */
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}


.slide-enter-active {
  transition: all .3s ease;
}
.slide-leave-active {
  /* transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0); */
}
.slide-enter, .slide-leave-active {
  transform: translateX(10px);
  opacity: 0;
}

</style>
