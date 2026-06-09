export class GameDataProvider {
  constructor(gameData) {
    this.gameData = gameData;
    this.itemData = undefined;
    this.allTargetItems = undefined;
    this.iconGrid = undefined;

    this.initItemData();
    this.allTargetItems = uniqueArray(
      this.gameData.recipe_data.flatMap((recipe) => Object.keys(recipe.产物)),
    );
    this.initIconLayout();
  }

  initIconLayout() {
    let gridMap = {};
    for (let [itemName, gridIndex] of Object.entries(this.gameData.item_grid)) {
      if (
        itemName === '沙土' ||
        itemName === '伊卡洛斯' ||
        itemName === '行星基地' ||
        itemName === '巨构星际组装厂'
      ) {
        continue;
      }
      let col = gridIndex % 100;
      let row = (gridIndex - col) / 100;
      gridMap[[col, row]] = {
        item: itemName,
        x: col,
        y: row,
      };
    }

    let allX = Object.values(gridMap).map(({ x }) => x);
    let allY = Object.values(gridMap).map(({ y }) => y);
    if (allX.length === 0 || allY.length === 0) {
      this.iconGrid = {
        nrow: 0,
        ncol: 0,
        icons: [],
      };
      return;
    }

    let minX = Math.min.apply(null, allX);
    let maxX = Math.max.apply(null, allX);
    let minY = Math.min.apply(null, allY);
    let maxY = Math.max.apply(null, allY);

    let icons = [];
    let remainingItems = new Set(this.allTargetItems);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        let itemName = gridMap[[x, y]]?.item;
        if (itemName) {
          icons.push({
            col: x - minX + 1,
            row: y - minY + 1,
            item: itemName,
          });
          remainingItems.delete(itemName);
        }
      }
    }

    if (remainingItems.size > 0) {
      console.warn('如下产物未能在物品选择器中显示', remainingItems);
    }

    this.iconGrid = {
      nrow: maxY - minY + 1,
      ncol: maxX - minX + 1,
      icons,
    };
  }

  initItemData() {
    let itemData = {};
    let recipeData = this.gameData.recipe_data;
    var itemIndex = 0;

    for (var i = 0; i < recipeData.length; i++) {
      for (var productName in recipeData[i].产物) {
        if (!(productName in itemData)) {
          itemData[productName] = [itemIndex];
          itemIndex++;
        }
        itemData[productName].push(i);
      }
    }

    this.itemData = itemData;
  }
}

function uniqueArray(arr) {
  return [...new Set(arr)];
}