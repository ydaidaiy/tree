<!--
 * @Author: dull_
 * @Date: 2020-05-29 14:47:46
 * @LastEditTime: 2020-05-29 14:53:29
 * @LastEditors: dull_
 * @Description: 
 * @FilePath: \tree_demo\src\App.vue
 * @
--> 
<script>
export default {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
</script>

<style>
/*每个页面公共css */
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
