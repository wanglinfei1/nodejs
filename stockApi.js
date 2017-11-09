/**
 * Created by wanglinfei on 2017/9/25.
 */
const models = require('./db');
const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const router = express.Router();
const getDataId = require('./addMongodb')

router.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  next();
});
router.get('/stockApi/stock/:id',(req,res) => {
  var stockId = req.params.id
  models.stock.find({id:stockId},(err,data) => {
    if(err){
      console.log(err)
    }else{
      res.send({code:0,data:data[0],  msg:'请求成功'})
    }
  })
})

router.post('/stockApi/create',(req,res) => {
  var stock=new Stock(req.body)
  //console.log(stock)
  function savStock(stockId){
    let savStock = new models.stock({
      id: stockId,
      name: stock.name,
      time:new Date(),
      price: stock.price,
      rating: stock.rating,
      desc: stock.desc,
      categories: stock.categories
    });
    savStock.save((err, data) => {
      if (err) {
        res.send(err)
      } else {
        res.send({code:0,data:data,  msg:'添加成功'})
      }
    })
  }
  function updata() {
    stock.time=new Date()
    models.stock.update({id: stock.id},{$set:stock},function(err,data) {
      if (err) {
        console.log(err)
      } else {
        res.send({code:0,data:data,  msg:'更新成功'})
      }
    });
  }
  models.stock.find({id:stock.id},(err,data) => {
    if(err){
      console.log(err)
    }else{
      if(data.length){
        updata()
      }else{
        getDataId('stockId',res).then((id) => {
          stock.id=id
          savStock(id)
        })
      }
    }
  })
})
/*分页查询列表*/
router.post('/stockApi/list', (req, res) => {
  var name = req.body.name;
  var queryList;
  if(name){
    queryList={name:name}
  }else{
    queryList={}
  }
  var sort = req.body.sort||1;
  var limit = parseInt(req.body.pageSize); //页数
  var skip = (parseInt(req.body.pageNum)-1) * limit; //页码
  var json = {};
  if(sort){
    json['time'] = sort;
  }
  var total
  models.stock.find(queryList,(err,data) => {
    total = data.length;
  })
  var query = models.stock.find(queryList).skip(skip).limit(limit).sort(json);
  query.find(function (err, data) {
    if (err) {
      res.send(err)
    } else {
      //console.log(data)
      res.send({code:0,data:data,  msg:'请求成功',total:total})
    }
  })
})
//删除用户
router.post('/stockApi/delete', (req, res) => {
  models.stock.remove({id: req.body.id},function(err,data){
    if(err){
      console.log(err)
    }else{
      res.send({code:0,data:null,msg:'删除成功'})
    }
  })
});
module.exports = router;

class Stock {
  constructor({id, name, price, rating, desc, categories}) {
    this.id = id;
    this.name= name;
    this.price=price;
    this.rating=rating;
    this.desc=desc;
    this.categories=categories;
  }
}
