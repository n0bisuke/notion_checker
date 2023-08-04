const fs = require('fs');
const LOGFILE_NAME = `log.json`;

//日本時間
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

module.exports = () => {
    //ロギング
    const logjson = {
	    msg: 'success',
	    time: dayjs().tz().format()
    };
    
    fs.writeFileSync(LOGFILE_NAME, JSON.stringify(logjson));
    console.log(`log done--`);
}