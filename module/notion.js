const { Client } = require("@notionhq/client")
const studentDBId = process.env.NT_STUDENT_DB_ID; //自身の利用するデータベースID
const notion = new Client({auth: process.env.NT_API_KEY}); //Notion API KEY

class NotionAPI {
    // #privatemethod() {
    //   return "privatemethod";
    // }

    async getUserById(userId){
        const response = await notion.users.retrieve({ user_id: userId });
        // console.log(response);
        return response;
    }

    async getLastEditedBlok(obj){
        //ソート
        const sorted = Object.keys(obj).map(function(key) {
            return obj[key];
        }).sort(function(a, b) {
            return (a.last_edited_time > b.last_edited_time) ? -1 : 1;  //オブジェクトの昇順ソート
        });
        console.log(sorted);
        console.log(`---`)

        //ソートして最新の1件
        const lastEditedBlock = sorted[0];
        const editedUser = await this.getUserById(lastEditedBlock.last_edited_by.id); //最終更新者

        // console.log(lastEditedBlock);
        // console.log(`------`);
        // // console.log(editedUser.name);
        // console.log(`/////////`);

        const result = {};

        result.type = lastEditedBlock.type;
        result.content = lastEditedBlock[result.type];

        result.last_edited_time = lastEditedBlock.last_edited_time;
        result.last_edited_user = editedUser;

        if(result.content?.rich_text && result?.content?.rich_text[0]?.plain_text){
            result.text = result?.content?.rich_text[0].plain_text;
        }else{
            result.text = ''; //うまく取得できなかった
        }

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

    async getDBbyClass(class_slug = `PO0`) {

        const res = await notion.databases.query({
            database_id: studentDBId,
            filter: {
              and: [
                {
                    "property": "学籍番号",
                    "rollup": {
                        "any": {
                            "rich_text": {
                                "contains": class_slug
                            }
                        }
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