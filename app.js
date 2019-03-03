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
var getIP = require('ipware')().get_ip;
let error =  require("./class/error.js");
let errorL = require("./class/errorList.js");
let errorList = new errorL();
let testy =[];
let wyniki =[];
var con =  mysql.createConnection({
    host: "localhost",
    user: "nodejs",
    password: "qwerty",
    database: "testynew",
    charset: 'utf8',
    debug: false
  });
  con.connect(function(err) {
    if (!err)
    console.log("Connected!");
    else
    console.log(err);
    errorList.error_List.push(new error("Błąd podczas połaczenia z bazą danych\n"+err,"mysql_connect"));
  });


var admin = require("./routes/admin");
admin.setMysql(con)
admin.setList(errorList)
admin.setTesty(testy);
admin.setWyniki(wyniki)
var user = require("./routes/uczen");
user.setMysql(con);
user.setList(errorList)
user.setTesty(testy);
user.setWyniki(wyniki)
var isAdmin=function(req,res,next)
{
  if((req.session.isLogin == true && req.session.isAdmin == true && req.session.name)||(req.session.isLogin == true && req.session.isDebug == true && req.session.name))
  {
    return next();
  }
  else
  {
    console.log("Brak uprawnień!");
    res.redirect("/");
  }
}
var isUser=function(req,res,next)
{
  if((req.session.isLogin == true && req.session.isUser == true && req.session.name)||(req.session.isLogin == true && req.session.isDebug == true && req.session.name))
  {
    return next();
  }
  else
  {
   // console.log("Brak uprawnień!");
    res.redirect("/");
  }
}
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
app.use(function(req,res,next)
{
  errorList.page_List.push(new error(req.method+" "+req.url+" "+req.connection.remoteAddress+" Data: "+JSON.stringify(req.body),"Ładowanie strony"));
  next();
});
app.get('/', function(req, res, next) {
  let error = req.session.loginError;
  req.session.loginError = "";
  res.render('index', {err: error});
});
app.get("/wyloguj",(req,res)=>{
  req.session.isLogin = false;
  req.session.isAdmin = false;
  req.session.isUser = false;
  req.session.isDebug = false;
  req.session.testID = false;
  req.session.name = ""
  res.redirect("/");
})
app.all('/administrator*',isAdmin, admin);
app.all("/uczen*",isUser,user);
app.get('/logowanie/:typ',(req,res,next)=>{
  let error = req.session.loginError;
  req.session.loginError = "";
if(req.params.typ == "administrator")
  res.render('logowanieAdmin',{title: "Logowanie administrator",href: "/login/admin",err : error,typ:"text"});
  else if(req.params.typ == "debug")
  res.render('logowanieAdmin',{title: "Logowanie debug",href: "/login/debug",err : error,typ:"password"});
 else
 next(createError(404));
});
app.post("/logowanie",(req,res)=>{
  if(req.body.name != "" && req.body.name )
  {
  req.session.isLogin = true;
  req.session.isAdmin = false;
  req.session.isUser = true;
  req.session.isDebug = false;
  req.session.name = req.body.name
  res.redirect("/uczen");
  errorList.event_List.push(new error("Nazwa: "+req.body.name,"Logowanie ucznia"))
  }
  else
  {
    res.redirect("/");
  }
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
  errorList.event_List.push(new error("Udane "+getIP(req),"Logowanie Administrator"))
}
else
{
  req.session.loginError = "Błędny login lub hasło";
  res.redirect("/logowanie/administrator");
  errorList.event_List.push(new error("Błędne dane logowania! "+getIP(req),"Logowanie Administrator"))
}
})
});

//logowanie do listy błędów i opcji debug
app.post("/login/debug",(req,res)=>{
  if(req.body.login == "DEBUG2019" && req.body.pass == "zaq12wsx")
  {
    req.session.isLogin = true;
    req.session.isAdmin = false;
    req.session.isUser = false;
    req.session.isDebug = true;
    req.session.name = "Administrator"
    res.redirect("/debug/Panel");
    errorList.event_List.push(new error(""+getIP(req),"Logowanie DEBUG"))
  }
  else
  {
    req.session.loginError = "Błędny login lub hasło";
    res.redirect("/logowanie/administrator");
    errorList.event_List.push(new error("Błędne dane logowania! "+getIP(req),"Logowanie DEBUG"))
  }
  });
app.get("/debug/panel",(req,res)=>{
res.json(errorList)
  });
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
  errorList.error_List.push(new error("nie znaleziono strony: "+req.url,"Not faound"))
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