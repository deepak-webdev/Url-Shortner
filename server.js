'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const dns = require('dns')
const bodyParser = require('body-parser')
var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended:false}))

app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


const urls = [];
let id =0;

app.post('/api/shorturl/new',(req,res)=>{
  
  let {url}= req.body;
  
  const notHttps = url.replace(/^https?:\/\//,'')
//   check if its valid
  dns.lookup(notHttps,(err,address,family)=>{
    if(err){
      return res.json({
        error:"Invalid URL"
      })
    }
    else{
      id++;
      
      const newShorturl = {
        original_url:url,
        short_url:id
      }
      urls.push(newShorturl);
      res.json(newShorturl)
    }
  })
})
  
// your first API endpoint... 
app.get("/api/shorturl/:id", function (req, res) {
  const {id} = req.params;
  const shortUrl = urls.find(link => link.short_url ==id)
  if(shortUrl){
      return res.redirect(shortUrl.original_url)
  }else{
    return res.json({
      error:'No short url'
    })
  }
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});