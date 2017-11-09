const models = require('./db');
const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const router = express.Router();
const getDataId = require('./addMongodb')
const path = require('path');

//用户注册
router.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  next();
});
router.post('/userApi/register', (req, res) => {
  if(!req.body.mobile){
    res.send({code:2011,data:null,msg:'手机号码错误'})
    return;
  }
  function savAccount(userId){
    let newAccount = new models.register({
      name: req.body.name,
      userId:userId,
      time: new Date(),
      mobile: req.body.mobile,
      email:req.body.exports,
      pass: req.body.pass
    });
    newAccount.save((err, data) => {
      if (err) {
        res.send(err)
      } else {
        res.send({code:0,data:null,  msg:'你的信息注册成功'})
      }
    })
  }
  models.register.find({mobile: req.body.mobile},function(err,data){
    if(err){
      console.log(err)
    }else{
      if(data.length){
        res.send({code:2011,data:null,msg:'你的信息已存在，请去登录'})
      }else{
        getDataId('userid',res).then((id) => {
          savAccount(id)
        })
      }
    }
  })
});
//用户登录
router.post('/userApi/login', (req, res) => {
  var findLogin=function(obj,callback){
    models.register.find(obj,function(err,data){
      if(err){
        console.log(err)
      }else{
        callback&&callback(data)
      }
    })
  }
  findLogin({mobile: req.body.mobile},function(data){
    if(!data.length){
      res.send({code:2012,data:null,msg:'你信息不存在请去注册'})
    }else{
      findLogin({mobile: req.body.mobile,pass:req.body.pass},function(data){
        if(!data.length){
          res.send({code:2014,data:null,msg:'用户名或密码错误登录失败'})
        }else{
          res.send({code:0,data:data[0],msg:'登录成功'})
        }
      })
    }
  })
});
//删除用户
router.post('/userApi/remove', (req, res) => {
  models.register.remove({_id: req.body.id},function(err,data){
    if(err){
      console.log(err)
    }else{
      res.send({code:0,data:null,msg:'删除成功'})
    }
  })
});
//修改密码
router.post('/userApi/update', (req, res) => {
  models.register.update({mobile: req.body.mobile},{$set:{pass:req.body.pass}},function(err,data) {
    if (err) {
      console.log(err)
    } else {
      if(data.nModified){
        res.send({code: 0, data: data, msg: '更新成功'})
      }else{
        res.send({code: 2018, data: data, msg: '你的密码和原密码一至'})
      }
    }
  });
});
/*分页*/
router.post('/userApi/list', (req, res) => {
  var name = req.body.name;
  var queryList;
  if(name){
    queryList={name:name}
  }else{
    queryList={}
  }
  var sort = req.body.sort||1;
  var limit = parseInt(req.body.pageSize);
  var skip = (parseInt(req.body.pageNum)-1) * limit;
  var json = {};
  if(sort){
    json['time'] = sort;
  }
  var query = models.register.find(queryList).skip(skip).limit(limit).sort(json);
  query.find(function (err, data) {
    if (err) {
      res.send(err)
    } else {
      res.send(data)
    }
  })
})
module.exports = router;
