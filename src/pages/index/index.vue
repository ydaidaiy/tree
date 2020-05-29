<template>
  <div>
    <!-- <div class="back" @click="go_back" :class="{hide:indexList.length > 0 }">返回上一级</div> -->
    <!-- 面包屑 -->
    <div class="nav">
      <div v-for="(item,index) in navList" :key="index" @click="change_nav(index)">
        {{item.name}}
        <span v-if="index !== navList.length -1" class="i i-jiantouarrow487"></span>
      </div>
    </div>
    <div class="main">
      <div class="info" v-for="(item,index) in currentList" :key="item.id">
        <div class="checked" @click="change_btn(item)">
          <div class="btn" :class="[item.checked? 'all' :item.orchecked? 'orchecked' :'']">
            <div v-show="item.checked || item.orchecked">√</div>
          </div>
          <div>{{item.name}}</div>
        </div>
        <div class="text">
          <div v-if="item.children.length > 0" @click="change_last(item,index)">下一级</div>
        </div>
      </div>
    </div>

    <div class="model" v-show="ishow_person">
      <div class="model-main">
        <div class="model-info" v-for="item in selected_person" :key="item.id">
          <div class="model-info-name">{{item.name}}</div>
          <div class="model-info-delete" @click="change_btn(item)">@</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-text" @click="show_person">已选择:员工 {{selected_person.length}}</div>
      <div class="footer-btn" @click="confirm">确定</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentList: [], // 当前展示的列表
      originalList: [], // 最原始的数据列表
      indexList: [], // 存储目录层级的数组，用于准确的返回上一层
      navList: [{ id: -1, name: "最外" }],
      ishow_person: false
    };
  },

  created() {
    setTimeout(() => {
      const list = [
        {
          id: 1,
          name: "部门一",
          children: [
            { id: 11, name: "小米", children: [] },
            { id: 12, name: "小明", children: [] },
            { id: 13, name: "小红", children: [] }
          ]
        },
        {
          id: 2,
          name: "部门二",
          children: [
            {
              id: 21,
              name: "小黑",
              children: [
                {
                  id: 211,
                  name: "小米",
                  children: [
                    { id: 2111, name: "小米白白小米白白小米白白", children: [] }
                  ]
                }
              ]
            },
            {
              id: 22,
              name: "小白",
              children: [{ id: 221, name: "小米白", children: [] }]
            }
          ]
        },
        { id: 3, name: "路飞", children: [] },
        { id: 4, name: "佐罗", children: [] },
        { id: 5, name: "佐罗", children: [] },
        { id: 6, name: "佐罗", children: [] },
        { id: 7, name: "佐罗", children: [] },
        { id: 8, name: "佐罗", children: [] },
        { id: 9, name: "佐罗", children: [] },
        { id: 10, name: "佐罗", children: [] },
        { id: 11, name: "佐罗", children: [] },
        { id: 11, name: "佐罗", children: [] },
        { id: 113, name: "佐罗", children: [] },
        { id: 141, name: "佐罗", children: [] },
        { id: 115, name: "佐罗", children: [] },
        { id: 161, name: "佐罗", children: [] },
        { id: 12, name: "1111", children: [] }
      ];
      this.init(list);
    }, 300);
  },
  computed: {
    selected_person() {
      // this.find_person().filter(item => !item.department)
      return this.find_person();
    }
  },
  methods: {
    confirm() {
      // console.log('输出--', JSON.stringify(this.originalList))
    },
    // 点击面包屑
    change_nav(i) {
      // 删除从点击的后一项开始
      if (i === this.navList.length - 1) return;
      this.navList.splice(i + 1, this.navList.length - i);
      if (i === 0) {
        this.currentList = this.originalList;
        return;
      }
      const item = this.navList[i];
      const list = this.originalList;
      let arr = [];
      list.forEach((element, i) => {
        const res = this.find_item(list[i], item);
        if (res.length > 0) {
          arr = [...res];
        }
      });
      this.currentList = arr[0].children;
    },
    // 显示选中的模态框
    show_person() {
      this.ishow_person = !this.ishow_person;
    },
    find_item(data, parameter) {
      const res = [];
      if (data.id === parameter.id && data.name === parameter.name) {
        res.push(data);
      }
      if (data.children.length > 0) {
        data.children.map(i => {
          res.push(...this.find_item(i, parameter));
        });
      }
      return res;
    },
    find_person() {
      const list = this.originalList;
      const arr = [];
      list.forEach((element, i) => {
        const res = this.getSelectedNodeIds(list[i]);
        arr.push(...res);
      });
      console.log("输出--", arr);
      return arr;
    },
    getSelectedNodeIds(data) {
      return this.getItems(data);
    },
    getItems(itemNode, key = "checked", children = "children") {
      /**
       *
       * @param {Object} itemNode 遍历对象
       * @param {String} key 对象识别标识 及对象key值为真(不为 0, null, false,'')时将被返回
       * @param {String} children 子代数组的键名
       */
      const res = [];
      itemNode[key] && res.push(itemNode);
      itemNode[children] &&
        itemNode[children].map(i => {
          res.push(...this.getItems(i));
        });
      return res;
    },
    async change_btn(item) {
      item.orchecked = false;
      item.checked = !item.checked;
      // 有父级，判断子级的状态，修改父级的状态
      if (item.parentID) {
        const parent = this.find_parent_node(item);
        this.parent_half(parent);
      }

      // 有子级 修改子级的选中状态
      if (item.children.length > 0) {
        this.set_select_all_child(item.children, item.checked);
      }
    },
    // 找父节点
    find_parent_node(list, currentList = this.originalList) {
      for (let index = 0; index < currentList.length; index++) {
        const element = currentList[index];
        const children = element.children;
        if (element.id === list.parentID) {
          return element;
        }
        const result = this.find_parent_node(list, children);
        if (result) return result;
      }
    },
    parent_half(item) {
      // 当前点击的父级
      const parent = item;
      // 选中的子级
      const checkedLength = parent.children.filter(i => i.checked).length;
      // 半选的子级
      const halfcheckedLength = parent.children.filter(i => i.orchecked).length;
      if (parent.children.length === checkedLength) {
        console.log("输出--", "子级全选，父级全选状态");
        this.change_check(parent, true, false);
      } else if (
        (parent.children.length > checkedLength && checkedLength > 0) ||
        halfcheckedLength > 0
      ) {
        console.log("输出--", "有半选的子级，父级半选");
        this.change_check(parent, false, true);
      } else if (checkedLength === 0) {
        console.log("输出--", "子级都没有选");
        this.change_check(parent, false, false);
      }

      if (parent.parentID) {
        console.log("输出--", "还有父级");
        const result = this.find_parent_node(parent, this.originalList);
        this.parent_half(result);
      }
    },
    // 父元素的状态
    change_check(data, checked, indeterminate) {
      // ，修改状态
      console.log("输出--", data);
      data.checked = checked;
      data.orchecked = indeterminate;
    },
    // 控制所有的子元素选择状态
    set_select_all_child(item, checked) {
      item.forEach(element => {
        element.checked = checked;
        if (element.children.length > 0) {
          this.set_select_all_child(element.children, checked);
        }
      });
    },
    // 返回上一级
    go_back() {
      if (this.indexList.length > 0) {
        // 返回时删掉最后一个索引
        this.indexList.pop();
        if (this.indexList.length === 0) {
          // this.indexList长度为0说明回到了最顶层
          this.currentList = this.originalList;
        } else {
          // 循环将当前索引的对应数组赋值给currentList
          let list = this.originalList;
          for (let i = 0; i < this.indexList.length; i++) {
            const index = this.indexList[i];
            list = list[index].children;
          }
          this.currentList = list;
        }
      }
      // 将
    },
    // 下一级
    change_last(item, index) {
      this.navList.push({
        id: item.id,
        name: item.name
      });
      this.indexList.push(index);
      this.currentList = item.children;
    },
    // 初始化数据
    init(list = []) {
      list.forEach(item => {
        this.$set(item, "checked", false);
        this.$set(item, "orchecked", false);
        this.$set(item, "department", false);

        if (Array.isArray(item.children) && item.children.length > 0) {
          this.$set(item, "department", true);
          item.children.forEach(ele => {
            ele.parentID = item.id;
          });

          this.init(item.children);
        }
      });

      this.currentList = list;
      this.originalList = list;
    }
  }
};
</script>

<style lang="scss" scoped>
.back {
  text-align: center;
  line-height: 50rrpx;
  background-color: rgb(14, 166, 226);
  color: #fff;
  border-radius: 20rpx;
  transition: all 0.7s;
  opacity: 0;
  margin-bottom: 10rpx;

  &.hide {
    transition: all 1s;
    opacity: 1;
  }
}

.nav {
  height: 80rpx;
  display: flex;
  align-items: center;
  padding-left: 30rpx;
}

.footer {
  height: 80rpx;
  border-top: 1rpx solid #000;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-text {
  }

  &-btn {
    margin-right: 20rpx;
  }
}

.model {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  z-index: 99;
  height: calc(100vh - 80rpx);
  background-color: rgba(0, 0, 0, 0.4);

  &-main {
    display: flex;
    position: absolute;
    flex-wrap: wrap;
    bottom: 2rpx;
    left: 0;
    width: 100%;
    height: 200rpx;
    background-color: #fff;
    padding: 30rpx 0;
    overflow: auto;
    border-radius: 10rpx 10rpx 0 0;
  }

  &-info {
    display: flex;
    width: 26%;
    box-sizing: border-box;
    justify-content: center;
    height: 60rpx;
    line-height: 60rpx;
    border: 1rpx solid #000;
    border-radius: 10rpx;
    position: relative;
    margin: 0 20rpx 20rpx;

    &-name {
      width: 100%;
      height: 100%;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 5rpx;
    }

    &-delete {
      position: absolute;
      right: -10rpx;
      top: -28rpx;
    }
  }
}

.main {
  height: calc(100vh - 180rpx);
  overflow: auto;

  .info {
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1rpx solid #cccccc;

    .checked {
      height: 80rpx;
      display: flex;
      flex: 1;
      padding-left: 30rpx;
      align-items: center;

      .btn {
        width: 40rpx;
        height: 40rpx;
        border: 1rpx solid #ccc;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.6s;
        margin-right: 20rpx;
      }

      .btn.all {
        transition: all 0.6s;
        background-color: #4a70ff;
        color: #ffffff;
      }

      .btn.orchecked {
        color: #4a70ff;
      }
    }

    .text {
      padding-right: 20rpx;
    }
  }
}
</style>
