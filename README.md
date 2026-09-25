# 企业 AI 落地案例库 · FDE 模式库

墨予镜出品。一个面向**企业决策者**与**AI 落地从业者**的中文案例库：按业务痛点检索真实企业 AI 落地案例，并从中抽象可复用的 FDE 交付模式。

## 与其他案例库的区别

- **按痛点检索**：首页入口是「客服成本」「专家知识流失」「质检依赖人工」这类业务痛点，不是公司名录或行业列表。
- **决策语言**：S 级案例回答五个问题——投入多大、周期多长、需要什么前提、失败点在哪、同类企业能不能复制。
- **FDE 模式库**：从案例中抽象交付模式（诊断型/平台型/助手型/评测型），案例与模式双向互链。
- **证据口径**：每条案例标注「公开事实 / 来源方披露 / 编辑分析」。效果数字凡未经独立审计的，如实标注，不做暗示。

## 案例分档

| 档位 | 含义 | 分析深度 |
| --- | --- | --- |
| S 级 | 公开细节足以回答决策五问 | 完整字段，参与模式抽象 |
| 标准级 | 方法与场景可理解，决策五问缺项 | 基础事实 + 痛点标签 |
| 概览级 | 只有场景与效果口径 | 线索卡，仅供参考 |

## 数据来源

所有案例回到一手公开来源自行提取（Datawhale《FDE 案例 100》、企业官方案例页、公司工程博客等），原始材料留存于 `data/raw/`，每条案例附来源链接。效果数字绝大多数为来源方披露。

## 项目结构

```
data/
  cases.json          # 案例数据（唯一事实源）
  patterns.json       # FDE 模式库
  pain-points.json    # 痛点标签受控词表
  raw/                # 原文留存（提取时的来源材料）
src/                  # 站点源码（React + Vite + Tailwind，hash 路由可分享单条链接）
scripts/
  build-data.mjs      # data/*.json → src/data/generated.ts（build 前自动执行）
  validate.mjs        # 数据校验
.github/workflows/    # GitHub Pages 构建部署
```

## 本地开发

```bash
pnpm install
pnpm dev        # 本地预览
pnpm build      # 产出 dist/
```

数据改动只需改 `data/*.json`，`pnpm build` 时自动生成站点数据；提交前跑 `node scripts/validate.mjs`。

## 线上部署

push 到 main 后由 GitHub Actions 自动构建并部署到 Pages，无需手工操作。

## 校验

```bash
node scripts/validate.mjs
```

## License

MIT（数据内容转载请注明来源；各案例版权归原作者与原发布方所有）
