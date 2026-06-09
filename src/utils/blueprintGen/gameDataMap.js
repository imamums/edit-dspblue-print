import {
	a as moreMegaStructureTheyComeFromVoidData,
	c as moreMegaStructureFractionateEverythingData,
	d as genesisBookData,
	f as fractionateEverythingData,
	i as moreMegaStructureTheyComeFromVoidFractionateEverythingData,
	l as moreMegaStructureData,
	n as moreMegaStructureTheyComeFromVoidGenesisBookFractionateEverythingData,
	o as moreMegaStructureGenesisBookFractionateEverythingData,
	r as moreMegaStructureTheyComeFromVoidGenesisBookData,
	s as moreMegaStructureGenesisBookData,
	t as vanillaData,
	u as genesisBookFractionateEverythingData,
} from './game-data-CxrUhFyM.js';

function deepClone(value) {
	return JSON.parse(JSON.stringify(value));
}

function listToMapById(list) {
	let map = new Map();
	(list || []).forEach((entry) => {
		map.set(entry.ID, entry);
	});
	return map;
}

function mergeWithDerivedDiff(baseList, withTheyComeFromVoidList, withoutTheyComeFromVoidList) {
	let baseMap = listToMapById(baseList);
	let withMap = listToMapById(withTheyComeFromVoidList);
	let withoutMap = listToMapById(withoutTheyComeFromVoidList);
	let outMap = new Map(baseMap);

	let allIds = new Set([...withMap.keys(), ...withoutMap.keys()]);
	allIds.forEach((id) => {
		let withEntry = withMap.get(id);
		let withoutEntry = withoutMap.get(id);

		if (withEntry && !withoutEntry) {
			outMap.set(id, deepClone(withEntry));
			return;
		}

		if (!withEntry && withoutEntry) {
			outMap.delete(id);
			return;
		}

		if (withEntry && withoutEntry) {
			if (JSON.stringify(withEntry) !== JSON.stringify(withoutEntry)) {
				outMap.set(id, deepClone(withEntry));
			}
		}
	});

	return Array.from(outMap.values()).sort((left, right) => Number(left.ID) - Number(right.ID));
}

function deriveTheyComeFromVoidStandalone(baseData, withTheyComeFromVoidData, withoutTheyComeFromVoidData) {
	if (!baseData || !withTheyComeFromVoidData || !withoutTheyComeFromVoidData) {
		return baseData;
	}

	let derived = deepClone(baseData);
	derived.items = mergeWithDerivedDiff(
		baseData.items,
		withTheyComeFromVoidData.items,
		withoutTheyComeFromVoidData.items,
	);
	derived.recipes = mergeWithDerivedDiff(
		baseData.recipes,
		withTheyComeFromVoidData.recipes,
		withoutTheyComeFromVoidData.recipes,
	);
	return derived;
}

const theyComeFromVoidData = deriveTheyComeFromVoidStandalone(
	vanillaData,
	moreMegaStructureTheyComeFromVoidData,
	moreMegaStructureData,
);
const theyComeFromVoidFractionateEverythingData = deriveTheyComeFromVoidStandalone(
	fractionateEverythingData,
	moreMegaStructureTheyComeFromVoidFractionateEverythingData,
	moreMegaStructureFractionateEverythingData,
);
const theyComeFromVoidGenesisBookData = deriveTheyComeFromVoidStandalone(
	genesisBookData,
	moreMegaStructureTheyComeFromVoidGenesisBookData,
	moreMegaStructureGenesisBookData,
);
const theyComeFromVoidGenesisBookFractionateEverythingData = deriveTheyComeFromVoidStandalone(
	genesisBookFractionateEverythingData,
	moreMegaStructureTheyComeFromVoidGenesisBookFractionateEverythingData,
	moreMegaStructureGenesisBookFractionateEverythingData,
);

const GAME_DATA_MAP = {
	Vanilla: vanillaData,
	TheyComeFromVoid: theyComeFromVoidData,
	FractionateEverything: fractionateEverythingData,
	TheyComeFromVoid_FractionateEverything: theyComeFromVoidFractionateEverythingData,
	GenesisBook: genesisBookData,
	TheyComeFromVoid_GenesisBook: theyComeFromVoidGenesisBookData,
	GenesisBook_FractionateEverything: genesisBookFractionateEverythingData,
	TheyComeFromVoid_GenesisBook_FractionateEverything:
		theyComeFromVoidGenesisBookFractionateEverythingData,
	MoreMegaStructure: moreMegaStructureData,
	MoreMegaStructure_FractionateEverything: moreMegaStructureFractionateEverythingData,
	MoreMegaStructure_GenesisBook: moreMegaStructureGenesisBookData,
	MoreMegaStructure_GenesisBook_FractionateEverything:
		moreMegaStructureGenesisBookFractionateEverythingData,
	MoreMegaStructure_TheyComeFromVoid: moreMegaStructureTheyComeFromVoidData,
	MoreMegaStructure_TheyComeFromVoid_FractionateEverything:
		moreMegaStructureTheyComeFromVoidFractionateEverythingData,
	MoreMegaStructure_TheyComeFromVoid_GenesisBook: moreMegaStructureTheyComeFromVoidGenesisBookData,
	MoreMegaStructure_TheyComeFromVoid_GenesisBook_FractionateEverything:
		moreMegaStructureTheyComeFromVoidGenesisBookFractionateEverythingData,
};

// TODO: 需人工确认 当前打包产物没有独立 TheyComeFromVoid* 源数据，
// TODO: 需人工确认 上述 4 个 TheyComeFromVoid 独立键由差量推导生成（相对 MoreMegaStructure 组合），
// TODO: 需人工确认 后续若恢复原始 data JSON，应替换为权威源数据。

export { GAME_DATA_MAP };
