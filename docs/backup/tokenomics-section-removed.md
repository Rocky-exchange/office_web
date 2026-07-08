# 备份:首页 Tokenomics 板块(已从页面移除)

**移除日期:** 2026-07-08
**原因:** 应需求暂时从首页隐藏「1 Billion ROCKY / Fixed Supply / 环形分配图」整个板块,后续可能重新加回。

## 说明

本次移除**只是不再渲染**该板块。以下资产全部**原样保留在代码库**,没有删除:

- 组件本体:`src/components/home/sections.tsx` → `export function TokenomicsSection()`(约 329 行起)
- 内容数据:`src/content/homepage.ts` → `tokenomicsAllocations`
- 样式:`src/app/globals.css` 中所有 `.tokenomics-*` 规则
- 图表图片:`public/echarts-pie.svg`

唯一改动的是 `src/components/home/home-page.tsx`:去掉了对该组件的引用。

## 如何恢复(一步即可)

编辑 `src/components/home/home-page.tsx`:

1. 在从 `@/components/home/sections` 的 import 中重新加入 `TokenomicsSection`。
2. 在 `<div className="tokenomics-faq-shell">` 内、`<FaqSection />` 之前,加回一行:

```tsx
<div className="tokenomics-faq-shell">
  <TokenomicsSection />
  <FaqSection />
</div>
```

保存并 push 到 main,GitHub Actions 会自动部署,板块即恢复。

## 注意:外层背景也被改过

移除板块后为消除背景断层,`src/app/globals.css` 里 `.tokenomics-faq-shell`
的背景被简化了(去掉了为 Tokenomics 标题准备的两团光晕)。若要 **完全还原**
成带光晕的原样,把该规则的 `background` 改回下面这段原始值:

```css
.rocky-homepage .tokenomics-faq-shell {
  position: relative;
  width: 100%;
  overflow: hidden;
  background:
    radial-gradient(ellipse 48% 22% at 82% 12%, rgba(245, 168, 95, 0.14) 0%, rgba(245, 168, 95, 0.05) 38%, rgba(245, 168, 95, 0) 78%),
    radial-gradient(ellipse 36% 18% at 14% 4%, rgba(176, 214, 234, 0.1) 0%, rgba(176, 214, 234, 0.03) 34%, rgba(176, 214, 234, 0) 76%),
    linear-gradient(180deg, #17100c 0%, #120d0a 20%, #120d0a 100%);
}
```

## 最省事的完全还原方式(git)

删除前的完整版本就是提交 **`1d31f2b`**(标题:Remove 1px border seam from
all Launch App buttons)。直接从该提交取回这三个文件即可一步还原(组件、
背景、页面全部复原):

```bash
git checkout 1d31f2b -- src/components/home/home-page.tsx src/app/globals.css
```

取回后检查一下再 push 到 main 即自动部署。
