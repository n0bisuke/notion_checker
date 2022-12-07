require('dotenv').config()

const NotionAPI = require('./module/db.js');
const discrod = require('./module/discord.js');
const nClient = new NotionAPI();

const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/timezone'));
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.tz.setDefault('Asia/Tokyo');
dayjs.extend(require('dayjs/plugin/isBetween'));

// Initializing a client
const main = async () => {
    const items = await nClient.getDBbyClass('po-07');

    const users = [];
    for await (const item of items) {
      const blockId = item.id;
      const items = await nClient.getBlocks(blockId);
      items.results.studentName = item.properties.Name.title[0].plain_text; //名前
      users.push(items.results);
    }
    
    //更新情報一覧
    const updateList = [];
    for await (const user of users) {
      const lastEditedBlock = nClient.getLastEditedBlok(user); //最新の変更があったブロックを取得
      const item = {
        studentName: user.studentName,
        block: lastEditedBlock
      }
      updateList.push(item);
    }

    //時間を確認
    const now = dayjs(); // 現在の日付情報を取得
    const currentTime = now.tz().format('YYYY-MM-DD HH:mm:ss');
    const towHAgo = dayjs(currentTime).subtract(2, 'h').format(); //2時間前の時間
    console.log(`現在時間:`,currentTime);
    console.log(`2時間前：`, towHAgo);

    for (update of updateList){
      
      const editTimeJP = dayjs(update.block.last_edited_time).tz().format('YYYY-MM-DD HH:mm:ss');
      if(dayjs(editTimeJP).isBetween(towHAgo, currentTime)){
        console.log(`2時間以内の変更:`);
        const text = `[${update.studentName}]さんの最終更新は${editTimeJP}です。 内容は「${update.block.text}」`;
        const discordPostData = {
            username: 'Notion通知',
            content: text
        }
        await discrod(discordPostData);
        console.log(text);
      }else{
        console.log(`それ以外:`);
      }

    }
}

main();