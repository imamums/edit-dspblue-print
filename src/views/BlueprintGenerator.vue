<template>
  <div class="generator-page">
    <div class="wrap">
      <ScrollCard :otherLinks="navExtraLinks" class="generator-scroll" :hideBarWhenOnlyOne="false">
        <ScrollCardItem name="生成蓝图" :canFold="false">
          <BlueprintGeneratorPanel @import-blueprint="importToTransformer"></BlueprintGeneratorPanel>
        </ScrollCardItem>
      </ScrollCard>
    </div>
  </div>
</template>

<script>
const GENERATED_BLUEPRINT_CACHE_KEY = "dsp.generatedBlueprint";

export default {
  name: "BlueprintGenerator",
  components: {
    ScrollCard: () => import("@/components/ScrollCard.vue"),
    ScrollCardItem: () => import("@/components/ScrollCardItem.vue"),
    BlueprintGeneratorPanel: () => import("@/components/BlueprintGeneratorPanel.vue"),
  },
  data() {
    return {
      navExtraLinks: [
        { name: "蓝图转换", url: "#/" },
      ],
    };
  },
  methods: {
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
    max-width: 1000px;
    margin: 0 auto;
    background: #fff;
    box-shadow: 0 0 20px 15px #fff;
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 10;
  }

  .generator-scroll {
    flex: 1;
    min-height: 0;
  }

  .navRight {
    display: flex;
    align-items: center;
    margin-right: 5px;

    .item {
      font-size: 12px;
      color: #999;
      text-decoration: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 5px;

      img {
        width: 16px;
        height: 16px;
      }

      span {
        margin-left: 5px;
      }

      &.hover span {
        display: inline-block;
        overflow: hidden;
        transition: width 0.2s ease-in-out;
      }

      &.hover:not(:hover) span {
        width: 0 !important;
      }
    }

    .item:hover {
      color: #3a8ee6;
      text-decoration: underline;
    }
  }
}
</style>
