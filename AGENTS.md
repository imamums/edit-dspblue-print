# AGENTS

## 项目总览

- 项目名称：DSP蓝图变换工具
- 项目目标：解析并转换《戴森球计划》蓝图数据，提供界面化的编辑与格式转换能力
- 前端框架：Vue 2 + Vue CLI 4 + Element UI

## 关键目录

- `src/views`：页面视图（当前主页面为 `Home.vue`）
- `src/components`：通用组件（如滚动卡片、版本下拉）
- `src/utils`：蓝图解析与参数处理工具
- `src/data`：静态展示数据
- `public/versions`：历史静态页面版本快照

## 常用命令

- 安装依赖：`npm install`
- 本地开发：`npm run serve`
- 生产构建：`npm run build`
- 代码检查：`npm run lint`

## 协作约定

- 每次前端修改完成后，必须在 `HISTORY_FRONTEND.md` 顶部追加一条变更记录（按时间倒序）
- 记录内容需完整覆盖：修改范围、修改文件、变更意图、核心变更内容、影响范围、注意事项
- 涉及后端接口、数据库结构、配置变更时，必须在“注意事项”中重点标注

## 变更边界提醒

- `public/versions` 目录通常用于历史版本展示；非明确需求请勿随意改动
- 工具与组件改动优先保持 Vue 2 生态兼容性
