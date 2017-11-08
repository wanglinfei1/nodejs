/**
 * Created by wanglinfei on 2017/11/2.
 */
const express = require('express');
const apiRouter = express.Router()
const axios = require('axios')
const sign = require('./sign')
const appId = '1106438561';

var getQQFM = function (req, res) {
  let baseUrl = 'http://api.fm.qq.com'
  let url = '/v1/category/get_category_list'
  let params = {
    appid: appId,
    format: 'json',
    deviceid: '867079010985428',
    category_id:0
  };
  let sig = sign(url, params);
  params.sig = sig;
  axios.get(baseUrl + url, {
    params: params
  }).then(response => {
    console.log(response.data)
  }).catch(error => {
    console.log(error)
  })
}
getQQFM()
/*module.exports = apiRouter;*/
