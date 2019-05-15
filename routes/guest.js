var express = require('express');
const createError = require('http-errors');
var router = express.Router();
let error =  require("../class/error.js");
let test = require("../class/test.js");
let pytanie = require("../class/pytanieClass.js");
const  { fork }  = require('child_process');
let LocalID =1;
let testList =[];
//const mysql = require("../class/mysql.js").init();
let mysql;
let eventList = [];
let wyniki = [];
router.setMysql = function(mysql1)
{
mysql = mysql1;
}
router.setList = function(list)
{
eventList = list;
}
router.setTesty= function(list)
{
testList = list
}
router.setWyniki= function(list)
{
wyniki = list
}

router.get("/guestmode/egzamin",(req,res)=>{
res.render("guest/egzamin");
});

router.post("/guestmode/get/egzamin",(req,res)=>
{
    //console.log(testList);
res.json(getEgzamin());
});

router.post("/guestmode/save/wynik",(req,res)=>{
    getWynik(req.body.id).odpowiedzi.push({name: req.session.name,pukty:req.body.punkty,max:req.body.max,test_id: req.test_id,procent: req.body.procent});
    req.session.isLogin = false;
    req.session.isAdmin = false;
    req.session.isUser = false;
    req.session.isGuest = false;
    req.session.isDebug = false;
    req.session.testID = false;
    req.session.name = ""
    res.json({});
});


function getEgzamin()
{
    let aa = null
    for(let i=0;i<testList.length;i++)
    {
        if(testList[i].guestMode == true)
        {
            aa = testList[i];
            break;
        }
    }
    return aa;
  
}

function getWynik(a)
{
    let aa = null
    for(let i=0;i<wyniki.length;i++)
    {
        if(wyniki[i].id == parseInt(a))
        {
            aa = wyniki[i];
            break;
        }
    }
    return aa; 
}

router.use(function(req, res, next) {
    next(createError(404));
  });

module.exports = router;
