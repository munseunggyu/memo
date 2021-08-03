const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const MongoClient = require('mongodb').MongoClient
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs')
app.use('/public',express.static('public'))
app.use(methodOverride('_method'))
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 
let db
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.qeyqz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
(error,client) => {
  db = client.db('memo')
  if(error) {return console.log(error);}
  app.listen('5050',() => console.log('5050'))
})


app.get('/',(req,res) => {
  db.collection('write').find().toArray((error,result) => {
    res.render('index.ejs',{writes:result})
  })
})
app.get('/index',(req,res) => {
  res.sendFile(__dirname + '/index.html')
})
app.get('/list',  (req, res) => {
  db.collection('write').find().toArray(function (error, result) {
    res.render('list.ejs', {writes: result})
  })
})

app.get('/write',(req,res) => {
  res.render('write.ejs')
})


app.post('/add', (req, res) => {
  
  db.collection('counter').findOne({name: '갯수'}, 
  function (error, result) {
    const count = result.total
    db.collection('write').insertOne({
      _id: count + 1,
      title: req.body.title,
      contents: req.body.contents
    }, function (error, result) {
      console.log('저장완료')
      db.collection('counter').updateOne({name: '갯수'}, {$inc: { total: 1}
      }, function (error, result) {
        if (error) {
          return console.log(error)
        }
        res.redirect('/')
      })
    });
  })
})

app.delete('/delete',(req,res) =>{
  req.body._id = parseInt(req.body._id)
  db.collection('write').deleteOne(req.body,(error,result) => console.log('삭제완료'))
})

app.get('/detail/:id',(req,res) => {
  db.collection('write').findOne({_id:parseInt(req.params.id)},(error,result) =>{
    res.render('detail.ejs',{writes:result})
  })
})

app.get('/edit/:id',(req,res) => {
  db.collection('write').findOne({_id:parseInt(req.params.id)},(error,result) =>{
    res.render('edit.ejs',{writes:result})
  })
})
app.put('/edit',(req,res) => {
  db.collection('write').updateOne({_id : parseInt(req.body.id)},{$set : {
    title: req.body.title,
    contents:req.body.contents
  }},(error,result) => {
    console.log('수정완료')
    res.redirect('/')
  })
})

app.get('/search', (req, res)=>{
  var 검색조건 = [
    {
      $search: {
        index: 'title',
        text: {
          query: req.query.value,
          path: 'title'
        }
      }
    }
  ] 
  db.collection('write').aggregate(검색조건).toArray((error, result)=>{
    res.render('search.ejs', {writes : result})
  })
})
