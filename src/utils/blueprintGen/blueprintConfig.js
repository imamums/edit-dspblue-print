var BELT_OPTIONS = [
  { value: 1, item_icon: '传送带' },
  { value: 2, item_icon: '高速传送带' },
  { value: 3, item_icon: '极速传送带' },
];

var SORTER_OPTIONS = [
  { value: 1, item_icon: '分拣器' },
  { value: 2, item_icon: '高速分拣器' },
  { value: 3, item_icon: '极速分拣器' },
  { value: 4, item_icon: '集装分拣器' },
];

var LAYOUT_COLS_OPTIONS = [
  { value: 3, label: '3' },
  { value: 5, label: '5' },
  { value: 7, label: '7' },
  { value: 9, label: '9' },
  { value: 11, label: '11' },
  { value: 13, label: '13' },
  { value: 15, label: '15' },
];

var LOGISTICS_MODE_OPTIONS = [
  { value: 1, label: '无方案' },
  { value: 2, label: '物流配送器' },
  { value: 3, label: '行星内物流运输站' },
];

var BELT_SPEED_OPTIONS = [
  { value: 360, label: '360/min' },
  { value: 720, label: '720/min' },
  { value: 1800, label: '1800/min' },
  { value: 7200, label: '7200/min' },
];

var PLACEMENT_MODE_OPTIONS = [
  { value: 1, label: '纵向放置' },
  { value: 2, label: '堆砌放置' },
];

var FACTORY_TYPE_ENUM = {
  NONE: -1,
  SMELTER: 1,
  WORKBENCH: 2,
  REFINERY: 3,
  CHEMICAL: 4,
  COLLIDER: 5,
  MATRIX: 6,
};

function BlueprintConfig() {
  this.maxMachineInALine = 15;
  this.beltLv = 1;
  this.inserterLv = 1;
  this.modeType = 2;
  this.maxLays = 3;
  this.beltSpeed = 7200;
  this.smelterMaxCount = 15;
  this.workbenchMaxCount = 15;
  this.refineryMaxCount = 15;
  this.chemicalMaxCount = 15;
  this.colliderMaxCount = 15;
  this.mergeType = 2;
  this.blockWidthLimit = 50;
}

BlueprintConfig.prototype.getMachineMaxCount = function (factoryType) {
  if (factoryType == FACTORY_TYPE_ENUM.SMELTER) {
    return this.smelterMaxCount;
  } else if (factoryType == FACTORY_TYPE_ENUM.WORKBENCH) {
    return this.workbenchMaxCount;
  } else if (factoryType == FACTORY_TYPE_ENUM.REFINERY) {
    return this.refineryMaxCount;
  } else if (factoryType == FACTORY_TYPE_ENUM.CHEMICAL) {
    return this.chemicalMaxCount;
  } else if (factoryType == FACTORY_TYPE_ENUM.COLLIDER) {
    return this.colliderMaxCount;
  } else {
    return 999;
  }
};

function getFactoryTypeInfo(gameData, itemName) {
  if (!gameData || !itemName) {
    return -1;
  }

  let itemId = gameData.name_id_dict[itemName];
  if (itemId == null) {
    return -1;
  }

  let typeInfo = gameData.factory_typeinfo || {};
  for (let type in typeInfo) {
    if (typeInfo[type].indexOf(itemId) != -1) {
      return +type;
    }
  }
  return -1;
}

function getFactoryLevel(gameData, itemName) {
  if (!gameData || !itemName) {
    return -1;
  }

  let itemId = gameData.name_id_dict[itemName];
  if (itemId == null) {
    return -1;
  }

  let typeInfo = gameData.factory_typeinfo || {};
  for (let type in typeInfo) {
    let levelIndex = typeInfo[type].indexOf(itemId);
    if (levelIndex != -1) {
      return levelIndex + 1;
    }
  }

  return -1;
}

function buildBlueprintRowInfo(row, gameData) {
  if (row.ignore) {
    return null;
  }

  let factoryType = getFactoryTypeInfo(gameData, row.factory_name);
  if (factoryType == -1) {
    return null;
  }

  let factoryLevel = getFactoryLevel(gameData, row.factory_name);
  let info = {
    recipeId: row.recipe_id,
  };
  info.machineCount = Math.ceil(row.factory_number.toFixed(2));
  info.machineLv = factoryLevel;
  info.machineType = factoryType;
  info.insertLv = 1;
  info.bletLv = 1;
  info.machineId = row.machineId;
  info.outputCount = row.outputCount;
  info.outputPerSecond = Number(row.outputPerSecond) || 0;
  info.mainItemId = row.mainItemId;
  info.inputItemCount = Math.max(1, Number(row.inputItemCount) || 1);
  info.outputItemCount = Math.max(1, Number(row.outputItemCount) || 1);
  info.inputItemIds = Array.isArray(row.inputItemIds) ? row.inputItemIds.slice() : [];
  info.outputItemIds = Array.isArray(row.outputItemIds) ? row.outputItemIds.slice() : [];
  info.inputItemCounts = Array.isArray(row.inputItemCounts) ? row.inputItemCounts.slice() : [];
  info.outputItemCounts = Array.isArray(row.outputItemCounts) ? row.outputItemCounts.slice() : [];
  return info;
}

function canGenerateBlueprint(row, gameData) {
  if (row.ignore) {
    return false;
  }

  return getFactoryTypeInfo(gameData, row.factory_name) != -1;
}

function isSameCalcResult(a, b) {
  if (!a || !b) {
    return a === b;
  }
  if (
    Math.abs(a.energyCost - b.energyCost) > 0.000001 ||
    Math.abs(a.totalEnergyCost - b.totalEnergyCost) > 0.000001
  ) {
    return false;
  }
  let aKeys = Object.keys(a.buildingCounts);
  let bKeys = Object.keys(b.buildingCounts);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  for (let key of aKeys) {
    if (a.buildingCounts[key] !== b.buildingCounts[key]) {
      return false;
    }
  }
  let aRawKeys = Object.keys(a.rawMaterials);
  let bRawKeys = Object.keys(b.rawMaterials);
  if (aRawKeys.length !== bRawKeys.length) {
    return false;
  }
  for (let key of aRawKeys) {
    if (Math.abs(a.rawMaterials[key] - (b.rawMaterials[key] || 0)) > 0.000001) {
      return false;
    }
  }
  return true;
}

export {
  BELT_OPTIONS,
  SORTER_OPTIONS,
  LAYOUT_COLS_OPTIONS,
  LOGISTICS_MODE_OPTIONS,
  BELT_SPEED_OPTIONS,
  PLACEMENT_MODE_OPTIONS,
  FACTORY_TYPE_ENUM,
  BlueprintConfig,
  getFactoryTypeInfo,
  getFactoryLevel,
  buildBlueprintRowInfo,
  canGenerateBlueprint,
  isSameCalcResult,
};