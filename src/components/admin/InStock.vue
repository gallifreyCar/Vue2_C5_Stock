<template>
  <div>
    <h2>订单列表</h2>
<!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>入库管理</el-breadcrumb-item>
    </el-breadcrumb>
<!--      用户列表主体-->
      <el-card>
        <el-row :gutter="25"> <!--间隙-->
<!--        搜索区域-->
<!--        搜索添加-->
          <el-col :span="10" >  <!--列宽-->
            <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @click="getinStockList">
              <el-button slot="append" icon="el-icon-search" @click="getinStockList">

              </el-button>
            </el-input>
          </el-col>
          <!-- 按钮-->
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible =true">添加表单</el-button>
          </el-col>
        </el-row>

        <!--用户列表   border边框   stripe隔行变色-->
        <el-table :data="inStockList" border:true stripe>

          
          <el-table-column label="订单编号" prop="ono"></el-table-column>
          <el-table-column label="供应商姓名" prop="pname"></el-table-column>
          <el-table-column label="联系方式" prop="ptel"></el-table-column>
          <el-table-column label="收货地址" prop="paddr"></el-table-column>
          <el-table-column label="货物信息" prop="gname"></el-table-column>
          <el-table-column label="货物数量" prop="innum"></el-table-column>
          <el-table-column label="入库日期" prop="indate"></el-table-column>
          <el-table-column label="货物单价" prop="inprice"></el-table-column>
          <el-table-column label="入库仓库" prop="sname"></el-table-column>
     

          <el-table-column label="操作" >
            <template slot-scope="scope">

              <!-- 修改 -->
              <el-tooltip effect="dark" content="修改信息" placement="top-start" :enterable="false" >
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
              </el-tooltip>
              <!-- 删除 -->
              <el-tooltip effect="dark" content="删除表单" placement="top-start" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click= "deleteInStock(scope.row.ono)"></el-button>
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
              :page-sizes="[1, 3, 5,10 ,20,100]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
        </div>
      </el-card>

    <!--新增用户表对话框-->
    <el-dialog title="添加入库订单" :visible.sync="addDialogVisible" @close="addDialogClosed" width="30%">
      <el-form  ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top" size="mini">
        <el-form-item label="订单编号" prop="ono">
          <el-input v-model="addForm.ono"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="pno" >
          <el-select v-model="addForm.pno" placeholder="请选择供应商">
            <el-option v-for="item in this.ProviderList" :key="item.pno" :label="item.pname" :value="item.pno"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物信息" prop="gno"  >
          <el-select v-model="addForm.gno" placeholder="请选择货物">
            <el-option v-for="item in this.GoodList" :key="item.gno" :label="item.gname" :value="item.gno"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物数量" prop="innum">
          <el-input  v-model="addForm.innum"></el-input>
        </el-form-item>
        <el-form-item label="入库日期" prop="indate">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.indate" style="width: 100%;" ></el-date-picker>
        </el-form-item>
        <el-form-item label="货物单价" prop="inprice">
            <el-input v-model="addForm.inprice"></el-input>
        </el-form-item>
        <el-form-item label="入库仓库" prop="sno" >
          <el-select v-model="addForm.sno" placeholder="请选择入库仓库">
              <el-option v-for="item in this.StockHouseList" :key="item.sno" :label="item.sname" :value="item.sno"></el-option>
          </el-select>
        </el-form-item>  
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addInStock">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用户表对话框-->
    <el-dialog title="修改表单" :visible.sync="editDialogVisible" @close="editDialogClosed" width="30%">
      <el-form  ref="editFormRef" :model="editForm" :rules="addFormRules" label-position="top" size="mini">
        <el-form-item label="订单编号" prop="ono">
          <el-input v-model="editForm.ono" disabled></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="pno" >
          <el-select v-model="editForm.pno" placeholder="请选择供应商">
            <el-option v-for="item in this.ProviderList" :key="item.pno" :label="item.pname" :value="item.pno"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物信息" prop="gno"  >
          <el-select v-model="editForm.gno" placeholder="请选择货物">
            <el-option v-for="item in this.GoodList" :key="item.gno" :label="item.gname" :value="item.gno"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物数量" prop="innum">
          <el-input v-model="editForm.innum"></el-input>
        </el-form-item>
        <el-form-item label="入库日期" prop="indate">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.indate" style="width: 100%;" ></el-date-picker>
        </el-form-item>
        <el-form-item label="货物单价" prop="inprice">
            <el-input v-model="editForm.inprice"></el-input>
        </el-form-item>
        <el-form-item label="入库仓库" prop="sno" >
          <el-select v-model="editForm.sno" placeholder="请选择入库仓库">
              <el-option v-for="item in this.StockHouseList" :key="item.sno" :label="item.sname" :value="item.sno"></el-option>
          </el-select>
        </el-form-item>  
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editInStock">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  //onLoad()
  created() {
    this.getGoodList()
    this.getinStockList()
    this.getProviderList()
    this.getStockHouseList()
    
  },
  //数据返回 创建属性
  data(){

    return{

      //查询信息实体
      queryInfo:{
        query:"",//查询信息
        pageNum:1,//当前页
        pageSize:3,//每页最大数
      },
    
      ProviderList:[],
      inStockList:[],//出库信息列表
      StockHouseList:[],
      GoodList:[],

      total:0,//总记录数
      addDialogVisible:false,//对话框状态

      //添加表单信息
      addForm:{
        ono:"",
        pno:"",
        gno:"",
        inprice:"",
        indate:"",
        sno:""
        
      },

      //修改用户信息
      editForm:{},
      //显示/隐藏修改用户栏
      editDialogVisible:false,

      //添加用户表单验证
      addFormRules: {
        ono: [
          {required: true, message: '请输入订单编号', trigger: 'blur'},
          {min: 1, max: 5, message: '长度不超过5的字符', trigger: 'blur'}
        ],
        innum: [
          {required: true, message: '请输入货物数量', trigger: 'blur'},
          {min: 1, max:4 , message: '不超过4位的整数', trigger: 'blur'}
        ],
        inprice: [
          {required: true, message: '请输入价格', trigger: 'blur'},
          {min: 1, max: 4, message: '不超过4位数字', trigger: 'blur'}
        ],
        pno: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        gno: [
          { required: true, message: '请选择货物', trigger: 'change' }
        ],
        indate: [
          {type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        sno: [
          { required: true, message: '请选择入库仓库', trigger: 'change' }
        ],

      },

      //修改用户表单验证
      editFormRules: {
         ono: [
          {required: false, message: '请输入订单编号', trigger: 'blur'},
          {min: 1, max: 5, message: '长度不超过5的字符', trigger: 'blur'}
        ],
        innum: [
          {required: true, message: '请输入货物数量', trigger: 'blur'},
          {min: 1, max:4 , message: '不超过4位的整数', trigger: 'blur'}
        ],
        inprice: [
          {required: true, message: '请输入价格', trigger: 'blur'},
          {min: 1, max: 4, message: '不超过4位数字', trigger: 'blur'}
        ],
        pno: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        gno: [
          { required: true, message: '请选择货物', trigger: 'change' }
        ],
        indate: [
          {type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        sno: [
          { required: true, message: '请选择入库仓库', trigger: 'change' }
        ],

      },
    };
  },

  //方法
  methods:{
    // 获取库存信息
    async getStockHouseList(){
      const{data:res} =await this.$http.get("getStockHouse",{params:this.queryInfo}) //发起get请求
      this.StockHouseList=res.data;//用户列表数据封装
      this.total=res.numbers;//总用户数封装
    },

      // 获取供应商信息
    async getProviderList(){
      const{data:res} =await this.$http.get("getProvider",{params:this.queryInfo}) //发起get请求
      this.ProviderList=res.data;//用户列表数据封装

    },

        // 获取库存信息
    async getGoodList(){
      const{data:res} =await this.$http.get("getGood",{params:this.queryInfo}) //发起get请求
      this.GoodList=res.data;//用户列表数据封装

    },

    // 获取入库信息
    async getinStockList(){
      const{data:res} =await this.$http.get("getInStock",{params:this.queryInfo}) //发起get请求
      this.inStockList=res.data;//用户列表数据封装
      this.total=res.numbers;//总用户数封装
    },

   
  



    //处理分页页面变化 最大数
    handleSizeChange(newSize){
      this.queryInfo.pageSize=newSize;
      this.getinStockList();
    },

    //pageNum的触发动作
    handleCurrentChange(newPage){
      this.queryInfo.pageNum=newPage;
      this.getinStockList();
    },



    // 监听用户的操作
    addDialogClosed(){
        this.$refs.addFormRef.resetFields();
    },

    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },


    //添加用户
    addInStock(){
      this.$refs.addFormRef.validate(async valid=>{
            console.log(valid);
            // 验证后台，不成功返回
             if(!valid) return;
             const{data:res}=await this.$http.post("addInStock",this.addForm);
             if(res!="success"){
               return this.$message.error("操作失败");
             }
              this.$message.success("操作成功");
              this.addDialogVisible = false;
              await this.getInStockList();
          });
    },

    //删除
    async deleteInStock(ono){
     const confirmResult =await this.$confirm("此操作将永久删除表单，是否继续？",'警告',{
       confirmButtonText:"确定",
       cancelButtonClass:"取消",
       type:'warning'
     }).catch(err=>err)
      if(confirmResult!='confirm'){
        return this.$message.info("已取消删除")
      }
      const{data:res}=await this.$http.post("deleteInStock?ono="+ono);
      console.log(res);
      if(res!="success"){
        return this.$message.error("操作失败");
      }
      this.$message.success("操作成功");
      await this.getUserList();
    },


    //显示对话框
    async showEditDialog(Info){
      
      this.editForm=Info;//查询出用户信息反填到编辑表单里面
      this.editDialogVisible=true;//开启编辑对话框
    },

   //修改用户
  editInStock(){
    this.$refs.editFormRef.validate(async valid=>{
      console.log(valid);
      // 验证数据合法性，不成功返回
      if(!valid) return;
      const{data:res}=await this.$http.post("editInStock",this.editForm);
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