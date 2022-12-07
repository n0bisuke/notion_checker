const { Client } = require("@notionhq/client")
const studentDBId = process.env.NT_STUDENT_DB_ID; //自身の利用するデータベースID
const notion = new Client({auth: process.env.NT_API_KEY}); //Notion API KEY

class NotionAPI {
    #privatemethod() {
      return "privatemethod";
    }

    getLastEditedBlok(obj){
        //ソート
        const sorted = Object.keys(obj).map(function(key) {
            return obj[key];
        }).sort(function(a, b) {
            return (a.last_edited_time > b.last_edited_time) ? -1 : 1;  //オブジェクトの昇順ソート
        });
        
        //ソートして最新の1件
        const lastEditedBlock = sorted[0];
        // console.log(lastEditedBlock);
        // // console.log(`------`);

        const result = {};
        result.type = lastEditedBlock.type;
        result.content = lastEditedBlock[result.type];

        if(result.content?.rich_text){
            result.text = result?.content?.rich_text[0].plain_text;
        }else{
            result.text = '';
        }
        result.last_edited_time = lastEditedBlock.last_edited_time;
        result.body = lastEditedBlock;

        return result; //最新の一つ
    }

    async getBlocks(blockId){
        const res = await notion.blocks.children.list({
            block_id: blockId,
            page_size: 100,
        });

        return res;
    }

    async getDBbyClass(class_slug = `po-07`) {

        const res = await notion.databases.query({
            database_id: studentDBId,
            filter: {
              or: [
                {
                  property: '学籍番号',
                  rich_text: {
                    contains: class_slug
                  }
                }
              ],
            },
        });
        const items = res.results;

        return items;
    }
}

module.exports = NotionAPI;