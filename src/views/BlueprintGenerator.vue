<template>
  <div class="generator-page">
    <div class="wrap">
      <div class="page-header">
        <div class="title">生成蓝图</div>
        <el-button type="text" @click="goHome">返回蓝图转换</el-button>
      </div>
      <BlueprintGeneratorPanel @import-blueprint="importToTransformer"></BlueprintGeneratorPanel>
    </div>
  </div>
</template>

<script>
const GENERATED_BLUEPRINT_CACHE_KEY = "dsp.generatedBlueprint";

export default {
  name: "BlueprintGenerator",
  components: {
    BlueprintGeneratorPanel: () => import("@/components/BlueprintGeneratorPanel.vue"),
  },
  methods: {
    goHome() {
      window.location.hash = "#/";
    },
    importToTransformer(code) {
      const text = String(code || "").trim();
      if (!text.startsWith("BLUEPRINT:")) {
        this.$message.warning("生成结果不是蓝图字符串");
        return;
      }
      localStorage.setItem(GENERATED_BLUEPRINT_CACHE_KEY, text);
      this.$message.success("已回填到转换页");
      window.location.hash = "#/";
    },
  },
};
</script>

<style lang="scss" scoped>
.generator-page {
  background: #f0f2f5;
  min-height: 100vh;

  .wrap {
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 0 20px 15px #fff;
    min-height: 100vh;
    position: relative;
    z-index: 10;
  }

  .page-header {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 18px;
      color: #303133;
      font-weight: 600;
    }
  }
}
</style>
