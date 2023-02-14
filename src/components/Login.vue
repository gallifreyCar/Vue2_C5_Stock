<template>
    <div class="login_container">
        <!-- 登录块 -->
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/shizi.png" alt/>
            </div> 
            <!-- 表单区域 -->
            <el-form ref="loginFormRef"  :rules="loginRules" :model="LoginForm" class ="login_form" label-width="0">
                <!-- 用户名 -->
                <el-form-item prop="mno">
                    <el-input v-model="LoginForm.mno" prefix-icon="iconfont icon-denglu"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="mpw">
                    <el-input v-model="LoginForm.mpw" prefix-icon="iconfont icon-mima" show-password></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login()">登录</el-button>
                    <el-button type="info" @click="resetLoginFrom()">重置</el-button>       
                </el-form-item>
            </el-form>
        </div>      
    </div>
</template>
<script>
export default {
    data(){
        return{
            //表单数据
            LoginForm:{

                mpw:"",
                mno:"",
                mname:""
            },
            //验证对象
            loginRules:{
                //校验用户名
                mno: [
                    { required: true, message: '请输入账号', trigger: 'blur' },//必填项验证 失去焦点触发
                    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' } //长度项验证
                ],  
                //校验密码
                mpw: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                ],  
            },
        }; 
    },
    methods:{
        //重置表单内容
        resetLoginFrom(){
            this.$refs.loginFormRef.resetFields();
        },
        //登录方法
        login(){
            //1.验证校验规则
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) return;// 验证失败
                console.log(this.LoginForm)
                const {data:res}=await this.$http.post("login",this.LoginForm);//访问后台
                if(res.flag =="ok"){
                    this.$message.success("登录成功");//信息提示
                //console.log(res.trueUser);//测试，打印一下后端传回来的信息
                    window.sessionStorage.setItem("user",JSON.stringify(res.manager));//存储用户信息
                    this.$router.push({path:"/home"});//页面路由跳转
                }else{
                    this.$message.error("登录失败");//错误提示
                }
            });
        },

    },
}
</script>
<style lang="less"  scoped>
//跟节点样式
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;// 圆角
  position: absolute;// 绝对定位
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);// 根据自己位置 以自己为长度位移

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;//实线框
    border-radius: 50%; // 加圆角
    padding: 2px; //填充
    box-shadow: 0 0 10px #0ee;// 盒子阴影
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #0ee;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%; // 加圆角
      background-color: rgb(255, 255, 255);
    }
  }
}
.btns{
    display: flex;
    justify-content: flex-end;
}.login_form{
    position:absolute;
    bottom: 0%;
    width: 100%;
    padding:0 10px; //上下没有，左右10个像素单位
    box-sizing:border-box;//设置边框
}

</style>