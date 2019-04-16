const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  Mongosession=require('connect-mongo')(session),  //，申明数据库session,引入模块并传参执行
  //MongoStore  = require("connect-mongo")(session),
  helmet = require('helmet'),
  path = require('path'),
  //conf = require('./conf');
  app = express();

mongoose.connect('mongodb://localhost/w', { useNewUrlParser: true });

mongoose.connection.on('error', e => console.log('连接数据库失败'));
mongoose.connection.once('open', e => console.log('连接数据库成功'));
app.use(helmet());
app.use(session({
  secret: 'emmmm emmmm',
  rolling: true,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true},
  store:new Mongosession({
  	url:'mongodb://localhost/w',   //数据库路径
  }) 
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/layui', express.static(path.join(__dirname, 'public/layui'), {maxAge: 1000*60*60*24*7}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

app.use(require('./router/outapi'));
app.use('/', require('./router/index'));
app.use('/admin', require('./router/admin'));

app.listen(235,function () {
  console.log('http://localhost:235')
});