export function applyProductionSpeedModifier(outputRate, buildingName, itemName, settings) {
  if (buildingName === '采矿机') {
    outputRate *= settings.mining_speed_multiple * settings.covered_veins_small;
  } else if (buildingName === '大型采矿机') {
    outputRate *= settings.mining_speed_multiple * settings.covered_veins_large * settings.mining_efficiency_large;
  } else if (buildingName === '原油萃取站') {
    outputRate *= settings.mining_speed_multiple * settings.mining_speed_oil;
  } else if (buildingName === '抽水站' || buildingName === '聚束液体汲取设施') {
    outputRate *= settings.mining_speed_multiple;
  } else if (buildingName === '轨道采集器') {
    outputRate *= settings.mining_speed_multiple;
    if (itemName === '氢') {
      outputRate *= settings.mining_speed_hydrogen;
    } else if (itemName === '重氢') {
      outputRate *= settings.mining_speed_deuterium;
    } else if (itemName === '可燃冰') {
      outputRate *= settings.mining_speed_gas_hydrate;
    } else if (itemName === '氦') {
      outputRate *= settings.mining_speed_helium;
    } else if (itemName === '氨') {
      outputRate *= settings.mining_speed_ammonia;
    }
  } else if (buildingName === '大气采集站') {
    outputRate *= settings.mining_speed_multiple;
    if (itemName === '氮') {
      outputRate *= settings.mining_speed_nitrogen;
    } else if (itemName === '氧') {
      outputRate *= settings.mining_speed_oxygen;
    } else if (itemName === '二氧化硫') {
      outputRate *= settings.mining_speed_carbon_dioxide;
    } else if (itemName === '二氧化碳') {
      outputRate *= settings.mining_speed_sulfur_dioxide;
    }
  } else if (buildingName === '行星基地') {
    outputRate *= settings.enemy_drop_multiple;
  } else if (buildingName.endsWith('分馏塔')) {
    outputRate *= settings.fractionating_speed;
  } else if (buildingName === '伊卡洛斯') {
    outputRate *= settings.icarus_manufacturing_speed;
  }
  return outputRate;
}