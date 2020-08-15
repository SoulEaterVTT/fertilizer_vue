<template>
  <div class="manager-contain">
    <div class="head">
      <el-form :inline="true" :model="reqTemp">
        <span class="query-name">区域：</span>
        <el-select
          v-model="reqTemp.areaId"
          class="headSelect"
          clearable
          placeholder="请选择区域"
          @change="setParentValue"
        >
          <el-option
            v-for="item in parentData"
            :key="item.id"
            :label="item.location"
            :value="item.id"
          />
        </el-select>
        <el-input v-model="reqTemp.name" placeholder="姓名" class="headSelect"></el-input>

        <el-input v-model="reqTemp.mobileNum" placeholder="手机号" class="headSelect"></el-input>

        <el-button type="primary" @click="getUserList" icon="el-icon-search">查询</el-button>
        <el-button type="primary" icon="el-icon-add" @click="handleCreate">添加</el-button>
      </el-form>
    </div>
    <div class="table-contain3">
      <el-table
        :data="tableData"
        border
        stripe
        highlight-current-row
        style="width:100%"
        @cell-mouse-enter="handleMouseEnter"
        @cell-mouse-leave="handleMouseOut"
      >
        <el-table-column property="name" label="姓名" align="center" />
        <el-table-column property="mobileNum" label="手机号" align="center" />
        <el-table-column property="address" label="地址" align="center" />

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <svg-icon style="color:#bfcbd9" icon-class="edit" @click="handleEdit(scope.row)" />
              <svg-icon style="color:#bfcbd9" icon-class="delete" @click="handleDelete(scope.row)" />
              <svg-icon style="color:#bfcbd9" icon-class="detail" @click="handleDetail(scope.row)" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="elrow-class">
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              v-if="paginations.total > 0"
              background
              :page-sizes="paginations.pageSizes"
              :page-size="paginations.pageSize"
              :layout="paginations.layout"
              :total="paginations.total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </el-col>
      </el-row>

      <el-drawer
        ref="drawer"
        :visible.sync="dialogFormVisible"
        direction="rtl"
        :modal="false"
        :show-close="false"
        size="100%"
        class="form-container"
      >
        <div
          class="form-content"
          style="padding-top:10%"
          :style="active"
          @mouseover="mouseOver"
          @mouseleave="mouseLeave"
        >
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="right"
            label-width="100px"
          >
            <div class="content">
              <div class="content-left">
                <el-form-item prop="name" label="姓名">
                  <el-input v-model="temp.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item prop="mobileNum" label="手机号">
                  <el-input v-model="temp.mobileNum" placeholder="请输入手机号" />
                </el-form-item>
              </div>
              <div class="content-right">
                <el-form-item label="区域">
                  <el-select
                    v-model="temp.areaId"
                    style="width:100%"
                    placeholder="请选择区域"
                    @change="setParentValue"
                  >
                    <el-option
                      v-for="item in parentData"
                      :key="item.id"
                      :label="item.location"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item prop="address" label="地址">
                  <el-input v-model="temp.address" placeholder="请输入地址" />
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div slot="footer" class="form-footer">
            <el-button class="cancle-btn" @click="dialogFormVisible = false">取消</el-button>

            <el-button
              type="primary"
              class="affirm-btn"
              @click="dialogStatus === 'create' ? createData() : updateData()"
            >确认</el-button>
          </div>
        </div>
      </el-drawer>

      <el-drawer
        ref="drawer"
        :visible.sync="fieldDialogFormVisible"
        direction="rtl"
        :modal="false"
        :show-close="false"
        size="100%"
        class="form-container"
      >
        <div class="form-content2" :style="active" @mouseover="mouseOver" @mouseleave="mouseLeave">
          <div class="content-header-search">
            <svg-icon
              :icon-class="add_icon_name"
              @mouseover="handleAddMouseOver"
              @mouseleave="handleAddMouseLeave"
              @click="handleCreateField"
            />
          </div>
          <el-table
            :data="fieldData"
            border
            stripe
            highlight-current-row
            style="width:100%"
            @cell-mouse-enter="handleMouseEnter"
            @cell-mouse-leave="handleMouseOut"
          >
            <el-table-column property="treeName" label="品种" align="center" />
            <el-table-column property="tdSize" label="亩数" align="center" />
            <el-table-column property="treeAge" label="树龄" align="center" />
            <el-table-column property="tdRemark" label="备注" align="center" />

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <svg-icon
                    style="color:#bfcbd9"
                    icon-class="edit"
                    @click="handleUpdateField(scope.row)"
                  />
                  <svg-icon
                    style="color:#bfcbd9"
                    icon-class="delete"
                    @click="handleDeleteField(scope.row)"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="form-footer">
            <el-button class="cancle-btn" @click="fieldDialogFormVisible = false">返回</el-button>
          </div>
        </div>
      </el-drawer>

      <div v-if="isShowForm">
        <el-dialog
          :title="fielDialogStatus=='create'?'添加地块':'更新地块'"
          :visible.sync="isShowForm"
          width="30%"
          :close-on-click-modal="false"
          :before-close="closeDialog"
        >
          <el-form
            ref="fieldForm"
            :model="fieldEditTemp"
            :rules="rules"
            label-position="right"
            label-width="100px"
            style="margin:19px;"
          >
            <el-form-item prop="treeTypeId" label="品种">
              <el-select
                v-model="fieldEditTemp.treeTypeId"
                class="headSelect"
                clearable
                placeholder="请选择品种"
              >
                <el-option
                  v-for="item in varietyData"
                  :key="item.id"
                  :label="item.treeName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="tdSize" label="亩数">
              <el-input v-model="fieldEditTemp.tdSize" />
            </el-form-item>
            <el-form-item prop="treeAge" label="种树时间">
              <el-input v-model="fieldEditTemp.treeAge" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="fieldEditTemp.tdRemark"
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              @click="fielDialogStatus=='create'?createFieldData():updateFieldData()"
            >确 定</el-button>
            <el-button @click="closeDialog">取 消</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addUser,
  selectUser,
  deleteUserById,
  updateUser,
  getAreaList
} from "@/api/userApi.js";
import {
  addField,
  selectField,
  deleteFieldById,
  updateField,
  selectFieldDetail
} from "@/api/fieldApi.js";
import { selectTreeType } from "@/api/treeTypeApi.js";
import moment from "moment";
export default {
  filters: {
    formatDate: function(value) {
      return moment(parseInt(value)).format("YYYY-MM-DD h:mm:ss");
    }
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8|9][0-9]{9}$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };
    return {
      searchText: "",
      add_icon_name: "add_no",
      active: "",
      show: false,
      tableData: [],
      parentData: [],
      varietyData: [],
      fieldData: [],
      isShowForm: false,
      userId: null,
      paginations: {
        total: 0,
        pageIndex: 1,
        pageSize: 14,
        pageSizes: [14, 20],
        layout: "total, sizes, prev, pager, next, jumper"
      },
      dialogFormVisible: false,
      fieldDialogFormVisible: false,
      dialogStatus: "",
      fielDialogStatus: "",
      temp: {
        id: null,
        name: null,
        mobileNum: null,
        address: null,
        password: null,
        areaId: null,
        createTime: null,
        updateTime: null
      },
      fieldTemp: {
        id: null,
        userId: null,
        size: null,
        treeName: null,
        treeAge: null,
        treeTypeId: null,
        remark: null,
        createTime: null,
        updateTime: null
      },
      fieldEditTemp: {
        tdId: null,
        tdRemark: null,
        tdSize: null,
        treeAge: null,
        treeName: null,
        userAddress: null,
        userId: null,
        userMobileNum: null,
        userName: null,
        treeTypeId: null
      },

// id: "bc3739b0-33e6-40b5-bb25-df095e878ac3"
// remark: ""
// size: "5"
// treeAge: 2014
// treeTypeId: "c2297b3a-a539-46cd-8fee-390854e9ab19"
// userId: "00b12305-0472-48cf-ad05-37bce021b901"

      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur"
          }
        ],
        mobileNum: [{ required: true, validator: checkPhone, trigger: "blur" }],
        address: [
          { required: true, message: "请输入地址", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 5 到 50 个字符",
            trigger: "blur"
          }
        ],
        size: [{ required: true, message: "请输入亩数", trigger: "blur" }],
        treeAge: [{ required: true, message: "请输入树龄", trigger: "blur" }]
      },
      reqTemp: {
        name: null,
        mobileNum: null,
        areaId: null
      }
    };
  },
  watch: {
    show(value) {
      if (value) {
        document.body.addEventListener("click", this.close);
      } else {
        document.body.removeEventListener("click", this.close);
      }
    }
  },
  created() {},
  mounted() {
    selectTreeType(1, 500, {}).then(res => {
      this.varietyData = res.data.list;
    });
    getAreaList().then(res => {
      this.parentData = res.data;
    });
    this.getUserList();
  },
  methods: {
    handleMouseEnter: function(row, column, cell, event) {
      cell.children[0].children[0].children[0].style.color = "#70cdf1";
      cell.children[0].children[0].children[1].style.color = "#f56c6c";
      cell.children[0].children[0].children[2].style.color = "#42b983";
      cell.children[0].children[0].children[3].style.color = "#64d9d6";
    },
    handleMouseOut: function(row, column, cell, event) {
      cell.children[0].children[0].children[0].style.color = "#bfcbd9";
      cell.children[0].children[0].children[1].style.color = "#bfcbd9";
      cell.children[0].children[0].children[2].style.color = "#bfcbd9";
      cell.children[0].children[0].children[3].style.color = "#bfcbd9";
    },
    handleAddMouseOver() {
      this.add_icon_name = "add_yes";
    },
    handleAddMouseLeave() {
      this.add_icon_name = "add_no";
    },
    mouseOver() {
      this.active =
        "box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);";
    },
    mouseLeave() {
      this.active = "";
    },
    getUserList() {
      selectUser(
        this.paginations.pageIndex,
        this.paginations.pageSize,
        this.reqTemp
      ).then(res => {
        this.paginations.total = res.data.total;
        this.tableData = res.data.list;
      });
    },
    // 每页多少条切换
    handleSizeChange(pageSize) {
      this.paginations.pageSize = pageSize;
      this.getUserList();
    },
    // 上下分页
    handleCurrentChange(page) {
      this.paginations.pageIndex = page;
      this.getUserList();
    },
    handleDelete(row) {
      this.$confirm("是否确定删除此用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deleteUserById(row.id).then(() => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUserList();
          });
        })
        .catch(() => {
          this.$message({
            message: "已取消删除"
          });
        });
    },
    handleEdit(row) {
      this.temp = row;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    handleDetail(row) {
      this.userId = row.id;
      this.fieldDialogFormVisible = true;
      this.getFieldList();
    },
    resetTemp() {
      this.temp = {
        id: null,
        name: null,
        mobileNum: null,
        address: null,
        password: null,
        areaId: null,
        createTime: null,
        updateTime: null
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addUser(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getUserList();
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          updateUser(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getUserList();
          });
        }
      });
    },
    setParentValue(event) {
      this.temp.areaId = event;
    },
    getFieldList() {
      selectField(1, 15, { userId: this.userId }).then(res => {
        this.fieldData = res.data.list;
      });
    },
    handleCreateField() {
      this.fielDialogStatus = "create";
      this.isShowForm = true;
    },
    handleUpdateField(row) {
      selectFieldDetail(row.tdId).then(res => {
        console.log(res);
      });
      // this.fieldEditTemp = row;
      // this.fielDialogStatus = "update";
      // this.isShowForm = true;
    },
    handleDeleteField(row) {
      this.$confirm("是否确定删除此地块?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deleteFieldById(row.tdId).then(() => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getFieldList();
          });
        })
        .catch(() => {
          this.$message({
            message: "已取消删除"
          });
        });
    },
    createFieldData() {
      this.$refs["fieldForm"].validate(valid => {
        if (valid) {
          this.fieldTemp = {
            id: this.fieldEditTemp.tdId,
            userId: this.userId,
            size: this.fieldEditTemp.tdSize,
            treeAge: this.fieldEditTemp.treeAge,
            treeTypeId: this.fieldEditTemp.treeTypeId,
            remark: this.fieldEditTemp.tdRemark
          };
          addField(this.fieldTemp).then(() => {
            this.getFieldList();
            this.closeDialog();
          });
        }
      });
    },
    updateFieldData() {
      this.$refs["fieldForm"].validate(valid => {
        if (valid) {
          this.fieldTemp = {
            id: this.fieldEditTemp.tdId,
            userId: this.userId,
            size: this.fieldEditTemp.tdSize,
            treeAge: this.fieldEditTemp.treeAge,
            treeTypeId: this.fieldEditTemp.treeTypeId,
            remark: this.fieldEditTemp.tdRemark
          };
          updateField(this.fieldTemp).then(() => {
            this.getFieldList();
            this.closeDialog();
          });
        }
      });
    },
    closeDialog() {
      this.resetFieldForm();
      this.isShowForm = false;
      this.$refs["fieldForm"].clearValidate();
    },
    resetFieldForm() {
      this.fieldTemp = {
        id: null,
        userId: null,
        size: null,
        treeAge: null,
        remark: null,
        createTime: null,
        updateTime: null
      };
      this.fieldEditTemp = {
        tdId: null,
        tdRemark: null,
        tdSize: null,
        treeAge: null,
        treeName: null,
        userAddress: null,
        userId: null,
        userMobileNum: null,
        userName: null
      };
    }
  }
};
</script>

<style lang="scss" scoped></style>
