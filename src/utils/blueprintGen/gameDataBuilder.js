import { GAME_DATA_MAP as RECOVERED_GAME_DATA_MAP } from './gameDataMap.js';

var MOD_GUIDS = {
  MoreMegaStructure: `Gnimaerd.DSP.plugin.MoreMegaStructure`,
  TheyComeFromVoid: `com.ckcz123.DSP_Battle`,
  GenesisBook: `org.LoShin.GenesisBook`,
  FractionateEverything: `com.menglei.dsp.FractionateEverything`,
};

var MOD_INFO = [
  {
    GUID: `Vanilla`,
    name: `原版游戏`,
    version: `0.10.34.28524`,
  },
  {
    GUID: MOD_GUIDS.MoreMegaStructure,
    name: `更多巨构`,
    version: `1.7.5`,
  },
  {
    GUID: MOD_GUIDS.TheyComeFromVoid,
    name: `深空来敌`,
    version: `3.4.3`,
  },
  {
    GUID: MOD_GUIDS.GenesisBook,
    name: `创世之书`,
    version: `3.0.14`,
  },
  {
    GUID: MOD_GUIDS.FractionateEverything,
    name: `万物分馏`,
    version: `1.4.4`,
  },
];

var PROLIFERATOR_EFFECT = [
  { 增产效果: 1, 加速效果: 1, 耗电倍率: 1 },
  { 增产效果: 1.125, 加速效果: 1.25, 耗电倍率: 1.3 },
  { 增产效果: 1.2, 加速效果: 1.5, 耗电倍率: 1.7 },
  { 增产效果: 1.225, 加速效果: 1.75, 耗电倍率: 2.1 },
  { 增产效果: 1.25, 加速效果: 2, 耗电倍率: 2.5 },
  { 增产效果: 1.275, 加速效果: 2.25, 耗电倍率: 2.9 },
  { 增产效果: 1.3, 加速效果: 2.5, 耗电倍率: 3.3 },
  { 增产效果: 1.325, 加速效果: 2.75, 耗电倍率: 3.7 },
  { 增产效果: 1.35, 加速效果: 3, 耗电倍率: 4.1 },
  { 增产效果: 1.375, 加速效果: 3.25, 耗电倍率: 4.5 },
  { 增产效果: 1.4, 加速效果: 3.5, 耗电倍率: 4.9 },
];

var GAME_DATA_MAP = RECOVERED_GAME_DATA_MAP || {};

var iconNameCache;

function getModOptions() {
  let options = [];
  MOD_INFO.forEach(function (mod) {
    if (mod.GUID !== `Vanilla`) {
      options.push({
        value: mod.GUID,
        label: `${mod.name} v${mod.version}`,
      });
    }
  });
  return options;
}

function buildGameData(selectedModGUIDs) {
  let gameData = {};
  let enabledMods = [];
  let gameName = ``;

  gameData.MoreMegaStructureEnable = false;
  if (selectedModGUIDs.includes(MOD_GUIDS.MoreMegaStructure)) {
    gameName += `_MoreMegaStructure`;
    gameData.MoreMegaStructureEnable = true;
    enabledMods.push(`MoreMegaStructure`);
  }
  gameData.TheyComeFromVoidEnable = false;
  if (selectedModGUIDs.includes(MOD_GUIDS.TheyComeFromVoid)) {
    gameName += `_TheyComeFromVoid`;
    gameData.TheyComeFromVoidEnable = true;
    enabledMods.push(`TheyComeFromVoid`);
  }
  gameData.GenesisBookEnable = false;
  if (selectedModGUIDs.includes(MOD_GUIDS.GenesisBook)) {
    gameName += `_GenesisBook`;
    gameData.GenesisBookEnable = true;
    enabledMods.push(`GenesisBook`);
  }
  gameData.FractionateEverythingEnable = false;
  if (selectedModGUIDs.includes(MOD_GUIDS.FractionateEverything)) {
    gameName += `_FractionateEverything`;
    gameData.FractionateEverythingEnable = true;
    enabledMods.push(`FractionateEverything`);
  }

  gameName = gameName === `` ? `Vanilla` : gameName.substring(1);

  let jsonData = GAME_DATA_MAP[gameName];
  gameData.mods = enabledMods;
  gameData.game_name = gameName;
  gameData.item_grid = {};
  gameData.item_icon_name = {};
  gameData.recipe_data = [];
  gameData.factory_data = [];
  gameData.proliferator_data = [];
  gameData.proliferator_effect = PROLIFERATOR_EFFECT;
  gameData.name_id_dict = {};
  gameData.id_name_dict = {};
  gameData.id_item_dict = {};
  gameData.json_data = jsonData;
  gameData.factory_typeinfo = {
    1: [2302, 2315, 2319],
    2: [2303, 2304, 2305, 2318],
    3: [2308],
    4: [2309, 2317],
    5: [2310],
    6: [2901, 2902],
  };

  if (!jsonData) {
    // TODO: 需人工确认 原始项目的 GAME_DATA_MAP 来自打包产物拆分数据文件；
    // TODO: 需人工确认 该映射尚未接入 src/data，当前先返回可运行的空壳数据避免开发态崩溃。
    gameData.proliferator_data.push({
      名称: `不使用增产剂`,
      增产剂: 0,
      喷涂次数: 1,
      增产点数: 0,
      增产效果: PROLIFERATOR_EFFECT[0].增产效果,
      加速效果: PROLIFERATOR_EFFECT[0].加速效果,
      耗电倍率: PROLIFERATOR_EFFECT[0].耗电倍率,
    });
    console.warn(`GAME_DATA_MAP 缺失键: ${gameName}，已回退为空数据`);
    return gameData;
  }

  function getItemById(id) {
    return gameData.id_item_dict[id];
  }

  jsonData.items.forEach(function (item) {
    gameData.item_grid[item.Name] = item.GridIndex;
    gameData.item_icon_name[item.Name] = item.IconName;
    gameData.name_id_dict[item.Name] = item.ID;
    gameData.id_name_dict[item.ID] = item.Name;
    gameData.id_item_dict[item.ID] = item;
  });

  let factoryTypeList = [];
  jsonData.recipes.forEach(function (recipe) {
    let materials = {};
    for (let i = 0; i < recipe.Items.length; i++) {
      let itemId = recipe.Items[i];
      let item = getItemById(itemId);
      materials[item.Name] = recipe.ItemCounts[i];
    }

    let products = {};
    for (let i = 0; i < recipe.Results.length; i++) {
      let itemId = recipe.Results[i];
      let item = getItemById(itemId);
      products[item.Name] = recipe.ResultCounts[i];
    }

    let factoryTypeIndex = -1;
    for (let i = 0; i < factoryTypeList.length; i++) {
      if (factoryTypeList[i].toString() === recipe.Factories.toString()) {
        factoryTypeIndex = i;
        break;
      }
    }
    if (factoryTypeIndex === -1) {
      factoryTypeIndex = factoryTypeList.length;
      factoryTypeList.push(recipe.Factories);
    }

    let timeSpend = recipe.TimeSpend / 60;
    let proliferator = recipe.Proliferator;
    gameData.recipe_data.push({
      原料: materials,
      产物: products,
      设施: factoryTypeIndex,
      时间: timeSpend,
      增产: proliferator,
      oid: recipe.ID,
    });
  });

  for (let i = 0; i < factoryTypeList.length; i++) {
    let factoryEntries = [];
    for (let j = 0; j < factoryTypeList[i].length; j++) {
      let entry = {};
      let item = getItemById(factoryTypeList[i][j]);
      entry.名称 = item.Name;
      entry.耗能 = item.WorkEnergyPerTick * 0.00006;
      entry.倍率 = item.Speed;
      entry.占地 = item.Space;
      factoryEntries.push(entry);
    }
    gameData.factory_data.push(factoryEntries);
  }

  let pe = gameData.proliferator_effect;
  gameData.proliferator_data.push({
    名称: `不使用增产剂`,
    增产剂: 0,
    喷涂次数: 1,
    增产点数: 0,
    增产效果: pe[0].增产效果,
    加速效果: pe[0].加速效果,
    耗电倍率: pe[0].耗电倍率,
  });

  if (iconNameCache === undefined) {
    iconNameCache = {};
  }

  jsonData.items.forEach(function (item) {
    if (item.ID === 1141) {
      gameData.proliferator_data.push({
        名称: `增产剂\xA0Mk.I`,
        增产剂: `增产剂\xA0Mk.I`,
        喷涂次数: 12,
        增产点数: 1,
        增产效果: pe[1].增产效果,
        加速效果: pe[1].加速效果,
        耗电倍率: pe[1].耗电倍率,
      });
    }
    if (item.ID === 1142) {
      gameData.proliferator_data.push({
        名称: `增产剂\xA0Mk.II`,
        增产剂: `增产剂\xA0Mk.II`,
        喷涂次数: 24,
        增产点数: 2,
        增产效果: pe[2].增产效果,
        加速效果: pe[2].加速效果,
        耗电倍率: pe[2].耗电倍率,
      });
    }
    if (item.ID === 1143) {
      gameData.proliferator_data.push({
        名称: gameData.GenesisBookEnable ? `增产剂` : `增产剂\xA0Mk.III`,
        增产剂: gameData.GenesisBookEnable ? `增产剂` : `增产剂\xA0Mk.III`,
        喷涂次数: 60,
        增产点数: 4,
        增产效果: pe[4].增产效果,
        加速效果: pe[4].加速效果,
        耗电倍率: pe[4].耗电倍率,
      });
    }
    iconNameCache[item.Name] = item.IconName;
  });

  if (gameData.FractionateEverythingEnable) {
    gameData.proliferator_data.push({
      名称: `点数聚集分馏塔`,
      增产剂: gameData.GenesisBookEnable ? `增产剂` : `增产剂\xA0Mk.III`,
      喷涂次数: 24,
      增产点数: 10,
      增产效果: pe[10].增产效果,
      加速效果: pe[10].加速效果,
      耗电倍率: pe[10].耗电倍率,
    });
  }

  return gameData;
}

function buildItemRecipeIndexMap(gameData) {
  let map = {};
  let index = 0;
  for (let r = 0; r < gameData.recipe_data.length; r++) {
    for (let product in gameData.recipe_data[r].产物) {
      if (!(product in map)) {
        map[product] = [index];
        index++;
      }
      map[product].push(r);
    }
  }
  return map;
}

function getIconName(itemName) {
  return iconNameCache[itemName];
}

export {
  MOD_GUIDS,
  MOD_INFO,
  PROLIFERATOR_EFFECT,
  buildGameData,
  buildItemRecipeIndexMap,
  getModOptions,
  getIconName,
};