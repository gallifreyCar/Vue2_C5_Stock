<template>
  <div>
    <h2>订单列表</h2>
<!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
    </el-breadcrumb>
<!--      用户列表主体-->
      <el-card>
        <el-row :gutter="25"> <!--间隙-->
<!--        搜索区域-->
<!--        搜索添加-->
          <el-col :span="10" >  <!--列宽-->
            <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @click="getStockList">
              <el-button slot="append" icon="el-icon-search" @click="getStockList">

              </el-button>
            </el-input>
          </el-col>
        
        </el-row>

        <!--用户列表   border边框   stripe隔行变色-->
        <el-table :data="StockList" border stripe>

          <el-table-column type="index"></el-table-column> <!--索引列-->
          <el-table-column label="货物编号" prop="gno"></el-table-column>
          <el-table-column label="货物名称" prop="gname"></el-table-column>
          <el-table-column label="货物类型" prop="tname"></el-table-column>
          <el-table-column label="货物存储量" prop="gnum"></el-table-column>
          <el-table-column label="仓库编号" prop="sno"></el-table-column>
          <el-table-column label="仓库名" prop="sname"></el-table-column>
          <el-table-column label="仓库容量" prop="ssize"></el-table-column>

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
    this.getStockList()
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
      StockList:[],//出库信息列表
      total:0,//总记录数
      addDialogVisible:false,//对话框状态

      //添加表单信息
      addForm:{
        
      },

      //修改用户信息
      editForm:{},
      //显示/隐藏修改用户栏
      editDialogVisible:false,
    };
  },

  //方法
  methods:{



    // 获取库存信息
    async getStockList(){
      const{data:res} =await this.$http.get("getStock",{params:this.queryInfo}) //发起get请求
      this.StockList=res.data;//用户列表数据封装
      this.total=res.numbers;//总用户数封装
    },


    //处理分页页面变化 最大数
    handleSizeChange(newSize){
      this.queryInfo.pageSize=newSize;
      this.getStockList();
    },

    //pageNum的触发动作
    handleCurrentChange(newPage){
      this.queryInfo.pageNum=newPage;
      this.getStockList();
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