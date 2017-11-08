/**
 * Created by wanglinfei on 2017/9/26.
 */
const models = require('./db');
const ObjectID = require('mongodb').ObjectID;

const getDataId = function(queryInfo,res) {
  return new Promise((reslove,reject) => {
    getUserId().then((data) => {
      reslove(data.value[queryInfo])
    },(data) => {
      savUserId().then((data) => {
        reslove(data[queryInfo])
      },(err) => {
        reject(err)
      })
    })
  })

  function savUserId(userId){
    return new Promise((reslove) => {
      let savUserId = new models.userids({
        name: 'userid',
        [queryInfo]:1,
      });
      savUserId.save((err, data) => {
        if (err) {
          res.send(err)
        } else {
          reslove(data)
        }
      })
    })
  }
  function getUserId() {
    return new Promise((resolve,reject) => {
      models.userids.findAndModify({'name':'userid'},[], { $inc: { [queryInfo]: 1 } }, {'new':true}, function (err,data) {
        if (err) throw err;
        if(data.ok==1&&data.value!=null){
          resolve(data)
        }else{
          reject(data)
        }
      });
    })
  }
}
module.exports = getDataId;
