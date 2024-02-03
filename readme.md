
## 流れ

- DBからクラス指定で学生ごとのレコードを取得
- レコード内のブロック（Notionの中身）を取得
- 最終更新の一件を取得
- 2時間以内に変更があれば通知

## キーたち

```
NT_STUDENT_DB_ID=${{secrets.NT_STUDENT_DB_ID}}
NT_API_KEY=${{secrets.NT_API_KEY}}
DISCORD_WEBHOOK_URL=${{secrets.DISCORD_WEBHOOK_URL}}
DISCORD_WEBHOOK_URL_CI=${{secrets.DISCORD_WEBHOOK_URL_CI}}
```

↓

デバッグの時

```js
if(process.env.CODESPACES){
    URL = process.env.DISCORD_WEBHOOK_URL;
}else if(process.env.GITHUB_ACTIONS){
    URL = process.env.DISCORD_WEBHOOK_URL_CI;
}
```

```
NT_STUDENT_DB_ID=${{secrets.NT_STUDENT_DB_ID}}
NT_API_KEY=${{secrets.NT_API_KEY}}
DISCORD_WEBHOOK_URL=${{secrets.DISCORD_WEBHOOK_URL}}
```

## notion

https://www.notion.so/my-integrations
