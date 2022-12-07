require('dotenv').config()
console.log(process.env.NT_TEST);
const NotionAPI = require('./module/db.js');
const nClient = new NotionAPI();

const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/timezone'))
dayjs.extend(require('dayjs/plugin/utc'))
dayjs.tz.setDefault('Asia/Tokyo')

const now = dayjs(); // 現在の日付情報を取得

console.log(`現在時間`,now.format());

// Initializing a client
const main = async () => {
    const items = await nClient.getDBbyClass('po-07');
    // console.log(items.properties.Name);

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

    const editTimeJP = dayjs(updateList[1].block.last_edited_time).format('YYYY-MM-DD HH:mm:ss');
    // console.log()
    console.log(`[${updateList[1].studentName}]さんの最終更新は${editTimeJP}です。 内容は「${updateList[1].block.text}」`);
}

main();