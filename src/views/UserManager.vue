<template>
  <div class="manager-contain">
    <div :class="{ show: show }" class="content-header-search">
      <svg-icon
        :icon-class="add_icon_name"
        @mouseover="handleAddMouseOver"
        @mouseleave="handleAddMouseLeave"
        @click="handleCreate"
      />
    </div>
    <div class="table-contain">
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
                <el-form-item prop="parent" label="负责人">
                  <el-select
                    v-model="temp.parentId"
                    style="width:100%"
                    placeholder="请选择负责人"
                    @change="setParentValue"
                  >
                    <el-option
                      v-for="item in parentData"
                      :key="item.id"
                      :label="item.name"
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
    </div>
  </div>
</template>

<script>
import {
  addUser,
  selectUser,
  deleteUserById,
  updateUser,
  selectParentUser
} from "@/api/userApi.js";
export default {
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
      // 需要给分页组件传的信息
      paginations: {
        total: 0, // 总数
        pageIndex: 1, // 当前位于哪页
        pageSize: 15, // 1页显示多少条
        pageSizes: [15, 20], // 每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        id: null,
        name: null,
        mobileNum: null,
        address: null,
        password: null,
        parentId: null,
        createTime: null,
        updateTime: null
      },
      rules: {
        parent: [
          { required: true, message: "请选择负责人", trigger: "change" }
        ],
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
        ]
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
    selectParentUser().then(res => {
      this.parentData = res.data;
    });
    this.getUserList();
  },
  methods: {
    setAccessValue(event) {
      this.temp.access = event;
    },
    setDomainValue(event) {
      this.temp.domain = event;
    },
    handleMouseEnter: function(row, column, cell, event) {
      cell.children[0].children[0].children[0].style.color = "#64d9d6";
      cell.children[0].children[0].children[1].style.color = "#f56c6c";
    },
    handleMouseOut: function(row, column, cell, event) {
      cell.children[0].children[0].children[0].style.color = "#bfcbd9";
      cell.children[0].children[0].children[1].style.color = "#bfcbd9";
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
    getUserListByKeyWords() {
      if (this.searchText !== null && this.searchText !== "") {
        selectParentUser(
          this.paginations.pageIndex,
          this.paginations.pageSize,
          this.searchText
        ).then(res => {
          this.paginations.total = res.data.total;
          this.tableData = res.data.list;
        });
      }
    },
    getUserList() {
      selectUser(
        this.paginations.pageIndex,
        this.paginations.pageSize,
        {}
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
          deleteUserById(row.userId).then(res => {
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
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    resetTemp() {
      this.temp = {
        username: null,
        userId: null,
        platformId: null,
        access: null,
        bindId: null,
        domain: null,
        password: null,
        status: null,
        type: null
      };
    },

    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
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
      this.temp.parentId = event;
    },
    click() {
      this.show = !this.show;
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus();
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur();
      this.options = [];
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
