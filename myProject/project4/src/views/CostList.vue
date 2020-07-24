
<template>
  <div class="CostListBox">
     <breadcrumb text="财务分析>成本管理"></breadcrumb>
    <!--查询-->
    <el-card class="eCardSearch">
      <el-form :inline="true" label-position="left" class="SearchBox">
        <el-form-item label="起始日期">
          <el-date-picker
            v-model="userInfo.startDate"
            type="date"
            placeholder="选择起始日期:"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="userInfo.endDate"
            type="date"
            placeholder="选择结束日期:"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search" round class="btnSearch">查询</el-button>
          <el-button type="primary" @click="addData" icon="el-icon-plus" class="btnAdd" round>新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 主题部分（表格里面的数据）----------->
    <el-card>
      <el-table
        :data="tableData"
        stripe
        style="width:100%"
        class="table"
        :cell-style="rowClass"
        :header-cell-style="headClass"
      >
        <el-table-column prop="staffName" label="出纳姓名" min-width="50%"></el-table-column>
        <el-table-column prop="empSalary" label="员工工资" min-width="60%"></el-table-column>
        <el-table-column prop="rent" label="房租" min-width="50%"></el-table-column>
        <el-table-column prop="waterFee" label="水费" min-width="50%"></el-table-column>
        <el-table-column prop="electricityFee" label="电费" min-width="50%"></el-table-column>
        <el-table-column prop="totalAmount" label="其他支出总金额" min-width="50%"></el-table-column>
        <el-table-column prop="profit" label="利润" min-width="50%"></el-table-column>
        <el-table-column prop="payoutDate" label="支出时间" min-width="50%"></el-table-column>
        <el-table-column prop="price" label="操作" min-width="100%">
          <template slot-scope="scope">
            <!-- 修改  按钮 -->
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-edit"
              class="btnEdit"
              @click="editData(scope.row)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              class="btnDel"
              @click="delData(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        background
        @current-change="CurrentChange"
        layout="total, prev, pager, next, jumper"
        :current-page.sync="current"
        :total="total"
        :page-size="limit"
      ></el-pagination>
    </div>
    <!-----------------------------------下面是模态框------------------------------------- -->
    <el-dialog title="编辑用户信息" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <!-- 下面的<div>-------</div>     dialog对话框里面的内容 -->
      <div>
        <el-form ref="form" :model="editObj" label-width="100px">
          <el-form-item label="出纳:">
            <el-input v-model="editObj.staffName"></el-input>
          </el-form-item>
          <el-form-item label="员工工资:">
            <el-input v-model="editObj.empSalary"></el-input>
          </el-form-item>
          <el-form-item label="房租费:">
            <el-input v-model="editObj.rent"></el-input>
          </el-form-item>
          <el-form-item label="水费:">
            <el-input v-model="editObj.waterFee"></el-input>
          </el-form-item>
          <el-form-item label="电费:">
            <el-input v-model="editObj.electricityFee"></el-input>
          </el-form-item>
          <el-form-item label="总支出:">
            <el-input v-model="editObj.totalAmount"></el-input>
          </el-form-item>
          <el-form-item label="利润:">
            <el-input v-model="editObj.profit"></el-input>
          </el-form-item>
          <el-form-item label="支出时间:">
            <el-date-picker
              v-model="userInfo.payoutDate"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- 这里@click要设置为提交 -->
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
 import breadcrumb from "./breadcrumb.vue";
// 定义一个全局状态0为增加，1为修改
var status = 0;
export default {
  inject: ["reload"],
   components: {
     breadcrumb
   },
  data() {
    return {
      current: 1,
      total: "",
      limit: "",

      // 每个input代表一个字段名，将查询的input框，全部放在一个对象里面。
      userInfo: {
        startDate: "",
        endDate: ""
      },
      // 表里面的数据
      tableData: [],
      // 弹框的显示
      dialogVisible: false,

      // 修改数据将存入一个新的对象
      editObj: {
        id: "",
        staffName: "",
        empSalary: "",
        rent: "",
        waterFee: "",
        electricityFee: "",
        payoutDate: ""
      }
    };
  },

  // 括号之后用分号，括号里面用逗号，各个函数分隔用逗号
  methods: {
    // 表头样式设置
    headClass() {
      return "text-align: center;background:rgb(242,242,242);color:rgb(140,138,140)";
    },
    // 表格样式设置
    rowClass() {
      return "text-align: center;";
    },
    // 请求页码
    CurrentChange(val) {
      console.log(val);
      this.$axios
        .post(
          "/api/financial/queryProfit",
          {
            pages: val, // 当前页
            limit: 5 // 页容量
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(response => {
          console.log(response);
          this.tableData = response.data.data;
        });
    },
    //   查询用户信息
    search() {
      var startDate = this.userInfo.startDate;
      var endDate = this.userInfo.endDate;

      console.log(this.userInfo.startDate, this.userInfo.endDate);
      this.$axios
        .post(
          "/api/financial/queryProfit",
          {
            startDate: startDate,
            endDate: endDate,
            pages: 1, // 当前页
            limit: 5 // 页容量
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          console.log(res.data.data);
          this.tableData = res.data.data;
          this.total = res.data.count;
          this.limit = res.data.limit;
        });
    },

    // ------------------点击出新增按钮弹对话框------------------------
    addData() {
      this.status = 0;

      this.dialogVisible = true;
      //   清空对象
      this.editObj = {
        id: "",
        staffName: "",
        empSalary: "",
        rent: "",
        waterFee: "",
        electricityFee: "",
        payoutDate: ""
      };
    },

    // --------------删除一组数据，给他加一个Dialog对话框，确认删除then，如果不执行.catch--------------------
    delData(idx) {
      this.$confirm("确认删除？")
        .then(_ => {
          var id = idx;
          console.log(id);
          this.$axios
            .post(
              "/api/financial/delOther",
              {
                id: id
              },
              {
                headers: {
                  "Content-Type": "application/json"
                }
              }
            )
            .then(res => {
              console.log(res.data);
            });
          this.reload();
        })
        .catch(_ => {});
    },

    //---------点击修改按钮打开对话框将数据表数据渲染过来----------
    editData(item) {
      this.status = 1;
      this.editObj = {
        id: item.id,
        staffName: item.staffName,
        empSalary: item.empSalary,
        rent: item.rent,
        waterFee: item.waterFee,
        electricityFee: item.electricityFee,
        totalAmount: item.totalAmount,
        profit: item.profit,
        payoutDate: item.payoutDate
      };

      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },

    // 点击对话框到确定，确定修改或新增数据
    confirm() {
      this.dialogVisible = false;
      if (this.status === 1) {
        console.log(this.status);
        this.$axios
          .post(
            "/api/financial/changeOther",
            {
              id: this.editObj.id,
              staffName: this.editObj.staffName,
              empSalary: this.editObj.empSalary,
              rent: this.editObj.rent,
              waterFee: this.editObj.waterFee,
              electricityFee: this.editObj.electricityFee,
              payoutDate: this.editObj.payoutDate
            },
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          )
          .then(res => {
            console.log(res.data);
          });
      } else {
        console.log(this.status);
        this.$axios
          .post(
            "/apifinancial/addOther",
            {
              staffName: this.editObj.staffName,
              empSalary: this.editObj.empSalary,
              rent: this.editObj.rent,
              waterFee: this.editObj.waterFee,
              electricityFee: this.editObj.electricityFee,
              payoutDate: this.editObj.payoutDate
            },
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          )
          .then(res => {
            console.log(res.data);
          });
      }
    }
  },

  // 挂载前，勾子函数
  mounted: function() {
    this.$axios
      .post(
        "/api/financial/queryProfit",
        {
          pages: 1, //  当前页数
          limit: 5 // 每页显示条数
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(res => {
        console.log(123);
        console.log(res.data);
        this.tableData = res.data.data;
        this.total = res.data.count;
        this.limit = res.data.limit;
      });
  }
};
</script>
<style  scoped>
.page {
  margin-top: 40px;
  text-align: right;
  padding-right: 100px !important;
}
.CostListBox {
  text-align: center;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
.el-table__body {
  width: 100%;
}
.table {
  padding: 20px;
  text-align: center;
  box-sizing: border-box;
}
.el-form-item__content button {
  margin-left: 40px;
}
.SearchBox {
  height: 70px;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 50px;
}
.eCardSearch {
  height: 100px;
  margin-bottom: 50px;
}
.btnSearch,
.btnAdd {
  height: 45px;
  width: 120px;
  text-align: center;
}
.btnSearch {
  color: rgb(63, 99, 255);
  border: 2px solid rgb(63, 99, 255);
  background-color: transparent;
}
.btnAdd {
  background-color: rgb(63, 99, 255);
  color: white;
  border: none;
}
.btnEdit {
  background-color: rgb(63, 99, 255);
  border: none;
}
.btnDel {
  border: none;
}
</style>