'use strict'

require('dotenv').config()

let URL = '';

if(process.env.CODESPACES){
    URL = process.env.DISCORD_WEBHOOK_URL;
}else if(process.env.GITHUB_ACTIONS){
    URL = process.env.DISCORD_WEBHOOK_URL_CI;
}

const main = async (postData) => {
    //送信するデータ
    // const postData = {
    //     username: 'Notion通知',
    //     content: 'Node.js Fetch APIからポスト'
    // }
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
}

module.exports = main;

// main();