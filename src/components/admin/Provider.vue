<template>
  <div>
    <h2>订单列表</h2>
<!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>平台业务</el-breadcrumb-item>
      <el-breadcrumb-item>供应商信息</el-breadcrumb-item>
    </el-breadcrumb>
<!--      用户列表主体-->
      <el-card>
        <el-row :gutter="25"> <!--间隙-->
<!--        搜索区域-->
<!--        搜索添加-->
          <el-col :span="10" >  <!--列宽-->
            <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @click="getProviderList">
              <el-button slot="append" icon="el-icon-search" @click="getProviderList">

              </el-button>
            </el-input>
          </el-col>
          <!-- 按钮-->
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible =true">添加表单</el-button>
          </el-col>
        </el-row>

        <!--用户列表   border边框   stripe隔行变色-->
        <el-table :data="ProviderList" border stripe>

          <el-table-column type="index"></el-table-column> <!--索引列-->
          <el-table-column label="供应商编号" prop="pno"></el-table-column>
          <el-table-column label="供应商姓名" prop="pname"></el-table-column>
          <el-table-column label="供应商地址" prop="paddr"></el-table-column>
          <el-table-column label="供应货物" prop="pgoods"></el-table-column>
          <el-table-column label="联系方式" prop="ptel"></el-table-column>



          <el-table-column label="操作" >
            <template slot-scope="scope">

              <!-- 删除 -->
              <el-tooltip effect="dark" content="删除表单" placement="top-start" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click= "deleteProvider(scope.row.pno)"></el-button>
              </el-tooltip>

            </template>
          </el-table-column>

        </el-table>

<!--        分页组件 size-change每页最大变化数  current-change当前变化数 layout功能组件-->
        <div>
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pageNum"
              :page-sizes="[1, 2, 5,10 ,20,100]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
        </div>
      </el-card>

    <!--新增用户表对话框-->
    <el-dialog title="添加出库订单" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form  ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="90px">
        <el-form-item label="发货人信息" prop="whosend">
          <el-input v-model="addForm.whosend"></el-input>
        </el-form-item>
        <el-form-item label="收货人信息" prop="whoget" >
          <el-input v-model="addForm.whoget"></el-input>
        </el-form-item>
        <el-form-item label="发货地" prop="shipmentplace">
          <el-input v-model="addForm.shipmentplace"></el-input>
        </el-form-item>
        <el-form-item label="收货地" prop="destination">
          <el-input v-model="addForm.destination"></el-input>
        </el-form-item>
          <el-form-item label="货物信息" prop="info">
            <el-input v-model="addForm.info"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用户表对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form  ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="90px">
        <el-form-item label="发货人信息" prop="whosend">
          <el-input v-model="editForm.whosend" ></el-input>
        </el-form-item>
        <el-form-item label="收货人信息" prop="whoget" >
          <el-input v-model="editForm.whoget" ></el-input>
        </el-form-item>
        <el-form-item label="发货地址" prop="shipmentplace">
          <el-input v-model="editForm.shipmentplace"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="destination">
          <el-input v-model="editForm.destination"></el-input>
        </el-form-item>
        <el-form-item label="货物信息" prop="info">
          <el-input v-model="editForm.info"></el-input>
        </el-form-item>


      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  //onLoad()
  created() {
    this.getProviderList()
  },
  //数据返回 创建属性
  data(){

    return{

      //查询信息实体
      queryInfo:{
        query:"",//查询信息
        pageNum:1,//当前页
        pageSize:5,//每页最大数
      },
      ProviderList:[],//出库信息列表
      total:0,//总记录数
      addDialogVisible:false,//对话框状态

      //添加表单信息
      addForm:{
        
      },

      //修改用户信息
      editForm:{},
      //显示/隐藏修改用户栏
      editDialogVisible:false,

      //添加用户表单验证
      addFormRules: {
        whosend: [
          {required: true, message: '请输入发件人', trigger: 'blur'},
          {min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur'}
        ],
        whoget: [
          {required: true, message: '请输入收件人', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur'}
        ],
        shipmentplace: [
          {required: true, message: '请输入发货地', trigger: 'blur'},
          {min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur'}
        ],
        destination: [
          {required: true, message: '请输入目的地', trigger: 'blur'},
          {min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur'}
        ],
        info: [
          {required: true, message: '请输入货物信息', trigger: 'blur'},
          {min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'blur'}
        ],

      },

      //修改用户表单验证
      editFormRules: {
        whosend: [
          {required: true, message: '请输入发件人', trigger: 'blur'},
          {min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur'}
        ],
        whoget: [
          {required: true, message: '请输入收件人', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur'}
        ],
        shipmentplace: [
          {required: true, message: '请输入发货地', trigger: 'blur'},
          {min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur'}
        ],
        destination: [
          {required: true, message: '请输入目的地', trigger: 'blur'},
          {min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur'}
        ],
        info: [
          {required: true, message: '请输入货物信息', trigger: 'blur'},
          {min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'blur'}
        ],
      },
    };
  },

  //方法
  methods:{



    // 获取供应商信息
    async getProviderList(){
      const{data:res} =await this.$http.get("getProvider",{params:this.queryInfo}) //发起get请求
      this.ProviderList=res.data;//用户列表数据封装
      this.total=res.numbers;//总用户数封装

    },


    //处理分页页面变化 最大数
    handleSizeChange(newSize){
      this.queryInfo.pageSize=newSize;
      this.getProviderList();
    },

    //pageNum的触发动作
    handleCurrentChange(newPage){
      this.queryInfo.pageNum=newPage;
      this.getProviderList();
    },



    // 监听用户的操作
    addDialogClosed(){
        this.$refs.addFormRef.resetFields();
    },

    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },


    //添加用户
    addUser(){
      this.$refs.addFormRef.validate(async valid=>{
            console.log(valid);
            // 验证后台，不成功返回
             if(!valid) return;
             const{data:res}=await this.$http.post("addUser2",this.addForm);
             if(res!="success"){
               return this.$message.error("操作失败");
             }
              this.$message.success("操作成功");
              this.addDialogVisible = false;
              await this.getUserList();
          });
    },

    //删除用户
    async deleteProvider(pno){
     const confirmResult =await this.$confirm("此操作将永久删除表单，是否继续？",'警告',{
       confirmButtonText:"确定",
       cancelButtonClass:"取消",
       type:'warning'
     }).catch(err=>err)
      if(confirmResult!='confirm'){
        return this.$message.info("已取消删除")
      }
      const{data:res}=await this.$http.post("deleteProvider?pno="+pno);
      console.log(res);
      if(res!="success"){
        return this.$message.error("操作失败");
      }
      this.$message.success("操作成功");
      await this.getUserList();
    },


    //显示对话框2
    async showEditDialog2(Info){
      this.editForm=Info;//查询出用户信息反填到编辑表单里面
      this.editDialogVisible=true;//开启编辑对话框
    },

   //修改用户
  editUser(){
    this.$refs.editFormRef.validate(async valid=>{
      console.log(valid);
      // 验证后台，不成功返回
      if(!valid) return;
      const{data:res}=await this.$http.post("editUser2",this.editForm);
      if(res!="success"){
        return this.$message.error("操作失败");
      }
      this.$message.success("操作成功");
      this.editDialogVisible = false;
      await this.getUserList();

    })
  }
}

};
</script>

<style lang='less' scoped>
.el-breadcrumb{
  margin-bottom: 15px;
  font-size:17px;
}
.el-select .el-input {
  width: 130px;
}

.el-row{

}
</style>