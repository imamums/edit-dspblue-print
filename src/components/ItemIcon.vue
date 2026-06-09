<template>
  <div
    class="item-icon-container"
    :style="containerStyle"
    :title="itemName"
  >
    <template v-if="renderType === 'individual'">
      <img :src="individualSrc" :style="imgStyle" @error="onImgError" />
    </template>
    <template v-else-if="renderType === 'sprite'">
      <div class="sprite-icon" :style="spriteStyle"></div>
    </template>
    <template v-else>
      <div class="fallback-icon" :style="fallbackStyle">
        {{ itemName ? itemName.charAt(0) : '?' }}
      </div>
    </template>
  </div>
</template>

<script>
import ICON_SPRITE_POSITIONS from "@/data/iconSpritePositions.json";
import * as itemsUtil from "@/utils/itemsUtil";

const ATLAS_MAP = {
  Vanilla: require("@/assets/images/sprites/Vanilla.webp"),
  MoreMegaStructure: require("@/assets/images/sprites/MoreMegaStructure.webp"),
  GenesisBook: require("@/assets/images/sprites/GenesisBook.webp"),
  FractionateEverything: require("@/assets/images/sprites/FractionateEverything.webp"),
};

const MOD_PRIORITY = [
  "Vanilla",
  "MoreMegaStructure",
  "GenesisBook",
  "FractionateEverything",
];

export default {
  name: "ItemIcon",
  props: {
    itemId: {
      type: [Number, String],
      default: null,
    },
    itemName: {
      type: String,
      default: "",
    },
    iconName: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      default: 16,
    },
    // 可选：从外部传入 gameData 中的映射名（对应游戏内的 IconName）
    gameIconName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      forceFallback: false,
    };
  },
  computed: {
    resolvedIconName() {
      if (this.gameIconName) return this.gameIconName;
      if (this.iconName) return this.iconName;
      if (this.itemId) {
        const itemInfo = itemsUtil.itemsMap.get(Number(this.itemId));
        return itemInfo?.icon || "";
      }
      return "";
    },
    renderType() {
      if (this.forceFallback) return "fallback";
      
      const name = this.resolvedIconName;
      if (!name) return "fallback";

      // 尝试在个人图中寻找（仅判断通过 require 是否能加载，通常需要 try-catch）
      // 由于 Vue 2 require 无法直接检测，我们优先尝试精灵图，或者先默认 individual
      // 这里根据项目的 itemsData 习惯，如果有具体名，可能存在 png
      
      // 检查精灵图
      const spriteData = this.findSprite(name);
      if (spriteData) return "sprite";

      // 默认尝试 individual
      return "individual";
    },
    individualSrc() {
      const name = this.resolvedIconName;
      if (!name) return "";
      try {
        return require("@/assets/images/" + name + ".png");
      } catch (e) {
        return "";
      }
    },
    containerStyle() {
      return {
        width: this.size + "px",
        height: this.size + "px",
      };
    },
    imgStyle() {
      return {
        width: "100%",
        height: "100%",
        objectFit: "contain",
      };
    },
    spriteStyle() {
      const name = this.resolvedIconName;
      const data = this.findSprite(name);
      if (!data) return {};

      const { modName, spriteData } = data;
      const { x, y, height, total_width, total_height } = spriteData;
      
      const scale = this.size / height;
      const bgWidth = total_width * scale;
      const bgHeight = total_height * scale;
      const posX = -x * scale;
      const posY = -y * scale;

      return {
        width: this.size + "px",
        height: this.size + "px",
        backgroundImage: `url(${ATLAS_MAP[modName]})`,
        backgroundPosition: `${posX}px ${posY}px`,
        backgroundSize: `${bgWidth}px ${bgHeight}px`,
        backgroundRepeat: "no-repeat",
      };
    },
    fallbackStyle() {
      return {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7fa",
        color: "#909399",
        fontSize: Math.max(this.size * 0.6, 10) + "px",
        borderRadius: "2px",
        border: "1px solid #dcdfe6",
      };
    },
  },
  methods: {
    findSprite(name) {
      if (!name) return null;
      // 按优先级遍历 mod
      for (const modName of MOD_PRIORITY) {
        const modMap = ICON_SPRITE_POSITIONS[modName];
        if (modMap && modMap[name]) {
          return {
            modName,
            spriteData: modMap[name],
          };
        }
      }
      return null;
    },
    onImgError() {
      // 个人图加载失败时，尝试降级到 fallback
      // 如果之前判断不是精灵图，才会加载 individual
      this.forceFallback = true;
    },
  },
};
</script>

<style scoped>
.item-icon-container {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  overflow: hidden;
}
.sprite-icon {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
.fallback-icon {
  user-select: none;
}
</style>
