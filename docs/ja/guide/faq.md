# FAQ とトラブルシューティング

本ドキュメントは Antdv Next Admin プロジェクトでよくある質問と解決策をまとめています。

## 目次

- [依存関係のインストール問題](#依存関係のインストール問題)
- [開発環境の問題](#開発環境の問題)
- [ルーティング問題](#ルーティング問題)
- [権限の問題](#権限の問題)
- [Mock データの問題](#mock-データの問題)
- [ビルド・デプロイ問題](#ビルド・デプロイ問題)
- [TypeScript の問題](#typescript-の問題)
- [パフォーマンス最適化の推奨事項](#パフォーマンス最適化の推奨事項)

---

## 依存関係のインストール問題

### Q: 依存関係のインストール時に停止またはタイムアウト

**解決策：**

```bash
# 国内ミラーを使用
npm config set registry https://registry.npmmirror.com

# または pnpm を使用
pnpm install
```

### Q: 依存関係の競合警告

**解決策：**

```bash
# node_modules を削除して再インストール
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 開発環境の問題

### Q: 開発サーバー起動後に白画面

**考えられる原因と解決策：**

1. **ポートが使用中**
```bash
# ポートを変更
npm run dev -- --port 3001
```

2. **環境変数が有効でない**
```bash
# 開発サーバーを再起動
# .env ファイルを変更した後は再起動が必要
```

3. **ブラウザキャッシュ**
```bash
# 強制リフレッシュ：Cmd/Ctrl + Shift + R
# またはブラウザキャッシュをクリア
```

### Q: ホットリロード（HMR）が機能しない

**解決策：**

```bash
# 1. Vite 設定を確認
# vite.config.ts で hmr 設定が正しいことを確認

server: {
  hmr: {
    overlay: true,
  },
}

# 2. 開発サーバーを再起動
# 3. ブラウザコンソールで WebSocket 接続エラーがないか確認
```

### Q: ログイン後に空白ページに遷移

**考えられる原因：**
1. 権限ルートが正しく生成されていない
2. KeepAlive キャッシュの問題

**解決策：**

```typescript
// permission store がルートを正しく生成しているか確認
const permissionStore = usePermissionStore()
await permissionStore.generateRoutes()

// キャッシュをクリアして再試行
localStorage.clear()
location.reload()
```

---

## ルーティング問題

### Q: ページリフレッシュで 404

**原因：** フロントエンドルーティングモードが history の場合、サーバー設定が必要

**解決策：**

**Nginx 設定：**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Vercel：**
```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Q: 新しいページを追加後にメニューが表示されない

**チェックリスト：**

1. ルートが `routes.ts` に正しく追加されているか
2. ルート meta に `title` が設定されているか
3. そのルートへのアクセス権限があるか
4. 再ログイン（権限ルートは再生成が必要）

### Q: KeepAlive キャッシュが機能しない

**考えられる原因：**

```typescript
// 1. ルート設定を確認
{
  meta: {
    keepAlive: true,  // true に設定されていることを確認
    title: 'ページタイトル' // title の設定が必須
  }
}

// 2. コンポーネント名がルート名と一致しているか確認
export default {
  name: 'Dashboard',  // ルート名と一致する必要あり
}

// 3. キャッシュリストを確認
tabsStore.cachedViews.includes('Dashboard')
```

---

## 権限の問題

### Q: ボタン権限ディレクティブが機能しない

**調査手順：**

```typescript
// 1. 権限コードが正しいか確認
<a-button v-permission="'user.create'">新規</a-button>

// 2. ユーザーがその権限を持っているか確認
const authStore = useAuthStore()
console.log(authStore.userPermissions) // ユーザー権限リストを表示

// 3. ユーザーがログインしているか確認
console.log(authStore.isLoggedIn)
```

### Q: ルートガードが無限ループ

**原因：** ルートガード内のロジックエラーによる循環遷移

**解決策：**

```typescript
// ルートガード内で正しく判定
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // ✅ 正しい：ログイン状態を先に判定
  if (!authStore.isLoggedIn && to.path !== '/login') {
    next('/login')
    return
  }
  
  // ✅ 正しい：ログイン済みでログインページにアクセス時はホームへ
  if (authStore.isLoggedIn && to.path === '/login') {
    next('/')
    return
  }
  
  next()
})
```

---

## Mock データの問題

### Q: Mock インターフェースが機能しない

**調査手順：**

1. **環境変数を確認**
```bash
# .env.development
VITE_USE_MOCK=true
```

2. **インターフェースアドレスを確認**
```typescript
// /api で始まる必要あり
request.get('/api/users')  // ✅ 正しい
request.get('/users')       // ❌ 誤り
```

3. **Mock ファイルを確認**
```typescript
// mock/handlers/*.mock.ts
export default defineMock([
  {
    url: '/api/users',  // /api で始まる必要あり
    method: 'GET',
    // ...
  }
])
```

4. **開発サーバーを再起動**

### Q: Mock データ変更後に反映されない

**解決策：**

Mock サーバーはホットリロードをサポートしていますが、時々再起動が必要です：

```bash
# 開発サーバーを再起動
npm run dev
```

---

## ビルド・デプロイ問題

### Q: ビルド失敗

**よくあるエラーと解決策：**

1. **TypeScript エラー**
```bash
# 型チェックを実行して具体的なエラーを確認
npm run type-check

# 型エラーを修正
```

2. **メモリ不足**
```bash
# Node メモリ制限を増やす
export NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

3. **パスエラー**
```typescript
// vite.config.ts で base 設定を確認
export default {
  base: '/',  // デプロイ環境に応じて調整
}
```

### Q: デプロイ後にリソースが 404

**考えられる原因：**

1. **Base パス設定エラー**
```typescript
// サブディレクトリにデプロイする場合
export default {
  base: '/admin/',  // サブディレクトリパス
}
```

2. **サーバー設定の問題**
- 静的リソースディレクトリ設定が正しいか確認
- ファイルパーミッションを確認

### Q: デプロイ後に白画面

**調査手順：**

1. **ブラウザコンソールのエラーを確認**
2. **ネットワークリクエストが成功しているか確認**
3. **環境変数が正しいか確認**
```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com
```

---

## TypeScript の問題

### Q: 型エラー：Cannot find module '@/components/xxx'

**解決策：**

```json
// tsconfig.json で paths 設定が正しいか確認
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

VS Code または TypeScript サービスを再起動

### Q: Vue ファイルの型エラー

**解決策：**

```typescript
// Vue 型がインストールされているか確認
npm install -D vue-tsc

// tsconfig.json に Vue ファイルを含める
{
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
```

### Q: Ref 型推論エラー

**解決策：**

```typescript
// ✅ 正しい：型を明示的に指定
const count = ref<number>(0)
const user = ref<User | null>(null)

// ✅ 正しい：初期値から推論
const count = ref(0)  // Ref<number> と推論
```

---

## パフォーマンス最適化の推奨事項

### 1. 初回ロード最適化

```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // パッケージ分割ロード
          'vendor': ['vue', 'vue-router', 'pinia'],
          'antdv': ['antdv-next'],
        },
      },
    },
  },
}
```

### 2. コンポーネント遅延ロード

```typescript
const Dashboard = () => import('@/views/dashboard/index.vue')
```

### 3. 画像最適化

```vue
<!-- WebP 形式を使用 -->
<img src="@/assets/logo.webp" alt="logo">

<!-- または遅延ロード -->
<img v-lazy="imageSrc" alt="image">
```

### 4. メモリリークを避ける

```typescript
// タイマーをクリア
onUnmounted(() => {
  clearInterval(timer)
})

// イベントリスナーをクリア
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Store 購読をクリア
const unsubscribe = store.$subscribe(() => {})
onUnmounted(() => {
  unsubscribe()
})
```

---

## ヘルプの取得方法

1. **ドキュメントを確認**：対応する機能モジュールのドキュメントを注意深く読む
2. **サンプルを確認**：`src/views/examples/` のサンプルコードを参照
3. **Issue を検索**：GitHub Issues で類似の問題を検索
4. **Issue を提出**：問題が解決しない場合は Issue を提出し、以下を添付：
   - 問題の説明
   - 再現手順
   - エラーのスクリーンショットまたはログ
   - 環境情報（Node バージョン、OS など）

---

## デバッグテクニック集

### Vue DevTools

1. [Vue DevTools ブラウザ拡張](https://devtools.vuejs.org/)をインストール
2. コンポーネントツリーと Props を表示
3. Pinia Store の状態を確認
4. ルート情報を表示

### コンソールデバッグ

```typescript
// ルート情報を出力
console.log('Current route:', router.currentRoute.value)

// Store 状態を出力
console.log('Auth store:', authStore.$state)

// 環境変数を出力
console.log('Env:', import.meta.env)
```

### Network パネル

1. API リクエストが成功しているか確認
2. リクエストパラメータとレスポンスデータを表示
3. CORS エラーがないか確認

---

## 次のステップ

- [開発ワークフロー](/guide/development-workflow) でプロジェクト開発規範を確認
- [API 統合](/guide/api-integration) でバックエンド連携を学習
- [サンプルと実践](/guide/examples) で完全な事例を確認
