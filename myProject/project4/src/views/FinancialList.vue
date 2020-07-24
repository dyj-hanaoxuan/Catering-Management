<template>
  <!-- ----------------------------------------供应商支出表------------------------------ -->
  <div class="FinancialListBox">
     <breadcrumb text="财务分析>财务管理"></breadcrumb>
    <!-- 查询------------->
    <el-card class="eCardSearch">
      <el-form :inline="true" label-position="left" class="SearchBox">
        <el-form-item label="供应商">
          <el-input v-model="userInfo.receivingUnit" placeholder="供应商:"></el-input>
        </el-form-item>
        <el-form-item label="支出时间">
          <el-date-picker
            v-model="userInfo.payoutDate"
            type="date"
            placeholder="支出时间:"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            round
            class="btnSearch search"
            @click="search"
          >查询</el-button>
          <el-button type="primary" icon="el-icon-plus" round class="btnAdd" @click="addInfo">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 主题部分（表格里面的数据）----------->
    <div class="body">
      <template>
        <el-table :data="tableData" style="width:100%">
          <el-table-column prop="receivingUnit" label="供应商"></el-table-column>
          <el-table-column prop="staffName" label="负责人姓名"></el-table-column>
          <el-table-column prop="payoutReason" label="支出事由"></el-table-column>
          <el-table-column prop="payoutAmount" label="支出金额"></el-table-column>
          <el-table-column prop="detail" label="详细信息"></el-table-column>
          <el-table-column prop="payoutDate" label="支出日期"></el-table-column>

          <el-table-column prop="control" label="操作">
            <template slot-scope="scope">
              <!-- 修改  按钮 -->
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                class="btnEdit"
                @click="editData(scope.row)"
              >修改</el-button>

              <!-- 删除按钮 -->
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                class="btnDel"
                @click="delData(scope.row.receivingId)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
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
    </div>

    <!-----------------------------------       下面是模态框     ------------------------------------- -->
    <el-dialog title="供货商支出" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <!-- 下面的<div>-------</div>     dialog对话框里面的内容 -->
      <div>
        <el-form ref="form" :model="editObj" label-width="100px">
          <!-- <el-form-item label="收款单位编号:" style="disabled">
                      <el-input v-model="editObj.receivingId"></el-input>
          </el-form-item>-->
          <el-form-item label="供应商:">
            <el-input v-model="editObj.receivingUnit"></el-input>
          </el-form-item>
          <el-form-item label="负责人姓名:">
            <el-input v-model="editObj.staffName"></el-input>
          </el-form-item>
          <el-form-item label="支出事由:">
            <el-input v-model="editObj.payoutReason"></el-input>
          </el-form-item>
          <el-form-item label="支出金额:">
            <el-input v-model="editObj.payoutAmount"></el-input>
          </el-form-item>
          <el-form-item label="详细信息:">
            <el-input v-model="editObj.detail"></el-input>
          </el-form-item>
          <el-form-item label="支出日期:" v-model="editObj.payoutDate">
            <el-date-picker
              v-model="editObj.payoutDate"
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
var status = 0;
export default {
     components: {
       breadcrumb
     },
  inject: ["reload"],
  data() {
    return {
      current: 1,
      total: "",
      limit: "",

      // 查询用户信息的数据存
      userInfo: {
        receivingUnit: "",
        payoutDate: ""
      },
      // 表里面的数据
      tableData: [],
      // 弹框的显示
      dialogVisible: false,

      // 修改数据将存入一个新的对象
      editObj: {
        receivingId: "",
        receivingUnit: "",
        staffName: "",
        payoutReason: "",
        payoutAmount: "",
        detail: "",
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
          "/api/financial/delUnitPayout",
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
    // 点击新增，弹出对话框 将数组设置为空
    addInfo() {
      this.status = 0;
      console.log(this.status);
      this.dialogVisible = true;
      this.editObj = {
        receivingUnit: "",
        staffName: "",
        payoutReason: "",
        payoutAmount: "",
        detail: "",
        payoutDate: ""
      };

      this.tableData.push(this.userInfo);
      this.userInfo = {
        one: "",
        two: "",
        three: "",
        four: "",
        five: "",
        six: ""
      };
    },
    // 删除一组数据，给他加一个Dialog对话框，确认删除then，如果不执行.catch
    delData(idx) {
      this.$confirm("确认删除？")
        .then(_ => {
          const receivingId = idx;
          this.$axios
            .post(
              "/api/financial/delUnitPayout",
              {
                receivingId: receivingId
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

    // ----点击修改，渲           染到模态框里面
    editData(item) {
      this.status = 1;
      console.log(this.status);
      this.editObj = {
        receivingId: item.receivingId,
        receivingUnit: item.receivingUnit,
        staffName: item.staffName,
        payoutReason: item.payoutReason,
        payoutAmount: item.payoutAmount,
        detail: item.detail,
        payoutDate: item.payoutDate
      };
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },

    // 点击确认后   修改表格数据
    confirm() {
      this.dialogVisible = false;
      if (this.status === 1) {
        console.log(this.status);
        console.log(this.editObj.receivingId);

        this.$axios
          .post(
            "/api/financial/changeUnitPayout",
            {
              receivingId: this.editObj.receivingId,
              receivingUnit: this.editObj.receivingUnit,
              staffName: this.editObj.staffName,
              payoutReason: this.editObj.payoutReason,
              payoutAmount: this.editObj.payoutAmount,
              detail: this.editObj.detail,
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
        console.log(this.editObj.receivingId);
        this.$axios
          .post(
            "/api/financial/addUnitPayout",
            {
              receivingId: this.editObj.receivingId,
              receivingUnit: this.editObj.receivingUnit,
              staffName: this.editObj.staffName,
              payoutReason: this.editObj.payoutReason,
              payoutAmount: this.editObj.payoutAmount,
              detail: this.editObj.detail,
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
        // Vue.set(this.tableData, this.userIndex, this.editObj);
      }
    },
    // 查询数据
    search() {
      const receivingUnit = this.userInfo.receivingUnit;
      const payoutDate = this.userInfo.payoutDate;
      this.$axios
        .post(
          "/api/financial/queryUnitPayout",
          {
            receivingUnit: receivingUnit,
            payoutDate: payoutDate,
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
  },
  // 挂载前，勾子函数,用于请求后台到数据，然后渲染在表格内
  mounted: function() {
    this.$axios
      .post(
        "/api/financial/queryUnitPayout",
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
.FinancialListBox {
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