# 备份:页脚 CTA 区「Whitepaper」按钮(已移除)

**移除日期:** 2026-07-08
**位置:** 页脚顶部「POWERED BY CANTON / DEFINED BY ROCKY」下方的 CTA 按钮区。
**原因:** 应需求先删除 Whitepaper 按钮,只保留居中的 Launch App,后续可能加回。

## 被移除的按钮配置

该按钮由 `src/content/homepage.ts` 的 `footerCtaLinks` 数组驱动。被删除的条目为:

```ts
{ label: 'Whitepaper', href: '#faq', variant: 'ghost' },
```

移除后 `footerCtaLinks` 只剩 Launch App 一项,靠父容器 `.footer-hero`
的 `justify-items: center` 自动居中,无需改动 CSS。

## 如何恢复

编辑 `src/content/homepage.ts`,把上面那行加回 `footerCtaLinks` 数组
(放在 Launch App 之后):

```ts
export const footerCtaLinks = [
  { label: 'Launch App', href: 'https://app.rocky.exchange', variant: 'primary' },
  { label: 'Whitepaper', href: '#faq', variant: 'ghost' },
] as const;
```

保存并 push 到 main 即自动部署。删除前的完整版本也可从提交 `0867c49`
之后的历史中找回。
