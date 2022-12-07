require('dotenv').config()

const NotionAPI = require('./module/db.js');
const nClient = new NotionAPI();

// Initializing a client
const main = async () => {
    const items = await nClient.getDBbyClass('po-07');

    const users = [];
    for await (const item of items) {
      const blockId = item.id;
      const items = await nClient.getBlocks(blockId);
      users.push(items.results);
    }

    const user = users[1];
    console.log(users);

    const lastEditedBlock = nClient.getLastEditedBlok(user); //最新の変更があったブロックを取得
    console.log(`${lastEditedBlock.body.last_edited_time}に変更がありました。 -> ${lastEditedBlock.text}`);

}

main();