# Observer Lab｜观察者训练场

个人长期判断力训练系统。它以课程和任务为主线，而不是普通聊天界面。

## 在线访问

[https://blog.codingforjoy.com/Observer-Lab/](https://blog.codingforjoy.com/Observer-Lab/)

推送到 `main` 后，GitHub Actions 会自动构建并发布 GitHub Pages。

## 本地运行

```bash
pnpm install
pnpm run dev
```

## 验证

```bash
pnpm run build
pnpm run test:sites
```

## 部署结构

- Vite 在 GitHub Actions 中使用 `/Observer-Lab/` 作为静态资源基路径。
- 构建产物位于 `dist/client`。
- `.github/workflows/deploy.yml` 负责构建、上传 Pages artifact 和发布。
