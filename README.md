---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 8451bb31a15b041c293e3bdd4aa56343_b318488f96c411f1ac84525400f8a581
    ReservedCode1: VZHGJYLX4FB9qzaqKdElyCDhtkTNNYIeq607n57rHIE7p8EvGGy2LVNX7Zrcjphz7dq56/9vynxO/jQR6x+cyZIGvr/V8fgnoi/XOM0BeDur7Uv72t0gouIth78wKiqfiYNJC+Xn0q7BRwl4OQS8eGHBp/WuJjG6DIsZeX9Gds/gRYWAay3EQMZl5fg=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 8451bb31a15b041c293e3bdd4aa56343_b318488f96c411f1ac84525400f8a581
    ReservedCode2: VZHGJYLX4FB9qzaqKdElyCDhtkTNNYIeq607n57rHIE7p8EvGGy2LVNX7Zrcjphz7dq56/9vynxO/jQR6x+cyZIGvr/V8fgnoi/XOM0BeDur7Uv72t0gouIth78wKiqfiYNJC+Xn0q7BRwl4OQS8eGHBp/WuJjG6DIsZeX9Gds/gRYWAay3EQMZl5fg=
---



# 测试小站（个人测试网页）

一个仅自己使用的本地心理测试网页，纯静态、零依赖、双击即用。内置 MBTI、依恋类型、SCL-90 等测试，支持自定义题库扩展、结果存档与导出、可选大模型深度解读。

## 快速开始

直接双击 `index.html` 即可在浏览器中打开使用，无需安装任何软件、无需服务器。

## 功能一览

| 功能 | 说明 |
|------|------|
| 测试卡片墙 | 首页展示所有已内置测试，点击即可开始 |
| 断点续答 | 长问卷答一半关掉，下次自动续答（进度保存在浏览器本地） |
| 结果存档 | 每次测试结果自动保存在浏览器 localStorage，历史页可回顾 |
| 结果导出 | 结果页支持导出 HTML 报告 / Markdown / JSON 三种格式 |
| 全量备份 | 历史页可一键导出全部记录为 JSON |
| AI 深度解读 | 设置页配置大模型 API（OpenAI 兼容），结果页可一键生成个性化深度报告 |
| 自定义题库 | 照模板往 `tests-data.js` 加一个测试对象即可上架新测试 |

## 添加新测试（自定义框架）

1. 打开 `tests-data.js`，参照已有测试（建议复制 `依恋类型测试` 或 `SCL-90` 的结构）；
2. 在 `window.TESTS.push({ ... })` 中按统一结构填写：`id`（唯一）、`name`、`questions`（题目数组）、`scoring`（计分规则）、`interpretation`（解读）；
3. 保存文件，刷新首页即可看到新测试卡片，引擎代码无需改动。

支持的计分规则：
- `dimension`：维度计分（如 MBTI 四维度、16PF 十六维度），支持 `pairs` 维度配对生成类型字母；
- `type`：类型票数 / 题目级量表分（如 SCL-90 按因子累加），支持 `classify` 自定义分类函数；
- 解读支持 `types`（按类型给解读）与 `special`（自定义函数生成完整分析报告）。

## 分享给好友

- **方式一（打包发送）**：将整个文件夹打包成 zip 发给好友，对方解压后双击 `index.html` 即可使用，好友的数据只存在他自己的浏览器里。
- **方式二（静态托管）**：将文件夹原样上传到 GitHub Pages / Gitee Pages / Vercel 等免费静态托管，生成链接分享即可。项目全部使用相对路径，本地与线上表现一致。

## NAS 同步注意事项

项目支持放进 NAS 双向同步目录，多设备自动同步题库与代码。注意：
- 测试历史存在各浏览器 localStorage，不随文件同步，各设备相互独立；
- 建议开启 NAS 的版本历史/回收站功能，防止误删传播；
- 避免两台设备同时编辑同一个题库文件，否则可能产生冲突副本（删除冲突副本保留一份即可）。

## 大模型深度解读配置

1. 打开设置页，填写：接口地址（Base URL）、API Key、模型名（OpenAI 兼容格式，如 DeepSeek / Kimi / 通义等）；
2. 配置保存后，在任意结果页点击「AI 深度解读」按钮即可生成个性化深度报告；
3. 注意：浏览器直连大模型接口需要该服务支持 CORS（主流 OpenAI 兼容服务大多支持）；未配置时按钮自动隐藏。

## 内置测试清单

| 测试 | 题量 | 状态 |
|------|------|------|
| 依恋类型测试（ECR 精简版） | 18 题 | 已内置 |
| MBTI 人格测试 | 60 题 | 已内置 |
| SCL-90 症状自评量表 | 90 题 | 已内置 |
| 16PF（卡特尔人格因素） | 待补充 | 待添加 |
| MMPI-2（明尼苏达多相人格测验） | 待补充 | 待添加 |

> 注：16PF 与 MMPI-2 的完整正式题本受版权保护，如你有自有题本，可通过自定义框架导入；也可添加公开常见版本。

## 免责声明

本工具仅供个人自我了解与娱乐参考，不构成医学诊断或心理治疗建议。如有明显心理困扰，请及时寻求专业心理医生或咨询师的帮助。
*（内容由AI生成，仅供参考）*
*（内容由AI生成，仅供参考）*
