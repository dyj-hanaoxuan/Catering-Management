<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }" style="font-size: 20px;color:rgb(54, 57, 59);margin-bottom: 40px;display: none"></el-breadcrumb-item>
        <el-breadcrumb-item style="font-size: 20px;rgb(54, 57, 59);margin-bottom: 40px">{{text}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>
<script>
export default {
  name: 'breadcrumb',
  props: ['text'],
  data () {
    return {}
  }
}
</script>
<style scoped>
</style>
