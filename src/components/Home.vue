<template>
  <!--  引入container布局-->
  <el-container class="home-container">
    <!--头部-->
    <el-header>
        <div>
          <img src="../assets/shizi.png" alt />
          <span>C5仓库货品管理系统 </span> 
        </div>
       <h6 class="tips">当前管理员：{{this.Manager.mname}}</h6> 
      <el-button type="info" @click="logout">安全退出</el-button>
    </el-header>
    <!-- 主体-->
    <el-container>
      <!-- 侧边栏-->
      <el-aside :width="isCollapsed?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu

            class="el-menu-vertical-demo"
            
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#50c870"
            
            :collapse="isCollapsed"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath">

          <!--          一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObject[item.id]" ></i>
              <span>{{item.title}}</span>
            </template>
<!--           二级菜单 -->
              <el-menu-item :index="it.path" v-for="it in item.subMenuList" :key="it.id" @click="SaveNavState(it.path)">
                <template slot="title">
                  <i :class="iconsObject[it.id]"></i>
                  <span>{{it.title}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主体内容-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>


export default {
  data(){
    return{
      //菜单列表
      menuList:[],
      isCollapsed:false,//伸缩
      activePath:'/welcome',//默认路径
      Manager:[],//管理员对象
      iconsObject: {
        '100':'iconfont icon-zhanghaoquanxianguanli',
        '200':'iconfont icon-huapen',
        '101':'iconfont icon-s_yonghuliebiao',
        '102':'iconfont icon-quanxian',
        '103':'iconfont icon-shouye',
        '104':'iconfont icon-jiaoyisuo',
        '201':'iconfont icon-jiaoyubaike',
        '202':'iconfont icon-shujuzichan-gerenzichan',
        '203':'iconfont icon-jiaoyisuo',
        '204':'iconfont icon-zhanghaoquanxianguanli',
      },

    }
  },


    //onload事件
    created(){
      // 查询menuList
      this.getMenuList()
      this.getManager()
      this.activePath=window.sessionStorage.getItem('activePath'); //取出session里的path  动态修改path
      
    },

    //方法集合
    methods:{
        //获取登陆者信息
        getManager(){
            this.Manager=window.sessionStorage.getItem('user')//取出登陆的管理员对象
            this.Manager=JSON.parse(this.Manager)
            console.log(this.Manager)
            console.log(typeof(this.Manager))
        },

        // 安全退出的方法
        logout(){
            window.sessionStorage.clear();//清除session信息
            this.$router.push("/login");//返回登录页面
        },
        //获取导航菜单的方法
        async getMenuList(){
          const {data:res}=await this.$http.get("menus");
          // console.log(res);//测试
          if(res.flag!=200) return this.$message.error("获取列表失败");//访问失败错误信息
          this.menuList=res.menus;//访问成功数据回填
        },
        //控制伸缩
        toggleCollapse(){
            this.isCollapsed=!this.isCollapsed;
        },
        //保存路径
        SaveNavState(activePath){
          window.sessionStorage.setItem('activePath',activePath);//存放到session中
          this.activePath=activePath;
        }
    },
}
</script>
<style lang="less" scoped>
  //布局器样式
  .home-container{
    height: 100%;

  }
  //头部样式
  .el-header{
    background: #373d41;
    display: flex;
    justify-content: space-between;//左右贴边
    padding-left: 0;//左边界
    align-items: center;
    color:#fff;
    font-size: 30px;
    >div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }
  //侧边栏样式
  .el-aside{
    background:#333744;
    .el-menu{
      border-right: #333744;
    }
  }
  //主体样式
  .el-main{
    background:#eaedf1;
  }
  .el-icon-s-help{
    color: #63a35c;
  }
  img{
    width:55px;
    height:55px;
  }
  // |||按钮样式
  .toggle-button{
    background: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #ffffff;
    text-align: center;//字体水平居中
    letter-spacing: 0.2em;//字体间距
    cursor: pointer;//显示鼠标
  }
  .tips{
    padding-left: 50%;
  }
</style>
