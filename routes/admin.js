//2019 © Bartosz Śnieg
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

/* GET method. */
    router.get("/administrator",(req,res)=>{
    res.render('admin/indexAdmin',{name: "Admin"});
    });

    router.get("/administrator/zmiana/hasla",(req,res)=>{
        let q =req.session.error;
        req.session.error="";
        res.render('admin/adminHaslo',{name: "Admin",alert:q});
    });
    router.get("/administrator/testy/szukaj/:name",(req,res)=>{
        let query;
        var dane =null;
        if(req.params.name == "all")
            query="SELECT * FROM `testy`";
        else
            query="SELECT * FROM `testy` WHERE `name` LIKE '%"+req.params.name+"%'";

        mysql.query(query,(err,data)=>{
            res.render('admin/testy',{name: "Admin",data: data,nameT: req.params.name});
            //console.log(data);
        });
    });
    router.get("/administrator/testy/szukaj",(req,res)=>{
        let query="SELECT * FROM `testy`";
        let q =req.session.testError;
        req.session.testError = "";
        mysql.query(query,(err,data)=>{
            res.render('admin/testy',{name: "Admin",data: data,nameT: "",alert: q});
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
        let alert = req.session.editPError
                req.session.editPError="";
        mysql.query(query,(err,data)=>{
            if(data.length>0)
            {
            testData = data[0];
            mysql.query("SELECT * FROM `pytania` WHERE `id_testu`="+testData.id,(err,dataa)=>{
                for(let i =0;i<dataa.length;i++)
                {
                    dataa[i].id = codyNumber(dataa[i].id);
                }
                
                if(req.session.addPError !="")
                {
                    alert = req.session.addPError;
                    req.session.addPError="";
                }
                res.render('admin/testV',{name: "Admin",test: testData,pytania: dataa,alert: alert});
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
                for(let i =0;i<dataa.length;i++)
                {
                    dataa[i].id = codyNumber(dataa[i].id);
                }
                res.render('admin/testV',{name: "Admin",test: testData,pytania: dataa,query: req.params.pytanie});
            });
            
            }else{
                res.redirect("/administrator/testy/szukaj/"+req.params.name)
            }
        })
    });

    router.get("/administrator/pytania/autor/:name",(req,res)=>{
        
        mysql.query("SELECT `pytania`.`id`,`pytania`.`tresc`,`pytania`.`odpA`,`pytania`.`odpB`,`pytania`.`odpC`,`pytania`.`odpD`,`pytania`.`poprawna`,`pytania`.`autor`,`pytania`.`autorAdres`,`testy`.`name` FROM `pytania`,`testy` WHERE `testy`.`id` = `pytania`.`id_testu` AND `autorAdres`='"+req.params.name+"' ORDER BY `pytania`.`id_testu` ASC ",(err,data)=>{
            if(data.length>0)
            {
                for(let i =0;i<data.length;i++)
                {
                    data[i].id=codyNumber(data[i].id)
                }
                res.render('admin/autorP',{name: "Admin",pytania:data,autor: data[0].autor});
            }
            else
            {
                req.session.testError = "Nie znaleziono testów tego autora!"
                res.redirect("/administrator/testy/szukaj")
            }
        });

    });

    router.get("/administrator/pytanie/dodaj/:name",(req,res)=>{
        let q = req.session.addPError;
        req.session.addPError ="";
        res.render('admin/pytanieAdd',{name: "Admin",testName:req.params.name,alert: q});
    });

    router.get("/administrator/pytanie/edytuj/:testname/:name",(req,res,next)=>{
        let q = req.session.addPError;
        req.session.addPError ="";
        mysql.query("SELECT * FROM `pytania` WHERE `id`="+decodyText(req.params.name),(err,data)=>{
            //console.log(data);
            if(data.length>0)
            res.render('admin/editP',{name: "Admin",testid: req.params.name,pytanie: data[0],testname: req.params.testname,alert:q});
            else
            next(createError(404));
        })
    });

    router.get("/administrator/pytanie/usun/:testname/:pytanie",(req,res)=>{
        let q = req.session.dellPError;
        req.session.dellPError ="";
        res.render('admin/dellC',{name: "Admin",alert:q,title: "Czy usunąć pytanie?",adres:"/administrator/pytanie/usun/"+req.params.testname+"/"+req.params.pytanie,cadres:"/administrator/testy/widok/"+req.params.testname})
    });

    router.get("/administrator/test/usun/:name",(req,res)=>{
        let q = req.session.dellPError;
        req.session.dellPError ="";
        res.render('admin/dellC',{name: "Admin",alert:q,title: "Czy usunąć Test?",adres:"/administrator/test/usun/"+req.params.name,cadres:"/administrator/testy/szukaj"});
    });

    router.get("/administrator/test/edit/:name/:status",(req,res)=>{
    mysql.query("SELECT `id` FROM `testy` WHERE `name`='"+req.params.name+"'",(err,data)=>{
        if(!err)
        {
            if(data.length > 0)
            {
                let query = "UPDATE `testy` SET `edit`="
                if(req.params.status == "false")
                {
                    query+=0+" WHERE `id`="+data[0].id;
                }else if(req.params.status == "true")
                {
                    query+=1+" WHERE `id`="+data[0].id;
                }
                mysql.query(query,(err,data)=>{
                    if(!err)
                    {
                        res.redirect("/administrator/testy/widok/"+req.params.name) 
                    }else
                    {
                        req.session.editPError="Wystąpił problem podczas komunikacji z bazą danych!";
                        res.redirect("/administrator/testy/widok/"+req.params.name)
                    }
                });
            }else
            {
                req.session.editPError="Nie znaleziono takiego testu!";
            res.redirect("/administrator/testy/widok/"+req.params.name)
            }
        }else
        {
            req.session.editPError="Wystąpił problem podczas komunikacji z bazą danych!";
            res.redirect("/administrator/testy/widok/"+req.params.name)
        }
    });
    });

    router.get("/administrator/rozpocznij/test/:name",(req,res)=>{
        let q = req.session.error;
        req.session.error ="";
        mysql.query("SELECT * FROM `testy` WHERE `name`='"+req.params.name+"'",(err,data)=>{
            if(!err)
            {
                res.render('admin/testSelect',{name: "Admin",alert:q,nameTest: req.params.name,maxL: data[0].ile});
            }
            else
            {
                req.session.testError = "Wystąpił problem podczas komunikacji z bazą danych";
                res.redirect("/administrator/testy/szukaj"); 
                eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 1: "+req.url)); 
            }
        });
        
    });

    router.get("/administrator/wyniki",(req,res)=>{
        let q = req.session.error
        req.session.error = "";
        res.render('admin/wynikiSelect',{name: "Admin",alert:q,data:wyniki});
    });

    router.get("/administrator/testy/aktualne",(req,res)=>{
        let q = req.session.Error;
        req.session.Error ="";
        res.render("admin/egzaminy",{name: req.session.name,data: testList,alert:q})  
    })

    router.get("/administrator/wyniki/:id",(req,res)=>{
        if(isWynikID(req.params.id))
        {
        req.session.testID = req.params.id;
        res.render('admin/wynik',{name: "Admin",data:getWynik(req.params.id)});
        }
        else
        {
            req.session.error = "Nie znaleziono wyników!";
            res.redirect("/administrator/wyniki");
        }
    });

    router.get("/administrator/egzamin/dell/:id",(req,res)=>{
        dellTest(req.params.id);
        res.redirect("/administrator/testy/aktualne")
    });
    router.get("/administrator/wynik/dell/:id",(req,res)=>{
        dellWynik(req.params.id);
        res.redirect("/administrator/wyniki")
    });

    router.post("/administrator/testy/dodaj",(req,res)=>{
        let query = "INSERT INTO `testy` (`id`, `name`, `ile`, `opis`) VALUES (NULL,"
        if(req.body.name != "")
        {
            mysql.query("SELECT * FROM `testy` WHERE `name`='"+req.body.name+"'",(err,data)=>{
                if(!err)
                {
                if(data.length == 0)
                {
                    query+="'"+req.body.name+"','0'"
                    if(req.body.about != "")
                    query+=",'"+req.body.about+"');"
                    else
                    query+=",NULL);";
                   // console.log(query);
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
            }else
            {
                eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator: "+req.url));
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
            if(err)
                eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 1: "+req.url));
            if(req.session.name == "" || !req.session.name)
            req.session.name = "Anonim"
            if(data.length>0)
            {
            id = data[0].id;
            if(req.body.tresc != "" && req.body.odpA != "" && req.body.odpB != "" && req.body.odpC != "" && req.body.odpD != "" && req.body.poprawne != "")
            {
                mysql.query("SELECT * FROM `pytania` WHERE `id_testu`="+id+" AND `tresc`='"+req.body.tresc+"'",(err,data)=>{
                    if(data.length == 0)
                    {
                        let query = "INSERT INTO `pytania`(`id`, `id_testu`, `tresc`, `odpA`, `odpB`, `odpC`, `odpD`, `poprawna`, `imgW`, `imgH`, `imgSrc`, `autor`, `autorAdres`) VALUES "
                        query+="(NULL,"+id+",'"+req.body.tresc+"','"+req.body.odpA+"','"+req.body.odpB+"','"+req.body.odpC+"','"+req.body.odpD+"',"+req.body.poprawne+",0,0,'Brak','"+req.session.name+"','"+convertToadress(req.session.name)+"')";
                        mysql.query(query,(err,data)=>{
                            if(!err)
                            {   mysql.query("UPDATE `testy` SET `ile`=`ile`+1 WHERE `id`="+id,(err,data)=>{
                                   // console.log("UPDATE `testy` SET `ile`=`ile`+1 WHERE `name`='"+req.params.name+"'")
                                    req.session.addPError = "Pytanie zostało dodane pomyślnie!";
                                    res.redirect("/administrator/pytanie/dodaj/"+req.params.name); 
                                });
                                if(req.body.img != "")
                                {
                                    const process = fork('./routes/pobieranie.js');
                                    process.send({nameFile:req.params.name+"-"+data.insertId,adress: req.body.img,pytanieId:data.insertId});
                                    process.on('message', (message) => {
                                        let query = "UPDATE `pytania` SET `imgW`="+message.imgW+",`imgH`="+message.imgH+",`imgSrc`='"+message.nameFile+"' WHERE `id`="+message.pytanieId;
                                        mysql.query(query,(err,data)=>{
                                            if(err)
                                            eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator: (dodawanie img do zdjęcia)"+req.url));
                                        })
                                    });
                                }
                               
                            }else
                            {
                                req.session.addPError = "Coś poszło nie tak!!";
                                res.redirect("/administrator/pytanie/dodaj/"+req.params.name); 
                                eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 2: "+req.url));
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

    router.post("/administrator/pytanie/edytuj/:testname/:pytanie",(req,res)=>{
        let id;
        mysql.query("SELECT id FROM `testy` WHERE `name`='"+req.params.testname+"'",(err,data)=>{
            if(err)
            eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 1: "+req.url));
            if(data.length>0)
            {
            id = data[0].id;
            if(req.body.tresc != "" && req.body.odpA != "" && req.body.odpB != "" && req.body.odpC != "" && req.body.odpD != "" && req.body.poprawne != "")
            {
                        let query = "UPDATE `pytania` SET `tresc`='"+req.body.tresc+"',`odpA`='"+req.body.odpA+"',`odpB`='"+req.body.odpB+"',`odpC`='"+req.body.odpC+"',`odpD`='"+req.body.odpD+"',`poprawna`="+req.body.poprawne+" WHERE `id`="+decodyText(req.params.pytanie)+" AND `id_testu`="+id;
                        mysql.query(query,(err,data)=>{
                            if(!err)
                            {
                                req.session.editPError = "Pytanie zostało pomyślnie zaktualizowane!";
                                res.redirect("/administrator/testy/widok/"+req.params.testname); 
                            }else
                            {
                                //console.log(query);
                                req.session.addPError = "Coś poszło nie tak!!";
                                res.redirect("/administrator/pytanie/edytuj/"+req.params.testname+"/"+req.params.pytanie); 
                                eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 2: "+req.url));
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

    router.post("/administrator/pytanie/usun/:testname/:pytanie",(req,res)=>{
        let id;
        mysql.query("SELECT `id` FROM `testy` WHERE `name`='"+req.params.testname+"';",(err,data)=>{
            if(!err)
            {
                if(data.length>0)
                {
                    id = data[0].id;
                    mysql.query("DELETE FROM `pytania` WHERE `id`="+decodyText(req.params.pytanie)+" AND `id_testu`="+id,(err,data)=>{
                        if(!err)
                        {
                            mysql.query("UPDATE `testy` SET `ile`=`ile`-1 WHERE `name`='"+req.params.testname+"'",(err,data)=>{
                                //console.log(err);
                                req.session.addPError = "Pytanie zostało usunięte pomyślnie!";
                                res.redirect("/administrator/testy/widok/"+req.params.testname); 
                            });
                        }
                        else
                        {
                            req.session.addPError = "Wystąpił problem podczas usuwania!";
                            res.redirect("/administrator/testy/widok/"+req.params.testname); 
                            eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 2: "+req.url));
                        }

                    });
                }
                else
                {
                    req.session.testError = "Nie znaleziono testu o nazwie: "+req.params.testname;
                            res.redirect("/administrator/testy/szukaj"); 
                }
            }
            else
            {
                req.session.testError = "Wystąpił problem podczas komunikacji z bazą danych";
                            res.redirect("/administrator/testy/szukaj"); 
                            eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 1: "+req.url));
            }
        });
    });

    router.post("/administrator/test/usun/:name",(req,res)=>{
        let id;
        mysql.query("SELECT `id` FROM `testy` WHERE `name`='"+req.params.name+"';",(err,data)=>{
            if(!err)
            {
                if(data.length>0)
                {
                    id = data[0].id;
                    mysql.query("DELETE FROM `testy` WHERE `id`="+id,(err,data)=>{

                        if(!err)
                        {
                            mysql.query("DELETE FROM `pytania` WHERE `id_testu`="+id,(err,data)=>{
                                if(!err)
                                {
                                    req.session.testError = "Test został usunięty!";
                                    res.redirect("/administrator/testy/szukaj");
                                }
                                else
                                {
                                    req.session.testError = "Wystąpił problem podczas usuwania pytań!";
                                    res.redirect("/administrator/testy/szukaj"); 
                                    eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 2: "+req.url)); 
                                }
                            });
                        }else
                        {
                            req.session.testError = "Wystąpił problem podczas usuwania testu!";
                            res.redirect("/administrator/testy/szukaj");    
                        }
                    });
                }
                else
                {
                    req.session.testError = "Nie istnieje taki test!";
                    res.redirect("/administrator/testy/szukaj"); 
                }
            }
            else
            {
                req.session.testError = "Wystąpił problem podczas komunikacji z bazą danych";
                res.redirect("/administrator/testy/szukaj"); 
                eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 1: "+req.url));
            }
        });
    });

    router.post("/administrator/set/test/:name",(req,res)=>{
        let ilosc = req.body.ile;
        let nameTest = req.params.name;
        let testlID;
        mysql.query("SELECT * FROM `testy` WHERE `name`='"+nameTest+"'",(err,data)=>{
            if(!err)
            {
                if(data.length>0)
                {
                    testlID = testList.push(new test(LocalID,data[0].id,ilosc,nameTest));
                    testlID--;
                    wyniki.push({id:LocalID++,testName: req.params.name,odpowiedzi:[]});
                    mysql.query("SELECT * FROM `pytania` WHERE `id_testu`="+data[0].id+" ORDER BY rand() LIMIT "+ilosc+";",(err,result)=>{
                        if(!err)
                        {
                            for(let a =0;a<result.length;a++)
                            {
                                testList[testlID].pytania.push(new pytanie(result[a].id,a+1,result[a].tresc,result[a].odpA,result[a].odpB,result[a].odpC,result[a].odpD,result[a].imgSrc,result[a].poprawna,result[a].imgW,result[a].imgH))
                            }
                            res.redirect("/administrator/wyniki/"+testList[testlID].id);
                            eventList.event_List.push(new error("Dodano nowy test do aktualnych","Testy - administrator: "+req.url)); 
                        }
                        else
                        {
                            req.session.testError = "Wystąpił problem podczas komunikacji z bazą danych";
                            res.redirect("/administrator/testy/szukaj"); 
                            eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 1: "+req.url)); 
                        }
                    });
                }
                else
                {
                    req.session.testError = "Nie istnieje taki test!";
                    res.redirect("/administrator/testy/szukaj"); 
                }

            }
            else
            {
                req.session.testError = "Wystąpił problem podczas komunikacji z bazą danych";
                res.redirect("/administrator/testy/szukaj"); 
                eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 1: "+req.url)); 
            }
        });
    });

    router.post("/administrator/get/wyniki",(req,res)=>{
        console.log(wyniki)
        res.json(getWynik(req.session.testID));
    })

    router.post("/administrator/zmien/haslo",(req,res)=>{
        let query = "SELECT * FROM `opcje` WHERE `content`='"+req.body.login+"' AND `alternContent`='"+req.body.pass+"' AND `title`='rootLog'";
        mysql.query(query,(err,data)=>{
            if(err)
            {
                req.session.error = "Wystąpił problem podczas komunikacji z bazą danych";
                res.redirect("/administrator/zmiana/hasla"); 
                eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 1: "+req.url)); 
            }
            else
            {
                if(data.length>0)
                {
                    mysql.query("UPDATE `opcje` SET `alternContent`='"+req.body.newPass+"' WHERE `id`="+data[0].id,(err,dataa)=>{
                        if(err)
                        {
                            req.session.error = "Wystąpił problem podczas komunikacji z bazą danych";
                            res.redirect("/administrator/zmiana/hasla"); 
                            eventList.error_List.push(new error("Błąd bazy danych "+err,"MYSQL - administrator 2: "+req.url));
                        }else
                        {
                            req.session.error = "Hasło zostało zmienione!";
                            res.redirect("/administrator/zmiana/hasla"); 
                        }
                    });
                }
                else
                {
                    req.session.error = "Błędny login lub hasło!\n(Hasło nie zostało zmienione)";
                    res.redirect("/administrator/zmiana/hasla"); 
                }
            }
        });
    });
    //strony dla ucznia
    
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
    function isWynikID(a)
{
    let aa = false;
    for(let i =0;i<wyniki.length;i++)
    {
        if(wyniki[i].id == parseInt(a))
        {
            aa = true
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
    function codyNumber(g)
    {
        let a = g.toString();
        let b="";
        for(let i =0;i<a.length;i++)
        {
            switch (a[i]) {
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
            switch (a[i]) {
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
    function dellTest(a){
    for(let i=0;i<testList.length;i++)
    {
        if(testList[i].id == parseInt(a))
        {
            testList.splice(i,1);
            break;
        }
    }
    }
    function dellWynik(a)
    {
        for(let i=0;i<wyniki.length;i++)
        {
            if(wyniki[i].id == parseInt(a))
            {
                wyniki.splice(i,1);
                break;
            }
        }
    }

   router.use(function(req, res, next) {
        next(createError(404));
      });
module.exports = router;
