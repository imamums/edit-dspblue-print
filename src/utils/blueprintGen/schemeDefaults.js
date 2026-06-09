import { buildItemRecipeIndexMap } from './gameDataBuilder.js';

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

var DEFAULT_SCHEME_TEMPLATE = {
  item_recipe_choices: {
    氢: 1,
  },
  scheme_for_recipe: [
    {
      建筑: 0,
      增产点数: 0,
      增产模式: 0,
    },
  ],
  cost_weight: {
    占地: 1,
    电力: 0,
    建筑成本: {
      分拣器: 0,
      制造台: 0,
    },
    物品额外成本: {
      单极磁石: {
        成本: 10,
        启用: 1,
        与其它成本累计: 0,
      },
      铁: {
        成本: 1,
        启用: 0,
        与其它成本累计: 0,
      },
    },
  },
};

function buildDefaultScheme(gameData) {
  let scheme = deepClone(DEFAULT_SCHEME_TEMPLATE);
  let recipeIndexMap = buildItemRecipeIndexMap(gameData);

  scheme.item_recipe_choices = {};
  scheme.scheme_for_recipe = [];
  scheme.cost_weight.占地 = 1;
  scheme.cost_weight.电力 = 0;
  scheme.cost_weight.建筑成本 = {
    分拣器: 0,
  };
  scheme.cost_weight.物品额外成本 = {};

  for (var factoryType in gameData.factory_data) {
    for (var factoryIndex in gameData.factory_data[factoryType]) {
      scheme.cost_weight.建筑成本[gameData.factory_data[factoryType][factoryIndex].名称] = 0;
    }
  }

  for (var item in recipeIndexMap) {
    scheme.cost_weight.物品额外成本[item] = {
      成本: 0,
      启用: 0,
      与其它成本累计: 0,
      溢出时处理成本: 0,
    };
  }

  for (let item in recipeIndexMap) {
    scheme.item_recipe_choices[item] = 1;
  }

  for (var i = 0; i < gameData.recipe_data.length; i++) {
    scheme.scheme_for_recipe.push({
      建筑: 0,
      增产点数: 0,
      增产模式: 0,
    });
  }

  return scheme;
}

var DEFAULT_SETTINGS = {
  mining_speed_oil: 3,
  mining_speed_hydrogen: 1,
  mining_speed_deuterium: 0.05,
  mining_speed_gas_hydrate: 0.8,
  mining_speed_helium: 0.02,
  mining_speed_ammonia: 0.3,
  mining_speed_nitrogen: 1.2,
  mining_speed_oxygen: 0.6,
  mining_speed_carbon_dioxide: 0.4,
  mining_speed_sulfur_dioxide: 0.6,
  hide_mines: false,
  covered_veins_small: 8,
  covered_veins_large: 16,
  mining_efficiency_large: 3,
  mining_speed_multiple: 1,
  enemy_drop_multiple: 1,
  icarus_manufacturing_speed: 1,
  fractionating_speed: 30,
  is_time_unit_minute: true,
  fixed_num: 2,
  stack_research_lab: 15,
  proliferate_itself: true,
  acc_rate: 1,
  inc_rate: 1,
  blue_buff: false,
  mineralize_list: {},
  natural_production_line: [],
};

export { DEFAULT_SCHEME_TEMPLATE, buildDefaultScheme, DEFAULT_SETTINGS };