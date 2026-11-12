# xuegavin 的个人主页

简体中文静态个人主页，使用原生 HTML 和 CSS，无需安装依赖或构建。

## 本地查看

直接用浏览器打开 `index.html`。

## 修改内容

- 在 `index.html` 中修改个人简介。项目列表由 `projects.js` 从 GitHub 自动读取，无需手动编辑。
- 联系入口已指向 https://github.com/xuegavin 。
- 在 `style.css` 中修改颜色、字体和响应式布局。

## GitHub Pages

将文件推送到仓库后，在 GitHub 仓库的 Settings → Pages 中选择 Deploy from a branch，然后选择实际推送的分支和 `/ (root)` 目录。

发布成功后的地址为 https://xuegavin.github.io/ 。本地生成文件并不代表已经发布。

## 自动展示项目

仅展示同时满足以下条件的仓库：公开、非 `xuegavin.github.io`、非 Fork、Topics 包含 `portfolio`。按最近更新时间排序，自动读取全部分页。

在目标仓库主页右侧 About 旁点击齿轮，在 Topics 中输入 `portfolio` 并按回车，然后保存。移除这个主题即可取消展示。仓库的 Description 用作卡片简介，主要语言和更新日期自动读取。

每次打开网页会读取项目，浏览器缓存有效期为 5 分钟；点击“刷新项目”绕过缓存。添加或移除主题后，可点击该按钮更新（GitHub 数据可能存在短暂延迟）。页面不会后台定时刷新。

无需令牌或后端。GitHub 接口受网络和匿名请求限流影响，失败时显示重试提示，不展示过期缓存。禁止将访问令牌写入网页。

运行逻辑测试：`node --test projects.test.cjs`。
