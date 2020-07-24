
<template>
  <div class="container">
     <breadcrumb text="财务分析>其他支出"></breadcrumb>
    <!--查询-->
    <el-card class="eCardSearch">
      <el-form :inline="true" label-position="left" class="SearchBox">
        <el-form-item label="员工编号">
          <el-input v-model="userInfo.staffId" placeholder="输入员工编号："></el-input>
        </el-form-item>
        <el-form-item label="员工姓名">
          <el-input v-model="userInfo.staffName" placeholder="输入员工姓名："></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" round class="btnSearch" @click="search">查询</el-button>
          <el-button type="primary" icon="el-icon-plus" round class="btnAdd" @click="addData">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--表格数据-->
    <el-card>
      <el-table
        :data="tableData"
        style="width:100%"
        class="table"
        :cell-style="rowClass"
        :header-cell-style="headClass"
      >
        <el-table-column prop="staffId" label="编号" min-width="60%"></el-table-column>
        <el-table-column prop="staffName" label="员工姓名" min-width="70%"></el-table-column>
        <el-table-column prop="gender" label="性别" min-width="50%"></el-table-column>
        <el-table-column prop="job" label="工作" min-width="100%"></el-table-column>
        <el-table-column prop="workYear" label="工作年限" min-width="100%"></el-table-column>
        <el-table-column prop="basicWage" label="基本工资" min-width="100%"></el-table-column>
        <el-table-column prop="attendanceWage" label="考勤工资" min-width="100%"></el-table-column>
        <el-table-column prop="reward" label="奖惩工资" min-width="100%"></el-table-column>
        <el-table-column prop="perfBonus" label="员工绩效奖金" min-width="120%"></el-table-column>
        <el-table-column prop="actualSalary" label="实发工资" min-width="100%"></el-table-column>
        <el-table-column prop="rayrollInfo" label="发放工资信息" min-width="120%"></el-table-column>

        <el-table-column prop="price" label="操作" min-width="130%">
          <template slot-scope="scope">
            <!-- 修改  按钮 -->
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-edit"
              class="btnEdit"
              @click="editData(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              class="btnDel"
              @click="delData(scope.row.staffId)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
     <div class="block page">
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
        <el-form ref="form" :model="editObj" label-width="110px">
          <el-form-item label="出纳:">
            <el-input v-model="editObj.staffName"></el-input>
          </el-form-item>
          <el-form-item label="性别:">
            <el-input v-model="editObj.gender"></el-input>
          </el-form-item>

          <el-form-item label="工作:">
            <el-input v-model="editObj.job"></el-input>
          </el-form-item>
          <el-form-item label="工作年限:">
            <el-input v-model="editObj.workYear"></el-input>
          </el-form-item>
          <el-form-item label="基本工资:">
            <el-input v-model="editObj.basicWage"></el-input>
          </el-form-item>
          <el-form-item label="考勤工资:">
            <el-input v-model="editObj.attendanceWage"></el-input>
          </el-form-item>

          <el-form-item label="奖惩工资:">
            <el-input v-model="editObj.reward"></el-input>
          </el-form-item>

          <el-form-item label="绩效奖金:">
            <el-input v-model="editObj.perfBonus"></el-input>
          </el-form-item>

          <el-form-item label="实发工资:">
            <el-input v-model="editObj.actualSalary"></el-input>
          </el-form-item>
          <el-form-item label="工资信息:">
            <el-input v-model="editObj.rayrollInfo"></el-input>
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
 import breadcrumb from './breadcrumb.vue'
// 定义一个全局状态0为增加，1为修改
var status = 0;
export default {
   components: {
       breadcrumb
   },
  data() {
    return {
      current: 1,
      total: "",
      limit: "",
      // 每个input代表一个字段名，将查询到input框，全部放在一个对象里面。
      userInfo: {
        id: "",
        staffName: "",
        payoutDate: ""
      },
      // 表里面的数据
      tableData: [],
      // 弹框的显示
      dialogVisible: false,

      // 修改数据将存入一个新的对象
      editObj: {
        staffId: "",
        staffName: "",
        gender: "",
        job: "",
        workYear: "",
        basicWage: "",
        attendanceWag: "",
        reward: "",
        perfBonus: "",
        actualSalary: "",
        rayrollInfo: ""
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
          "/api/financial/queryWage",
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    //   在input框输入编号  姓名  查询用户信息
    search() {
      var staffId = this.userInfo.staffId;
      var staffName = this.userInfo.staffName;
      console.log(staffId, staffName);

      this.$axios
        .post(
          "/api/financial/queryWage",
          {
            staffId: staffId,
            staffName: staffName,
            pages: val, // 当前页
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

    // ------------------点击新增按钮弹出对话框------------------------
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
          const id = idx;
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
        })
        .catch(_ => {});
    },

    //---------点击修改按钮打开对话框将数据表数据渲染过来----------
    editData(item) {
      this.status = 1;
      this.editObj = {
        staffId: item.staffId,
        staffName: item.staffName,
        gender: item.gender,
        job: item.job,
        workYear: item.workYear,
        basicWage: item.basicWage,
        attendanceWage: item.attendanceWage,
        reward: item.reward,
        perfBonus: item.perfBonus,
        actualSalary: item.actualSalary,
        rayrollInfo: item.rayrollInfo
      };

      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },

    // 点击对话框中的确定，确定修改或新增数据
    confirm() {
      this.dialogVisible = false;
      if (this.status === 1) {
        console.log(this.status);

        console.log(this.editObj.staffName);
        this.$axios
          .post(
            "/api/financial/changeWage",
            {
              staffId: this.editObj.staffId,
              staffName: this.editObj.staffName,
              basicWage: this.editObj.basicWage,
              attendanceWage: this.editObj.attendanceWage,
              reward: this.editObj.reward,
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

        console.log(this.editObj.staffName);
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
        "/api/financial/queryWage",
        {
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
.StaffListBox {
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