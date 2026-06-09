import { applyProductionSpeedModifier } from './productionSpeedModifier.js';

const PRIVATE_METHODS = new WeakSet();

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function declareField(instance, fieldName, defaultValue) {
  instance[fieldName] = defaultValue;
}

export class Calculator {
  constructor(gameDataProvider, schemeData, settings) {
    PRIVATE_METHODS.add(this);
    declareField(this, 'gameData', undefined);
    declareField(this, 'itemData', undefined);
    declareField(this, 'schemeData', undefined);
    declareField(this, 'settings', undefined);
    declareField(this, 'proliferatorPrice', undefined);
    declareField(this, 'itemGraph', undefined);
    declareField(this, 'multiSources', undefined);
    declareField(this, 'itemList', undefined);
    declareField(this, 'keyItemList', undefined);

    this.gameData = gameDataProvider.gameData;
    this.itemData = gameDataProvider.itemData;
    this.schemeData = deepClone(schemeData);
    this.settings = settings;

    for (let i = 0; i < settings.natural_production_line.length; i++) {
      if (!settings.natural_production_line[i]) {
        settings.natural_production_line[i] = [];
        break;
      }
    }

    let maxProliferatorPoints =
      this.gameData.proliferator_data[this.gameData.proliferator_data.length - 1].增产点数;

    for (let i = 0; i < this.schemeData.scheme_for_recipe.length; i++) {
      if (
        this.gameData.recipe_data[i].增产 == 8 &&
        this.schemeData.scheme_for_recipe[i].增产模式 == 0
      ) {
        this.schemeData.scheme_for_recipe[i].增产模式 = 4;
      }
      if (
        this.schemeData.scheme_for_recipe[i].增产模式 > 0 &&
        this.schemeData.scheme_for_recipe[i].增产点数 == 0
      ) {
        this.schemeData.scheme_for_recipe[i].增产点数 = maxProliferatorPoints;
      }
    }

    this.buildProliferatorPrice(settings.proliferate_itself);
    this.buildItemGraph();
    this.buildItemList();
  }

  calculate(needsList) {
    let gameData = this.gameData;
    let naturalProductionLine = this.settings.natural_production_line;
    let itemData = this.itemData;
    let proliferatorPrice = this.proliferatorPrice;
    let multiSources = this.multiSources;
    let keyItemList = this.keyItemList;
    let supplyMap = {};
    let demandMap = {};
    let naturalDeficit = {};
    let lpConstraintValues = {};
    let itemFlow = {};

    for (let item in needsList) {
      itemFlow[item] = needsList[item];
    }

    for (let lineIndex in naturalProductionLine) {
      let nplEntry = naturalProductionLine[lineIndex];
      let recipe = gameData.recipe_data[itemData[nplEntry.目标物品][nplEntry.配方id]];
      let productionRate =
        (nplEntry.建筑数量 * 60 * gameData.factory_data[recipe.设施][nplEntry.建筑].倍率) / recipe.时间;

      if (nplEntry.增产点数 == 0 || nplEntry.增产模式 == 0) {
        for (let material in recipe.原料) {
          if (material in itemFlow) {
            itemFlow[material] = Number(itemFlow[material]) + recipe.原料[material] * productionRate;
          } else {
            itemFlow[material] = recipe.原料[material] * productionRate;
          }
        }
        for (let product in recipe.产物) {
          if (product in itemFlow) {
            itemFlow[product] = Number(itemFlow[product]) - recipe.产物[product] * productionRate;
          } else {
            itemFlow[product] = recipe.产物[product] * -1 * productionRate;
          }
        }
      } else {
        let totalMaterialCount = 0;
        for (let material in recipe.原料) {
          totalMaterialCount += recipe.原料[material];
        }
        totalMaterialCount = Number(totalMaterialCount) * productionRate;

        if (nplEntry.增产模式 == 1) {
          let accelerationEffect = gameData.proliferator_effect[nplEntry.增产点数].加速效果;
          for (let material in recipe.原料) {
            if (material in itemFlow) {
              itemFlow[material] = Number(itemFlow[material]) + recipe.原料[material] * productionRate * accelerationEffect;
            } else {
              itemFlow[material] = recipe.原料[material] * productionRate * accelerationEffect;
            }
          }
          for (let prolifItem in proliferatorPrice[nplEntry.增产点数]) {
            if (prolifItem in itemFlow) {
              itemFlow[prolifItem] = Number(itemFlow[prolifItem]) + proliferatorPrice[nplEntry.增产点数][prolifItem] * totalMaterialCount * accelerationEffect;
            } else {
              itemFlow[prolifItem] = proliferatorPrice[nplEntry.增产点数][prolifItem] * totalMaterialCount * accelerationEffect;
            }
          }
          for (let product in recipe.产物) {
            if (product in itemFlow) {
              itemFlow[product] = Number(itemFlow[product]) - recipe.产物[product] * productionRate * accelerationEffect;
            } else {
              itemFlow[product] = recipe.产物[product] * -1 * productionRate * accelerationEffect;
            }
          }
        } else if (nplEntry.增产模式 == 2) {
          let increaseEffect = gameData.proliferator_effect[nplEntry.增产点数].增产效果;
          for (let material in recipe.原料) {
            if (material in itemFlow) {
              itemFlow[material] = Number(itemFlow[material]) + recipe.原料[material] * productionRate;
            } else {
              itemFlow[material] = recipe.原料[material] * productionRate;
            }
          }
          for (let prolifItem in proliferatorPrice[nplEntry.增产点数]) {
            if (prolifItem in itemFlow) {
              itemFlow[prolifItem] = Number(itemFlow[prolifItem]) + proliferatorPrice[nplEntry.增产点数][prolifItem] * totalMaterialCount;
            } else {
              itemFlow[prolifItem] = proliferatorPrice[nplEntry.增产点数][prolifItem] * totalMaterialCount;
            }
          }
          for (let product in recipe.产物) {
            if (product in itemFlow) {
              itemFlow[product] = Number(itemFlow[product]) - recipe.产物[product] * productionRate * increaseEffect;
            } else {
              itemFlow[product] = recipe.产物[product] * -1 * productionRate * increaseEffect;
            }
          }
        } else if (nplEntry.增产模式 == 3) {
          let accelerationEffect = gameData.proliferator_effect[nplEntry.增产点数].加速效果;
          for (let material in recipe.原料) {
            if (material in itemFlow) {
              itemFlow[material] = Number(itemFlow[material]) + recipe.原料[material] * productionRate;
            } else {
              itemFlow[material] = recipe.原料[material] * productionRate;
            }
          }
          for (let prolifItem in proliferatorPrice[nplEntry.增产点数]) {
            if (prolifItem in itemFlow) {
              itemFlow[prolifItem] = Number(itemFlow[prolifItem]) + proliferatorPrice[nplEntry.增产点数][prolifItem] * totalMaterialCount;
            } else {
              itemFlow[prolifItem] = proliferatorPrice[nplEntry.增产点数][prolifItem] * totalMaterialCount;
            }
          }
          for (let product in recipe.产物) {
            if (product in itemFlow) {
              itemFlow[product] = Number(itemFlow[product]) - recipe.产物[product] * productionRate * accelerationEffect;
            } else {
              itemFlow[product] = recipe.产物[product] * -1 * productionRate * accelerationEffect;
            }
          }
        }
      }
    }

    for (let item in itemFlow) {
      if (itemFlow[item] < 0) {
        naturalDeficit[item] = itemFlow[item];
      }
    }

    let costGraph = this.buildCostGraph();

    for (let item in itemFlow) {
      if (itemFlow[item] > 0) {
        if (item in supplyMap) {
          supplyMap[item] = Number(supplyMap[item]) + itemFlow[item];
        } else {
          supplyMap[item] = itemFlow[item];
        }
        for (let material in costGraph[item].原料) {
          if (material in supplyMap) {
            supplyMap[material] = Number(supplyMap[material]) + costGraph[item].原料[material] * itemFlow[item];
          } else {
            supplyMap[material] = costGraph[item].原料[material] * itemFlow[item];
          }
        }
      }
    }

    for (let item in multiSources) {
      if (item in supplyMap) {
        lpConstraintValues[item] = supplyMap[item];
      } else {
        lpConstraintValues[item] = 0;
      }
    }

    for (let item in naturalDeficit) {
      if (item in multiSources) {
        lpConstraintValues[item] = Number(lpConstraintValues[item]) + itemFlow[item];
      } else if (item in supplyMap) {
        if (supplyMap[item] + itemFlow[item] > 0) {
          for (let material in costGraph[item].原料) {
            supplyMap[material] = Number(supplyMap[material]) + costGraph[item].原料[material] * itemFlow[item];
          }
          supplyMap[item] = Number(supplyMap[item]) + itemFlow[item];
        } else {
          for (let material in costGraph[item].原料) {
            supplyMap[material] = Number(supplyMap[material]) - costGraph[item].原料[material] * supplyMap[item];
          }
          lpConstraintValues[item] = supplyMap[item] + itemFlow[item];
          supplyMap[item] = 0;
        }
      } else {
        lpConstraintValues[item] = itemFlow[item];
      }
    }

    for (let i = 0; i < keyItemList.length; i++) {
      if (!(keyItemList[i] in multiSources) && !(keyItemList[i] in naturalDeficit)) {
        if ([keyItemList[i]] in supplyMap) {
          lpConstraintValues[keyItemList[i]] = supplyMap[keyItemList[i]];
        } else {
          lpConstraintValues[keyItemList[i]] = 0;
        }
      }
    }

    this.solveLP(lpConstraintValues, supplyMap, demandMap, costGraph);
    return [supplyMap, demandMap];
  }

  buildProliferatorPrice(proliferateItself) {
    let gameData = this.gameData;
    let priceTable = [];
    priceTable.push({});
    for (let i = 1; i < gameData.proliferator_effect.length; i++) {
      priceTable.push(-1);
    }

    for (let prolifIndex in gameData.proliferator_data) {
      if (gameData.proliferator_data[prolifIndex].增产点数 != 0) {
        priceTable[gameData.proliferator_data[prolifIndex].增产点数] = {};
        if (proliferateItself) {
          priceTable[gameData.proliferator_data[prolifIndex].增产点数][gameData.proliferator_data[prolifIndex].增产剂] =
            1 /
            Math.floor(
              gameData.proliferator_data[prolifIndex].喷涂次数 *
                gameData.proliferator_effect[gameData.proliferator_data[prolifIndex].增产点数].增产效果 -
                1 +
                0.000001,
            );
        } else {
          priceTable[gameData.proliferator_data[prolifIndex].增产点数][gameData.proliferator_data[prolifIndex].增产剂] =
            1 / gameData.proliferator_data[prolifIndex].喷涂次数;
        }
      }
    }

    this.proliferatorPrice = priceTable;
  }

  buildItemGraph() {
    let gameData = this.gameData;
    let itemData = this.itemData;
    let schemeData = this.schemeData;
    let settings = this.settings;
    let proliferatorPrice = this.proliferatorPrice;
    let multiSourcesMap = {};
    let itemGraph = {};

    for (let item in itemData) {
      itemGraph[item] = {
        原料: {},
        可生产: {},
        产出倍率: 0,
        副产物: {},
      };
    }

    for (let item in itemData) {
      if (item in settings.mineralize_list) {
        itemGraph[item].产出倍率 = 100000000 ** (settings.fixed_num + 1);
        continue;
      }

      let recipeIndex = itemData[item][schemeData.item_recipe_choices[item]];
      let recipe = gameData.recipe_data[recipeIndex];

      if (
        gameData.TheyComeFromVoidEnable &&
        settings.blue_buff &&
        Object.keys(recipe.原料).length >= 2
      ) {
        recipe.产物[Object.keys(recipe.原料)[0]] = Object.values(recipe.产物)[0];
      }

      itemGraph[item].产出倍率 = gameData.recipe_data[recipeIndex].产物[item] * 1;

      let outputMultiplier = 1;
      let totalMaterialRatio = 0;
      let totalMaterialRatioForProlif = 0;
      let prolifMode = schemeData.scheme_for_recipe[recipeIndex].增产模式;
      let prolifPoints = schemeData.scheme_for_recipe[recipeIndex].增产点数;

      for (let material in gameData.recipe_data[recipeIndex].原料) {
        totalMaterialRatio = gameData.recipe_data[recipeIndex].原料[material] / gameData.recipe_data[recipeIndex].产物[item];
        itemGraph[item].原料[material] = totalMaterialRatio;
        totalMaterialRatioForProlif += totalMaterialRatio;
      }

      if (prolifMode && prolifPoints) {
        if (prolifMode == 1) {
          for (let prolifItem in proliferatorPrice[prolifPoints]) {
            if (prolifItem in itemGraph[item].原料) {
              itemGraph[item].原料[prolifItem] += totalMaterialRatioForProlif * proliferatorPrice[prolifPoints][prolifItem];
            } else {
              itemGraph[item].原料[prolifItem] = totalMaterialRatioForProlif * proliferatorPrice[prolifPoints][prolifItem];
            }
          }
          itemGraph[item].产出倍率 *= gameData.proliferator_effect[prolifPoints].加速效果 * this.settings.acc_rate;
        } else if (prolifMode == 2) {
          for (let prolifItem in proliferatorPrice[prolifPoints]) {
            if (prolifItem in itemGraph[item].原料) {
              itemGraph[item].原料[prolifItem] += totalMaterialRatioForProlif * proliferatorPrice[prolifPoints][prolifItem];
            } else {
              itemGraph[item].原料[prolifItem] = totalMaterialRatioForProlif * proliferatorPrice[prolifPoints][prolifItem];
            }
          }
          outputMultiplier *= gameData.proliferator_effect[prolifPoints].增产效果 * this.settings.inc_rate;
          itemGraph[item].产出倍率 *= outputMultiplier;
        } else if (prolifMode == 3) {
          for (let prolifItem in proliferatorPrice[prolifPoints]) {
            if (prolifItem in itemGraph[item].原料) {
              itemGraph[item].原料[prolifItem] += totalMaterialRatioForProlif * proliferatorPrice[prolifPoints][prolifItem];
            } else {
              itemGraph[item].原料[prolifItem] = totalMaterialRatioForProlif * proliferatorPrice[prolifPoints][prolifItem];
            }
          }
          outputMultiplier *= gameData.proliferator_effect[prolifPoints].加速效果 * this.settings.acc_rate;
          itemGraph[item].产出倍率 *= outputMultiplier;
        } else if (prolifMode == 4) {
          for (let prolifItem in proliferatorPrice[prolifPoints]) {
            if (prolifItem in itemGraph[item].原料) {
              itemGraph[item].原料[prolifItem] += totalMaterialRatioForProlif * proliferatorPrice[prolifPoints][prolifItem];
            } else {
              itemGraph[item].原料[prolifItem] = totalMaterialRatioForProlif * proliferatorPrice[prolifPoints][prolifItem];
            }
          }
          itemGraph[item].产出倍率 *= prolifPoints / 10;
        }
      }

      for (let material in itemGraph[item].原料) {
        itemGraph[item].原料[material] /= outputMultiplier;
      }

      itemGraph[item].产出倍率 /= gameData.recipe_data[recipeIndex].时间;

      if (item in itemGraph[item].原料) {
        let selfConsumptionFactor = 1 / (1 - itemGraph[item].原料[item]);
        itemGraph[item].产出倍率 /= selfConsumptionFactor;
        itemGraph[item].自消耗 = selfConsumptionFactor - 1;
        delete itemGraph[item].原料[item];
        for (let material in itemGraph[item].原料) {
          itemGraph[item].原料[material] *= selfConsumptionFactor;
        }
      }

      for (let material in itemGraph[item].原料) {
        itemGraph[material].可生产[item] = 1 / itemGraph[item].原料[material];
      }

      if (Object.keys(gameData.recipe_data[recipeIndex].产物).length > 1) {
        let selfConsumption = 0;
        if ('自消耗' in itemGraph[item]) {
          selfConsumption = itemGraph[item].自消耗;
        }
        for (let byproduct in gameData.recipe_data[recipeIndex].产物) {
          if (byproduct != item) {
            if (byproduct in itemGraph[item].原料) {
              if (
                Math.min(
                  gameData.recipe_data[recipeIndex].产物[byproduct] / (gameData.recipe_data[recipeIndex].产物[item] - selfConsumption),
                  itemGraph[item].原料[byproduct],
                ) == itemGraph[item].原料[byproduct]
              ) {
                itemGraph[item].副产物[byproduct] =
                  gameData.recipe_data[recipeIndex].产物[byproduct] / (gameData.recipe_data[recipeIndex].产物[item] - selfConsumption) -
                  itemGraph[item].原料[byproduct];
                itemGraph[item].原料[byproduct] = 0;
                if (byproduct in multiSourcesMap) {
                  multiSourcesMap[byproduct].push(item);
                } else {
                  multiSourcesMap[byproduct] = [item];
                }
              } else {
                itemGraph[item].原料[byproduct] -=
                  gameData.recipe_data[recipeIndex].产物[byproduct] / (gameData.recipe_data[recipeIndex].产物[item] - selfConsumption);
              }
            } else {
              itemGraph[item].副产物[byproduct] =
                gameData.recipe_data[recipeIndex].产物[byproduct] / (gameData.recipe_data[recipeIndex].产物[item] - selfConsumption);
              if (byproduct in multiSourcesMap) {
                multiSourcesMap[byproduct].push(item);
              } else {
                multiSourcesMap[byproduct] = [item];
              }
            }
          }
        }
      }

      let factoryType = gameData.recipe_data[recipeIndex].设施;
      let factoryName = gameData.factory_data[factoryType][schemeData.scheme_for_recipe[recipeIndex].建筑].名称;
      itemGraph[item].产出倍率 = applyProductionSpeedModifier(itemGraph[item].产出倍率, factoryName, item, settings);
    }

    this.itemGraph = itemGraph;
    this.multiSources = multiSourcesMap;
  }

  getItemCost(item) {
    let gameData = this.gameData;
    let schemeData = this.schemeData;
    let itemData = this.itemData;
    let itemGraph = this.itemGraph;
    let settings = this.settings;
    let stackResearchLab = settings.stack_research_lab;
    let cost = 0;

    if (
      schemeData.cost_weight.物品额外成本[item].启用 &&
      ((cost = Number(cost) + schemeData.cost_weight.物品额外成本[item].额外成本),
      !schemeData.cost_weight.物品额外成本[item].与其它成本累计)
    ) {
      return cost;
    }

    var recipeIndex = itemData[item][schemeData.item_recipe_choices[item]];
    var factoryData = gameData.factory_data[gameData.recipe_data[recipeIndex].设施][schemeData.scheme_for_recipe[recipeIndex].建筑];
    var productionTimePerUnit = 1 / itemGraph[item].产出倍率 / factoryData.倍率;
    var stackFactor = factoryData.名称.endsWith('研究站') ? stackResearchLab : 1;

    cost = Number(cost) + (productionTimePerUnit * schemeData.cost_weight.占地 * factoryData.占地) / stackFactor;
    cost =
      Number(cost) +
      productionTimePerUnit *
        schemeData.cost_weight.电力 *
        factoryData.耗能 *
        gameData.proliferator_effect[schemeData.scheme_for_recipe[recipeIndex].增产点数].耗电倍率;
    cost =
      Number(cost) +
      productionTimePerUnit *
        ((schemeData.cost_weight.建筑成本.分拣器 * 0) / stackFactor +
          schemeData.cost_weight.建筑成本[factoryData.名称]);
    return cost;
  }

  buildItemList() {
    var itemGraphCopy = JSON.parse(JSON.stringify(this.itemGraph));
    let itemData = this.itemData;
    var sortedItemList = [];
    var keyItemList = [];
    var indexRange = [0, Object.keys(itemGraphCopy).length - 1];

    function removeItemFromGraph(itemName) {
      for (let material in itemGraphCopy[itemName].原料) {
        delete itemGraphCopy[material].可生产[itemName];
      }
      for (let product in itemGraphCopy[itemName].可生产) {
        delete itemGraphCopy[product].原料[itemName];
      }
      delete itemGraphCopy[itemName];
    }

    function processNode(itemName, direction, indices) {
      if (!direction) {
        if (itemGraphCopy[itemName] && Object.keys(itemGraphCopy[itemName].原料).length == 0) {
          var products = itemGraphCopy[itemName].可生产;
          removeItemFromGraph(itemName);
          sortedItemList[indices[0]] = itemName;
          itemData[itemName][0] = indices[0];
          indices[0] += 1;
          for (let product in products) {
            indices = processNode(product, 0, indices);
          }
        }
      } else if (itemGraphCopy[itemName] && Object.keys(itemGraphCopy[itemName].可生产).length == 0) {
        var materials = itemGraphCopy[itemName].原料;
        removeItemFromGraph(itemName);
        sortedItemList[indices[1]] = itemName;
        itemData[itemName][0] = indices[1];
        --indices[1];
        for (let material in materials) {
          indices = processNode(material, 1, indices);
        }
      }
      return indices;
    }

    for (;;) {
      for (let item in itemGraphCopy) {
        if (item in itemGraphCopy) {
          if (Object.keys(itemGraphCopy[item].原料).length == 0) {
            indexRange = processNode(item, 0, indexRange);
          } else if (Object.keys(itemGraphCopy[item].可生产).length == 0) {
            indexRange = processNode(item, 1, indexRange);
          }
        }
      }
      if (Object.keys(itemGraphCopy).length <= 0) {
        break;
      }
      let maxNode = {
        name: -1,
        count: 1,
      };
      for (let item in itemGraphCopy) {
        let connectionCount = Object.keys(itemGraphCopy[item].原料).length + Object.keys(itemGraphCopy[item].可生产).length;
        if (connectionCount > maxNode.count) {
          maxNode.name = item;
          maxNode.count = connectionCount;
        }
      }
      keyItemList.push(maxNode.name);
      sortedItemList[indexRange[0]] = maxNode.name;
      itemData[maxNode.name][0] = indexRange[0];
      indexRange[0]++;
      removeItemFromGraph(maxNode.name);
    }

    this.itemList = sortedItemList;
    this.keyItemList = keyItemList;
  }

  buildCostGraph() {
    let itemGraph = this.itemGraph;
    let itemList = this.itemList;
    let keyItemList = this.keyItemList;
    let multiSources = this.multiSources;
    let mineralizeList = this.settings.mineralize_list;
    let keyItemIndex = 0;
    let mineralizeIndex = 0;
    let costGraph = {};

    function addMaterialCost(costEntry, itemName, quantity) {
      if (itemName in costEntry) {
        costEntry[itemName] = Number(costEntry[itemName]) + quantity;
      } else {
        costEntry[itemName] = quantity;
      }
      for (var material in costGraph[itemName].原料) {
        if (material in costEntry) {
          costEntry[material] = Number(costEntry[material]) + costGraph[itemName].原料[material] * quantity;
        } else {
          costEntry[material] = costGraph[itemName].原料[material] * quantity;
        }
      }
      return costEntry;
    }

    for (let item in keyItemList) {
      costGraph[keyItemList[item]] = {
        原料: {},
        成本: 0,
        累计成本: 0,
      };
    }
    for (let item in mineralizeList) {
      costGraph[item] = {
        原料: {},
        成本: 0,
        累计成本: 0,
      };
    }
    for (let item in multiSources) {
      costGraph[item] = {
        原料: {},
        成本: 0,
        累计成本: 0,
      };
    }

    for (let i = 0; i < itemList.length; i++) {
      if (keyItemIndex < keyItemList.length && itemList[i] == keyItemList[keyItemIndex]) {
        ++keyItemIndex;
        continue;
      } else if (mineralizeIndex < mineralizeList.length && itemList[i] == mineralizeList[mineralizeIndex]) {
        ++mineralizeIndex;
        continue;
      } else if (itemList[i] in multiSources) {
        continue;
      } else {
        costGraph[itemList[i]] = {
          原料: {},
          成本: this.getItemCost(itemList[i]),
          累计成本: 0,
        };
        for (let material in itemGraph[itemList[i]].原料) {
          costGraph[itemList[i]].原料 = addMaterialCost(costGraph[itemList[i]].原料, material, itemGraph[itemList[i]].原料[material]);
        }
        for (let byproduct in itemGraph[itemList[i]].副产物) {
          costGraph[itemList[i]].原料 = addMaterialCost(costGraph[itemList[i]].原料, byproduct, -itemGraph[itemList[i]].副产物[byproduct]);
        }
        costGraph[itemList[i]].累计成本 = costGraph[itemList[i]].成本;
        for (let material in costGraph[itemList[i]].原料) {
          if (costGraph[itemList[i]].原料[material] > 0) {
            costGraph[itemList[i]].累计成本 =
              Number(costGraph[itemList[i]].累计成本) + Number(costGraph[material].成本) * costGraph[itemList[i]].原料[material];
          }
        }
      }
    }

    return costGraph;
  }

  solveLP(constraintValues, supplyMap, demandMap, costGraph) {
    let itemGraph = this.itemGraph;
    let schemeData = this.schemeData;
    let lpProblem = {
      optimize: 'cost',
      opType: 'min',
      constraints: {},
      variables: {},
    };

    for (var item in constraintValues) {
      lpProblem.constraints[`i${item}`] = {
        min: constraintValues[item],
      };
      lpProblem.variables[item] = {
        cost: this.getItemCost(item),
      };
      for (let otherItem in constraintValues) {
        lpProblem.variables[item][`i${otherItem}`] = 0;
      }
      lpProblem.variables[item][`i${item}`] = 1;
      lpProblem.variables[item].cost =
        Number(lpProblem.variables[item].cost) +
        schemeData.cost_weight.物品额外成本[item].溢出时处理成本;

      if ('副产物' in itemGraph[item]) {
        for (let byproduct in itemGraph[item].副产物) {
          lpProblem.variables[item][`i${byproduct}`] =
            Number(lpProblem.variables[item][`i${byproduct}`]) + itemGraph[item].副产物[byproduct];
          lpProblem.variables[item].cost =
            Number(lpProblem.variables[item].cost) +
            itemGraph[item].副产物[byproduct] * schemeData.cost_weight.物品额外成本[byproduct].溢出时处理成本;
        }
      }

      for (let material in itemGraph[item].原料) {
        lpProblem.variables[item].cost =
          Number(lpProblem.variables[item].cost) + itemGraph[item].原料[material] * costGraph[material].累计成本;
        if (material in constraintValues) {
          lpProblem.variables[item][`i${material}`] =
            Number(lpProblem.variables[item][`i${material}`]) - itemGraph[item].原料[material];
        }
        for (let subMaterial in costGraph[material].原料) {
          if (subMaterial in constraintValues) {
            lpProblem.variables[item][`i${subMaterial}`] =
              Number(lpProblem.variables[item][`i${subMaterial}`]) - costGraph[material].原料[subMaterial] * itemGraph[item].原料[material];
          }
          if ('副产物' in itemGraph[subMaterial] && !(subMaterial in constraintValues)) {
            for (let byproduct in itemGraph[subMaterial].副产物) {
              lpProblem.variables[item][`i${byproduct}`] =
                Number(lpProblem.variables[item][`i${byproduct}`]) +
                itemGraph[subMaterial].副产物[byproduct] * itemGraph[item].原料[material] * costGraph[material].原料[subMaterial];
            }
          }
        }
      }
    }

    let glpkRuntime = null;

    if (!glpkRuntime) {
      // TODO: 需人工确认 原始实现依赖 glpk 运行时；当前恢复版在缺失 glpk 时降级为可交互模式，
      // TODO: 需人工确认 仅保持界面与配置流程可运行，产线求解结果不代表真实最优解。
      if (typeof console !== 'undefined') {
        console.warn('glpk runtime unavailable; using fallback LP solution.');
      }

      for (let item in constraintValues) {
        let required = Number(constraintValues[item]) || 0;
        supplyMap[item] = Number(supplyMap[item] || 0) + required;
      }

      return 0;
    }

    let solution = glpkRuntime.Solve(lpProblem);
    let totalCost = 0;

    if ('result' in solution) {
      totalCost = solution.result;
      delete solution.result;
    }
    if ('feasible' in solution) {
      if (!solution.feasible) {
        alert('线性规划无解,请检查来源配方设定是否可能满足需求');
      }
      delete solution.feasible;
    }
    if ('bounded' in solution) {
      if (!solution.bounded) {
        alert('线性规划目标函数无界,请检查配方执行成本是否合理');
      }
      delete solution.bounded;
    }

    let dualValues = {};
    for (let constraint in lpProblem.constraints) {
      dualValues[constraint] = lpProblem.constraints[constraint].min * -1;
    }
    for (let variable in solution) {
      for (let key in lpProblem.variables[variable]) {
        if (key != 'cost') {
          dualValues[key] += lpProblem.variables[variable][key] * solution[variable];
        }
      }
    }
    for (let constraint in dualValues) {
      if (dualValues[constraint] > 1e-8) {
        demandMap[constraint.slice(1)] = dualValues[constraint];
      }
    }

    for (let item in constraintValues) {
      supplyMap[item] = 0;
    }
    for (let item in solution) {
      supplyMap[item] = Number(supplyMap[item]) + solution[item];
      for (let material in itemGraph[item].原料) {
        if (!(material in constraintValues)) {
          if (material in supplyMap) {
            supplyMap[material] = Number(supplyMap[material]) + solution[item] * itemGraph[item].原料[material];
          } else {
            supplyMap[material] = solution[item] * itemGraph[item].原料[material];
          }
          for (let subMaterial in costGraph[material].原料) {
            if (!(subMaterial in constraintValues)) {
              if (subMaterial in supplyMap) {
                supplyMap[subMaterial] = Number(supplyMap[subMaterial]) + solution[item] * itemGraph[item].原料[material] * costGraph[material].原料[subMaterial];
              } else {
                supplyMap[subMaterial] = solution[item] * itemGraph[item].原料[material] * costGraph[material].原料[subMaterial];
              }
            }
          }
        }
      }
    }

    return totalCost;
  }
}