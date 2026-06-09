import { BlueprintUtils } from './blueprintUtils.js';
import * as PARSER from '@/utils/parser';

const DEFAULT_GAME_VERSION = '0.10.34.28529';

const MACHINE_SPACING = {
  1: { x: 5, y: 7 },
  2: { x: 6, y: 7 },
  3: { x: 8, y: 7 },
  4: { x: 9, y: 8 },
  5: { x: 12, y: 10 },
  6: { x: 7, y: 9 },
};

const MACHINE_SLOT_MAP = {
  1: [8, 7, 6, 0, 1, 2],
  2: [8, 7, 6, 0, 1, 2],
  3: [3, 4, 5, 2, 1, 0],
  4: [6, 5, 4, 0, 1, 2],
  5: [6, 7, 8, 2, 1, 0],
  6: [6, 7, 8, 2, 1, 0],
};

const MACHINE_LAYOUT_CONFIG = {
  1: {
    startBeltOffset: 1,
    space: 3,
    lineSpacing: 3,
    bottomMidDistance: 1,
    topMidDistance: 1,
    leftMidDistance: 1,
    yaw: 0,
  },
  2: {
    startBeltOffset: 1,
    space: 4,
    lineSpacing: 3,
    bottomMidDistance: 1,
    topMidDistance: 1,
    leftMidDistance: 1,
    yaw: 0,
  },
  3: {
    startBeltOffset: 1,
    space: 6,
    lineSpacing: 3,
    bottomMidDistance: 1,
    topMidDistance: 1,
    leftMidDistance: 1,
    yaw: 270,
  },
  4: {
    startBeltOffset: 2,
    space: 7,
    lineSpacing: 4,
    bottomMidDistance: 1,
    topMidDistance: 2,
    leftMidDistance: 1,
    yaw: 0,
  },
  5: {
    startBeltOffset: 3,
    space: 10,
    lineSpacing: 5,
    bottomMidDistance: 2,
    topMidDistance: 2,
    leftMidDistance: 2,
    yaw: 0,
  },
  6: {
    startBeltOffset: 1,
    space: 5,
    lineSpacing: 5,
    bottomMidDistance: 2,
    topMidDistance: 2,
    leftMidDistance: 1,
    yaw: 0,
  },
};

const BELT_ITEM_IDS = {
  1: 2001,
  2: 2002,
  3: 2003,
};

const INSERTER_ITEM_IDS = {
  1: 2011,
  2: 2012,
  3: 2013,
  4: 2014,
};

const BUILDING_MODEL_INDEX_BY_ITEM_ID = {
  2001: 35,
  2002: 36,
  2003: 37,
  2020: 38,
  2011: 41,
  2012: 42,
  2013: 43,
  2014: 483,
  2101: 51,
  2103: 49,
  2107: 371,
  2201: 44,
  2302: 62,
  2315: 194,
  2319: 457,
  2303: 65,
  2304: 66,
  2305: 67,
  2318: 456,
  2308: 63,
  2309: 64,
  2317: 376,
  2310: 69,
  2901: 70,
  2902: 455,
};

const MACHINE_TYPES_REQUIRE_STATION_SPACE = new Set([3, 4, 6]);
const MODE2_FLY_BLOCK_ZERO_BAN_ITEM_IDS = new Set([1000, 1007, 1114, 1116, 1120, 1121]);

const STATION_SLOT_PRIORITY = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5];

const STATION_SLOT_POS_OFFSET = {
  6: { x: -1, y: -6, z: 0 },
  7: { x: 0, y: -5, z: 0 },
  8: { x: 1, y: -4, z: 0 },
  9: { x: 4, y: -1, z: 0 },
  10: { x: 4, y: 0, z: 0 },
  11: { x: 4, y: 1, z: 0 },
  0: { x: 1, y: 4, z: 0 },
  1: { x: 0, y: 5, z: 0 },
  2: { x: -1, y: 6, z: 0 },
  3: { x: -4, y: 7, z: 0 },
  4: { x: -5, y: 8, z: 0 },
  5: { x: -6, y: 9, z: 0 },
};

const STATION_SLOT_FIRST_AXIS = {
  6: 'x',
  7: 'y',
  8: 'y',
  9: 'y',
  10: 'y',
  11: 'y',
  0: 'x',
  1: 'x',
  2: 'x',
  3: 'x',
  4: 'x',
  5: 'x',
};

const STATION_SLOT_MAIN_POINTS = {
  6: [
    { x: -1, y: -6, z: 0 },
    { x: -1, y: -2, z: 0 },
  ],
  7: [
    { x: 0, y: -5, z: 0 },
    { x: 0, y: -2, z: 0 },
  ],
  8: [
    { x: 1, y: -4, z: 0 },
    { x: 1, y: -2, z: 0 },
  ],
  9: [
    { x: 4, y: -1, z: 0 },
    { x: 2, y: -1, z: 0 },
  ],
  10: [
    { x: 4, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
  ],
  11: [
    { x: 4, y: 1, z: 0 },
    { x: 2, y: 1, z: 0 },
  ],
  0: [
    { x: 1, y: 4, z: 0 },
    { x: 1, y: 2, z: 0 },
  ],
  1: [
    { x: 0, y: 5, z: 0 },
    { x: 0, y: 2, z: 0 },
  ],
  2: [
    { x: -1, y: 6, z: 0 },
    { x: -1, y: 2, z: 0 },
  ],
  3: [
    { x: -4, y: 7, z: 0 },
    { x: -4, y: 1, z: 0 },
    { x: -2, y: 1, z: 0 },
  ],
  4: [
    { x: -5, y: 8, z: 0 },
    { x: -5, y: 0, z: 0 },
    { x: -2, y: 0, z: 0 },
  ],
  5: [
    { x: -6, y: 9, z: 0 },
    { x: -6, y: -1, z: 0 },
    { x: -2, y: -1, z: 0 },
  ],
};

const STATION_STORAGE_TEMPLATE = [
  { itemId: 0, localRole: 0, remoteRole: 0, max: 0, lockAmount: 0 },
  { itemId: 0, localRole: 0, remoteRole: 0, max: 0, lockAmount: 0 },
  { itemId: 0, localRole: 0, remoteRole: 0, max: 0, lockAmount: 0 },
  { itemId: 0, localRole: 0, remoteRole: 0, max: 0, lockAmount: 0 },
];

const STATION_SLOT_TEMPLATE = [
  { dir: 1, storageIdx: 0 },
  { dir: 1, storageIdx: 0 },
  { dir: 1, storageIdx: 0 },
  { dir: 1, storageIdx: 0 },
  { dir: 1, storageIdx: 0 },
  { dir: 1, storageIdx: 0 },
  { dir: 1, storageIdx: 0 },
  { dir: 1, storageIdx: 0 },
  { dir: 1, storageIdx: 0 },
  { dir: 1, storageIdx: 1 },
  { dir: 1, storageIdx: 2 },
  { dir: 1, storageIdx: 3 },
];

const STATION_PARAMETERS_TEMPLATE = {
  storage: STATION_STORAGE_TEMPLATE,
  slots: STATION_SLOT_TEMPLATE,
  workEnergyPerTick: 12,
  tripRangeOfDrones: 180,
  tripRangeOfShips: 10000,
  includeOrbitCollector: true,
  warpEnableDistance: 12,
  warperNecessary: true,
  deliveryAmountOfDrones: 10,
  deliveryAmountOfShips: 100,
  pilerCount: 0,
  miningSpeed: 0,
  droneAutoReplenish: true,
  shipAutoReplenish: false,
};

function toNumber(value, fallback = 0) {
  let n = Number(value);
  if (Number.isFinite(n)) {
    return n;
  }
  return fallback;
}

function toInt(value, fallback = 0) {
  return Math.trunc(toNumber(value, fallback));
}

function resolveLineLimit(rowInfo, config) {
  let defaultLimit = Math.max(1, toInt(config?.maxMachineInALine, 15));
  if (config && typeof config.getMachineMaxCount === 'function') {
    return Math.max(1, toInt(config.getMachineMaxCount(rowInfo.machineType), defaultLimit));
  }
  return defaultLimit;
}

function getMachineSpacing(machineType) {
  return MACHINE_SPACING[machineType] || { x: 6, y: 8 };
}

function getMachineSlotMap(machineType) {
  return MACHINE_SLOT_MAP[toInt(machineType, 1)] || MACHINE_SLOT_MAP[1];
}

function getMachineLayoutConfig(machineType) {
  return MACHINE_LAYOUT_CONFIG[toInt(machineType, 1)] || MACHINE_LAYOUT_CONFIG[1];
}

function resolveInputItemCount(rowInfo) {
  let inputItemCount = toInt(
    rowInfo?.inputItemCount ?? rowInfo?.recipeInputCount ?? rowInfo?.inputCount,
    1,
  );
  return Math.max(1, inputItemCount);
}

function getBeltItemId(level) {
  return BELT_ITEM_IDS[toInt(level, 1)] || BELT_ITEM_IDS[1];
}

function getInserterItemId(level) {
  return INSERTER_ITEM_IDS[toInt(level, 1)] || INSERTER_ITEM_IDS[1];
}

function getModelIndexByItemId(itemId) {
  let id = toInt(itemId, 0);
  return toInt(BUILDING_MODEL_INDEX_BY_ITEM_ID[id], id);
}

function createMachineBuilding(rowInfo, x, y, yaw = 0) {
  let building = BlueprintUtils.CreateEmptyBuilding();
  building.itemId = toInt(rowInfo.machineId, 0);
  building.modelIndex = getModelIndexByItemId(rowInfo.machineId);
  building.areaIndex = 0;
  building.recipeId = toInt(rowInfo.recipeId, 0);
  building.filterId = 0;
  building.outputObjIdx = -1;
  building.inputObjIdx = -1;
  building.inputToSlot = 0;
  building.outputToSlot = 0;
  building.yaw = [yaw, yaw];
  building.parameters = { acceleratorMode: 0 };
  BlueprintUtils.setBuildPos(building, x, y, 0);
  return building;
}

function createBeltBuilding(level, x, y, yaw) {
  let building = BlueprintUtils.CreateEmptyBuilding();
  let itemId = getBeltItemId(level);

  building.itemId = itemId;
  building.modelIndex = getModelIndexByItemId(itemId);
  building.areaIndex = 0;
  building.recipeId = 0;
  building.filterId = 0;
  building.outputObjIdx = -1;
  building.inputObjIdx = -1;
  building.inputToSlot = 1;
  building.outputToSlot = 0;
  building.yaw = [yaw, yaw];
  building.parameters = null;

  BlueprintUtils.setBuildPos(building, x, y, 0);
  return building;
}

function createInserterBuilding(level) {
  let building = BlueprintUtils.CreateEmptyBuilding();
  let itemId = getInserterItemId(level);

  building.itemId = itemId;
  building.modelIndex = getModelIndexByItemId(itemId);
  building.areaIndex = 0;
  building.recipeId = 0;
  building.filterId = 0;
  building.outputObjIdx = -1;
  building.inputObjIdx = -1;
  building.outputToSlot = -1;
  building.inputToSlot = 1;
  building.inputFromSlot = -1;
  building.yaw = [0, 0];
  building.parameters = { length: 1 };

  return building;
}

function createStorageBoxBuilding() {
  let building = BlueprintUtils.CreateEmptyBuilding();
  building.itemId = 2101;
  building.modelIndex = getModelIndexByItemId(2101);
  building.outputToSlot = 14;
  building.inputFromSlot = 15;
  building.outputFromSlot = 15;
  building.inputToSlot = 14;
  building.parameters = {
    bans: 23,
    storageType: 0,
    filters: new Array(30).fill(0),
  };
  return building;
}

function createSplitterBuilding() {
  let building = BlueprintUtils.CreateEmptyBuilding();
  building.itemId = 2020;
  building.modelIndex = getModelIndexByItemId(2020);
  building.areaIndex = 0;
  building.recipeId = 0;
  building.filterId = 0;
  building.outputObjIdx = -1;
  building.inputObjIdx = -1;
  building.outputToSlot = 1;
  building.inputFromSlot = 0;
  building.outputFromSlot = 0;
  building.inputToSlot = 1;
  building.yaw = [0, 0];
  building.parameters = null;
  return building;
}

function createDeliveryBuilding() {
  let building = BlueprintUtils.CreateEmptyBuilding();
  building.itemId = 2107;
  building.modelIndex = getModelIndexByItemId(2107);
  building.parameters = {
    playerMode: 2,
    storageMode: 2,
    workEnergyPerTick: 1.8,
    courierAutoReplenish: false,
  };
  building.yaw = [0, 0];
  building.outputObjIdx = -1;
  building.inputObjIdx = 0;
  building.outputToSlot = 0;
  building.inputFromSlot = 13;
  building.outputFromSlot = 0;
  building.inputToSlot = 0;
  building.filterId = 1001;
  BlueprintUtils.setBuildPos(building, 0, 0, 1.875);
  return building;
}

function createPowerTowerBuilding() {
  let building = BlueprintUtils.CreateEmptyBuilding();
  building.itemId = 2201;
  building.modelIndex = getModelIndexByItemId(2201);
  building.areaIndex = 0;
  building.recipeId = 0;
  building.filterId = 0;
  building.outputObjIdx = -1;
  building.inputObjIdx = -1;
  building.inputToSlot = 0;
  building.outputToSlot = 0;
  building.yaw = [0, 0];
  building.parameters = null;
  return building;
}

function calcYaw(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let angle = (Math.atan2(dx, dy) * 180) / Math.PI;
  if (angle < 0) {
    angle += 360;
  }
  return Math.round(angle / 45) * 45;
}

function linkByInserter(source, target, inserter, options = {}) {
  let sourcePos = BlueprintUtils.getBuildPos(source);
  let targetPos = BlueprintUtils.getBuildPos(target);

  inserter.localOffset[0] = { ...sourcePos };
  inserter.localOffset[1] = { ...targetPos };

  let distance = sourcePos.x === targetPos.x ? Math.abs(sourcePos.y - targetPos.y) : Math.abs(sourcePos.x - targetPos.x);
  let length = Math.max(1, toInt(Math.ceil(distance), 1));
  if (options.lengthOverride != null) {
    length = Math.max(1, toInt(options.lengthOverride, length));
  }
  inserter.parameters = { length };

  let yaw = options.yawOverride == null
    ? calcYaw(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y)
    : toInt(options.yawOverride, 0);
  inserter.yaw = [yaw, yaw];
  inserter.outputToSlot = options.toMachine ? toInt(options.targetSlot, 0) : -1;
  inserter.inputFromSlot = options.sourceSlot == null ? inserter.inputFromSlot : toInt(options.sourceSlot, -1);
  inserter.__inputSourceRef = source;
  inserter.__outputTargetRef = target;
}

function createStraightBeltLine(startX, count, y, beltLevel) {
  let belts = [];
  let beltByX = {};

  for (let i = 0; i < count; i++) {
    let x = startX + i;
    let belt = createBeltBuilding(beltLevel, x, y, 90);
    belts.push(belt);
    beltByX[x] = belt;
  }

  for (let i = 0; i < belts.length - 1; i++) {
    belts[i].outputToSlot = 1;
    belts[i].__outputTargetRef = belts[i + 1];
  }

  return { belts, beltByX };
}

function resolveOutputItemCount(rowInfo) {
  let outputItemCount = toInt(rowInfo?.outputItemCount ?? rowInfo?.recipeOutputCount, 1);
  return Math.max(1, outputItemCount);
}

function resolveInputItemIds(rowInfo, inputCount) {
  let ids = Array.isArray(rowInfo?.inputItemIds) ? rowInfo.inputItemIds : [];
  let result = [];
  for (let i = 0; i < inputCount; i++) {
    result.push(toInt(ids[i], 0));
  }
  return result;
}

function resolveOutputItemIds(rowInfo) {
  let ids = Array.isArray(rowInfo?.outputItemIds) ? rowInfo.outputItemIds : [];
  if (ids.length > 0) {
    return ids.map((id) => toInt(id, 0));
  }
  let mainItemId = toInt(rowInfo?.mainItemId, 0);
  return mainItemId > 0 ? [mainItemId] : [];
}

function resolveInputItemStacks(rowInfo, inputCount) {
  let counts = Array.isArray(rowInfo?.inputItemCounts) ? rowInfo.inputItemCounts : [];
  let result = [];
  for (let i = 0; i < inputCount; i++) {
    result.push(Math.max(1, toInt(counts[i], 1)));
  }
  return result;
}

function resolveOutputItemStacks(rowInfo, outputCount) {
  let counts = Array.isArray(rowInfo?.outputItemCounts) ? rowInfo.outputItemCounts : [];
  let result = [];
  for (let i = 0; i < outputCount; i++) {
    result.push(Math.max(1, toInt(counts[i], 1)));
  }
  return result;
}

function linkBelt(source, target) {
  if (!source || !target) {
    return;
  }
  source.outputToSlot = 1;
  source.__outputTargetRef = target;
}

function linkBeltLine(belts) {
  for (let i = 0; i < belts.length - 1; i++) {
    linkBelt(belts[i], belts[i + 1]);
  }
}

function reverseBeltLine(belts) {
  for (let i = 0; i < belts.length; i++) {
    let yaw = (toInt(belts[i]?.yaw?.[0], 0) + 180) % 360;
    belts[i].yaw = [yaw, yaw];
    if (i === 0) {
      belts[i].outputToSlot = 0;
      delete belts[i].__outputTargetRef;
    } else {
      belts[i].outputToSlot = 1;
      belts[i].__outputTargetRef = belts[i - 1];
    }
  }
}

function createPathByPoints(points) {
  let path = [];
  if (!Array.isArray(points) || points.length === 0) {
    return path;
  }

  path.push({ ...points[0] });
  for (let i = 0; i < points.length - 1; i++) {
    let from = points[i];
    let to = points[i + 1];
    let x = from.x;
    let y = from.y;
    let z = toNumber(from.z, 0);

    if (x !== to.x) {
      let step = x < to.x ? 1 : -1;
      while (x !== to.x) {
        x += step;
        path.push({ x, y, z });
      }
      continue;
    }

    if (y !== to.y) {
      let step = y < to.y ? 1 : -1;
      while (y !== to.y) {
        y += step;
        path.push({ x, y, z });
      }
    }
  }

  return path;
}

function pointKey(pos) {
  return `${toNumber(pos?.x, 0)}_${toNumber(pos?.y, 0)}_${toNumber(pos?.z, 0)}`;
}

function addPointRecord(record, pos) {
  record[pointKey(pos)] = 1;
}

function addPointsRecord(record, points) {
  for (let i = 0; i < points.length; i++) {
    addPointRecord(record, points[i]);
  }
}

function isPointBlocked(record, pos) {
  return record[pointKey(pos)] === 1;
}

function findPathWithAxis(start, end, firstAxis = 'x', forbidden = {}) {
  let x = toNumber(start?.x, 0);
  let y = toNumber(start?.y, 0);
  let z = toNumber(start?.z, 0);
  let targetX = toNumber(end?.x, 0);
  let targetY = toNumber(end?.y, 0);
  let path = [{ x, y, z }];
  let limit = (Math.abs(targetX - x) + Math.abs(targetY - y)) * 4;
  let steps = 0;

  while ((x !== targetX || y !== targetY) && steps < limit) {
    steps += 1;

    if (firstAxis === 'x') {
      if (x !== targetX) {
        let nextX = x + (x < targetX ? 1 : -1);
        let trial = { x: nextX, y, z };
        if (isPointBlocked(forbidden, trial)) {
          if (y < targetY) {
            y += 1;
          } else if (y > targetY) {
            y -= 1;
          } else {
            y += 1;
          }
        } else {
          x = nextX;
        }
      } else if (y !== targetY) {
        y += y < targetY ? 1 : -1;
      }
    } else if (y !== targetY) {
      let nextY = y + (y < targetY ? 1 : -1);
      let trial = { x, y: nextY, z };
      if (isPointBlocked(forbidden, trial)) {
        if (x < targetX) {
          x += 1;
        } else if (x > targetX) {
          x -= 1;
        } else {
          x += 1;
        }
      } else {
        y = nextY;
      }
    } else if (x !== targetX) {
      x += x < targetX ? 1 : -1;
    }

    path.push({ x, y, z });
  }

  return path;
}

function createBeltsByPath(path, beltLevel) {
  if (!Array.isArray(path) || path.length === 0) {
    return [];
  }

  let belts = [];
  for (let i = 0; i < path.length; i++) {
    let pos = path[i];
    let belt = createBeltBuilding(beltLevel, toNumber(pos.x, 0), toNumber(pos.y, 0), 0);
    belts.push(belt);
  }

  for (let i = 0; i < belts.length - 1; i++) {
    let from = BlueprintUtils.getBuildPos(belts[i]);
    let to = BlueprintUtils.getBuildPos(belts[i + 1]);
    let yaw = calcYaw(from.x, from.y, to.x, to.y);
    belts[i].yaw = [yaw, yaw];
    linkBelt(belts[i], belts[i + 1]);
  }

  if (belts.length > 1) {
    let lastYaw = toInt(belts[belts.length - 2].yaw?.[0], 0);
    belts[belts.length - 1].yaw = [lastYaw, lastYaw];
  }

  return belts;
}

function buildMode2FlyInputOrder(inputItemIds) {
  let ids = Array.isArray(inputItemIds) ? inputItemIds.map((id) => toInt(id, 0)) : [];
  if (ids.length <= 3) {
    return ids.reverse();
  }

  let ordered = [];
  for (let i = 2; i >= 0; i--) {
    ordered.push(ids[i]);
  }
  for (let i = 3; i < ids.length; i++) {
    ordered.push(ids[i]);
  }
  return ordered;
}

function createMode2FlyBlock(itemId, beltLevel, inserterLevel, isInput, linkedBelt, offsetX, offsetY) {
  let normalizedItemId = toInt(itemId, 0);
  if (!linkedBelt || normalizedItemId <= 0) {
    return [];
  }

  let box = createStorageBoxBuilding();
  box.parameters.bans = 29;
  if (MODE2_FLY_BLOCK_ZERO_BAN_ITEM_IDS.has(normalizedItemId)) {
    box.parameters.bans = 0;
  }
  BlueprintUtils.setBuildPos(box, toNumber(offsetX, 0), toNumber(offsetY, 0), 0);

  let delivery = createDeliveryBuilding();
  delivery.filterId = normalizedItemId;
  delivery.parameters.courierAutoReplenish = true;
  BlueprintUtils.setBuildPos(delivery, toNumber(offsetX, 0), toNumber(offsetY, 0), 1.875);
  delivery.__inputSourceRef = box;

  let linkPos = BlueprintUtils.getBuildPos(linkedBelt);
  let boxPos = BlueprintUtils.getBuildPos(box);
  let cursorX = toNumber(linkPos.x, 0) + 1;
  let cursorY = toNumber(linkPos.y, 0);
  let beltCount = Math.max(0, toInt(toNumber(boxPos.x, 0) - cursorX + 1, 0));
  let belts = [];

  for (let i = 0; i < beltCount; i++) {
    let belt = createBeltBuilding(beltLevel, cursorX, cursorY, 0);
    belts.push(belt);

    if (Math.abs(cursorX - (toNumber(boxPos.x, 0) - 1)) < 0.000001) {
      let verticalSteps = Math.max(0, toInt(Math.abs(toNumber(boxPos.y, 0) - cursorY) - 2, 0));
      for (let v = 0; v < verticalSteps; v++) {
        cursorY += toNumber(boxPos.y, 0) > cursorY ? 1 : -1;
        let verticalBelt = createBeltBuilding(beltLevel, cursorX, cursorY, 0);
        belts.push(verticalBelt);
      }
    }

    cursorX += 1;
  }

  linkBeltLine(belts);
  if (isInput) {
    reverseBeltLine(belts);
    if (belts[0]) {
      linkBelt(belts[0], linkedBelt);
    }
  } else if (belts[0]) {
    linkBelt(linkedBelt, belts[0]);
  }

  let inserter = null;
  if (belts.length > 0) {
    inserter = createInserterBuilding(inserterLevel);
    let endBelt = belts[belts.length - 1];
    let endPos = BlueprintUtils.getBuildPos(endBelt);
    let boxAboveBelt = toNumber(boxPos.y, 0) > toNumber(endPos.y, 0);

    inserter.parameters = { length: 1 };
    inserter.localOffset[0].x = toNumber(boxPos.x, 0);
    inserter.localOffset[1].x = toNumber(boxPos.x, 0);

    if (isInput) {
      delivery.parameters.storageMode = 2;
      inserter.__outputTargetRef = endBelt;
      inserter.__inputSourceRef = box;
      inserter.outputToSlot = -1;
      inserter.inputFromSlot = boxAboveBelt ? 4 : 10;
      inserter.yaw = [boxAboveBelt ? 180 : 0, boxAboveBelt ? 180 : 0];

      if (boxAboveBelt) {
        inserter.localOffset[0].y = toNumber(boxPos.y, 0) - 1 + 0.2;
        inserter.localOffset[1].y = toNumber(endPos.y, 0);
      } else {
        inserter.localOffset[0].y = toNumber(boxPos.y, 0) + 1 - 0.2;
        inserter.localOffset[1].y = toNumber(endPos.y, 0);
      }
    } else {
      delivery.parameters.storageMode = 1;
      inserter.__outputTargetRef = box;
      inserter.__inputSourceRef = endBelt;
      inserter.outputToSlot = boxAboveBelt ? 4 : 10;
      inserter.filterId = normalizedItemId;
      inserter.yaw = [boxAboveBelt ? 0 : 180, boxAboveBelt ? 0 : 180];

      inserter.localOffset[0].y = toNumber(endPos.y, 0);
      if (boxAboveBelt) {
        inserter.localOffset[1].y = toNumber(boxPos.y, 0) - 1 + 0.2;
      } else {
        inserter.localOffset[1].y = toNumber(boxPos.y, 0) + 1 - 0.2;
      }
    }
  }

  let buildings = [box, delivery].concat(belts);
  if (inserter) {
    buildings.push(inserter);
  }
  return buildings;
}

function appendMode2FlyBlocks(rowInfo, inputLines, outputLine, beltLevel, inserterLevel) {
  if (!Array.isArray(inputLines) || inputLines.length === 0) {
    return [];
  }

  let firstTailLine = inputLines[0]?.belts || [];
  let outputBelts = outputLine?.belts || [];
  if (firstTailLine.length === 0 || outputBelts.length === 0) {
    return [];
  }

  let inputItemIds = resolveInputItemIds(rowInfo, inputLines.length);
  let itemBeltMap = {};
  for (let i = 0; i < inputLines.length; i++) {
    let line = inputLines[i];
    reverseBeltLine(line?.belts || []);
    let itemId = toInt(inputItemIds[i], 0);
    if (itemId > 0) {
      itemBeltMap[itemId] = line;
    }
  }

  let firstTail = firstTailLine[firstTailLine.length - 1];
  let firstTailPos = BlueprintUtils.getBuildPos(firstTail);
  let topVisibleLineCount = inputLines.length <= 3 ? inputLines.length : 3;
  let baseX = toNumber(firstTailPos.x, 0) + 2;
  let baseY = toNumber(firstTailPos.y, 0) + topVisibleLineCount + 1;

  let flyBuildings = [];
  let orderedInputIds = buildMode2FlyInputOrder(inputItemIds);
  let outputColumnIndex = 0;

  for (let i = 0; i < orderedInputIds.length; i++) {
    let itemId = toInt(orderedInputIds[i], 0);
    if (itemId <= 0) {
      continue;
    }

    let line = itemBeltMap[itemId];
    let lineBelts = line?.belts || [];
    let linkBelt = lineBelts.length > 0 ? lineBelts[lineBelts.length - 1] : null;
    if (!linkBelt) {
      continue;
    }

    let blockBuildings = createMode2FlyBlock(
      itemId,
      beltLevel,
      inserterLevel,
      true,
      linkBelt,
      baseX + 3 * i,
      baseY,
    );
    flyBuildings.push(...blockBuildings);
    outputColumnIndex += 1;
  }

  let mainItemId = toInt(rowInfo?.mainItemId, 0);
  let outputLinkBelt = outputBelts[outputBelts.length - 1] || null;
  if (mainItemId > 0 && outputLinkBelt) {
    let outputBlockBuildings = createMode2FlyBlock(
      mainItemId,
      beltLevel,
      inserterLevel,
      false,
      outputLinkBelt,
      baseX + 1 + 3 * outputColumnIndex,
      baseY,
    );
    flyBuildings.push(...outputBlockBuildings);
  }

  return flyBuildings;
}

function createLegacyMachineSegment(rowInfo, options) {
  let {
    machineCount,
    originY,
    beltLevel,
    inserterLevel,
    includeTransport,
    enableBackflow,
    enableFlyBlocks,
  } = options;

  let conf = getMachineLayoutConfig(rowInfo.machineType);
  let slotMap = getMachineSlotMap(rowInfo.machineType);
  let inputCount = resolveInputItemCount(rowInfo);
  let bottomInputCount = Math.min(3, inputCount);
  let extraInputCount = Math.max(0, inputCount - 3);

  let machineY = originY + bottomInputCount + conf.bottomMidDistance;
  let machineStartX = conf.leftMidDistance + conf.startBeltOffset;
  let beltLength = machineCount * conf.space + conf.startBeltOffset;

  let machines = [];
  for (let i = 0; i < machineCount; i++) {
    let machineX = machineStartX + i * conf.space;
    machines.push(createMachineBuilding(rowInfo, machineX, machineY, conf.yaw));
  }

  let belts = [];
  let inserters = [];
  let inputLines = [];
  let outputLine = null;
  let backflowLine = null;
  let flyBlocks = [];

  if (!includeTransport) {
    return {
      machines,
      belts,
      inserters,
      inputLines,
      outputLine,
    };
  }

  for (let lineIndex = 0; lineIndex < inputCount; lineIndex++) {
    let lineY = lineIndex < bottomInputCount
      ? originY + lineIndex
      : originY + lineIndex + conf.lineSpacing;
    let line = createStraightBeltLine(0, beltLength, lineY, beltLevel);
    inputLines.push(line);
    belts.push(...line.belts);
  }

  let outputLineY = originY + inputCount + conf.lineSpacing;
  outputLine = createStraightBeltLine(0, beltLength, outputLineY, beltLevel);
  belts.push(...outputLine.belts);

  for (let machineIndex = 0; machineIndex < machines.length; machineIndex++) {
    let machine = machines[machineIndex];
    let beltXBase = machineIndex * conf.space + conf.startBeltOffset;

    for (let i = 0; i < bottomInputCount; i++) {
      let line = inputLines[bottomInputCount - 1 - i];
      let sourceBelt = line?.beltByX[beltXBase + i];
      if (!sourceBelt) {
        continue;
      }

      let inserter = createInserterBuilding(inserterLevel);
      linkByInserter(sourceBelt, machine, inserter, {
        toMachine: true,
        targetSlot: slotMap[i] ?? 0,
        sourceSlot: -1,
        yawOverride: 0,
        lengthOverride: i + 1,
      });
      inserters.push(inserter);
    }

    for (let i = 0; i < extraInputCount; i++) {
      let line = inputLines[bottomInputCount + i];
      let sourceBelt = line?.beltByX[beltXBase + i];
      if (!sourceBelt) {
        continue;
      }

      let inserter = createInserterBuilding(inserterLevel);
      linkByInserter(sourceBelt, machine, inserter, {
        toMachine: true,
        targetSlot: slotMap[3 + i] ?? 0,
        sourceSlot: -1,
        yawOverride: 180,
        lengthOverride: i + 1,
      });
      inserters.push(inserter);
    }

    let outputCount = 1;
    for (let i = 0; i < outputCount; i++) {
      let targetBelt = outputLine.beltByX[beltXBase + i];
      if (!targetBelt) {
        continue;
      }

      let sourceSlot = slotMap[3 + extraInputCount + i] ?? slotMap[slotMap.length - 1] ?? 0;
      let inserter = createInserterBuilding(inserterLevel);
      linkByInserter(machine, targetBelt, inserter, {
        toMachine: false,
        sourceSlot,
        yawOverride: 0,
        lengthOverride: i + 1 + extraInputCount,
      });
      inserters.push(inserter);
    }
  }

  if (enableBackflow) {
    let outputBelts = outputLine?.belts || [];
    if (outputBelts.length > 0) {
      let startPos = BlueprintUtils.getBuildPos(outputBelts[0]);
      backflowLine = createStraightBeltLine(
        toNumber(startPos.x, 0),
        outputBelts.length,
        toNumber(startPos.y, 0) + 1,
        beltLevel,
      );
      reverseBeltLine(backflowLine.belts);

      let outputTail = outputBelts[outputBelts.length - 1];
      let backflowTail = backflowLine.belts[backflowLine.belts.length - 1];
      if (outputTail && backflowTail) {
        linkBelt(outputTail, backflowTail);
      }

      belts.push(...backflowLine.belts);
    }
  }

  if (enableFlyBlocks) {
    flyBlocks = appendMode2FlyBlocks(rowInfo, inputLines, outputLine, beltLevel, inserterLevel);
  }

  return {
    machines,
    belts,
    inserters,
    flyBlocks,
    inputLines,
    outputLine,
    backflowLine,
  };
}

function finalizeBlockIndices(buildings) {
  for (let i = 0; i < buildings.length; i++) {
    buildings[i].index = i;
  }

  for (let i = 0; i < buildings.length; i++) {
    let building = buildings[i];

    if (building.__outputTargetRef) {
      building.outputObjIdx = building.__outputTargetRef.index;
    } else {
      building.outputObjIdx = toInt(building.outputObjIdx, -1);
    }

    if (building.__inputSourceRef) {
      building.inputObjIdx = building.__inputSourceRef.index;
    } else {
      building.inputObjIdx = toInt(building.inputObjIdx, -1);
    }

    delete building.__outputTargetRef;
    delete building.__inputSourceRef;
  }
}

function createMachineSegments(rowInfo, config, options = {}) {
  let machineCount = Math.max(1, toInt(Math.ceil(toNumber(rowInfo.machineCount, 1)), 1));
  let lineLimit = resolveLineLimit(rowInfo, config);
  let machinesPerLine = Math.max(1, Math.min(machineCount, lineLimit));
  let spacing = getMachineSpacing(rowInfo.machineType);
  let includeTransport = options.includeTransport == null
    ? toInt(config?.modeType, 2) !== 1
    : !!options.includeTransport;
  let enableBackflow = !!options.enableBackflow;
  let enableFlyBlocks = !!options.enableFlyBlocks;
  let beltLevel = toInt(config?.beltLv, 1);
  let inserterLevel = toInt(config?.inserterLv, 1);
  let layoutConf = getMachineLayoutConfig(rowInfo.machineType);
  let inputCount = resolveInputItemCount(rowInfo);
  let bottomInputCount = Math.min(3, inputCount);
  let segmentHeight = Math.max(
    bottomInputCount + layoutConf.bottomMidDistance,
    inputCount + layoutConf.lineSpacing,
  ) + 1;
  let segmentVerticalStep = Math.max(spacing.y, segmentHeight + 2);

  let segments = [];

  let lineCount = Math.ceil(machineCount / machinesPerLine);
  for (let line = 0; line < lineCount; line++) {
    let begin = line * machinesPerLine;
    let count = Math.min(machinesPerLine, machineCount - begin);
    if (count <= 0) {
      continue;
    }

    let segment = createLegacyMachineSegment(rowInfo, {
      machineCount: count,
      originY: line * segmentVerticalStep,
      beltLevel,
      inserterLevel,
      includeTransport,
      enableBackflow,
      enableFlyBlocks,
    });

    segment.buildings = segment.machines.concat(segment.belts, segment.inserters, segment.flyBlocks || []);
    segments.push(segment);
  }

  if (includeTransport && toInt(config?.modeType, 2) === 1 && segments.length > 1) {
    let segmentConnectors = connectNeighborSegments(segments, config);
    if (segmentConnectors.length > 0) {
      segments[segments.length - 1].buildings.push(...segmentConnectors);
    }
  }

  return {
    machineCount,
    machinesPerLine,
    segments,
  };
}

function createMachineBlockFromSegments(segments) {
  let buildings = [];
  for (let i = 0; i < segments.length; i++) {
    buildings.push(...segments[i].buildings);
  }

  finalizeBlockIndices(buildings);
  return buildings;
}

function createMachineBlock(rowInfo, config) {
  let modeType = toInt(config?.modeType, 2);
  let { segments } = createMachineSegments(rowInfo, config, {
    includeTransport: true,
    enableBackflow: false,
    enableFlyBlocks: modeType === 2,
  });
  return createMachineBlockFromSegments(segments);
}

function createMachineBlockWithOptions(rowInfo, config, options = {}) {
  let modeType = toInt(config?.modeType, 2);
  let { segments } = createMachineSegments(rowInfo, config, {
    includeTransport: true,
    enableBackflow: !!options.enableBackflow,
    enableFlyBlocks: options.enableFlyBlocks == null ? modeType === 2 : !!options.enableFlyBlocks,
  });

  return {
    block: createMachineBlockFromSegments(segments),
    segments,
  };
}

function resolveMode2OutputPerSecond(rowInfo) {
  let outputPerSecond = toNumber(rowInfo?.outputPerSecond, 0);
  if (outputPerSecond > 0) {
    return outputPerSecond;
  }

  let outputCount = toNumber(rowInfo?.outputCount, 0);
  if (outputCount > 0) {
    return outputCount / 60;
  }

  return 0;
}

function collectMode2SegmentMetas(rowInfo, segments) {
  let metas = [];
  let inputCount = resolveInputItemCount(rowInfo);
  let inputItemIds = resolveInputItemIds(rowInfo, inputCount);
  let mainItemId = toInt(rowInfo?.mainItemId, 0);
  let totalOutputPerSecond = resolveMode2OutputPerSecond(rowInfo);
  let perSegmentOutputPerSecond = segments.length > 0
    ? totalOutputPerSecond / segments.length
    : totalOutputPerSecond;

  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    let inputHeads = [];
    let outputBelts = segment?.outputLine?.belts || [];
    let backflowBelts = segment?.backflowLine?.belts || [];

    for (let inputIndex = 0; inputIndex < inputCount; inputIndex++) {
      let head = segment?.inputLines?.[inputIndex]?.belts?.[0];
      if (!head) {
        continue;
      }
      inputHeads.push({
        head,
        itemId: toInt(inputItemIds[inputIndex], 0),
      });
    }

    metas.push({
      mainItemId,
      inputHeads,
      outputHead: outputBelts[0] || null,
      outputTail: outputBelts.length > 0 ? outputBelts[outputBelts.length - 1] : null,
      backflowHead: backflowBelts[0] || null,
      backflowTail: backflowBelts.length > 0 ? backflowBelts[backflowBelts.length - 1] : null,
      outputPerSecond: perSegmentOutputPerSecond,
    });
  }

  return metas;
}

function createLogisticsStationBuilding(x, y) {
  let station = BlueprintUtils.CreateEmptyBuilding();
  station.itemId = 2103;
  station.modelIndex = getModelIndexByItemId(2103);
  station.inputToSlot = 0;
  station.yaw = [0, 0];
  station.parameters = BlueprintUtils.simpleClone(STATION_PARAMETERS_TEMPLATE);
  BlueprintUtils.setBuildPos(station, x, y, 0);
  return station;
}

function getStationPos(station) {
  return BlueprintUtils.getBuildPos(station);
}

function getStationLinkBeltPos(station, slot) {
  let pos = getStationPos(station);
  let offset = STATION_SLOT_POS_OFFSET[slot] || { x: 0, y: 0, z: 0 };
  return {
    x: pos.x + offset.x,
    y: pos.y + offset.y,
    z: pos.z + offset.z,
  };
}

function findStationStorageIdx(station, itemId) {
  let storage = station?.parameters?.storage || [];
  for (let i = 0; i < storage.length; i++) {
    if (toInt(storage[i]?.itemId, 0) === toInt(itemId, 0)) {
      return i + 1;
    }
  }
  return 0;
}

function setStationStorageInfo(station, storageIdx, itemId, isSupply, maxCount = 10000) {
  let storage = station?.parameters?.storage || [];
  if (storageIdx < 0 || storageIdx >= storage.length) {
    return;
  }

  storage[storageIdx].itemId = toInt(itemId, 0);
  storage[storageIdx].localRole = isSupply ? 1 : 2;
  storage[storageIdx].max = Math.max(1, toInt(maxCount, 10000));
}

function setStationSlotInfo(station, slotIdx, itemId, isSupply) {
  let slots = station?.parameters?.slots || [];
  if (slotIdx < 0 || slotIdx >= slots.length) {
    return;
  }

  let slot = slots[slotIdx];
  slot.dir = isSupply ? 2 : 1;
  if (slot.dir === 1) {
    slot.storageIdx = findStationStorageIdx(station, itemId);
  }
}

function applyStationTailFineOffset(slot, path) {
  if (path.length < 2) {
    return;
  }

  let tail = path[path.length - 1];
  let beforeTail = path[path.length - 2];

  if ([0, 1, 2].indexOf(slot) === -1) {
    if ([3, 4, 5].indexOf(slot) === -1) {
      if ([6, 7, 8].indexOf(slot) === -1) {
        if ([9, 10, 11].indexOf(slot) !== -1) {
          tail.x += 0.1464;
          beforeTail.x += 0.0207;
        }
      } else {
        tail.y -= 0.1464;
        beforeTail.y -= 0.0207;
      }
    } else {
      tail.x -= 0.1464;
      beforeTail.x -= 0.0207;
    }
  } else {
    tail.y += 0.1464;
    beforeTail.y += 0.0207;
  }

  if ([2, 6].indexOf(slot) === -1) {
    if ([0, 8].indexOf(slot) === -1) {
      if ([3, 11].indexOf(slot) === -1) {
        if ([5, 9].indexOf(slot) !== -1) {
          tail.y += 0.0015;
          beforeTail.y += 0.0015;
        }
      } else {
        tail.y -= 0.0015;
        beforeTail.y -= 0.0015;
      }
    } else {
      tail.x -= 0.0015;
      beforeTail.x -= 0.0015;
    }
  } else {
    tail.x += 0.0015;
    beforeTail.x += 0.0015;
  }
}

function createStationTailBelts(station, slot, beltLevel) {
  let stationPos = getStationPos(station);
  let slotMainPoints = STATION_SLOT_MAIN_POINTS[slot] || [];
  let points = [];

  for (let i = 0; i < slotMainPoints.length; i++) {
    points.push({
      x: stationPos.x + slotMainPoints[i].x,
      y: stationPos.y + slotMainPoints[i].y,
      z: stationPos.z + slotMainPoints[i].z,
    });
  }

  let path = createPathByPoints(points).slice(1);
  applyStationTailFineOffset(slot, path);
  return createBeltsByPath(path, beltLevel);
}

function needsStationHeadPadding(rowInfo) {
  return MACHINE_TYPES_REQUIRE_STATION_SPACE.has(toInt(rowInfo?.machineType, 0));
}

function isStationModeSupported(rowInfo) {
  let inputCount = resolveInputItemCount(rowInfo);
  let outputCount = resolveOutputItemCount(rowInfo);
  if (inputCount + outputCount > 4) {
    return false;
  }

  let channelsPerLine = inputCount + 1;
  return channelsPerLine <= STATION_SLOT_PRIORITY.length;
}

function computeStationStorageMax(stackCount, machineCount) {
  let base = toNumber(stackCount, 1) * Math.max(1, toInt(machineCount, 1)) * 0.5;
  let value = Math.ceil(base / 100) * 100;
  if (value <= 0) {
    value = 10000;
  }
  return Math.min(10000, toInt(value, 10000));
}

function createStationBlock(rowInfo, segments, config) {
  if (!Array.isArray(segments) || segments.length === 0) {
    return [];
  }

  let inputCount = resolveInputItemCount(rowInfo);
  let inputItemIds = resolveInputItemIds(rowInfo, inputCount);
  let inputItemStacks = resolveInputItemStacks(rowInfo, inputCount);
  let outputItemIds = resolveOutputItemIds(rowInfo);
  let outputItemStacks = resolveOutputItemStacks(rowInfo, Math.max(1, outputItemIds.length));
  let beltLevel = toInt(config?.beltLv, 1);
  let lineBuildings = [];
  let headInfos = [];

  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    reverseBeltLine(segment.outputLine?.belts || []);
    lineBuildings.push(...segment.buildings);

    for (let inputIndex = 0; inputIndex < inputCount; inputIndex++) {
      let headBelt = segment.inputLines?.[inputIndex]?.belts?.[0];
      if (!headBelt) {
        continue;
      }
      headInfos.push({
        head: headBelt,
        isOutput: false,
        itemId: toInt(inputItemIds[inputIndex], 0),
      });
    }

    let outputHead = segment.outputLine?.belts?.[0];
    if (outputHead) {
      headInfos.push({
        head: outputHead,
        isOutput: true,
        itemId: toInt(outputItemIds[0], 0),
      });
    }
  }

  let station = createLogisticsStationBuilding(-10, 6);
  let slotPriority = STATION_SLOT_PRIORITY.slice();
  if (headInfos.length <= 6) {
    slotPriority = slotPriority.slice(3);
    BlueprintUtils.setBuildPos(station, -10, 1, 0);
  }

  let machineCount = 0;
  for (let i = 0; i < segments.length; i++) {
    machineCount += segments[i].machines.length;
  }

  let storageIdx = 0;
  for (let i = 0; i < inputItemIds.length && storageIdx < 4; i++) {
    let itemId = toInt(inputItemIds[i], 0);
    if (itemId <= 0) {
      continue;
    }
    let maxCount = computeStationStorageMax(inputItemStacks[i], machineCount);
    setStationStorageInfo(station, storageIdx, itemId, false, maxCount);
    storageIdx += 1;
  }
  for (let i = 0; i < outputItemIds.length && storageIdx < 4; i++) {
    let itemId = toInt(outputItemIds[i], 0);
    if (itemId <= 0) {
      continue;
    }
    let maxCount = computeStationStorageMax(outputItemStacks[i], machineCount);
    setStationStorageInfo(station, storageIdx, itemId, true, maxCount);
    storageIdx += 1;
  }

  let pathCheckRecord = {};
  for (let i = 0; i < headInfos.length; i++) {
    addPointRecord(pathCheckRecord, BlueprintUtils.getBuildPos(headInfos[i].head));
  }
  let stationPos = getStationPos(station);
  addPointRecord(pathCheckRecord, { x: stationPos.x + 3, y: stationPos.y + 2, z: 0 });
  addPointRecord(pathCheckRecord, { x: stationPos.x + 2, y: stationPos.y + 3, z: 0 });

  let pathBelts = [];
  let usePadding = needsStationHeadPadding(rowInfo);
  for (let i = 0; i < headInfos.length; i++) {
    let slot = slotPriority[i];
    if (slot == null) {
      continue;
    }

    let headInfo = headInfos[i];
    let headPos = BlueprintUtils.getBuildPos(headInfo.head);
    if (usePadding) {
      headPos = { ...headPos, x: headPos.x - 1 };
    }

    let targetPos = getStationLinkBeltPos(station, slot);
    let firstAxis = STATION_SLOT_FIRST_AXIS[slot] || 'y';
    let path = findPathWithAxis(headPos, targetPos, firstAxis, pathCheckRecord);
    if (!usePadding) {
      path = path.slice(1);
    }
    addPointsRecord(pathCheckRecord, path);

    let pathLine = createBeltsByPath(path, beltLevel);
    let stationTailBelts = createStationTailBelts(station, slot, beltLevel);
    if (pathLine.length > 0 && stationTailBelts.length > 0) {
      linkBelt(pathLine[pathLine.length - 1], stationTailBelts[0]);
    }

    let fullPath = pathLine.concat(stationTailBelts);
    if (fullPath.length === 0) {
      continue;
    }

    if (headInfo.isOutput) {
      linkBelt(headInfo.head, fullPath[0]);
      setStationSlotInfo(station, slot, 0, true);

      let tail = fullPath[fullPath.length - 1];
      tail.outputToSlot = slot;
      tail.__outputTargetRef = station;
    } else {
      reverseBeltLine(fullPath);
      linkBelt(fullPath[0], headInfo.head);
      setStationSlotInfo(station, slot, headInfo.itemId, false);

      let tail = fullPath[fullPath.length - 1];
      tail.inputFromSlot = slot;
      tail.__inputSourceRef = station;
      if (headInfo.itemId > 0) {
        tail.parameters = { iconId: headInfo.itemId, count: 0 };
      }
    }

    pathBelts.push(...fullPath);
  }

  let buildings = lineBuildings.concat([station], pathBelts);
  let size = BlueprintUtils.getBlueprintSize(buildings);
  if (Number.isFinite(size.min.x) && Number.isFinite(size.min.y)) {
    BlueprintUtils.buildPosOffSet(buildings, -size.min.x, -size.min.y, 0);
  }

  finalizeBlockIndices(buildings);
  return buildings;
}

function createStationBlocks(rowInfo, config) {
  let segmentResult = createMachineSegments(rowInfo, config, { includeTransport: true });
  let segments = segmentResult.segments;
  if (segments.length === 0) {
    return [];
  }

  let channelsPerLine = resolveInputItemCount(rowInfo) + 1;
  let linesPerStation = Math.max(1, Math.floor(STATION_SLOT_PRIORITY.length / channelsPerLine));
  let blocks = [];

  for (let i = 0; i < segments.length; i += linesPerStation) {
    let group = segments.slice(i, i + linesPerStation);
    let block = createStationBlock(rowInfo, group, config);
    if (block.length > 0) {
      blocks.push(block);
    }
  }

  return blocks;
}

function createBlocksForRow(rowInfo, config, rowOptions = {}) {
  let modeType = toInt(config?.modeType, 2);
  if (toInt(config?.modeType, 2) !== 3) {
    let enableBackflow = modeType === 2 && !!rowOptions.enableBackflow;
    let enableFlyBlocks = modeType === 2;
    let machineBlock = createMachineBlockWithOptions(rowInfo, config, { enableBackflow, enableFlyBlocks });
    let mode2SegmentMetas = modeType === 2
      ? collectMode2SegmentMetas(rowInfo, machineBlock.segments)
      : [];
    return {
      blocks: [machineBlock.block],
      stationFallbackCount: 0,
      backflowRowCount: enableBackflow ? 1 : 0,
      mode2SegmentMetas,
    };
  }

  if (!isStationModeSupported(rowInfo)) {
    return {
      blocks: [createMachineBlock(rowInfo, config)],
      stationFallbackCount: 1,
      backflowRowCount: 0,
      mode2SegmentMetas: [],
    };
  }

  let stationBlocks = createStationBlocks(rowInfo, config);
  if (stationBlocks.length === 0) {
    return {
      blocks: [createMachineBlock(rowInfo, config)],
      stationFallbackCount: 1,
      backflowRowCount: 0,
      mode2SegmentMetas: [],
    };
  }

  return {
    blocks: stationBlocks,
    stationFallbackCount: 0,
    backflowRowCount: 0,
    mode2SegmentMetas: [],
  };
}

function calcBlockSize(buildings) {
  let size = BlueprintUtils.getBlueprintSize(buildings);
  return {
    minX: size.min.x,
    minY: size.min.y,
    width: Math.max(1, Math.ceil(size.width + 1)),
    height: Math.max(1, Math.ceil(size.height + 1)),
  };
}

function applyBlockPlacement(blocks, placements) {
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    let placement = placements[i];
    let size = calcBlockSize(block);
    let targetX = toNumber(placement?.x, 0);
    let targetY = toNumber(placement?.y, 0);
    BlueprintUtils.buildPosOffSet(block, targetX - size.minX, targetY - size.minY, 0);
  }

  let indexOffset = 0;
  for (let i = 0; i < blocks.length; i++) {
    if (i > 0) {
      BlueprintUtils.IndexOffset(blocks[i], indexOffset);
    }
    indexOffset += blocks[i].length;
  }
}

function mergeMainlineBlocksByColumn(blocks, config, options) {
  let gap = Math.max(0, toInt(options?.blockGap, 0));
  let minStride = toInt(config?.modeType, 2) === 3 ? 12 : 0;
  let y = 0;
  let placements = [];

  for (let i = 0; i < blocks.length; i++) {
    let size = calcBlockSize(blocks[i]);
    placements.push({ x: 0, y });
    let stride = Math.max(size.height + gap, minStride);
    y += stride;
  }

  applyBlockPlacement(blocks, placements);
}

function mergeMainlineBlocksByPacking(blocks, config) {
  let blockSizes = blocks.map((block) => calcBlockSize(block));
  let maxBlockWidth = blockSizes.reduce((max, size) => Math.max(max, size.width), 0);
  let widthLimit = Math.max(maxBlockWidth, Math.max(10, toInt(config?.blockWidthLimit, 50)));
  let rowStridePadding = toInt(config?.modeType, 2) === 3 ? 12 : 1;

  let placements = [];
  let x = 0;
  let y = 0;
  let rowHeight = 0;

  for (let i = 0; i < blocks.length; i++) {
    let size = blockSizes[i];
    if (x > 0 && x + size.width > widthLimit) {
      y += Math.max(rowHeight + 1, rowStridePadding);
      x = 0;
      rowHeight = 0;
    }

    placements.push({ x, y });
    x += size.width;
    rowHeight = Math.max(rowHeight, size.height);
  }

  applyBlockPlacement(blocks, placements);
}

function mergeMainlineBlocks(blocks, config, options = {}) {
  let mergeType = toInt(config?.mergeType, 1);
  if (mergeType === 2) {
    mergeMainlineBlocksByPacking(blocks, config);
    return;
  }
  mergeMainlineBlocksByColumn(blocks, config, options);
}

function createVerticalBeltLine(x, startY, count, beltLevel) {
  let belts = [];

  for (let i = 0; i < count; i++) {
    let y = startY + i;
    let belt = createBeltBuilding(beltLevel, x, y, 0);
    belts.push(belt);
  }

  for (let i = 0; i < belts.length - 1; i++) {
    linkBelt(belts[i], belts[i + 1]);
    let fromPos = BlueprintUtils.getBuildPos(belts[i]);
    let toPos = BlueprintUtils.getBuildPos(belts[i + 1]);
    let yaw = calcYaw(fromPos.x, fromPos.y, toPos.x, toPos.y);
    belts[i].yaw = [yaw, yaw];
  }

  if (belts.length > 1) {
    let lastYaw = toInt(belts[belts.length - 2].yaw?.[0], 0);
    belts[belts.length - 1].yaw = [lastYaw, lastYaw];
  }

  return {
    belts,
    startY,
  };
}

function pickLineBeltByY(lineInfo, y) {
  if (!lineInfo || !Array.isArray(lineInfo.belts) || lineInfo.belts.length === 0) {
    return null;
  }

  let startY = toInt(lineInfo.startY, 0);
  let idx = toInt(Math.round(toNumber(y, startY)) - startY, 0);
  if (idx < 0) {
    idx = 0;
  }
  if (idx >= lineInfo.belts.length) {
    idx = lineInfo.belts.length - 1;
  }
  return lineInfo.belts[idx];
}

function createBeltInserter(source, target, inserterLevel, filterId = 0) {
  let inserter = createInserterBuilding(inserterLevel);
  linkByInserter(source, target, inserter, {
    toMachine: false,
  });

  if (toInt(filterId, 0) > 0) {
    inserter.filterId = toInt(filterId, 0);
  }
  return inserter;
}

function createOrthogonalBeltPath(startX, startY, endX, endY) {
  let sx = toNumber(startX, 0);
  let sy = toNumber(startY, 0);
  let ex = toNumber(endX, 0);
  let ey = toNumber(endY, 0);

  if (Math.abs(sx - ex) < 0.000001 && Math.abs(sy - ey) < 0.000001) {
    return [{ x: sx, y: sy, z: 0 }];
  }

  if (Math.abs(sx - ex) < 0.000001 || Math.abs(sy - ey) < 0.000001) {
    return createPathByPoints([
      { x: sx, y: sy, z: 0 },
      { x: ex, y: ey, z: 0 },
    ]);
  }

  let cornerA = { x: ex, y: sy, z: 0 };
  return createPathByPoints([
    { x: sx, y: sy, z: 0 },
    cornerA,
    { x: ex, y: ey, z: 0 },
  ]);
}

function buildDetourPathForSplitter(sourcePos, targetPos) {
  let sx = toNumber(sourcePos?.x, 0);
  let sy = toNumber(sourcePos?.y, 0);
  let ex = toNumber(targetPos?.x, 0);
  let ey = toNumber(targetPos?.y, 0);
  let dx = ex - sx;
  let dy = ey - sy;

  if (Math.abs(dx) < 0.000001 && Math.abs(dy) < 0.000001) {
    return [{ x: sx, y: sy, z: 0 }];
  }

  if (Math.abs(dx) >= Math.abs(dy)) {
    let detourY = sy + (dy >= 0 ? 1 : -1);
    return createPathByPoints([
      { x: sx, y: sy, z: 0 },
      { x: sx, y: detourY, z: 0 },
      { x: ex, y: detourY, z: 0 },
      { x: ex, y: ey, z: 0 },
    ]);
  }

  let detourX = sx + (dx >= 0 ? 1 : -1);
  return createPathByPoints([
    { x: sx, y: sy, z: 0 },
    { x: detourX, y: sy, z: 0 },
    { x: detourX, y: ey, z: 0 },
    { x: ex, y: ey, z: 0 },
  ]);
}

function createDirectBeltBridge(source, target, beltLevel) {
  if (!source || !target) {
    return [];
  }

  let sourcePos = BlueprintUtils.getBuildPos(source);
  let targetPos = BlueprintUtils.getBuildPos(target);
  let path = createOrthogonalBeltPath(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
  if (!Array.isArray(path) || path.length < 2) {
    return [];
  }

  let belts = [];
  for (let i = 1; i < path.length - 1; i++) {
    let p = path[i];
    belts.push(createBeltBuilding(beltLevel, toNumber(p.x, 0), toNumber(p.y, 0), 0));
  }

  let cursor = source;
  for (let i = 0; i < belts.length; i++) {
    linkBelt(cursor, belts[i]);
    cursor = belts[i];
  }
  linkBelt(cursor, target);

  return belts;
}

function createBeltSplitterBridge(source, target, beltLevel, filterId = 0) {
  if (!source || !target) {
    return [];
  }

  let sourcePos = BlueprintUtils.getBuildPos(source);
  let targetPos = BlueprintUtils.getBuildPos(target);
  let path = createOrthogonalBeltPath(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
  if (!Array.isArray(path) || path.length < 3) {
    path = buildDetourPathForSplitter(sourcePos, targetPos);
  }
  if (!Array.isArray(path) || path.length < 3) {
    return [];
  }

  let splitterIdx = Math.max(1, Math.min(path.length - 2, Math.floor(path.length / 2)));
  let splitterPoint = path[splitterIdx];

  let leadBelts = [];
  for (let i = 1; i < splitterIdx; i++) {
    let p = path[i];
    leadBelts.push(createBeltBuilding(beltLevel, toNumber(p.x, 0), toNumber(p.y, 0), 0));
  }

  let tailBelts = [];
  for (let i = splitterIdx + 1; i < path.length - 1; i++) {
    let p = path[i];
    tailBelts.push(createBeltBuilding(beltLevel, toNumber(p.x, 0), toNumber(p.y, 0), 0));
  }

  let splitter = createSplitterBuilding();
  BlueprintUtils.setBuildPos(splitter, toNumber(splitterPoint.x, 0), toNumber(splitterPoint.y, 0), 0);
  splitter.yaw = [calcYaw(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y), calcYaw(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y)];
  if (toInt(filterId, 0) > 0) {
    splitter.filterId = toInt(filterId, 0);
  }

  let upstream = source;
  for (let i = 0; i < leadBelts.length; i++) {
    linkBelt(upstream, leadBelts[i]);
    upstream = leadBelts[i];
  }

  linkBelt(upstream, splitter);
  splitter.__inputSourceRef = upstream;

  let downstream = tailBelts.length > 0 ? tailBelts[0] : target;
  splitter.outputToSlot = 1;
  splitter.__outputTargetRef = downstream;

  if (tailBelts.length > 0) {
    for (let i = 0; i < tailBelts.length - 1; i++) {
      linkBelt(tailBelts[i], tailBelts[i + 1]);
    }
    linkBelt(tailBelts[tailBelts.length - 1], target);
  }

  let box = createStorageBoxBuilding();
  BlueprintUtils.setBuildPos(box, toNumber(splitterPoint.x, 0), toNumber(splitterPoint.y, 0), 1.2);

  return leadBelts.concat([splitter], tailBelts, [box]);
}

function createBeltBridgeConnector(source, target, config, inserterLevel, filterId = 0) {
  if (toInt(config?.useFourWaySplitter, 0) > 0) {
    let bridgeBuildings = createBeltSplitterBridge(source, target, toInt(config?.beltLv, 1), filterId);
    if (bridgeBuildings.length > 0) {
      return bridgeBuildings;
    }
  }

  return [createBeltInserter(source, target, inserterLevel, filterId)];
}

function createSegmentBeltConnector(source, target, config) {
  if (!source || !target) {
    return [];
  }

  if (toInt(config?.useFourWaySplitter, 0) > 0) {
    let bridgeBuildings = createBeltSplitterBridge(source, target, toInt(config?.beltLv, 1));
    if (bridgeBuildings.length > 0) {
      return bridgeBuildings;
    }
  }

  return createDirectBeltBridge(source, target, toInt(config?.beltLv, 1));
}

function connectNeighborSegments(segments, config) {
  if (!Array.isArray(segments) || segments.length <= 1) {
    return [];
  }

  let connectors = [];
  for (let i = 0; i < segments.length - 1; i++) {
    let current = segments[i];
    let next = segments[i + 1];

    let currentInputLines = Array.isArray(current?.inputLines) ? current.inputLines : [];
    let nextInputLines = Array.isArray(next?.inputLines) ? next.inputLines : [];
    let inputLineCount = Math.min(currentInputLines.length, nextInputLines.length);

    for (let lineIndex = 0; lineIndex < inputLineCount; lineIndex++) {
      let currentInputBelts = currentInputLines[lineIndex]?.belts || [];
      let nextInputBelts = nextInputLines[lineIndex]?.belts || [];
      let source = currentInputBelts[currentInputBelts.length - 1];
      let target = nextInputBelts[0];
      connectors.push(...createSegmentBeltConnector(source, target, config));
    }

    let currentOutputBelts = current?.outputLine?.belts || [];
    let nextOutputBelts = next?.outputLine?.belts || [];
    let outputSource = currentOutputBelts[currentOutputBelts.length - 1];
    let outputTarget = nextOutputBelts[0];
    connectors.push(...createSegmentBeltConnector(outputSource, outputTarget, config));

    let currentBackflowBelts = current?.backflowLine?.belts || [];
    let nextBackflowBelts = next?.backflowLine?.belts || [];
    let backflowSource = currentBackflowBelts[currentBackflowBelts.length - 1];
    let backflowTarget = nextBackflowBelts[0];
    connectors.push(...createSegmentBeltConnector(backflowSource, backflowTarget, config));
  }

  return connectors;
}

function isNeedItem(needsById, itemId) {
  let id = toInt(itemId, 0);
  return id > 0 && toNumber(needsById?.[id], 0) > 0;
}

function calcMode2LimiterInserterPlan(needPow, maxInserterLv) {
  let insertConf = {
    3: [6, 3, 2],
    2: [3, 1.5, 1],
    1: [1.5, 0.75, 0.5],
  };

  let result = [];
  let remain = Math.max(0, toNumber(needPow, 0));
  let maxLv = Math.max(1, Math.min(3, toInt(maxInserterLv, 1)));

  for (let lenIdx = 0; lenIdx < 3 && remain > 0.001; lenIdx++) {
    for (let lv = 3; lv >= 1 && remain > 0.001; lv--) {
      if (lv > maxLv) {
        continue;
      }

      let conf = insertConf[lv];
      if (!conf) {
        continue;
      }

      let power = toNumber(conf[lenIdx], 0);
      if (power <= 0 || Math.abs(power - 0.75) < 0.000001) {
        continue;
      }

      while (remain >= power - 0.0001) {
        result.push({
          lv,
          len: lenIdx + 1,
          power,
        });
        remain -= power;
      }
    }
  }

  if (result.length === 0) {
    result.push({
      lv: maxLv,
      len: 1,
      power: 0.5,
    });
  }

  result.sort((a, b) => {
    if (a.len !== b.len) {
      return a.len - b.len;
    }
    return b.lv - a.lv;
  });

  return result;
}

function createMode2LimiterBlock(needPow, maxInserterLv, beltLevel, filterId = 0, config = {}) {
  let plan = calcMode2LimiterInserterPlan(needPow, maxInserterLv);

  let belts1 = [];
  let sourceBelts = [];
  let belt = null;
  let x = 0;
  let currentLen = 1;

  if (plan[0].len !== 1) {
    belt = createBeltBuilding(beltLevel, x, -1, 0);
    belts1.push(belt);
    x += 1;
  }

  for (let i = 0; i < plan.length; i++) {
    let targetLen = toInt(plan[i].len, 1);
    let targetY = -targetLen;

    if (targetLen !== currentLen) {
      belt = createBeltBuilding(beltLevel, x, -currentLen, 0);
      belts1.push(belt);

      let diff = targetLen - currentLen;
      for (let step = 0; step < diff; step++) {
        belt = createBeltBuilding(beltLevel, x, -(currentLen + step), 0);
        belts1.push(belt);
      }

      belt = createBeltBuilding(beltLevel, x, targetY, 0);
      belts1.push(belt);
      x += 1;
      currentLen = targetLen;
    }

    belt = createBeltBuilding(beltLevel, x, targetY, 0);
    belts1.push(belt);
    sourceBelts.push(belt);
    x += 1;
  }

  linkBeltLine(belts1);

  let lastX = toInt(BlueprintUtils.getBuildPos(belts1[belts1.length - 1]).x, 0);
  let belts2Line = createStraightBeltLine(0, lastX + 1, 2, beltLevel);
  let belts2 = belts2Line.belts;
  reverseBeltLine(belts2);

  let targetByX = {};
  for (let i = 0; i < belts2.length; i++) {
    let pos = BlueprintUtils.getBuildPos(belts2[i]);
    targetByX[toInt(pos.x, 0)] = belts2[i];
  }

  let inserters = [];
  for (let i = 0; i < plan.length; i++) {
    let source = sourceBelts[i];
    if (!source) {
      continue;
    }
    let sourcePos = BlueprintUtils.getBuildPos(source);
    let target = targetByX[toInt(sourcePos.x, 0)];
    if (!target) {
      continue;
    }

    inserters.push(
      ...createBeltBridgeConnector(
        source,
        target,
        config,
        Math.min(toInt(plan[i].lv, maxInserterLv), toInt(maxInserterLv, 1)),
        filterId,
      ),
    );
  }

  return {
    buildings: belts1.concat(belts2, inserters),
    inputBelt: belts1[0] || null,
    outputBelt: belts2[0] || null,
  };
}

function createMode2RawOreSupplyBlock(itemId, needPerSecond, scheduleIndex, maxInserterLv, beltLevel) {
  let normalizedScheduleIndex = Math.max(0, Math.min(2, toInt(scheduleIndex, 0)));
  let alignedNeedPow = Math.max(0.5, Math.ceil(toNumber(needPerSecond, 0) / 0.5) * 0.5);
  let inputPlan = calcMode2RawOreInserterPlan(alignedNeedPow, normalizedScheduleIndex, maxInserterLv);
  let backPow = calcMode2RawOreBackPow(alignedNeedPow, normalizedScheduleIndex, maxInserterLv);
  let outputPlan = calcMode2RawOreInserterPlan(backPow, -1, maxInserterLv);

  if (inputPlan.length === 0) {
    inputPlan = [{
      lv: Math.max(1, Math.min(3, toInt(maxInserterLv, 1))),
      len: normalizedScheduleIndex + 1,
      power: 0.5,
    }];
  }

  if (outputPlan.length === 0) {
    outputPlan = [{
      lv: Math.max(1, Math.min(3, toInt(maxInserterLv, 1))),
      len: 1,
      power: 0.5,
    }];
  }

  let inputBelt = createBeltBuilding(beltLevel, -1, 0, 0);
  let centerBelt = createBeltBuilding(beltLevel, 0, 0, 0);

  let totalCount = Math.max(1, toInt(Math.floor(alignedNeedPow * 60), 1));
  inputBelt.parameters = {
    iconId: toInt(itemId, 0),
    count: totalCount,
  };

  let outputBelts = [];
  for (let i = 0; i < outputPlan.length; i++) {
    let belt = createBeltBuilding(beltLevel, 0, 1 + i, 0);
    outputBelts.push(belt);
  }

  let inputBelts = [];
  let inputInsetBelts = [];
  let currentLen = 1;
  let currentY = -1;

  let pushInputBelt = (x, y) => {
    let belt = createBeltBuilding(beltLevel, x, y, 0);
    inputBelts.push(belt);
    return belt;
  };

  for (let i = 0; i < inputPlan.length; i++) {
    let relativeLen = Math.max(1, toInt(inputPlan[i].len, 1) - normalizedScheduleIndex);
    let targetX = -(relativeLen - 1);

    if (relativeLen !== currentLen) {
      pushInputBelt(-(currentLen - 1), currentY);
      let span = relativeLen - currentLen;
      for (let step = 0; step < span; step++) {
        pushInputBelt(-(currentLen - 1 + step), currentY);
      }
      pushInputBelt(targetX, currentY);
      currentY -= 1;
      currentLen = relativeLen;
    }

    let inset = pushInputBelt(targetX, currentY);
    inputInsetBelts.push(inset);
    currentY -= 1;
  }

  if (inputBelts.length === 0) {
    let fallbackInset = pushInputBelt(0, -1);
    inputInsetBelts.push(fallbackInset);
    inputPlan = [{
      lv: Math.max(1, Math.min(3, toInt(maxInserterLv, 1))),
      len: normalizedScheduleIndex + 1,
      power: 0.5,
    }];
  }

  let flowBelts = [...outputBelts].reverse();
  flowBelts.push(centerBelt);
  flowBelts.push(...inputBelts);
  linkBeltLine(flowBelts);
  linkBelt(inputBelt, centerBelt);
  inputBelt.outputToSlot = 2;

  let belts = [inputBelt, centerBelt].concat(outputBelts, inputBelts);
  return {
    buildings: belts,
    outputBelt: outputBelts[0] || centerBelt,
    inputInsetBelts,
    outputInsetBelts: outputBelts,
    inputTransPlan: inputPlan,
    outputTransPlan: outputPlan,
  };
}

function calcMode2RawOreInserterPlan(needPow, scheduleIndex, maxInserterLv) {
  let insertConf = {
    3: [6, 3, 2],
    2: [3, 1.5, 1],
    1: [1.5, 0.75, 0.5],
  };

  let minLen = Math.max(1, Math.min(3, toInt(scheduleIndex, 0) + 1));
  let maxLv = Math.max(1, Math.min(3, toInt(maxInserterLv, 1)));
  let remain = Math.max(0, toNumber(needPow, 0));
  let result = [];

  for (let lenIdx = minLen - 1; lenIdx < 3 && remain > 0.001; lenIdx++) {
    for (let lv = 3; lv >= 1 && remain > 0.001; lv--) {
      if (lv > maxLv) {
        continue;
      }

      let conf = insertConf[lv];
      if (!conf) {
        continue;
      }

      let power = toNumber(conf[lenIdx], 0);
      if (power <= 0 || Math.abs(power - 0.75) < 0.000001) {
        continue;
      }

      while (remain >= power - 0.0001) {
        result.push({
          lv,
          len: lenIdx + 1,
          power,
        });
        remain -= power;
      }
    }
  }

  if (result.length === 0) {
    result.push({
      lv: maxLv,
      len: minLen,
      power: 0.5,
    });
  }

  result.sort((a, b) => {
    if (a.len !== b.len) {
      return a.len - b.len;
    }
    return b.lv - a.lv;
  });

  return result;
}

function calcMode2RawOreBackPow(needPow, scheduleIndex, maxInserterLv) {
  let insertConf = {
    3: [6, 3, 2],
    2: [3, 1.5, 1],
    1: [1.5, 0.75, 0.5],
  };

  let maxLv = Math.max(1, Math.min(3, toInt(maxInserterLv, 1)));
  let lenIdx = Math.max(0, Math.min(2, toInt(scheduleIndex, 0)));
  let quantum = toNumber(insertConf[maxLv]?.[lenIdx], 0);
  let targetNeed = Math.max(0.5, toNumber(needPow, 0));
  if (quantum <= 0) {
    return targetNeed;
  }

  let aligned = Math.ceil(targetNeed / quantum) * quantum;
  if (aligned <= targetNeed) {
    aligned = (Math.ceil(targetNeed / quantum) + 1) * quantum;
  }
  return Math.max(targetNeed, aligned);
}

function getMode2BeltSpeedByLevel(level) {
  let lv = Math.max(1, Math.min(3, toInt(level, 1)));
  if (lv === 1) {
    return 6;
  }
  if (lv === 2) {
    return 12;
  }
  return 30;
}

function buildMode2ItemSchedule(rows, needsById, rawOreById, beltLevel) {
  let recipeInfo = [];

  let rawOreKeys = Object.keys(rawOreById || {});
  for (let i = 0; i < rawOreKeys.length; i++) {
    let itemId = toInt(rawOreKeys[i], 0);
    let rawNeed = toNumber(rawOreById?.[itemId], 0);
    if (itemId <= 0 || rawNeed <= 0) {
      continue;
    }
    recipeInfo.push({
      itemId,
      needCount: Math.ceil(rawNeed / 0.5) * 0.5,
    });
  }

  let rowList = Array.isArray(rows) ? rows : [];
  for (let i = 0; i < rowList.length; i++) {
    let row = rowList[i];
    let mainItemId = toInt(row?.mainItemId, 0);
    if (mainItemId <= 0 || isNeedItem(needsById, mainItemId)) {
      continue;
    }

    let outputPerSecond = resolveMode2OutputPerSecond(row);
    if (outputPerSecond <= 0) {
      continue;
    }

    recipeInfo.push({
      itemId: mainItemId,
      needCount: Math.ceil(outputPerSecond / 0.5) * 0.5,
    });
  }

  let totalNeed = 0;
  for (let i = 0; i < recipeInfo.length; i++) {
    totalNeed += toNumber(recipeInfo[i].needCount, 0);
  }

  recipeInfo.sort((a, b) => {
    if (Math.abs(toNumber(a.needCount, 0) - toNumber(b.needCount, 0)) < 0.000001) {
      return toInt(a.itemId, 0) - toInt(b.itemId, 0);
    }
    return toNumber(b.needCount, 0) - toNumber(a.needCount, 0);
  });

  let beltSpeed = getMode2BeltSpeedByLevel(beltLevel);
  let laneCount = Math.min(3, Math.max(0, Math.ceil(totalNeed / Math.max(0.5, beltSpeed))));
  let itemSchedule = [];
  let laneLoads = [];

  for (let i = 0; i < laneCount; i++) {
    itemSchedule.push([]);
    laneLoads.push(0);
  }

  for (let i = 0; i < recipeInfo.length; i++) {
    let itemId = toInt(recipeInfo[i].itemId, 0);
    let needCount = toNumber(recipeInfo[i].needCount, 0);

    for (let lane = 0; lane < laneLoads.length; lane++) {
      if (laneLoads[lane] + needCount <= beltSpeed + 0.000001 || lane === laneLoads.length - 1) {
        itemSchedule[lane].push(itemId);
        laneLoads[lane] += needCount;
        break;
      }
    }
  }

  return itemSchedule;
}

function getMode2ItemScheduleIndex(itemId, itemSchedule) {
  let targetId = toInt(itemId, 0);
  if (targetId <= 0 || !Array.isArray(itemSchedule)) {
    return -1;
  }

  for (let i = 0; i < itemSchedule.length; i++) {
    if (!Array.isArray(itemSchedule[i])) {
      continue;
    }
    if (itemSchedule[i].indexOf(targetId) !== -1) {
      return i;
    }
  }

  return -1;
}

function buildMode2MainBus(segmentMetas, baseBuildings, config, needsById = {}, rawOreById = {}, itemSchedule = []) {
  if (!Array.isArray(segmentMetas) || segmentMetas.length === 0 || !Array.isArray(baseBuildings)) {
    return {
      buildings: [],
      limiterRowCount: 0,
      rawOreRowCount: 0,
    };
  }

  let allItems = new Set();
  for (let i = 0; i < segmentMetas.length; i++) {
    let meta = segmentMetas[i];
    for (let j = 0; j < meta.inputHeads.length; j++) {
      let itemId = toInt(meta.inputHeads[j].itemId, 0);
      if (itemId > 0) {
        allItems.add(itemId);
      }
    }

    let mainItemId = toInt(meta.mainItemId, 0);
    if (mainItemId > 0 && !isNeedItem(needsById, mainItemId)) {
      allItems.add(mainItemId);
    }
  }

  if (allItems.size === 0) {
    return {
      buildings: [],
      limiterRowCount: 0,
      rawOreRowCount: 0,
    };
  }

  let itemIds = [...allItems].sort((a, b) => a - b);
  let size = BlueprintUtils.getBlueprintSize(baseBuildings);
  let minX = Math.floor(toNumber(size.min.x, 0));
  let minY = Math.floor(toNumber(size.min.y, 0));
  let maxY = Math.ceil(toNumber(size.max.y, 0));
  let startY = minY;
  let lineCount = Math.max(3, maxY - startY + 1);
  let startX = minX - 6;

  let busLines = {};
  let laneByItemId = {};
  let laneIndexes = [];

  for (let i = 0; i < itemIds.length; i++) {
    let itemId = itemIds[i];
    let lane = getMode2ItemScheduleIndex(itemId, itemSchedule);
    if (lane < 0) {
      lane = laneIndexes.length;
    }
    laneByItemId[itemId] = lane;
    if (laneIndexes.indexOf(lane) === -1) {
      laneIndexes.push(lane);
    }
  }

  laneIndexes.sort((a, b) => a - b);

  let laneToLine = {};
  let busBelts = [];
  let beltLevel = toInt(config?.beltLv, 1);
  for (let i = 0; i < laneIndexes.length; i++) {
    let lane = laneIndexes[i];
    let line = createVerticalBeltLine(startX - i * 2, startY, lineCount, beltLevel);
    laneToLine[lane] = line;
    busBelts.push(...line.belts);
  }

  for (let i = 0; i < itemIds.length; i++) {
    let itemId = itemIds[i];
    let lane = laneByItemId[itemId];
    if (!laneToLine[lane]) {
      continue;
    }
    busLines[itemId] = laneToLine[lane];
  }

  let inserterLevel = toInt(config?.inserterLv, 1);
  let connectors = [];
  let limiterBuildings = [];
  let rawOreBuildings = [];
  let limiterRowCount = 0;
  let rawOreRowCount = 0;

  let producedMainItemIds = new Set();
  for (let i = 0; i < segmentMetas.length; i++) {
    let producedId = toInt(segmentMetas[i]?.mainItemId, 0);
    if (producedId > 0) {
      producedMainItemIds.add(producedId);
    }
  }

  for (let i = 0; i < segmentMetas.length; i++) {
    let meta = segmentMetas[i];

    for (let j = 0; j < meta.inputHeads.length; j++) {
      let inputHead = meta.inputHeads[j];
      let itemId = toInt(inputHead.itemId, 0);
      if (itemId <= 0 || !busLines[itemId] || !inputHead.head || isNeedItem(needsById, itemId)) {
        continue;
      }

      let headPos = BlueprintUtils.getBuildPos(inputHead.head);
      let sourceBelt = pickLineBeltByY(busLines[itemId], headPos.y);
      if (!sourceBelt) {
        continue;
      }

      connectors.push(...createBeltBridgeConnector(sourceBelt, inputHead.head, config, inserterLevel, itemId));
    }

    let backflowHead = meta.backflowHead;
    let mainItemId = toInt(meta.mainItemId, 0);
    if (!backflowHead || mainItemId <= 0 || !busLines[mainItemId]) {
      continue;
    }

    let backflowPos = BlueprintUtils.getBuildPos(backflowHead);
    let targetBelt = pickLineBeltByY(busLines[mainItemId], backflowPos.y);
    if (!targetBelt) {
      continue;
    }

    let targetPos = BlueprintUtils.getBuildPos(targetBelt);
    let backflowToBusDistance = Math.floor(toNumber(backflowPos.x, 0) - toNumber(targetPos.x, 0));
    let sameY = Math.abs(toNumber(backflowPos.y, 0) - toNumber(targetPos.y, 0)) < 0.000001;
    if (backflowToBusDistance === 1 && sameY) {
      linkBelt(backflowHead, targetBelt);
      backflowHead.outputToSlot = 2;
    } else {
      connectors.push(...createBeltBridgeConnector(backflowHead, targetBelt, config, inserterLevel, mainItemId));
    }

    let outputTail = meta.outputTail;
    let backflowTail = meta.backflowTail;
    if (!outputTail || !backflowTail || isNeedItem(needsById, mainItemId)) {
      continue;
    }

    let limitNeed = Math.max(0.5, toNumber(meta.outputPerSecond, 0));
    let limiterBlock = createMode2LimiterBlock(limitNeed, inserterLevel, beltLevel, mainItemId, config);
    if (!limiterBlock.inputBelt || !limiterBlock.outputBelt) {
      continue;
    }

    let outputPos = BlueprintUtils.getBuildPos(outputTail);
    let limiterInputPos = BlueprintUtils.getBuildPos(limiterBlock.inputBelt);
    BlueprintUtils.buildPosOffSet(
      limiterBlock.buildings,
      toNumber(outputPos.x, 0) + 1 - toNumber(limiterInputPos.x, 0),
      toNumber(outputPos.y, 0) + 1 - toNumber(limiterInputPos.y, 0),
      0,
    );

    linkBelt(outputTail, limiterBlock.inputBelt);
    linkBelt(limiterBlock.outputBelt, backflowTail);
    limiterBuildings.push(...limiterBlock.buildings);
    limiterRowCount += 1;
  }

  let rawOreItemIds = Object.keys(rawOreById)
    .map((itemId) => toInt(itemId, 0))
    .filter((itemId) => {
      if (itemId <= 0 || !busLines[itemId]) {
        return false;
      }
      if (producedMainItemIds.has(itemId)) {
        return false;
      }
      return toNumber(rawOreById[itemId], 0) > 0;
    })
    .sort((a, b) => toNumber(rawOreById[b], 0) - toNumber(rawOreById[a], 0));

  let rawOreCursorY = startY + 3;
  for (let i = 0; i < rawOreItemIds.length; i++) {
    let itemId = rawOreItemIds[i];
    let needPerSecond = Math.max(0.5, Math.ceil(toNumber(rawOreById[itemId], 0) / 0.5) * 0.5);
    let scheduleIndex = getMode2ItemScheduleIndex(itemId, itemSchedule);
    if (scheduleIndex < 0) {
      scheduleIndex = i;
    }

    let rawOreBlock = createMode2RawOreSupplyBlock(itemId, needPerSecond, scheduleIndex, inserterLevel, beltLevel);
    let targetBelt = pickLineBeltByY(busLines[itemId], rawOreCursorY);
    if (!targetBelt || !rawOreBlock.outputBelt) {
      continue;
    }

    let outputPos = BlueprintUtils.getBuildPos(rawOreBlock.outputBelt);
    let targetPos = BlueprintUtils.getBuildPos(targetBelt);
    BlueprintUtils.buildPosOffSet(
      rawOreBlock.buildings,
      toNumber(targetPos.x, 0) - 1 - toNumber(outputPos.x, 0),
      toNumber(targetPos.y, 0) - toNumber(outputPos.y, 0),
      0,
    );

    let hasConnector = false;
    let inputInsetBelts = Array.isArray(rawOreBlock.inputInsetBelts) ? rawOreBlock.inputInsetBelts : [];
    let outputInsetBelts = Array.isArray(rawOreBlock.outputInsetBelts) ? rawOreBlock.outputInsetBelts : [];

    for (let j = 0; j < inputInsetBelts.length; j++) {
      let sourceBelt = inputInsetBelts[j];
      if (!sourceBelt) {
        continue;
      }

      let sourcePos = BlueprintUtils.getBuildPos(sourceBelt);
      let busTarget = pickLineBeltByY(busLines[itemId], sourcePos.y);
      if (!busTarget) {
        continue;
      }

      let lv = toInt(rawOreBlock.inputTransPlan?.[j]?.lv, inserterLevel);
      rawOreBlock.buildings.push(...createBeltBridgeConnector(sourceBelt, busTarget, config, lv));
      hasConnector = true;
    }

    for (let j = 0; j < outputInsetBelts.length; j++) {
      let targetBeltInBlock = outputInsetBelts[j];
      if (!targetBeltInBlock) {
        continue;
      }

      let targetPosInBlock = BlueprintUtils.getBuildPos(targetBeltInBlock);
      let busSource = pickLineBeltByY(busLines[itemId], targetPosInBlock.y);
      if (!busSource) {
        continue;
      }

      let lv = toInt(rawOreBlock.outputTransPlan?.[j]?.lv, inserterLevel);
      rawOreBlock.buildings.push(...createBeltBridgeConnector(busSource, targetBeltInBlock, config, lv, itemId));
      hasConnector = true;
    }

    if (!hasConnector) {
      rawOreBlock.buildings.push(...createBeltBridgeConnector(rawOreBlock.outputBelt, targetBelt, config, inserterLevel, itemId));
    }

    rawOreBuildings.push(...rawOreBlock.buildings);
    rawOreRowCount += 1;

    let blockSize = BlueprintUtils.getBlueprintSize(rawOreBlock.buildings);
    rawOreCursorY += Math.max(3, toInt(Math.ceil(toNumber(blockSize.height, 0)) + 1, 3));
  }

  return {
    buildings: busBelts.concat(connectors, limiterBuildings, rawOreBuildings),
    limiterRowCount,
    rawOreRowCount,
  };
}

function buildBlueprintDataFromBuildings(buildings, shortDesc = '') {
  let data = BlueprintUtils.createEmptyBlueprintData();
  data.header.shortDesc = shortDesc;
  data.header.gameVersion = DEFAULT_GAME_VERSION;
  data.buildings = buildings;

  if (buildings.length > 0) {
    let size = BlueprintUtils.getBlueprintSize(buildings);
    data.areas[0].size = {
      x: Math.max(10, Math.ceil(size.width + 4)),
      y: Math.max(10, Math.ceil(size.height + 4)),
    };
  }

  return data;
}

function createPowerTowerGrid(existingBuildings) {
  if (!Array.isArray(existingBuildings) || existingBuildings.length === 0) {
    return [];
  }

  let size = BlueprintUtils.getBlueprintSize(existingBuildings);
  let minX = Math.floor(toNumber(size.min?.x ?? size.min.x ?? 0, 0));
  let minY = Math.floor(toNumber(size.min?.y ?? size.min.y ?? 0, 0));
  let maxX = Math.ceil(toNumber(size.max?.x ?? size.max.x ?? 0, 0));
  let maxY = Math.ceil(toNumber(size.max?.y ?? size.max.y ?? 0, 0));
  let width = Math.max(1, maxX - minX);
  let height = Math.max(1, maxY - minY);

  let occupied = new Set();
  for (let i = 0; i < existingBuildings.length; i++) {
    let b = existingBuildings[i];
    let pos = BlueprintUtils.getBuildPos(b);
    let id = toInt(b?.itemId, 0);

    let bSize = 1;
    if ([2303, 2304, 2305, 2302, 2315, 2308, 2309, 2310, 2314, 2311].includes(id)) {
      bSize = 3;
    } else if (id === 2313) {
      bSize = 6;
    } else if (id === 2306) {
      bSize = 4;
    } else if (id === 2103 || id === 2104) {
      bSize = 7;
    } else if (id === 2101) {
      bSize = 2;
    } else if (id === 2102) {
      bSize = 3;
    } else if (id === 2020) {
      bSize = 3;
    } else if (id === 2107) {
      bSize = 1;
    }

    let radius = (bSize - 1) / 2;
    for (let dx = -Math.floor(radius); dx <= Math.ceil(radius); dx++) {
      for (let dy = -Math.floor(radius); dy <= Math.ceil(radius); dy++) {
        occupied.add(`${Math.round(toNumber(pos?.x, 0) + dx)}_${Math.round(toNumber(pos?.y, 0) + dy)}`);
      }
    }
  }

  let powerConsumers = existingBuildings.filter((b) => {
    let id = toInt(b?.itemId, 0);
    return id !== 2001 && id !== 2002 && id !== 2003;
  }).length;
  let totalTowers = Math.max(1, Math.ceil(powerConsumers / 20), Math.ceil(existingBuildings.length / 40));

  let topY = minY + 2;
  let bottomY = maxY + 1;
  let middleY = Math.floor((topY + bottomY) / 2) + 1;
  let plannedPoints = [
    { x: minX + Math.floor(width * 0.2), y: topY },
    { x: minX + Math.floor(width * 0.8), y: topY },
    { x: minX + Math.floor(width * 0.2), y: bottomY },
    { x: minX + Math.floor(width * 0.8), y: bottomY },
    { x: Math.floor((minX + maxX) / 2), y: middleY },
  ];

  let towers = [];
  let used = {};

  function tryPlaceTower(x, y) {
    for (let r = 0; r <= 4; r++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
          if (r > 0 && Math.abs(dx) !== r && Math.abs(dy) !== r) {
            continue;
          }

          let cx = Math.round(toNumber(x, 0) + dx);
          let cy = Math.round(toNumber(y, 0) + dy);
          let key = `${cx}_${cy}`;
          if (!occupied.has(key) && !used[key]) {
            let tower = createPowerTowerBuilding();
            BlueprintUtils.setBuildPos(tower, cx, cy, 0);
            towers.push(tower);
            used[key] = 1;
            occupied.add(key);
            return true;
          }
        }
      }
    }
    return false;
  }

  for (let i = 0; i < plannedPoints.length && towers.length < totalTowers; i++) {
    tryPlaceTower(plannedPoints[i].x, plannedPoints[i].y);
  }

  if (towers.length >= totalTowers) {
    return towers;
  }

  let cols = Math.max(1, Math.ceil(Math.sqrt(totalTowers * (width / Math.max(1, height)))));
  let rows = Math.max(1, Math.ceil(totalTowers / cols));
  for (let row = 0; row < rows && towers.length < totalTowers; row++) {
    for (let col = 0; col < cols && towers.length < totalTowers; col++) {
      let x = minX + Math.floor(width * (col + 0.5) / cols);
      let y = minY + Math.floor(height * (row + 0.5) / rows);
      tryPlaceTower(x, y);
    }
  }

  return towers;
}

function normalizeBeltYawByOutput(buildings) {
  if (!Array.isArray(buildings) || buildings.length === 0) {
    return;
  }

  let byIndex = {};
  let inboundByTarget = {};
  for (let i = 0; i < buildings.length; i++) {
    let building = buildings[i];
    let index = toInt(building?.index, -1);
    byIndex[index] = building;

    let outputObjIdx = toInt(building?.outputObjIdx, -1);
    if (outputObjIdx >= 0) {
      if (!Array.isArray(inboundByTarget[outputObjIdx])) {
        inboundByTarget[outputObjIdx] = [];
      }
      inboundByTarget[outputObjIdx].push(building);
    }
  }

  for (let i = 0; i < buildings.length; i++) {
    let building = buildings[i];
    let itemId = toInt(building?.itemId, 0);
    if (!BELT_ITEM_IDS[1] || !Object.values(BELT_ITEM_IDS).includes(itemId)) {
      continue;
    }

    let outputObjIdx = toInt(building?.outputObjIdx, -1);
    if (outputObjIdx < 0) {
      continue;
    }

    let target = byIndex[outputObjIdx];
    if (!target) {
      continue;
    }

    let from = BlueprintUtils.getBuildPos(building);
    let to = BlueprintUtils.getBuildPos(target);
    let yaw = calcYaw(toNumber(from?.x, 0), toNumber(from?.y, 0), toNumber(to?.x, 0), toNumber(to?.y, 0));
    building.yaw = [yaw, yaw];
  }

  for (let i = 0; i < buildings.length; i++) {
    let building = buildings[i];
    let itemId = toInt(building?.itemId, 0);
    if (!BELT_ITEM_IDS[1] || !Object.values(BELT_ITEM_IDS).includes(itemId)) {
      continue;
    }

    let outputObjIdx = toInt(building?.outputObjIdx, -1);
    if (outputObjIdx >= 0) {
      continue;
    }

    let inbound = inboundByTarget[toInt(building?.index, -1)] || [];
    if (inbound.length === 0) {
      continue;
    }

    let sourceYaw = toInt(inbound[0]?.yaw?.[0], toInt(building?.yaw?.[0], 0));
    building.yaw = [sourceYaw, sourceYaw];
  }
}

function buildSingleRowBlueprint(rowInfo, config, options = {}) {
  let { blocks, stationFallbackCount, backflowRowCount } = createBlocksForRow(rowInfo, config);
  if (blocks.length > 1) {
    mergeMainlineBlocksByColumn(blocks, config, { blockGap: 0 });
  }

  let buildings = [];
  for (let i = 0; i < blocks.length; i++) {
    buildings = buildings.concat(blocks[i]);
  }

  let data = buildBlueprintDataFromBuildings(buildings, options.shortDesc || '单行蓝图');
  return {
    code: PARSER.toStr(data),
    data,
    buildings,
    stationFallbackCount,
    backflowRowCount,
  };
}

function buildMainLineBlueprint(rows, config, options = {}) {
  let validRows = Array.isArray(rows) ? rows : [];
  let needsById = options && typeof options.needsById === 'object' && options.needsById
    ? options.needsById
    : {};
  let rawOreById = options && typeof options.rawOreById === 'object' && options.rawOreById
    ? options.rawOreById
    : {};
  let modeType = toInt(config?.modeType, 2);
  let blocks = [];
  let stationFallbackCount = 0;
  let backflowRowCount = 0;
  let mode2LimiterRowCount = 0;
  let mode2RawOreRowCount = 0;
  let mode2SegmentMetas = [];
  let mode2ItemSchedule = [];

  for (let i = 0; i < validRows.length; i++) {
    let row = validRows[i];
    let mainItemId = toInt(row?.mainItemId, 0);
    let isNeedItem = mainItemId > 0 && toNumber(needsById[mainItemId], 0) > 0;
    let rowBlockResult = createBlocksForRow(row, config, {
      enableBackflow: modeType === 2 ? false : !isNeedItem,
    });
    blocks.push(...rowBlockResult.blocks);
    stationFallbackCount += rowBlockResult.stationFallbackCount;
    backflowRowCount += rowBlockResult.backflowRowCount;
    if (Array.isArray(rowBlockResult.mode2SegmentMetas) && rowBlockResult.mode2SegmentMetas.length > 0) {
      mode2SegmentMetas.push(...rowBlockResult.mode2SegmentMetas);
    }
  }

  mergeMainlineBlocks(blocks, config, options);

  if (modeType === 2) {
    mode2ItemSchedule = buildMode2ItemSchedule(validRows, needsById, rawOreById, toInt(config?.beltLv, 1));
  }

  let buildings = [];
  for (let i = 0; i < blocks.length; i++) {
    buildings = buildings.concat(blocks[i]);
  }

  if (modeType === 2 && mode2SegmentMetas.length > 0 && buildings.length > 0 && toInt(config?.useMode2MainBus, 0) > 0) {
    let busResult = buildMode2MainBus(
      mode2SegmentMetas,
      buildings,
      config,
      needsById,
      rawOreById,
      mode2ItemSchedule,
    );
    mode2LimiterRowCount = toInt(busResult.limiterRowCount, 0);
    mode2RawOreRowCount = toInt(busResult.rawOreRowCount, 0);
    if (Array.isArray(busResult.buildings) && busResult.buildings.length > 0) {
      buildings = buildings.concat(busResult.buildings);
      finalizeBlockIndices(buildings);
    }
  }

  if (toInt(config?.enablePowerTower, 1) > 0 && (modeType === 1 || modeType === 2 || modeType === 3) && buildings.length > 0) {
    let powerTowers = createPowerTowerGrid(buildings);
    if (powerTowers.length > 0) {
      let preTowerCount = Math.min(2, powerTowers.length);
      let preTowers = powerTowers.slice(0, preTowerCount);
      let tailTowers = powerTowers.slice(preTowerCount);

      let insertAt = buildings.length;
      for (let i = 0; i < buildings.length; i++) {
        let building = buildings[i];
        if (toInt(building?.itemId, 0) !== 2001) {
          continue;
        }
        if (toNumber(building?.localOffset?.[0]?.y, 0) >= 5) {
          insertAt = i;
          break;
        }
      }

      if (preTowers.length > 0 && insertAt < buildings.length) {
        let insertIndexThreshold = toInt(buildings[insertAt]?.index, buildings.length);

        for (let i = 0; i < buildings.length; i++) {
          let building = buildings[i];
          if (toInt(building.index, -1) >= insertIndexThreshold) {
            building.index = toInt(building.index, -1) + preTowerCount;
          }
          if (toInt(building.outputObjIdx, -1) >= insertIndexThreshold) {
            building.outputObjIdx = toInt(building.outputObjIdx, -1) + preTowerCount;
          }
          if (toInt(building.inputObjIdx, -1) >= insertIndexThreshold) {
            building.inputObjIdx = toInt(building.inputObjIdx, -1) + preTowerCount;
          }
        }

        for (let i = 0; i < preTowers.length; i++) {
          preTowers[i].index = insertIndexThreshold + i;
        }

        let tailBase = buildings.length + preTowers.length;
        for (let i = 0; i < tailTowers.length; i++) {
          tailTowers[i].index = tailBase + i;
        }

        let head = buildings.slice(0, insertAt);
        let tail = buildings.slice(insertAt);
        buildings = head.concat(preTowers, tail, tailTowers);
      } else {
        let baseIndex = buildings.length;
        for (let i = 0; i < powerTowers.length; i++) {
          powerTowers[i].index = baseIndex + i;
        }
        buildings = buildings.concat(powerTowers);
      }
    }
  }

  normalizeBeltYawByOutput(buildings);

  let data = buildBlueprintDataFromBuildings(buildings, options.shortDesc || '主线蓝图');
  return {
    code: PARSER.toStr(data),
    data,
    buildings,
    stationFallbackCount,
    backflowRowCount,
    mode2LimiterRowCount,
    mode2RawOreRowCount,
  };
}

async function copyBlueprintCodeToClipboard(code) {
  if (!code) {
    return false;
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch {
      // Fall through to execCommand.
    }
  }

  if (typeof document === 'undefined') {
    return false;
  }

  let textarea = document.createElement('textarea');
  textarea.value = code;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

export { buildSingleRowBlueprint, buildMainLineBlueprint, copyBlueprintCodeToClipboard };
