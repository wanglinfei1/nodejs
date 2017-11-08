// Schema、Model、Entity或者Documents的关系请牢记，
//Schema生成Model，Model创造Entity，
//Model和Entity都可对数据库操作造成影响，
//但Model比Entity更具操作性。
const mongoose = require('mongoose');
// 连接数据库 如果不自己创建 默认test数据库会自动生成
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test',{
    useMongoClient: true,
});
// 为这次连接绑定事件
const db = mongoose.connection;
db.once('error',() => console.log('Mongo connection error'));
db.once('open',() => console.log('Mongo connection successed'));

const addOauthInfoSchema=mongoose.Schema({
    city:String,
    country:String,
    headimgurl:String,
    language:String,
    nickname:String,
    openid:String,
    privilege:Array,
    province:String,
    sex:Number,
    time:Date
});
const registerSchema=mongoose.Schema({
    name: String,
    time: Date,
    mobile: String,
    email: String,
    pass: String
});
const useridsSchema=mongoose.Schema({
  name: String,
  userId:Number,
  stockId:Number
});
useridsSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};
const stockSchema=mongoose.Schema({
    id: Number,
    name: String,
    time: Date,
    price: Number,
    rating: Number,
    desc: String,
    categories: Array
});
/************** 定义模型Model **************/
const Models = {
    addOauthInfo: mongoose.model('addOauthInfo',addOauthInfoSchema,'addOauthInfo'),
    register:mongoose.model('register',registerSchema,'register'),
    userids:mongoose.model('userids',useridsSchema,'userids'),
    stock:mongoose.model('stock',stockSchema,'stock')
}
module.exports = Models;
