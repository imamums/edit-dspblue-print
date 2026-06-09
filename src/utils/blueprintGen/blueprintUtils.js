class BlueprintUtils {
  constructor() {}

  static createEmptyBlueprintData() {
    return {
      version: 2,
      header: {
        layout: 10,
        icons: [0, 0, 0, 0, 0],
        time: new Date(),
        gameVersion: `0.10.34.28529`,
        shortDesc: ``,
        author: ``,
        customVersion: ``,
        externalFields: ``,
        desc: ``,
      },
      cursorOffset: { x: 0, y: 0 },
      cursorTargetArea: 0,
      dragBoxSize: { x: 1, y: 1 },
      primaryAreaIdx: 0,
      patch: 1,
      areas: [
        {
          index: 0,
          parentIndex: -1,
          tropicAnchor: 0,
          areaSegments: 200,
          anchorLocalOffset: { x: 0, y: 0 },
          size: { x: 10, y: 10 },
        },
      ],
      buildings: [],
    };
  }

  static CreateEmptyBuilding() {
    return {
      index: 0,
      itemId: 0,
      modelIndex: 0,
      areaIndex: 0,
      localOffset: [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
      ],
      yaw: [90, 90],
      tilt: 0,
      pitch: 0,
      tilt2: 0,
      pitch2: 0,
      outputObjIdx: -1,
      inputObjIdx: -1,
      outputToSlot: 0,
      inputFromSlot: 0,
      outputFromSlot: 0,
      inputToSlot: 1,
      outputOffset: 0,
      inputOffset: 0,
      recipeId: 0,
      filterId: 0,
      parameters: null,
    };
  }

  static getBlueprintSize(buildings) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let b of buildings) {
      for (let offset of b.localOffset) {
        if (b.itemId == 2103 || b.itemId == 2104) {
          minX = Math.min(minX, offset.x - 3);
          minY = Math.min(minY, offset.y - 3);
          maxX = Math.max(maxX, offset.x + 3);
          maxY = Math.max(maxY, offset.y + 3);
        } else if (b.itemId == 2101) {
          minX = Math.min(minX, offset.x - 2);
          minY = Math.min(minY, offset.y - 2);
          maxX = Math.max(maxX, offset.x + 2);
          maxY = Math.max(maxY, offset.y + 2);
        } else {
          minX = Math.min(minX, offset.x);
          minY = Math.min(minY, offset.y);
          maxX = Math.max(maxX, offset.x);
          maxY = Math.max(maxY, offset.y);
        }
      }
    }
    return {
      min: { x: minX, y: minY },
      max: { x: maxX, y: maxY },
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  static mergeBlueprint(buildingLists) {
    let offset = 0;
    for (let i = 0; i < buildingLists.length; i++) {
      let list = buildingLists[i];
      if (i > 0) {
        BlueprintUtils.IndexOffset(list, offset);
      }
      offset += list.length;
    }
  }

  static mergeBlock(buildingLists, gap = 0) {
    let yOffset = 0;
    let indexOffset = 0;
    for (let i = 0; i < buildingLists.length; i++) {
      let list = buildingLists[i];
      let size = BlueprintUtils.getBlueprintSize(list);
      BlueprintUtils.buildPosOffSet(list, 0, yOffset + -size.min.y, 0);
      if (i > 0) {
        BlueprintUtils.IndexOffset(list, indexOffset);
      }
      indexOffset += list.length;
      yOffset += size.max.y - size.min.y + 1 + gap;
    }
  }

  static rotateBlueprint(buildings, angleDeg) {
    if (buildings.length === 0) return;
    let rad = (angleDeg * Math.PI) / 180;
    let cos = Math.cos(rad);
    let sin = Math.sin(rad);
    for (let b of buildings) {
      let p0 = b.localOffset[0];
      let p1 = b.localOffset[1];
      p0.x = p0.x * cos - p0.y * sin;
      p0.y = p0.x * sin + p0.y * cos;
      p1.x = p1.x * cos - p1.y * sin;
      p1.y = p1.x * sin + p1.y * cos;
      b.yaw[0] = (b.yaw[0] + angleDeg) % 360;
      b.yaw[1] = (b.yaw[1] + angleDeg) % 360;
      if (b.yaw[0] < 0) b.yaw[0] += 360;
      if (b.yaw[1] < 0) b.yaw[1] += 360;
    }
  }

  static IndexOffset(buildings, offset) {
    for (let i = 0; i < buildings.length; i++) {
      buildings[i].index += offset;
      if (buildings[i].inputObjIdx != -1) {
        buildings[i].inputObjIdx += offset;
      }
      if (buildings[i].outputObjIdx != -1) {
        buildings[i].outputObjIdx += offset;
      }
    }
  }

  static buildPosOffSet(buildings, dx, dy, dz = 0) {
    for (let i = 0; i < buildings.length; i++) {
      for (let j = 0; j < buildings[i].localOffset.length; j++) {
        buildings[i].localOffset[j].x += dx;
        buildings[i].localOffset[j].y += dy;
        buildings[i].localOffset[j].z += dz;
      }
    }
  }

  static setBuildPos(building, x, y, z) {
    building.localOffset[0].x = x;
    building.localOffset[0].y = y;
    building.localOffset[0].z = z;
    building.localOffset[1].x = x;
    building.localOffset[1].y = y;
    building.localOffset[1].z = z;
  }

  static getBuildPos(building) {
    return {
      x: building.localOffset[0].x,
      y: building.localOffset[0].y,
      z: building.localOffset[0].z,
    };
  }

  static setYaw(building, yaw) {
    let normalized = ((yaw % 360) + 360) % 360;
    building.yaw[0] = normalized;
    building.yaw[1] = normalized;
  }

  static simpleClone(obj) {
    if (typeof obj != `object` || !obj) return obj;
    if (obj instanceof Array) return obj.map((e) => BlueprintUtils.simpleClone(e));
    let clone = {};
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = BlueprintUtils.simpleClone(obj[key]);
      }
    }
    return clone;
  }

  static cloneBlueprint(data) {
    return BlueprintUtils.simpleClone(data);
  }

  static zeroPos(buildings) {
    let size = BlueprintUtils.getBlueprintSize(buildings);
    BlueprintUtils.buildPosOffSet(buildings, size.min.x * -1, size.min.y * -1);
  }

  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`复制成功`);
    } catch (e) {
      console.error(`复制失败`, e);
    }
  }

  static calcYaw(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    let angle = (Math.atan2(dx, dy) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    return Math.round(angle / 45) * 45;
  }
}

export { BlueprintUtils };