const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const http = require('http').Server(app);
const jade = require('jade');
const bodyParser = require('body-parser');
var mysql = require('mysql');
const session = require('express-session');
var con =  mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testynew",
    charset: 'utf8',
    debug: false
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

var usersRouter = require('./routes/users');
var admin = require("./routes/admin");
admin.setMysql(con)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html',jade.__express)
app.use(logger('dev')); //debug mode
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 9999009 } }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res, next) {
  let error = req.session.loginError;
  req.session.loginError = "";
  res.render('index', {err: error});
});
app.all('/administrator*', admin);
app.get('/logowanie/:typ',(req,res,next)=>{
  let error = req.session.loginError;
  req.session.loginError = "";
if(req.params.typ == "administrator")
  res.render('logowanieAdmin',{title: "Logowanie administrator",href: "/login/admin",err : error});
  else if(req.params.typ == "debug")
  res.render('logowanieAdmin',{title: "Logowanie debug",href: "/login/debug",err : error});
 else
 next(createError(404));
});


//logowanie administratora
app.post("/login/admin",(req,res)=>{
let query = "SELECT * FROM `opcje` WHERE `content`='"+req.body.login+"' AND `alternContent`='"+req.body.pass+"' AND `title`='rootLog'"
con.query(query,(err,data)=>{
if(data.length >0)
{
  req.session.isLogin = true;
  req.session.isAdmin = true;
  req.session.isUser = false;
  req.session.isDebug = false;
  req.session.name = "Administrator"
  res.redirect("/administrator");
}
else
{
  req.session.loginError = "Błędny login lub hasło";
  res.redirect("/logowanie/administrator");
}
})
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.listen(app.get('port'),function(){
  console.log('Serwer Express nasłuchuje na porcie : http:192.168.0.100:'+app.get('port'));
});