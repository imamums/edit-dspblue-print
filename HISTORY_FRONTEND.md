# HISTORY_FRONTEND

### [2026-06-09 17:10] GitHub Copilot / Gemini 3 Flash (Preview)

- **修改范围**：蓝图配置下拉框图标增强
- **修改的文件**：
  - `src/components/BlueprintGeneratorPanel.vue`
- **变更意图**：在蓝图生成的配置项中引入物品/模式图标，提升视觉识别度与交互体验
- **核心变更内容**：
  - 步骤1：为“传送带等级”、“分拣器等级”及“物流模式”的 `el-select` 选项添加 `ItemIcon` 精灵图图标
  - 步骤2：在这些下拉框的 `prefix` 插槽中集成选中项图标，实现闭合状态下的图标预览
  - 步骤3：同步为“需求物品”下拉框添加 `prefix` 图标预览，保持界面一致性
  - 步骤4：新增 `getBeltName`, `getSorterName`, `getModeName` 辅助方法用于等级/模式到物品名称的映射
- **影响范围**：
  - 涉及蓝图生成设置面板的所有等级与模式选择器
  - 优化了移动端或高分辨率下的配置识别效率
- **注意事项**：
  - 图标大小统一设为 14px (prefix) 和 16px (option)，并配合 `bp-item-select-popper` 样式确保对齐

### [2026-06-09 16:55] GitHub Copilot / Gemini 3 Flash (Preview)

- **修改范围**：新增“视为原矿”功能，支持截断产线深度分解
- **修改的文件**：
  - `src/components/BlueprintGeneratorPanel.vue`
  - `src/utils/blueprintGen/schemeDefaults.js`
  - `HISTORY_FRONTEND.md`
- **变更意图**：允许用户手动指定某些中间产物为“原矿”，防止计算引擎继续向下拆解（例如已通过物流塔供应的半成品），从而只生成当前层级的蓝图
- **核心变更内容**：
  - 步骤1：修复 `schemeDefaults` 中 `mineralize_list` 类型定义，由数组改为对象以支持物品名索引
  - 步骤2：在生成配方卡片标题处增加“视为原矿”按钮，点击后将该物品加入排除列表
  - 步骤3：新增“视为原矿列表”摘要区域，展示当前所有被截断的物品，并支持一键恢复或移除
  - 步骤4：同步更新 `isRawMaterialItem` 与蓝图生成逻辑，确保被标记的物品在蓝图代码中正确作为“输入物品”处理而不是生成生产线
- **影响范围**：
  - 增强了蓝图生成的模块化能力，方便分段设计工厂
  - 生成结果的“原材料”统计将包含这些手动指定的物品
- **注意事项**：
  - 标记物品为原矿后会立即重新触发蓝图计算与渲染

### [2026-06-09 16:15] GitHub Copilot / Gemini 3 Flash (Preview)

- **修改范围**：新增蓝图生成配方选择、批量配置预设与快速需求填充功能
- **修改的文件**：
  - `src/components/RecipeSelector.vue` (新增)
  - `src/components/BlueprintGeneratorPanel.vue`
  - `HISTORY_FRONTEND.md`
- **变更意图**：参考 `DSP_Blueprint_Generator` 实现更加灵活的蓝图生成配置，支持用户自定义每步产线的配方，并提供便捷的批量参数调整能力
- **核心变更内容**：
  - 步骤1：新建 `RecipeSelector.vue` 组件，支持计算并按优先级展示物品的所有可用配方（产出、效率、用时）
  - 步骤2：在生成器“需求列表”中集成配方选择功能，用户可在添加需求时即指定生产策略
  - 步骤3：在“生成结果”配方列表区域增加交互式配方切换，修改后自动重新计算蓝图结果
  - 步骤4：新增“批量预设”功能区，支持一键统一设置常用工厂（熔炉、制造台等）的单排机器数量上限
  - 步骤5：新增“快速填充”需求模板，支持快速添加白糖、透镜、翘曲器等常见生产任务
- **影响范围**：
  - 显著提升了复杂产线（如多种来源的石墨烯、氢气等）生成的控制精度
  - 优化了大批量配置下的操作效率
- **注意事项**：
  - 配方选择是全局生效的（基于 `schemeData`），修改某处会影响整条产线中相同物品的获取方式
  - 快速预设目前覆盖了中后期几种高频物品

### [2026-06-09 16:30] GitHub Copilot / Gemini 3 Flash (Preview)

- **修改范围**：集成精灵图资产，统一物品图标组件并修复缺失资源问题
- **修改的文件**：
  - `src/assets/images/sprites/*` (新增)
  - `src/data/iconSpritePositions.json` (新增)
  - `src/components/ItemIcon.vue` (新增)
  - `src/views/Home.vue`
  - `src/components/BlueprintGeneratorPanel.vue`
  - `HISTORY_FRONTEND.md`
- **变更意图**：利用 `DSP_Blueprint_Generator` 的精灵图资源修复部分物品图标无法显示的问题，并统一图标渲染逻辑
- **核心变更内容**：
  - 步骤1：从外部项目同步 `Vanilla/GenesisBook` 等 4 套精灵图及坐标索引 JSON
  - 步骤2：新建 `ItemIcon.vue` 组件，支持：1. 优先尝试本地 PNG 2. 自动匹配精灵图偏移 3. 最终首字母占位兜底
  - 步骤3：全量替换 `Home` 视图与 `BlueprintGeneratorPanel` 中的 `<img>` 为 `<ItemIcon>`，且在生成器中配合 `GameIconName` 提高匹配精度
- **影响范围**：
  - 解决了大部分 MOD 物品和遗漏的原版物品图标显示
  - 统一了图标大小限制与渲染风格
- **注意事项**：
  - 引入精灵图后首屏构建产物体积有所增加
  - `Vanilla.webp` 等文件现已托管在 `src/assets/images/sprites/`

### [2026-06-09 11:18] GitHub Copilot / GPT-5.3-Codex

- **修改范围**：生成页物品图片尺寸限制
- **修改的文件**：
  - `src/components/BlueprintGeneratorPanel.vue`
  - `HISTORY_FRONTEND.md`
- **变更意图**：避免需求下拉与配方展示中的物品图标过大，保持界面一致性
- **核心变更内容**：
  - 步骤1：需求物品选择下拉增加 `popper-class`，为弹层单独应用图标样式
  - 步骤2：统一将图标尺寸限制为 `16x16`，并增加 `max-width/max-height` 硬限制
  - 步骤3：补充非 scoped 样式，确保 Element 弹层中的图标尺寸约束生效
- **影响范围**：
  - 生成页需求下拉中的物品图标
  - 生成配方区域中的物品图标
- **注意事项**：
  - 本次无后端接口、数据库结构变更
  - 仅样式层改动，不影响蓝图生成逻辑

### [2026-06-09 11:02] GitHub Copilot / GPT-5.3-Codex

- **修改范围**：生成蓝图入口位置调整与生成页物品图标化/配方展示
- **修改的文件**：
  - `src/views/Home.vue`
  - `src/components/ScrollCard.vue`
  - `src/components/BlueprintGeneratorPanel.vue`
  - `HISTORY_FRONTEND.md`
- **变更意图**：满足“生成蓝图选项放到数据字典后面，物品尽量使用图片，生成物品需要配方展示”的需求
- **核心变更内容**：
  - 步骤1：将“生成蓝图”入口从右侧按钮移至顶部导航链接组，紧跟“数据字典”之后
  - 步骤2：`ScrollCard` 对 `#/` 内部链接改为当前页 hash 跳转，避免新开窗口
  - 步骤3：生成页需求物品选择项改为图标+名称显示（有图标则优先展示）
  - 步骤4：新增“生成配方”区域，按产线展示输入/输出物品（图标+数量）与工厂数量
- **影响范围**：
  - 顶部导航入口顺序调整
  - 生成页可视信息增强，便于查看每条生成产线的配方关系
  - 生成结果蓝图字符串逻辑不变
- **注意事项**：
  - 本次无后端接口、数据库结构变更
  - 部分物品在数据集中无图标资源时将自动回退为文字显示

### [2026-06-09 10:22] GitHub Copilot / GPT-5.3-Codex

- **修改范围**：生成蓝图页面首屏体积优化（按需加载）
- **修改的文件**：
  - `src/App.vue`
  - `src/views/BlueprintGenerator.vue`
  - `src/components/BlueprintGeneratorPanel.vue`
  - `HISTORY_FRONTEND.md`
- **变更意图**：降低主页面首包压力，避免未进入生成页时加载生成器重型模块
- **核心变更内容**：
  - 步骤1：`App.vue` 将 `BlueprintGenerator` 改为异步组件加载
  - 步骤2：`BlueprintGenerator.vue` 将 `BlueprintGeneratorPanel` 改为异步组件加载
  - 步骤3：`BlueprintGeneratorPanel.vue` 将 `blueprintGenerator / blueprintConfig / gameDataBuilder / Calculator` 等重型依赖改为动态 `import()`
  - 步骤4：生成、复制等动作触发时再懒加载对应模块，并保持原有业务流程不变
- **影响范围**：
  - 主页面（蓝图转换页）首屏资源减少
  - 生成页首次进入与首次生成会发生按需加载
  - 功能行为与交互保持不变
- **注意事项**：
  - 本次无后端接口、数据库结构变更
  - 首次点击“生成主线蓝图”可能比之前多一次模块加载等待（通常仅首轮）

### [2026-06-09 09:57] GitHub Copilot / GPT-5.3-Codex

- **修改范围**：蓝图生成功能交互重构（需求先行）与页面结构拆分（独立页面）
- **修改的文件**：
  - `src/components/BlueprintGeneratorPanel.vue`
  - `src/views/BlueprintGenerator.vue`
  - `src/App.vue`
  - `src/views/Home.vue`
  - `src/utils/blueprintGen/gameDataBuilder.js`
  - `src/utils/blueprintGen/gameDataMap.js`
  - `src/utils/blueprintGen/game-data-CxrUhFyM.js`
  - `src/utils/blueprintGen/GameDataProvider.js`
  - `src/utils/blueprintGen/Calculator.js`
  - `src/utils/blueprintGen/schemeDefaults.js`
  - `src/utils/blueprintGen/productionSpeedModifier.js`
  - `HISTORY_FRONTEND.md`
- **变更意图**：满足“应先选择需求物品和物品数量再生成，且生成蓝图放到单独页面”的需求
- **核心变更内容**：
  - 步骤1：迁移并接入需求计算链路（`buildGameData`、`GameDataProvider`、`Calculator`、`schemeDefaults`）
  - 步骤2：重写 `BlueprintGeneratorPanel`，改为“需求物品 + 数量（件/分钟）”输入，自动计算产线并生成主线蓝图
  - 步骤3：新增独立页面 `BlueprintGenerator.vue`，通过 `#/generator` 访问，不再作为 `Home` 标签项
  - 步骤4：`App.vue` 增加哈希路由切页逻辑，`Home.vue` 增加“生成蓝图”入口及跨页回填（localStorage）
  - 步骤5：修复迁移代码 lint 兼容问题（`structuredClone/globalThis/while(true)` 等）
- **影响范围**：
  - 主页面转换流程保持不变
  - 蓝图生成从原标签页改为独立页面
  - 生成逻辑由“手填 rowInfo JSON”改为“需求驱动自动产线生成”
- **注意事项**：
  - 本次无后端接口、数据库结构变更
  - 由于引入游戏数据文件，前端构建产物体积上升（build 仅出现性能告警，不影响构建成功）

### [2026-06-09 09:35] GitHub Copilot / GPT-5.3-Codex

- **修改范围**：`Home` 页面新增“生成蓝图”标签页与蓝图生成功能接入
- **修改的文件**：
  - `src/views/Home.vue`
  - `src/components/BlueprintGeneratorPanel.vue`
  - `src/utils/blueprintGen/blueprintGenerator.js`
  - `src/utils/blueprintGen/blueprintConfig.js`
  - `src/utils/blueprintGen/blueprintUtils.js`
  - `vue.config.js`
  - `HISTORY_FRONTEND.md`
- **变更意图**：在现有蓝图变换工具中补充“生成蓝图”能力，并保持与参考项目 `DSP_Blueprint_Generator/src` 的核心生成逻辑一致
- **核心变更内容**：
  - 步骤1：迁移参考项目核心生成模块到 `src/utils/blueprintGen`，并适配当前工程输出（使用现有 `PARSER.toStr`）
  - 步骤2：新增 `BlueprintGeneratorPanel` 组件，支持“单行/主线”两种生成模式、参数配置、JSON输入、一键生成与复制
  - 步骤3：在 `Home.vue` 增加“生成蓝图”标签页，并实现“生成结果回填到导入蓝图区”联动
  - 步骤4：修复迁移后 lint 问题（`blueprintUtils` 的 `hasOwnProperty` 调用方式）并修正 `vue.config.js` 规则写法以通过 lint
- **影响范围**：前端页面导航新增标签页；蓝图生成结果可直接接入原有“导入蓝图 -> 生成配置 -> 输出结果”链路
- **注意事项**：本次仅前端功能与构建配置细节调整，无后端接口、数据库结构变更

### [2026-06-08 17:23] GitHub Copilot / GPT-5.3-Codex

- **修改范围**：项目协作文档
- **修改的文件**：
  - `AGENTS.md`
  - `HISTORY_FRONTEND.md`
- **变更意图**：建立统一的前端变更记录机制与项目协作总览文档
- **核心变更内容**：
  - 新增 `AGENTS.md`，沉淀项目总览、目录说明、命令与协作约定
  - 新增 `HISTORY_FRONTEND.md`，定义前端历史记录使用说明与模板
- **影响范围**：影响后续所有前端改动的记录与回溯流程
- **注意事项**：本次仅文档变更，无后端接口、数据库结构、配置项改动

## 使用说明

- **每次修改完成后，必须在本文件顶部追加一条记录**（按时间倒序排列，最新记录在最上方，时间可通过 mcp 服务：time-server 获取东八区时间）
- 严格按照下方的“记录格式模板”填写，保持字段完整、描述准确
- 修改人可填写真实姓名、Agent 名称或所使用的大模型名称（如 `Claude Sonnet 4.5`、`GPT-4o`、`GLM-4.5` 等）
- 涉及后端接口、数据库结构、配置变更时，必须在“注意事项”中重点标注
- 记录内容尽量具体，便于后续排查问题与回溯需求

## 记录格式模板

```markdown
### [YYYY-MM-DD HH:MM] 修改人/Agent/使用的大模型名称

- **修改范围**：涉及的功能模块（如：用户管理页面/侧边栏菜单/API 调用）
- **修改的文件**：
  - `src/views/system/user/index.vue`
  - `src/api/system/user.js`
- **变更意图**：为什么要改（如：修复分页失效问题/新增批量导出功能）
- **核心变更内容**：
  - 做了什么具体改动（如：将 `listUser` 方法参数调整、新增 `exportUser` API）
- **影响范围**：可能影响到哪些其他页面或组件
- **注意事项**：如需要修改后端、需要清除缓存、需要重新打包等
```
