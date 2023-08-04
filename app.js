require('dotenv').config()

const CLASS = 'PO08'; //今期のクラス

const NotionAPI = require('./module/notion.js');
const discrod = require('./module/discord.js');
const nClient = new NotionAPI();
const logging = require('./module/log.js');

const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/timezone'));
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.tz.setDefault('Asia/Tokyo');
dayjs.extend(require('dayjs/plugin/isBetween'));

// Initializing a client
const main = async () => {
    const items = await nClient.getDBbyClass(CLASS);
    // console.log(items)

    const users = [];

    for await (const item of items) {
      // console.log(item)
      const blocks = await nClient.getBlocks(item.id);
      users.push({
        id: item.id,
        studentName: item.properties.title.title[0].plain_text,
        url: item.url,
        blocks: blocks,
        last_edited_time: item.properties["Last edited time"].last_edited_time,
      });
    }

    //更新情報一覧
    const updateList = [];
    for await (const user of users) {
      console.log(user.blocks);
      const lastEditedBlock = await nClient.getLastEditedBlok(user.blocks.results); //最新の変更があったブロックを取得
      const item = {
        studentName: user.studentName,
        url: user.url,
        block: lastEditedBlock
      }

      updateList.push(item);
    }

    //時間を確認
    const now = dayjs(); // 現在の日付情報を取得
    const currentTime = now.tz().format('YYYY-MM-DD HH:mm:ss');

    const betweenH = 2; //2時間以内
    const oneHAgo = dayjs(currentTime).subtract(betweenH, 'h').format('YYYY-MM-DD HH:mm:ss'); //2時間前の時間
    console.log(`現在時間:`, currentTime);
    console.log(`${betweenH}時間前:`, oneHAgo);
    console.log(`------`)

    let sendMsg = '';
    let lastEditAvater = 'https://i.gyazo.com/8b29a2b82201f0974a42d51cfa6ad66a.png'; //デフォはうこさん

    for (update of updateList){
      
      const editTimeJP = dayjs(update.block.last_edited_time).tz().format('YYYY-MM-DD HH:mm:ss');
      console.log(update.block.last_edited_time,editTimeJP)
      if(dayjs(editTimeJP).isBetween(oneHAgo, currentTime)){
        console.log(`${betweenH}時間以内の変更あり`);
        // console.log(update)
        sendMsg += `[最終更新: ${editTimeJP}] ${update.studentName}さんのNotionページ( ${update.url} )を${update.block.last_edited_user?.name}さんが更新。 ${update.block.text} \n`;
        // console.log(sendMsg);
        lastEditAvater = update.block.last_edited_user?.avatar_url; //Disocrd投稿するアバター
      }else{
        console.log(`${betweenH}時間以内の変更なし`);
        // console.log(`それ以外:`);
      }
    }

    //Discordに投稿
    const discordPostData = {
      avatar_url: lastEditAvater,
      // avatar_url: "https://i.gyazo.com/558634c1c09a399b2c20116c80e75cae.png",
      username: 'Notion通知',
      content: sendMsg
    }
    // await discrod(discordPostData);
    console.log(discordPostData);
    logging();
}

main();