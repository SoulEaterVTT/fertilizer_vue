<template>
  <div class="manager-contain">
    <div class="head">
      <el-form :inline="true" :model="reqTemp">
        <span class="query-name">名称：</span>
        <el-select
          v-model="reqTemp.parentId"
          class="headSelect"
          clearable
          placeholder="请选择肥料"
          @change="setParentValue"
        >
          <el-option v-for="item in parentData" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>

        <el-button type="primary" @click="getUserList" icon="el-icon-search">查询</el-button>
        <el-button type="primary" icon="el-icon-add" @click="handleCreate">添加</el-button>
      </el-form>
    </div>
    <div class="form-content2" :style="active" @mouseover="mouseOver" @mouseleave="mouseLeave">
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
    </div>
  </div>
</template>

<script>
import {
  addField,
  selectField,
  deleteFieldById,
  updateField
} from "@/api/fieldApi.js";
import { selectUser } from "@/api/userApi.js";
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
      add_icon_name: "add_no",
      active: "",
      show: false,
      tableData: [],
      userData: [],
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
      reqTemp: {
        name: null,
        mobileNum: null,
        parentId: null
      },
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
    selectUser().then(res => {
      this.userData = res.data;
    });
    this.getFieldList();
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
    getFieldList() {
      selectField(
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
      this.getFieldList();
    },
    // 上下分页
    handleCurrentChange(page) {
      this.paginations.pageIndex = page;
      this.getFieldList();
    },
    handleDelete(row) {
      this.$confirm("是否确定删除此地块?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deleteFieldById(row.id).then(() => {
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
        id: null,
        name: null,
        mobileNum: null,
        address: null,
        password: null,
        parentId: null,
        createTime: null,
        updateTime: null
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
          addField(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getFieldList();
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          updateField(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getFieldList();
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
