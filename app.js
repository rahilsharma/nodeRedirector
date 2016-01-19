var express = require('express');
var http = require('http');
var app = express();
var urls = ["http://livestock.cloudaccess.net","http://talkoot.in","http://sensexniftytrading.co.in","http://sensexniftytrading.in","http://sensexniftytrading.biz"];
var curNum = 0;
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.get('/doreq',function(req,res){
  var query = req.query.list;
  curNum =curNum + 1;
  if (curNum==5){
    curNum = 0;
  }
  res.redirect(urls[curNum] + "/app_list_quote.php?list=" + query);
});
app.listen(3030);
console.log('Running on http://localhost:' + 3030);


