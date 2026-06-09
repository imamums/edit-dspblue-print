<template>
  <div class="recipe-selector" v-if="recipeOptions.length > 1">
    <el-dropdown trigger="click" @command="handleRecipeChange">
      <div class="recipe-trigger">
        <div class="recipe-icons">
          <ItemIcon
            v-for="(item, idx) in currentRecipeIcons"
            :key="idx"
            :item-name="item"
            :game-icon-name="getGameIconName(item)"
            :size="20"
          />
        </div>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown" class="recipe-dropdown-menu">
        <el-dropdown-item
          v-for="option in recipeOptions"
          :key="option.value"
          :command="option.value"
          :class="{ 'is-active': option.value === choice }"
        >
          <div class="recipe-option">
            <div class="option-icons">
              <ItemIcon
                v-for="(item, idx) in option.iconItems"
                :key="idx"
                :item-name="item"
                :game-icon-name="getGameIconName(item)"
                :size="24"
              />
            </div>
            <div class="option-meta">
              <span class="recipe-name">{{ option.title }}</span>
              <span class="efficiency">{{ option.efficiencyLabel }}</span>
            </div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import ItemIcon from "./ItemIcon.vue";

function toNumber(value, fallback = 0) {
  let n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatRate(value) {
  if (value >= 100) return value.toFixed(0);
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

function formatItemDict(dict) {
  return Object.keys(dict || {})
    .map((name) => `${name}x${dict[name]}`)
    .join(" + ");
}

function buildRecipePriority(recipe, itemName, selected) {
  let inputs = Object.keys(recipe?.原料 || {});
  let outputs = Object.keys(recipe?.产物 || {});
  let targetOutput = toNumber(recipe?.产物?.[itemName], 0);
  let timeSeconds = Math.max(0.000001, toNumber(recipe?.时间, 60));
  let perMinute = (targetOutput * 60) / timeSeconds;

  let selectedBoost = selected ? 1000000 : 0;
  let outputBoost = targetOutput * 10000;
  let efficiencyBoost = perMinute * 100;
  let simpleInputsBoost = (20 - inputs.length) * 10;
  let lessByproductBoost = (8 - outputs.length) * 3;
  let shortTimeBoost = (300 - timeSeconds) * 0.1;

  return (
    selectedBoost +
    outputBoost +
    efficiencyBoost +
    simpleInputsBoost +
    lessByproductBoost +
    shortTimeBoost
  );
}

export default {
  name: "RecipeSelector",
  components: { ItemIcon },
  props: {
    item: {
      type: String,
      required: true,
    },
    choice: {
      type: Number,
      default: 1,
    },
    gameData: {
      type: Object,
      required: true,
    },
    itemData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    recipeOptions() {
      const recipeIndices = this.itemData[this.item] || [];
      return recipeIndices
        .slice(1)
        .map((recipeIndex, index) => {
          const recipe = this.gameData.recipe_data[recipeIndex];
          if (!recipe) return null;

          const inputs = Object.keys(recipe.原料 || {});
          const outputs = Object.keys(recipe.产物 || {});
          const iconItems = [...outputs, ...inputs];
          const targetOutput = toNumber(recipe.产物?.[this.item], 0);
          const timeSeconds = Math.max(0.000001, toNumber(recipe.时间, 60));
          const perMinute = (targetOutput * 60) / timeSeconds;
          const isSelected = this.choice === index + 1;

          return {
            value: index + 1,
            iconItems,
            priority: buildRecipePriority(recipe, this.item, isSelected),
            title: `${formatItemDict(recipe.产物)} <- ${formatItemDict(recipe.原料)}`,
            efficiencyLabel: `用时: ${timeSeconds}s | x${formatRate(targetOutput)} / ${formatRate(perMinute)}/min`,
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.priority - a.priority || a.value - b.value);
    },
    currentRecipeIcons() {
      const current = this.recipeOptions.find((opt) => opt.value === this.choice);
      return current ? current.iconItems : [];
    },
  },
  methods: {
    getGameIconName(itemName) {
      return this.gameData?.item_icon_name?.[itemName] || "";
    },
    handleRecipeChange(value) {
      this.$emit("change", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.recipe-selector {
  display: inline-block;
  vertical-align: middle;
}

.recipe-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background: #fff;
  transition: all 0.2s;

  &:hover {
    border-color: #409eff;
  }

  .recipe-icons {
    display: flex;
    align-items: center;
    gap: -4px; // Slight overlap
  }
}

.recipe-dropdown-menu {
  max-width: 500px;

  .el-dropdown-menu__item.is-active {
    background-color: #ecf5ff;
    color: #409eff;
  }
}

.recipe-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;

  .option-icons {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }

  .option-meta {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .recipe-name {
      font-size: 13px;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .efficiency {
      font-size: 11px;
      color: #909399;
    }
  }
}
</style>
