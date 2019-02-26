var express = require('express');
const createError = require('http-errors');
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

    router.get("/administrator/testy/widok/:name",(req,res)=>{
        let query="SELECT * FROM `testy` WHERE `name`='"+req.params.name+"'";
        let testData;
        let pytania;
        mysql.query(query,(err,data)=>{
            if(data.length>0)
            {
            testData = data[0];
            mysql.query("SELECT * FROM `pytania` WHERE `id_testu`="+testData.id,(err,dataa)=>{
                for(let i =0;i<dataa.length;i++)
                {
                    dataa[i].id = codyNumber(dataa[i].id);
                }
                res.render('admin/testV',{name: "Admin",test: testData,pytania: dataa});
            });
            
            }else{
                res.redirect("/administrator/testy/szukaj/"+req.params.name)
            }
        })
    });
    router.get("/administrator/testy/widok/:name/:pytanie",(req,res)=>{
        let query="SELECT * FROM `testy` WHERE `name`='"+req.params.name+"'";
        let testData;
        let pytania;
        mysql.query(query,(err,data)=>{
            if(data.length>0)
            {
            testData = data[0];
            mysql.query("SELECT * FROM `pytania` WHERE `id_testu`="+testData.id+" AND `tresc` LIKE '%"+req.params.pytanie+"%'",(err,dataa)=>{
                res.render('admin/testV',{name: "Admin",test: testData,pytania: dataa,query: req.params.pytanie});
            });
            
            }else{
                res.redirect("/administrator/testy/szukaj/"+req.params.name)
            }
        })
    });

    router.get("/administrator/pytanie/dodaj/:name",(req,res)=>{
        let q = req.session.addPError;
        req.session.addPError ="";
        res.render('admin/pytanieAdd',{name: "Admin",testName:req.params.name,alert: q});
    });
    router.get("/administrator/pytanie/edytuj/:name",(req,res,next)=>{

        mysql.query("SELECT * FROM `pytania` WHERE `id`="+decodyText(req.params.name),(err,data)=>{
            console.log(data);
            if(data.length>0)
            res.render('admin/editP',{name: "Admin",pytanie: data[0]});
            else
            next(createError(404));
        })
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

    router.post("/administrator/pytanie/dodaj/:name",(req,res)=>{
        let id;
        mysql.query("SELECT id FROM `testy` WHERE `name`='"+req.params.name+"'",(err,data)=>{
            if(data.length>0)
            {
            id = data[0].id;
            if(req.body.tresc != "" && req.body.odpA != "" && req.body.odpB != "" && req.body.odpC != "" && req.body.odpD != "" && req.body.poprawne != "")
            {
                mysql.query("SELECT * FROM `pytania` WHERE `id_testu`="+id+" AND `tresc`='"+req.body.tresc+"'",(err,data)=>{
                    if(data.length == 0)
                    {
                        let query = "INSERT INTO `pytania`(`id`, `id_testu`, `tresc`, `odpA`, `odpB`, `odpC`, `odpD`, `poprawna`, `imgW`, `imgH`, `imgSrc`, `autor`, `autorAdres`) VALUES "
                        query+="(NULL,"+id+",'"+req.body.tresc+"','"+req.body.odpA+"','"+req.body.odpB+"','"+req.body.odpC+"','"+req.body.odpD+"',"+req.body.poprawne+",NULL,NULL,NULL,'"+req.session.name+"','"+convertToadress(req.session.name)+"')";
                        mysql.query(query,(err,data)=>{
                            if(!err)
                            {
                                req.session.addPError = "Pytanie zostało dodane pomyślnie!";
                                res.redirect("/administrator/pytanie/dodaj/"+req.params.name); 
                            }else
                            {
                                req.session.addPError = "Coś poszło nie tak!!";
                                res.redirect("/administrator/pytanie/dodaj/"+req.params.name); 
                            }
                        });
                    }else
                    {
                        req.session.addPError = "Istnieje już pytanie o takiej treści!";
                        res.redirect("/administrator/pytanie/dodaj/"+req.params.name);  
                    }
                });
            }else
            {
                res.redirect("/administrator/pytanie/dodaj/"+req.params.name); 
            }
            }
            else
            res.redirect("/administrator/testy/szukaj");
        });
    });
    function convertToadress(a)
    {
        let b ="";
        for(let i =0;i<a.length;i++)
        {
            if(a[i]!=" ")
            {
                b+=a[i];
            }else
            {
                b+="+";
            }
        }
        return b;
    }
    function codyNumber(g)
    {
        let a = g.toString();
        let b="";
        for(let i =0;i<a.length;i++)
        {
            switch (a) {
                case '1':
                    b+="q"
                    break;
                case '2':
                    b+="x"
                    break;
                case '3':
                    b+="a"
                    break;
                case '4':
                    b+="h"
                    break;
                case '5':
                    b+="l"
                    break;
                case '6':
                    b+="p"
                    break;
                case '7':
                    b+="n"
                    break;
                case '8':
                    b+="g"
                    break;
                case '9':
                    b+="y"
                    break;
                case '0':
                    b+="u"
                    break;
                default:
                return false;
                    break;
            }
        }
        return b;
    }
    function decodyText(g)
    {
        let a = g.toString();
        let b="";
        for(let i =0;i<a.length;i++)
        {
            switch (a) {
                case "q":
                    b+='1'
                    break;
                case 'x':
                    b+="2"
                    break;
                case 'a':
                    b+="3"
                    break;
                case 'h':
                    b+="4"
                    break;
                case 'l':
                    b+="5"
                    break;
                case 'p':
                    b+="6"
                    break;
                case 'n':
                    b+="7"
                    break;
                case 'g':
                    b+="8"
                    break;
                case 'y':
                    b+="9"
                    break;
                case 'u':
                    b+="0"
                    break;
                default:
                return false;
                    break;
            }
        }
        return parseInt(b);
    }


   router.use(function(req, res, next) {
        next(createError(404));
      })
module.exports = router;
