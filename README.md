天空島

「天空島」是以 HTML、CSS、JavaScript 與 Three.js 製作的第一人稱 3D 方塊探索遊戲。目前完成 STEP 0：玩家可以在固定大小的浮島上行走、環視與跳躍。挖掘、掉落物、拾取、放置方塊和下雨仍列在後續計畫中，尚未實作。

## 開始遊玩

本專案不需要建置步驟、npm 套件或應用程式後端。Three.js 由 jsDelivr CDN 載入，因此初次遊玩需要網路連線。由於頁面使用 JavaScript module，直接以 `file://` 開啟可能遇到瀏覽器 CORS 限制；建議在專案資料夾啟動本機靜態檔案伺服器：

```sh
cd "/Users/hopeyen/Desktop/my project"
python3 -m http.server 8000
```

接著開啟 [http://localhost:8000/](http://localhost:8000/)。這個命令只提供靜態檔案，不含遊戲後端。部署到靜態網站代管服務時，請保留專案檔案的相對位置。

## 操作方式

1. 點擊「進入小島」以鎖定滑鼠並開始遊玩；若瀏覽器未鎖定滑鼠，請確認頁面已取得焦點。
2. 按住 `W`、`A`、`S`、`D` 前後左右移動。
3. 按空白鍵跳躍。
4. 移動滑鼠控制視角，按 `Esc` 釋放滑鼠。

## 目前內容

- 固定尺寸的 12 × 12 方塊浮島，包含草地、泥土與石頭層；島嶼方塊數為 12 × 12 × 4，未超過 32 × 32 × 32 的世界上限。
- 第一人稱攝影機、滑鼠視角控制、WASD 移動、重力、跳躍與掉出島嶼後返回起點。
- 使用課程素材包中的草地、泥土和石頭貼圖，並以最近鄰取樣保留像素風格。

尚未完成的遊戲功能可參考 [PLANS.md](PLANS.md)：破壞方塊、掉落與拾取方塊、重新放置方塊，以及 R 鍵切換下雨。

## 專案檔案

| 路徑 | 用途 |
| --- | --- |
| `index.html` | 遊戲頁面與開始畫面 |
| `styles.css` | 遊戲畫面與開始介面樣式 |
| `src/game.js` | Three.js 場景、浮島與玩家控制 |
| `assets/textures/16px/` | 遊戲使用的課程方塊貼圖 |
| `tests/step0.test.js` | STEP 0 基本結構與場景檢查 |
| `BRIEF.md` | 專案需求與技術限制 |
| `PLANS.md` | 分階段實作計畫 |
| `VERIFY.md` | 遊戲驗收項目 |

## 驗收與效能

目前自動檢查涵蓋靜態入口、Three.js 場景、攝影機、控制器、跳躍與貼圖取樣設定。完整人工驗收及學校舊電腦上的每秒 30 格效能量測尚未完成；驗收清單見 [VERIFY.md](VERIFY.md)。遊玩需要支援 WebGL 與 Pointer Lock 的瀏覽器。

## 素材與授權

課程素材包的 `README.txt` 註明，圖片由 JUNHAO CHEN 為課程繪製，授權為 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)。使用或再散布這些圖片時，請保留作者與授權資訊，並遵守非商業及相同方式分享條款。

Three.js 0.155.0 由 CDN 載入，採用 [MIT License](https://github.com/mrdoob/three.js/blob/r155/LICENSE)。本專案未另行宣告整體程式碼授權。
