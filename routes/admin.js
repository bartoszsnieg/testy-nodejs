var express = require('express');
var router = express.Router();
//const mysql = require("../class/mysql.js").init();
let mysql;
router.setMysql = function(mysql1)
{
mysql = mysql1;
}
/* GET home page. */
router.get("/administrator",(req,res)=>{
res.render('admin/indexAdmin',{name: "Admin"});
});
router.get("/administrator/testy/szukaj/:name",(req,res)=>{
    let query;
    var dane =null;
    if(req.params.name == "all")
        query="SELECT * FROM `testy`";
    else
        query="SELECT * FROM `testy` WHERE `name`='"+req.params.name+"'";

    mysql.query(query,(err,data)=>{
        res.render('admin/testy',{name: "Admin",data: data,nameT: req.params.name});
        console.log(data);
    });
    });
    router.get("/administrator/testy/szukaj",(req,res)=>{
        let query="SELECT * FROM `testy`";
        mysql.query(query,(err,data)=>{
            res.render('admin/testy',{name: "Admin",data: data,nameT: ""});
            //console.log(data);
    });
    });
    router.get("/administrator/testy/dodaj",(req,res)=>{
        let a =req.session.addError;
        let b=req.session.addOpis;
        let c =req.session.addCorecct;
        req.session.addOpis = "";
        req.session.addError = "";
        req.session.addCorecct="";
        res.render('admin/addTesty',{name: "Admin",err: a,data: b,alert:c});
        
    });
    router.post("/administrator/testy/dodaj",(req,res)=>{
        let query = "INSERT INTO `testy` (`id`, `name`, `ile`, `opis`) VALUES (NULL,"
        if(req.body.name != "")
        {
            mysql.query("SELECT * FROM `testy` WHERE `name`='"+req.body.name+"'",(err,data)=>{
                if(data.length == 0)
                {
                    query+="'"+req.body.name+"','0'"
                    if(req.body.about != "")
                    query+=",'"+req.body.about+"');"
                    else
                    query+=",NULL);";
                    console.log(query);
                    mysql.query(query,(err,data)=>{
                        if(!err)
                        req.session.addCorecct = "Test został dodany pomyślnie"
                        else
                        req.session.addCorecct = "Coś poszło nie tak!"
                        res.redirect("/administrator/testy/dodaj");
                    })
                }else
                {
                    req.session.addError ="Istnieje test o takiej nazwie!"
                    if(req.body.about != "")
                    req.session.addOpis = req.body.about;
                    res.redirect("/administrator/testy/dodaj");
                    
                }
            });
        }else
        {
            res.redirect("/administrator/testy/dodaj");
        }
    });
module.exports = router;
