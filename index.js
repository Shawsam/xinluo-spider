const mongoose = require("mongoose")
const promise = require('q')
const DB_URL = 'mongodb://127.0.0.1:28888/studio'

const fetchIndexData = require('./task/fetchIndexData')
const fetchCateData  = require('./task/fetchCateData')


//连接数据库
mongoose.Promise = promise.Promise
mongoose.connect(DB_URL,{useMongoClient:true});
mongoose.connection.on('connected', function () {
    console.log("数据库连接成功！");

    fetchCateData()
});



