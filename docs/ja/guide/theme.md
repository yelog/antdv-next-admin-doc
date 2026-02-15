# テーマシステム

## 概要

Antdv Next Admin は柔軟なテーマシステムを提供し、CSS変数と Pinia Store を通じて動的テーマ切り替えを実現し、複数のテーマカラーとライト/ダークモードをサポートしています。

## テーマモード

3つのテーマモードをサポート：

| モード | 説明 |
| --- | --- |
| `light` | ライトモード |
| `dark` | ダークモード（Ant Design の `darkAlgorithm` を使用） |
| `auto` | システム設定に自動追従 |

### テーマモードの切り替え

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

themeStore.setThemeMode('dark')   // ダークに切り替え
themeStore.setThemeMode('light')  // ライトに切り替え
themeStore.setThemeMode('auto')   // システムに追従
```

## テーマカラー

6つのプリセットテーマカラーを内蔵：

| カラー | 色値 | 名称 |
| --- | --- | --- |
| 🔵 ブルー | `#1677ff` | デフォルト |
| 🟢 グリーン | `#52c41a` | — |
| 🟣 パープル | `#722ed1` | — |
| 🔴 レッド | `#f5222d` | — |
| 🟠 オレンジ | `#fa8c16` | — |
| 🔵 シアン | `#13c2c2` | — |

### テーマカラーの設定

```typescript
themeStore.setPrimaryColor('#1677ff')  // 任意の有効なカラー値
```

## CSS変数

テーマシステムの核心は `src/assets/styles/variables.css` で定義された100以上のCSSデザイン変数です：

```css
:root {
  /* プライマリカラー */
  --ant-primary-color: #1677ff;

  /* 背景色 */
  --bg-color: #ffffff;
  --bg-color-secondary: #f5f5f5;

  /* テキストカラー */
  --text-color: rgba(0, 0, 0, 0.88);
  --text-color-secondary: rgba(0, 0, 0, 0.65);

  /* サイドバー */
  --sidebar-bg-color: #001529;
  --sidebar-text-color: rgba(255, 255, 255, 0.65);

  /* その他の変数... */
}
```

Theme Store はテーマ切り替え時に `document.documentElement` 上のCSS変数を動的に更新します。

### CSS変数の使用

コンポーネントスタイル内で直接使用：

```css
.my-component {
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}
```

::: tip ベストプラクティス
ハードコードされたカラー値ではなくCSS変数を優先的に使用し、すべてのテーマモードでコンポーネントが正しく表示されるようにしてください。
:::

## サイドバーテーマ

サイドバーは独立した明暗テーマ設定をサポートし、グローバルテーマモードの影響を受けません：

- **ダークサイドバー**：深い青色背景（`#001529`）、ライトメインコンテンツエリアとの組み合わせに適しています
- **ライトサイドバー**：白背景、全体的により統一されたスタイル

サイドバーテーマは独立したCSS変数で制御されます（`--sidebar-bg-color`、`--sidebar-text-color` など）。

## カスタムテーマ

### 新しいプリセットカラーの追加

Theme Store のカラープリセット配列に新しいカラーを追加するだけです。

### デフォルトCSS変数の変更

`src/assets/styles/variables.css` を編集し、CSS変数定義を変更または追加します。変更後、その変数を使用するすべてのコンポーネントが自動的に更新されます。

### Ant Design テーマ

ダークモードは Ant Design Vue の `darkAlgorithm` を通じて実装され、すべての Ant Design コンポーネントがダークモードで正しくレンダリングされることを保証します。
