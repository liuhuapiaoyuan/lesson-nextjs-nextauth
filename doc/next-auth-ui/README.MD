## 一起干翻next-auth@5.0系列(四): 短信登录集成+自定义UI



## 自定义登录面
1. 自定义登录页面配置
首先我们再`auth.config.ts`中,增加配置:

```javascript
 pages: {
     signIn: "/login",
  },
```

2. 实现自定义登录页面

> 推荐一个快速实现UI的网站 : [uiverse](https://uiverse.io/),直接获得tailwindicss+html片段代码

该页面
创建`src/pages/login/page.tsx` 

```javascript
```

3. 提交登录

4. 注册

5. 第三方账号登录绑定

## 国内习惯改造: 增加短信登录

思路: 通过`Credential`