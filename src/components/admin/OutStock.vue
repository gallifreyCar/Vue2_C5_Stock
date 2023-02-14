<template>
  <div>
    <h2>订单列表</h2>
<!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>出库管理</el-breadcrumb-item>
    </el-breadcrumb>
<!--      用户列表主体-->
      <el-card>
        <el-row :gutter="25"> <!--间隙-->
<!--        搜索区域-->
<!--        搜索添加-->
          <el-col :span="10" >  <!--列宽-->
            <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @click="getOutStockList">
              <el-button slot="append" icon="el-icon-search" @click="getOutStockList">

              </el-button>
            </el-input>
          </el-col>
          <!-- 按钮-->
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible =true">添加表单</el-button>
          </el-col>
        </el-row>

        <!--用户列表   border边框   stripe隔行变色-->
        <el-table :data="outStockList" border stripe>

        
          <el-table-column label="订单编程" prop="ono"></el-table-column>
          <el-table-column label="用户姓名" prop="cname"></el-table-column>
          <el-table-column label="联系方式" prop="ctel"></el-table-column>
          <el-table-column label="收货地址" prop="caddr"></el-table-column>
          <el-table-column label="货物信息" prop="gname"></el-table-column>
          <el-table-column label="出货数量" prop="outnum"></el-table-column>
          <el-table-column label="出货日期" prop="outdate"></el-table-column>
          <el-table-column label="出货单价" prop="outprice"></el-table-column>
          <el-table-column label="出货仓库" prop="sname"></el-table-column>
     

          <el-table-column label="操作" >
            <template slot-scope="scope">

              <!-- 修改 -->
              <el-tooltip effect="dark" content="修改信息" placement="top-start" :enterable="false" >
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog2(scope.row)"></el-button>
              </el-tooltip>
              <!-- 删除 -->
              <el-tooltip effect="dark" content="删除用户" placement="top-start" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click= "deleteUser(scope.row.ono)"></el-button>
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
 <el-dialog title="添加出库订单" :visible.sync="addDialogVisible" @close="addDialogClosed" width="30%">
      <el-form  ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top" size="mini">
        <el-form-item label="订单编号" prop="ono">
          <el-input v-model="addForm.ono"></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="cno" >
          <el-select v-model="addForm.cno" placeholder="请选择客户">
            <el-option v-for="item in this.CustomerList" :key="item.cno" :label="item.cname" :value="item.cno"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物信息" prop="gno"  >
          <el-select v-model="addForm.gno" placeholder="请选择货物">
            <el-option v-for="item in this.GoodList" :key="item.gno" :label="item.gname" :value="item.gno"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物数量" prop="outnum">
          <el-input  v-model="addForm.outnum"></el-input>
        </el-form-item>
        <el-form-item label="出库日期" prop="indate">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.outdate" style="width: 100%;" ></el-date-picker>
        </el-form-item>
        <el-form-item label="货物单价" prop="inprice">
            <el-input v-model="addForm.outprice"></el-input>
        </el-form-item>
        <el-form-item label="出库仓库" prop="sno" >
          <el-select v-model="addForm.sno" placeholder="请选择出库仓库">
              <el-option v-for="item in this.StockHouseList" :key="item.sno" :label="item.sname" :value="item.sno"></el-option>
          </el-select>
        </el-form-item>  
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOutStock">确 定</el-button>
      </span>
    </el-dialog>

   

  <!--修改用户表对话框-->
  <el-dialog title="修改表单" :visible.sync="editDialogVisible" @close="editDialogClosed" width="30%">
      <el-form  ref="editFormRef" :model="editForm" :rules="addFormRules" label-position="top" size="mini">
        <el-form-item label="订单编号" prop="ono">
          <el-input v-model="editForm.ono" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="cno" >
          <el-select v-model="editForm.cno" placeholder="请选择客户">
            <el-option v-for="item in this.CustomerList" :key="item.cno" :label="item.cname" :value="item.cno"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物信息" prop="gno"  >
          <el-select v-model="editForm.gno" placeholder="请选择货物">
            <el-option v-for="item in this.GoodList" :key="item.gno" :label="item.gname" :value="item.gno"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物数量" prop="innum">
          <el-input v-model="editForm.outnum"></el-input>
        </el-form-item>
        <el-form-item label="入库日期" prop="indate">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.indate" style="width: 100%;" ></el-date-picker>
        </el-form-item>
        <el-form-item label="货物单价" prop="inprice">
            <el-input v-model="editForm.outprice"></el-input>
        </el-form-item>
        <el-form-item label="入库仓库" prop="sno" >
          <el-select v-model="editForm.sno" placeholder="请选择入库仓库">
              <el-option v-for="item in this.StockHouseList" :key="item.sno" :label="item.sname" :value="item.sno"></el-option>
          </el-select>
        </el-form-item>  
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOutStock">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  //onLoad()
  created() {
    this.getOutStockList()
    this.getCustomerList()
    this.getGoodList()
    this.getStockHouseList()
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
      CustomerList:[],
      outStockList:[],//出库信息列表
      StockHouseList:[],
      GoodList:[],

      total:0,//总记录数
      addDialogVisible:false,//对话框状态

      //添加表单信息
      addForm:{},

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



    // 获取出库信息
    async getOutStockList(){
      const{data:res} =await this.$http.get("getOutStock",{params:this.queryInfo}) //发起get请求
      this.outStockList=res.data;//用户列表数据封装
      this.total=res.numbers;//总用户数封装

    },

      // 获取库存信息
    async getStockHouseList(){
      const{data:res} =await this.$http.get("getStockHouse",{params:this.queryInfo}) //发起get请求
      this.StockHouseList=res.data;//用户列表数据封装
      this.total=res.numbers;//总用户数封装
    },

          // 获取库存信息
    async getGoodList(){
      const{data:res} =await this.$http.get("getGood",{params:this.queryInfo}) //发起get请求
      this.GoodList=res.data;//用户列表数据封装

    },


      // 获取信息
    async getCustomerList(){
      const{data:res} =await this.$http.get("getCustomer",{params:this.queryInfo}) //发起get请求
      this.CustomerList=res.data;//用户列表数据封装
      this.total=res.numbers;//总用户数封装
    },


    //处理分页页面变化 最大数
    handleSizeChange(newSize){
      this.queryInfo.pageSize=newSize;
      this.getOutStockList();
    },

    //pageNum的触发动作
    handleCurrentChange(newPage){
      this.queryInfo.pageNum=newPage;
      this.getOutStockList();
    },



    // 监听用户的操作
    addDialogClosed(){
        this.$refs.addFormRef.resetFields();
    },

    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },


    //添加用户
    addOutStock(){
      this.$refs.addFormRef.validate(async valid=>{
            console.log(valid);
            // 验证后台，不成功返回
             if(!valid) return;
             const{data:res}=await this.$http.post("addOutStock",this.addForm);
             if(res!="success"){
               return this.$message.error("操作失败");
             }
              this.$message.success("操作成功");
              this.addDialogVisible = false;
              await this.getUserList();
          });
    },

    //删除表单
    async deleteUser(id){
     const confirmResult =await this.$confirm("此操作将永久删除表单，是否继续？",'警告',{
       confirmButtonText:"确定",
       cancelButtonClass:"取消",
       type:'warning'
     }).catch(err=>err)
      if(confirmResult!='confirm'){
        return this.$message.info("已取消删除")
      }
      const{data:res}=await this.$http.post("deleteOutStock?id="+id);
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
  editOutStock(){
    this.$refs.editFormRef.validate(async valid=>{
      console.log(valid);
      // 验证后台，不成功返回
      if(!valid) return;
      const{data:res}=await this.$http.post("editOutStock",this.editForm);
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