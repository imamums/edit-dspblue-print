<template>
  <div class="blueprint-generator-panel">
    <el-alert
      title="先选择需求物品和数量，再生成主线蓝图"
      type="info"
      :closable="false"
      show-icon
    ></el-alert>

    <el-form class="generator-form" label-width="120px" @submit.native.prevent>
      <el-form-item label="需求列表：">
        <div class="needs-wrap">
          <div class="need-row" v-for="(need, index) in needsList" :key="index">
            <el-select
              v-model="need.itemName"
              filterable
              placeholder="选择需求物品"
              class="need-item"
              popper-class="bp-item-select-popper"
            >
              <el-option
                v-for="itemName in itemOptions"
                :key="itemName"
                :value="itemName"
                :label="itemName"
              >
                <div class="item-option-row">
                  <ItemIcon
                    :item-name="itemName"
                    :game-icon-name="getGameIconName(itemName)"
                  />
                  <span class="item-name">{{ itemName }}</span>
                </div>
              </el-option>
            </el-select>

            <RecipeSelector
              v-if="runtime && need.itemName"
              :item="need.itemName"
              :choice="getRecipeChoice(need.itemName)"
              :game-data="runtime.gameData"
              :item-data="runtime.provider.itemData"
              @change="setRecipeChoice(need.itemName, $event)"
              class="need-recipe"
            />

            <el-input-number
              v-model="need.amount"
              :min="0"
              :step="1"
              :precision="2"
              controls-position="right"
              class="need-amount"
            ></el-input-number>

            <span class="unit">件/分钟</span>

            <el-button
              type="text"
              class="remove-btn"
              @click="removeNeed(index)"
              :disabled="needsList.length <= 1"
            >
              删除
            </el-button>
          </div>

          <div class="need-actions">
            <el-button size="small" @click="addNeed">新增需求</el-button>
            <el-button size="small" @click="clearNeeds">清空需求</el-button>
            <el-divider direction="vertical"></el-divider>
            <span class="label">快速填充：</span>
            <el-button size="mini" plain @click="applyQuickNeed('宇宙矩阵', 60)">白糖 60</el-button>
            <el-button size="mini" plain @click="applyQuickNeed('引力透镜', 60)">透镜 60</el-button>
            <el-button size="mini" plain @click="applyQuickNeed('空间翘曲器', 60)">翘曲器 120</el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="蓝图标题：">
        <el-input v-model.trim="shortDesc" placeholder="例如：主线蓝图"></el-input>
      </el-form-item>

      <el-form-item label="蓝图配置：">
        <div class="config-grid">
          <div class="config-item">
            <span class="label">传送带等级</span>
            <el-select v-model="config.beltLv" size="small">
              <el-option :value="1" label="1级"></el-option>
              <el-option :value="2" label="2级"></el-option>
              <el-option :value="3" label="3级"></el-option>
            </el-select>
          </div>

          <div class="config-item">
            <span class="label">分拣器等级</span>
            <el-select v-model="config.inserterLv" size="small">
              <el-option :value="1" label="1级"></el-option>
              <el-option :value="2" label="2级"></el-option>
              <el-option :value="3" label="3级"></el-option>
              <el-option :value="4" label="4级"></el-option>
            </el-select>
          </div>

          <div class="config-item">
            <span class="label">物流模式</span>
            <el-select v-model="config.modeType" size="small">
              <el-option :value="1" label="无方案"></el-option>
              <el-option :value="2" label="物流配送器"></el-option>
              <el-option :value="3" label="行星内物流运输站"></el-option>
            </el-select>
          </div>

          <div class="config-item">
            <span class="label">放置模式</span>
            <el-select v-model="config.mergeType" size="small">
              <el-option :value="1" label="纵向放置"></el-option>
              <el-option :value="2" label="堆砌放置"></el-option>
            </el-select>
          </div>

          <div class="config-item">
            <span class="label">单线机器上限</span>
            <el-input-number
              v-model="config.maxMachineInALine"
              :min="1"
              :step="1"
              size="small"
            ></el-input-number>
          </div>

          <div class="config-item">
            <span class="label">块宽限制</span>
            <el-input-number
              v-model="config.blockWidthLimit"
              :min="10"
              :step="1"
              size="small"
            ></el-input-number>
          </div>

          <div class="config-item" v-if="config.modeType === 2">
            <span class="label">主干汇流(模式2)</span>
            <el-switch v-model="config.useMode2MainBus"></el-switch>
          </div>
        </div>
      </el-form-item>

      <el-collapse>
        <el-collapse-item title="高级配置：各工厂单排上限">
          <div class="preset-row">
            <span class="label">批量预设：</span>
            <el-button size="mini" @click="setAllMaxCount(15)">15</el-button>
            <el-button size="mini" @click="setAllMaxCount(20)">20</el-button>
            <el-button size="mini" @click="setAllMaxCount(30)">30</el-button>
            <el-button size="mini" @click="setAllMaxCount(50)">50</el-button>
            <el-button size="mini" @click="setAllMaxCount(60)">60</el-button>
            <el-button size="mini" @click="setAllMaxCount(100)">100</el-button>
          </div>
          <div class="config-grid">
            <div class="config-item">
              <span class="label">熔炉上限</span>
              <el-input-number
                v-model="config.smelterMaxCount"
                :min="1"
                :step="1"
                size="small"
              ></el-input-number>
            </div>
            <div class="config-item">
              <span class="label">制造台上限</span>
              <el-input-number
                v-model="config.workbenchMaxCount"
                :min="1"
                :step="1"
                size="small"
              ></el-input-number>
            </div>
            <div class="config-item">
              <span class="label">精炼厂上限</span>
              <el-input-number
                v-model="config.refineryMaxCount"
                :min="1"
                :step="1"
                size="small"
              ></el-input-number>
            </div>
            <div class="config-item">
              <span class="label">化工厂上限</span>
              <el-input-number
                v-model="config.chemicalMaxCount"
                :min="1"
                :step="1"
                size="small"
              ></el-input-number>
            </div>
            <div class="config-item">
              <span class="label">对撞机上限</span>
              <el-input-number
                v-model="config.colliderMaxCount"
                :min="1"
                :step="1"
                size="small"
              ></el-input-number>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-form-item>
        <el-button type="primary" :loading="generating" @click="generateBlueprintByNeeds"
          >生成主线蓝图</el-button
        >
      </el-form-item>
    </el-form>

    <el-divider></el-divider>

    <div class="result-header">
      <div class="title">生成结果</div>
      <div class="actions">
        <el-button size="small" :disabled="!resultCode" @click="copyResult">复制</el-button>
        <el-button
          size="small"
          type="primary"
          plain
          :disabled="!resultCode"
          @click="importToTransformer"
        >
          导入到转换区
        </el-button>
      </div>
    </div>

    <el-alert
      v-if="resultMessage"
      :title="resultMessage"
      type="success"
      :closable="false"
      show-icon
    ></el-alert>

    <div class="mineralize-summary" v-if="runtime && Object.keys(runtime.settings.mineralize_list || {}).length">
      <div class="title">视为原矿列表：</div>
      <div class="tags">
        <el-tag
          v-for="(val, itemName) in runtime.settings.mineralize_list"
          :key="itemName"
          closable
          size="small"
          @close="unmarkRawMaterial(itemName)"
        >
          {{ itemName }}
        </el-tag>
        <el-button type="text" size="mini" @click="clearAllRawMaterials">清空</el-button>
      </div>
    </div>

    <div class="recipe-list" v-if="generatedRows.length">
      <div class="recipe-title">生成配方</div>
      <div class="recipe-card" v-for="(row, index) in generatedRows" :key="index">
        <div class="recipe-card-header">
          <div class="main-item">
            <ItemIcon
              :item-id="row.mainItemId"
              :item-name="row.mainItemName"
              :game-icon-name="row.mainItemIconName"
            />
            <span>{{ row.mainItemName }}</span>
            <RecipeSelector
              v-if="runtime"
              :item="row.mainItemName"
              :choice="getRecipeChoice(row.mainItemName)"
              :game-data="runtime.gameData"
              :item-data="runtime.provider.itemData"
              @change="updateRecipeAndRegenerate(row.mainItemName, $event)"
              class="result-recipe"
            />
          </div>
          <div class="header-actions">
            <el-button
              v-if="!runtime.settings.mineralize_list[row.mainItemName]"
              type="text"
              size="mini"
              @click="markAsRawMaterial(row.mainItemName)"
              >视为原矿</el-button
            >
            <div class="factory">{{ row.factoryName }} x {{ row.machineCount }}</div>
          </div>
        </div>
        <div class="recipe-flow">
          <div class="io-side">
            <div class="io-label">输入</div>
            <div class="io-items">
              <div class="io-item" v-for="(item, inx) in row.inputs" :key="'in-' + inx">
                <ItemIcon
                  :item-id="item.id"
                  :item-name="item.name"
                  :game-icon-name="item.iconName"
                />
                <span class="item-text">{{ item.name }} x{{ item.count }}</span>
              </div>
            </div>
          </div>
          <div class="io-arrow">-></div>
          <div class="io-side">
            <div class="io-label">输出</div>
            <div class="io-items">
              <div class="io-item" v-for="(item, onx) in row.outputs" :key="'out-' + onx">
                <ItemIcon
                  :item-id="item.id"
                  :item-name="item.name"
                  :game-icon-name="item.iconName"
                />
                <span class="item-text">{{ item.name }} x{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-input
      class="result-code"
      type="textarea"
      :rows="8"
      readonly
      :value="resultCode"
      placeholder="生成后将在这里显示蓝图字符串"
    ></el-input>
  </div>
</template>

<script>
import * as itemsUtil from "@/utils/itemsUtil";
import ItemIcon from "./ItemIcon.vue";
import RecipeSelector from "./RecipeSelector.vue";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  if (Number.isFinite(n)) {
    return n;
  }
  return fallback;
}

function toInt(value, fallback = 0) {
  return Math.trunc(toNumber(value, fallback));
}

export default {
  name: "BlueprintGeneratorPanel",
  components: {
    ItemIcon,
    RecipeSelector,
  },
  data() {
    return {
      generating: false,
      shortDesc: "主线蓝图",
      resultCode: "",
      resultMessage: "",
      itemOptions: [],
      runtime: null,
      needsList: [{ itemName: "", amount: 60 }],
      generatedRows: [],
      config: {
        beltLv: 1,
        inserterLv: 1,
        modeType: 2,
        mergeType: 1,
        maxMachineInALine: 15,
        blockWidthLimit: 50,
        useMode2MainBus: true,
        smelterMaxCount: 15,
        workbenchMaxCount: 15,
        refineryMaxCount: 15,
        chemicalMaxCount: 15,
        colliderMaxCount: 15,
      },
      blueprintModules: null,
      calcModules: null,
    };
  },
  mounted() {
    this.initRuntime();
  },
  methods: {
    async ensureBlueprintModules() {
      if (this.blueprintModules) {
        return this.blueprintModules;
      }
      const [generatorModule, configModule] = await Promise.all([
        import("@/utils/blueprintGen/blueprintGenerator"),
        import("@/utils/blueprintGen/blueprintConfig"),
      ]);
      this.blueprintModules = {
        buildMainLineBlueprint: generatorModule.buildMainLineBlueprint,
        copyBlueprintCodeToClipboard: generatorModule.copyBlueprintCodeToClipboard,
        BlueprintConfig: configModule.BlueprintConfig,
        buildBlueprintRowInfo: configModule.buildBlueprintRowInfo,
      };
      return this.blueprintModules;
    },
    async ensureCalcModules() {
      if (this.calcModules) {
        return this.calcModules;
      }
      const [gameDataBuilderModule, providerModule, schemeModule, calculatorModule] =
        await Promise.all([
          import("@/utils/blueprintGen/gameDataBuilder"),
          import("@/utils/blueprintGen/GameDataProvider"),
          import("@/utils/blueprintGen/schemeDefaults"),
          import("@/utils/blueprintGen/Calculator"),
        ]);
      this.calcModules = {
        buildGameData: gameDataBuilderModule.buildGameData,
        GameDataProvider: providerModule.GameDataProvider,
        buildDefaultScheme: schemeModule.buildDefaultScheme,
        DEFAULT_SETTINGS: schemeModule.DEFAULT_SETTINGS,
        Calculator: calculatorModule.Calculator,
      };
      return this.calcModules;
    },
    async initRuntime() {
      try {
        const { buildGameData, GameDataProvider, buildDefaultScheme, DEFAULT_SETTINGS } =
          await this.ensureCalcModules();
        const gameData = buildGameData([]);
        const provider = new GameDataProvider(gameData);
        const schemeData = buildDefaultScheme(gameData);
        const settings = clone(DEFAULT_SETTINGS);
        if (Array.isArray(settings.mineralize_list)) {
          settings.mineralize_list = {};
        }
        this.runtime = {
          gameData,
          provider,
          schemeData,
          settings,
        };
        this.itemOptions = (provider.allTargetItems || []).slice().sort((a, b) => a.localeCompare(b));
        if (this.itemOptions.length > 0 && !this.needsList[0].itemName) {
          this.needsList[0].itemName = this.itemOptions[0];
        }
      } catch (error) {
        console.error("init-runtime-error", error);
        this.$message.error("初始化生成器数据失败，请检查控制台");
      }
    },
    getItemInfoById(itemId) {
      return itemsUtil.itemsMap.get(toInt(itemId, 0));
    },
    getGameIconName(itemName) {
      return this.runtime?.gameData?.item_icon_name?.[itemName] || "";
    },
    getGameIconNameById(itemId) {
      const name = this.runtime?.gameData?.id_name_dict?.[itemId];
      return name ? this.getGameIconName(name) : "";
    },
    getItemNameById(itemId) {
      const info = this.getItemInfoById(itemId);
      if (info?.name) {
        return info.name;
      }
      return this.runtime?.gameData?.id_name_dict?.[itemId] || `未知物品_${itemId}`;
    },
    buildRecipePreviewRows(rows, gameData) {
      return (rows || []).map((row) => {
        const inputs = (row.inputItemIds || []).map((id, idx) => ({
          id,
          name: this.getItemNameById(id),
          count: Number(row.inputItemCounts?.[idx] || 0),
          iconName: this.getGameIconNameById(id),
        }));
        const outputs = (row.outputItemIds || []).map((id, idx) => ({
          id,
          name: this.getItemNameById(id),
          count: Number(row.outputItemCounts?.[idx] || 0),
          iconName: this.getGameIconNameById(id),
        }));
        return {
          mainItemId: row.mainItemId,
          mainItemName: this.getItemNameById(row.mainItemId),
          mainItemIconName: this.getGameIconNameById(row.mainItemId),
          factoryName: gameData.id_name_dict?.[row.machineId] || `工厂_${row.machineId}`,
          machineCount: row.machineCount,
          inputs,
          outputs,
        };
      });
    },
    addNeed() {
      this.needsList.push({ itemName: this.itemOptions[0] || "", amount: 60 });
    },
    removeNeed(index) {
      if (this.needsList.length <= 1) {
        return;
      }
      this.needsList.splice(index, 1);
    },
    clearNeeds() {
      this.needsList = [{ itemName: this.itemOptions[0] || "", amount: 60 }];
    },
    getRecipeChoice(itemName) {
      return this.runtime?.schemeData?.item_recipe_choices?.[itemName] || 1;
    },
    setRecipeChoice(itemName, choice) {
      if (this.runtime?.schemeData?.item_recipe_choices) {
        this.$set(this.runtime.schemeData.item_recipe_choices, itemName, choice);
      }
    },
    updateRecipeAndRegenerate(itemName, choice) {
      this.setRecipeChoice(itemName, choice);
      this.generateBlueprintByNeeds();
    },
    setAllMaxCount(val) {
      this.config.smelterMaxCount = val;
      this.config.workbenchMaxCount = val;
      this.config.refineryMaxCount = val;
      this.config.chemicalMaxCount = val;
      this.config.colliderMaxCount = val;
    },
    markAsRawMaterial(itemName) {
      if (!this.runtime) return;
      if (!this.runtime.settings.mineralize_list) {
        this.$set(this.runtime.settings, "mineralize_list", {});
      }
      this.$set(this.runtime.settings.mineralize_list, itemName, true);
      this.generateBlueprintByNeeds();
    },
    unmarkRawMaterial(itemName) {
      if (!this.runtime?.settings?.mineralize_list) return;
      this.$delete(this.runtime.settings.mineralize_list, itemName);
      this.generateBlueprintByNeeds();
    },
    clearAllRawMaterials() {
      if (!this.runtime?.settings) return;
      this.$set(this.runtime.settings, "mineralize_list", {});
      this.generateBlueprintByNeeds();
    },
    applyQuickNeed(itemName, amount) {
      // Find if item already exists
      const existing = this.needsList.find(n => n.itemName === itemName);
      if (existing) {
        existing.amount = amount;
      } else {
        if (this.needsList.length === 1 && !this.needsList[0].itemName) {
          this.needsList[0].itemName = itemName;
          this.needsList[0].amount = amount;
        } else {
          this.needsList.push({ itemName, amount });
        }
      }
      this.$message.info(`已预设需求: ${itemName} x ${amount}`);
    },
    buildNeedsMap() {
      const needsMap = {};
      this.needsList.forEach((need) => {
        const itemName = (need.itemName || "").trim();
        const amount = toNumber(need.amount, 0);
        if (!itemName || amount <= 0) {
          return;
        }
        needsMap[itemName] = toNumber(needsMap[itemName], 0) + amount;
      });
      return needsMap;
    },
    buildConfig() {
      const cfg = new this.blueprintModules.BlueprintConfig();
      cfg.beltLv = toInt(this.config.beltLv, 1);
      cfg.inserterLv = toInt(this.config.inserterLv, 1);
      cfg.modeType = toInt(this.config.modeType, 2);
      cfg.mergeType = toInt(this.config.mergeType, 1);
      cfg.maxMachineInALine = toInt(this.config.maxMachineInALine, 15);
      cfg.blockWidthLimit = toInt(this.config.blockWidthLimit, 50);
      cfg.smelterMaxCount = toInt(this.config.smelterMaxCount, 15);
      cfg.workbenchMaxCount = toInt(this.config.workbenchMaxCount, 15);
      cfg.refineryMaxCount = toInt(this.config.refineryMaxCount, 15);
      cfg.chemicalMaxCount = toInt(this.config.chemicalMaxCount, 15);
      cfg.colliderMaxCount = toInt(this.config.colliderMaxCount, 15);
      cfg.useMode2MainBus = this.config.useMode2MainBus ? 1 : 0;
      return cfg;
    },
    calcFactoryCount(outputPerTime, itemName, calculator, schemeData, gameData, fixedNum, timeScale) {
      const recipeChoice = schemeData.item_recipe_choices[itemName];
      const recipeIndex = calculator.itemData[itemName][recipeChoice];
      const schemeRow = schemeData.scheme_for_recipe[recipeIndex];
      const recipe = gameData.recipe_data[recipeIndex];
      const factory = gameData.factory_data[recipe.设施][schemeRow.建筑];
      const productionTimePerUnit = 1 / calculator.itemGraph[itemName].产出倍率 / factory.倍率;
      const roundingBias = Math.pow(0.1, fixedNum) * 0.49994;
      return (outputPerTime / timeScale) * productionTimePerUnit + roundingBias;
    },
    buildBlueprintRowsFromSupply(supplyMap, calculator, schemeData, gameData, timeScale, fixedNum) {
      const rows = [];
      Object.entries(supplyMap).forEach(([itemName, outputPerTime]) => {
        const outputNum = toNumber(outputPerTime, 0);
        if (outputNum <= 0.000001) {
          return;
        }
        const itemRecipeOptions = calculator.itemData[itemName];
        if (!itemRecipeOptions || itemRecipeOptions.length <= 1) {
          return;
        }

        const recipeChoice = schemeData.item_recipe_choices[itemName];
        const recipeIndex = itemRecipeOptions[recipeChoice];
        const recipe = gameData.recipe_data[recipeIndex];
        const schemeRow = schemeData.scheme_for_recipe[recipeIndex];
        const factory = gameData.factory_data[recipe.设施]?.[schemeRow.建筑];
        if (!recipe || !factory) {
          return;
        }

        const inputNames = Object.keys(recipe.原料 || {});
        const outputNames = Object.keys(recipe.产物 || {});
        const row = {
          recipe_id: recipe.oid,
          outputCount: outputNum,
          outputPerSecond: outputNum / Math.max(1, timeScale),
          inputItemCount: inputNames.length,
          outputItemCount: outputNames.length,
          inputItemIds: inputNames.map((name) => gameData.name_id_dict[name] || 0),
          outputItemIds: outputNames.map((name) => gameData.name_id_dict[name] || 0),
          inputItemCounts: inputNames.map((name) => Number(recipe.原料?.[name] || 0)),
          outputItemCounts: outputNames.map((name) => Number(recipe.产物?.[name] || 0)),
          mainItemId: gameData.name_id_dict[itemName],
          factory_number: this.calcFactoryCount(
            outputNum,
            itemName,
            calculator,
            schemeData,
            gameData,
            fixedNum,
            timeScale
          ),
          factory_name: factory.名称,
          machineId: gameData.name_id_dict[factory.名称],
          ignore: !!this.runtime?.settings?.mineralize_list?.[itemName],
        };

        const rowInfo = this.blueprintModules.buildBlueprintRowInfo(row, gameData);
        if (rowInfo && rowInfo.machineCount > 0) {
          rows.push(rowInfo);
        }
      });

      rows.sort((a, b) => toNumber(b.outputPerSecond, 0) - toNumber(a.outputPerSecond, 0));
      return rows;
    },
    isRawMaterialItem(itemName, calculator, schemeData, gameData) {
      if (this.runtime?.settings?.mineralize_list?.[itemName]) {
        return true;
      }
      try {
        const recipeIndex = calculator.itemData[itemName][schemeData.item_recipe_choices[itemName]];
        const recipe = gameData.recipe_data[recipeIndex];
        return (
          Object.keys(recipe.原料 || {}).length === 0 && Object.keys(recipe.产物 || {}).length === 1
        );
      } catch {
        return false;
      }
    },
    buildRawOreById(supplyMap, calculator, schemeData, gameData, timeScale) {
      const rawOreById = {};
      Object.entries(supplyMap).forEach(([itemName, value]) => {
        if (!this.isRawMaterialItem(itemName, calculator, schemeData, gameData)) {
          return;
        }
        const itemId = gameData.name_id_dict[itemName];
        if (!itemId) {
          return;
        }
        const perSecond = toNumber(value, 0) / Math.max(1, timeScale);
        if (perSecond > 0) {
          rawOreById[itemId] = perSecond;
        }
      });
      return rawOreById;
    },
    buildNeedsById(needsMap, gameData) {
      const needsById = {};
      Object.keys(needsMap).forEach((itemName) => {
        const itemId = gameData.name_id_dict[itemName];
        if (!itemId) {
          return;
        }
        needsById[itemId] = needsMap[itemName];
      });
      return needsById;
    },
    async generateBlueprintByNeeds() {
      if (!this.runtime) {
        this.$message.warning("生成器尚未初始化完成");
        return;
      }

      const needsMap = this.buildNeedsMap();
      if (Object.keys(needsMap).length === 0) {
        this.$message.warning("请至少选择一个需求物品并填写大于0的数量");
        return;
      }

      this.generating = true;
      try {
        const blueprintModules = await this.ensureBlueprintModules();
        const { Calculator } = await this.ensureCalcModules();
        const gameData = this.runtime.gameData;
        const provider = this.runtime.provider;
        const schemeData = clone(this.runtime.schemeData);
        const settings = clone(this.runtime.settings);
        const timeScale = settings.is_time_unit_minute ? 60 : 1;
        const fixedNum = settings.fixed_num || 2;

        const calculator = new Calculator(provider, schemeData, settings);
        const [supplyMap] = calculator.calculate(needsMap);
        const rows = this.buildBlueprintRowsFromSupply(
          supplyMap,
          calculator,
          schemeData,
          gameData,
          timeScale,
          fixedNum
        );

        if (rows.length === 0) {
          throw new Error("没有可用于生成蓝图的产线，请检查需求物品是否可自动生产");
        }

        const cfg = this.buildConfig();
        const needsById = this.buildNeedsById(needsMap, gameData);
        const rawOreById = this.buildRawOreById(supplyMap, calculator, schemeData, gameData, timeScale);

        const result = blueprintModules.buildMainLineBlueprint(rows, cfg, {
          shortDesc: this.shortDesc || "主线蓝图",
          needsById,
          rawOreById,
        });

        this.resultCode = result.code || "";
        this.generatedRows = this.buildRecipePreviewRows(rows, gameData);
        this.resultMessage = `生成成功：产线 ${rows.length} 条，建筑 ${result.buildings?.length || 0} 个`;
        this.$message.success("主线蓝图已生成");
      } catch (error) {
        console.error("generate-blueprint-error", error);
        this.resultCode = "";
        this.resultMessage = "";
        this.generatedRows = [];
        this.$message.error(`蓝图生成失败：${error?.message || error}`);
      } finally {
        this.generating = false;
      }
    },
    async copyResult() {
      if (!this.resultCode) {
        this.$message.warning("请先生成蓝图");
        return;
      }
      const blueprintModules = await this.ensureBlueprintModules();
      const copied = await blueprintModules.copyBlueprintCodeToClipboard(this.resultCode);
      if (copied) {
        this.$message.success("蓝图已复制到剪贴板");
      } else {
        this.$message.warning("复制失败，请手动复制结果文本");
      }
    },
    importToTransformer() {
      if (!this.resultCode) {
        this.$message.warning("请先生成蓝图");
        return;
      }
      this.$emit("import-blueprint", this.resultCode);
    },
  },
};
</script>

<style lang="scss" scoped>
.blueprint-generator-panel {
  .generator-form {
    margin-top: 12px;
  }

  .needs-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .need-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;

      .need-item {
        min-width: 230px;
      }

      .item-option-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .item-name {
        line-height: 20px;
      }

      .need-amount {
        width: 150px;
      }

      .unit {
        color: #909399;
        font-size: 12px;
        margin: 0 4px;
      }

      .need-recipe {
        margin: 0 8px;
        flex-shrink: 0;
      }

      .remove-btn {
        padding: 0;
      }
    }
  }

  .preset-row {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    .label {
      font-size: 13px;
      color: #606266;
    }
  }

  .need-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    flex-wrap: wrap;

    .label {
      font-size: 13px;
      color: #606266;
    }
  }

  .mineralize-summary {
    margin-top: 15px;
    padding: 10px;
    background: #fdf6ec;
    border-radius: 4px;
    border: 1px solid #faecd8;

    .title {
      font-size: 12px;
      color: #e6a23c;
      margin-bottom: 6px;
      font-weight: 600;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }
  }

  .config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 10px 16px;

    .config-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;

      .label {
        color: #606266;
        font-size: 12px;
        white-space: nowrap;
      }
    }
  }

  .result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .title {
      font-size: 14px;
      color: #303133;
      font-weight: 600;
    }

    .actions {
      display: flex;
      gap: 8px;
    }
  }

  .recipe-list {
    margin-top: 10px;

    .recipe-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 8px;
    }

    .recipe-card {
      border: 1px solid #ebeef5;
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 8px;
      background: #fff;
    }

    .recipe-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .main-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      color: #303133;

      .result-recipe {
        margin-left: 8px;
        font-weight: normal;
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .factory {
      color: #606266;
      font-size: 12px;
    }

    .recipe-flow {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 10px;
    }

    .io-arrow {
      color: #909399;
      font-size: 12px;
      text-align: center;
      white-space: nowrap;
    }

    .io-label {
      color: #909399;
      font-size: 12px;
      margin-bottom: 4px;
    }

    .io-items {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 10px;
    }

    .io-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #606266;
      font-size: 12px;
    }

    .item-text {
      white-space: nowrap;
    }
  }

  .item-icon {
    width: 16px;
    height: 16px;
    max-width: 16px;
    max-height: 16px;
    object-fit: contain;
    vertical-align: middle;
    flex-shrink: 0;
  }

  .result-code {
    margin-top: 10px;
  }
}
</style>

<style lang="scss">
.bp-item-select-popper {
  .item-icon {
    width: 16px;
    height: 16px;
    max-width: 16px;
    max-height: 16px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .item-option-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
