'use strict'

let URL = '';

if(process.env.GITHUB_ACTIONS){
    URL = process.env.DISCORD_WEBHOOK_URL_CI;
}else{
    //ローカル
    URL = process.env.DISCORD_WEBHOOK_URL;
}

const main = async (postData) => {
    try {
        //送信するデータ
        // const postData = {
        //     username: 'Notion通知',
        //     content: 'Node.js Fetch APIからポスト'
        // }
        // console.log(`----`, URL);
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });

        // const json = await response.json();
        console.log(response.status);
        return response.status;
    } catch (error) {
        throw new Error(`エラーが発生しました。`,error);
    }
}

module.exports = main;

// main();