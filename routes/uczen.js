//2019 © Bartosz Śnieg
var express = require('express');
const createError = require('http-errors');
var router = express.Router();
let error =  require("../class/error.js");
const  { fork }  = require('child_process');
let eventList;
let mysql;
let testList =[];
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

router.get("/uczen",(req,res)=>{
res.render("uczen/indexUczen",{name: req.session.name})
});

router.get("/uczen/testy/edytuj",(req,res)=>{
    let q = req.session.error;
    req.session.error = "";
    mysql.query("SELECT * FROM `testy` WHERE `edit`=1",(err,data)=>{
        if(!err)
        {
            res.render("uczen/testEditlist",{name: req.session.name,data: data,alert:q})
        }
        else
        {
            res.render("uczen/testEditlist",{name: req.session.name,data: null,alert:"Błąd w połączeniu z bazą danych!"})
        }
    });
});

router.get("/uczen/testy/edytuj/:name",(req,res)=>{
    mysql.query("SELECT * FROM `testy` WHERE `edit`=1 AND `name` LIKE '%"+req.params.name+"%';",(err,data)=>{
    if(!err)
    {
        res.render("uczen/testEditlist",{name: req.session.name,data: data})
    }
    else
    {
        res.render("uczen/testEditlist",{name: req.session.name,data: null,alert:"Błąd w połączeniu z bazą danych!"})
    }
    });
});

router.get("/uczen/testy/widok/:name",(req,res)=>{
    let alert = req.session.error;
    req.session.error = "";
    mysql.query("SELECT * FROM `testy` WHERE `edit`=1 AND `name`='"+req.params.name+"'",(err,data)=>{

        if(!err)
        {
            if(data.length>0)
            {
                mysql.query("SELECT * FROM `pytania` WHERE `id_testu`="+data[0].id,(errr,dataa)=>{
                    if(!errr)
                    {
                        res.render("uczen/testV",{name: req.session.name,test: data[0],pytania: dataa,alert: alert})
                    }
                    else
                    {
                        req.session.error = "Błąd w połączeniu z bazą danych!";
                        res.redirect("/uczen/testy/edytuj")  
                    }
                });
            }
            else
            {
                req.session.error = "Nie znaleziono takiego testu!";
                res.redirect("/uczen/testy/edytuj");
            }
        }
        else
        {
            req.session.error = "Błąd w połączeniu z bazą danych!";
            res.redirect("/uczen/testy/edytuj");
        }

    });
});

router.get("/uczen/testy/widok/:name/:pytanie",(req,res)=>{
    let alert = req.session.error;
    req.session.error = "";
    mysql.query("SELECT * FROM `testy` WHERE `edit`=1 AND `name`='"+req.params.name+"'",(err,data)=>{

        if(!err)
        {
            if(data.length>0)
            {
                mysql.query("SELECT * FROM `pytania` WHERE `id_testu`="+data[0].id+" AND `tresc` LIKE '%"+req.params.pytanie+"%';",(errr,dataa)=>{
                    if(!errr)
                    {
                        res.render("uczen/testV",{name: req.session.name,test: data[0],pytania: dataa,alert: alert,query:req.params.pytanie})
                    }
                    else
                    {
                        req.session.error = "Błąd w połączeniu z bazą danych!";
                        res.redirect("/uczen/testy/edytuj")  
                    }
                });
            }
            else
            {
                req.session.error = "Nie znaleziono takiego testu!";
                res.redirect("/uczen/testy/edytuj");
            }
        }
        else
        {
            req.session.error = "Błąd w połączeniu z bazą danych!";
            res.redirect("/uczen/testy/edytuj");
        }

    });
});

router.get("/uczen/pytanie/dodaj/:name",(req,res)=>{
    let q = req.session.addPError;
    req.session.addPError ="";
    res.render("uczen/pytanieAdd",{name: req.session.name,testName: req.params.name,alert:q})
});

router.get("/uczen/testy/aktualne",(req,res)=>{
    let q = req.session.Error;
    req.session.Error ="";
    res.render("uczen/egzaminy",{name: req.session.name,data: testList,alert:q})  
})

router.get("/uczen/egzamin/:id",(req,res)=>{
    if(isEgzamID(req.params.id))
    {
        req.session.testID = req.params.id;
    res.render("uczen/egzaminTest",{name: req.session.name});
    //console.log(getEgzamin(req.params.id));
    }
    else
    {
        req.session.Error ="Nie znaleziono takiego egzaminu!"; 
        res.redirect("/uczen/testy/aktualne");
    }
});

router.post("/uczen/get/egzamin",(req,res)=>{
    res.json(getEgzamin(req.session.testID))
})

router.post("/uczen/pytanie/dodaj/:name",(req,res)=>{
    let id;
        mysql.query("SELECT id FROM `testy` WHERE `name`='"+req.params.name+"'",(err,data)=>{
            if(err)
            eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - uczen 1: "+req.url));
            if(req.session.name == "" || !req.session.name)
            req.session.name = "Anonim"
            if(data.length>0)
            {
            id = data[0].id;
            if(req.body.tresc != "" && req.body.odpA != "" && req.body.odpB != "" && req.body.odpC != "" && req.body.odpD != "" && req.body.poprawne != "")
            {
                mysql.query("SELECT * FROM `pytania` WHERE `id_testu`="+id+" AND `tresc`='"+req.body.tresc+"'",(err,data)=>{
                    if(err)
                        eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - uczen 1: "+req.url));
                    if(data.length == 0)
                    {
                        let query = "INSERT INTO `pytania`(`id`, `id_testu`, `tresc`, `odpA`, `odpB`, `odpC`, `odpD`, `poprawna`, `imgW`, `imgH`, `imgSrc`, `autor`, `autorAdres`) VALUES "
                        query+="(NULL,"+id+",'"+req.body.tresc+"','"+req.body.odpA+"','"+req.body.odpB+"','"+req.body.odpC+"','"+req.body.odpD+"',"+req.body.poprawne+",0,0,'Brak','"+req.session.name+"','"+convertToadress(req.session.name)+"')";
                        mysql.query(query,(err,data)=>{
                            if(!err)
                            {   mysql.query("UPDATE `testy` SET `ile`=`ile`+1 WHERE `id`="+id,(err,data)=>{
                                    req.session.addPError = "Pytanie zostało dodane pomyślnie!";
                                    res.redirect("/uczen/pytanie/dodaj/"+req.params.name); 
                                });
                                if(req.body.img != "")
                                {
                                    const process = fork('./routes/pobieranie.js');
                                    process.send({nameFile:req.params.name+"-"+data.insertId,adress: req.body.img,pytanieId:data.insertId});
                                    process.on('message', (message) => {
                                        let query = "UPDATE `pytania` SET `imgW`="+message.imgW+",`imgH`="+message.imgH+",`imgSrc`='"+message.nameFile+"' WHERE `id`="+data.insertId;
                                        mysql.query(query,(err,data)=>{
                                            if(err)
                                            eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - Uczeń: (dodawanie img do zdjęcia)"+req.url));
                                        })
                                    });
                                }
                                if(Object.keys(req.files).length != 0)
                                {
                                    console.log(true)
                                    let sampleFile = req.files.img2;
                                    sampleFile.mv(__dirname.substring(0,__dirname.indexOf("\\routes"))+'/public/testy-img/'+req.params.name+"-"+data.insertId+sampleFile.name, function(err) {console.log(err)})
                                    let query = "UPDATE `pytania` SET `imgW`="+0+",`imgH`="+0+",`imgSrc`='"+req.params.name+"-"+data.insertId+sampleFile.name+"' WHERE `id`="+data.insertId;
                                    mysql.query(query,(err,data)=>{
                                        if(err)
                                        eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator: (dodawanie img do zdjęcia)"+req.url));
                                    })
                                }
                            }else
                            {
                                req.session.addPError = "Coś poszło nie tak!!";
                                res.redirect("/uczen/pytanie/dodaj/"+req.params.name); 
                            }
                        });
                    }else
                    {
                        req.session.addPError = "Istnieje już pytanie o takiej treści!";
                        res.redirect("/uczen/pytanie/dodaj/"+req.params.name);  
                    }
                });
            }else
            {
                res.redirect("/uczen/pytanie/dodaj/"+req.params.name); 
            }
            }
            else
            res.redirect("/uczen/testy/edytuj");
        });

});

router.post("/uczen/save/wynik",(req,res)=>{
    getWynik(req.body.id).odpowiedzi.push({name: req.session.name,pukty:req.body.punkty,max:req.body.max,test_id: req.test_id,procent: req.body.procent});
});

router.post("/uczen/get/wyniki",(req,res)=>{
    res.json(getWynik(req.body.id));
})

function isEgzamID(a)
{
    let aa = false;
    for(let i =0;i<testList.length;i++)
    {
        if(testList[i].id == parseInt(a))
        {
            aa = true
            break;
        }
    }
    return aa;
}

function getEgzamin(a)
{
    let aa = null
    for(let i=0;i<testList.length;i++)
    {
        if(testList[i].id == parseInt(a))
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

module.exports = router;
