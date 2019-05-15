//2019 © Bartosz Śnieg
window.onload = ()=>{
    let test;
    let last = 0;
    let nuberList = document.getElementById("number");
    let bodyP = document.getElementById("pytanieBody");
    $.post("/guestmode/get/egzamin",{},(data)=>{
        test = data;
       // console.log(data)
    }).then(()=>{
        let q1 ="";
        for(let i =0;i<test.ilosc_pytan;i++)
        {
            if(i==0)
            {
                q1+="<li class='wpProQuiz_reviewQuestionTarget' name='"+i+"'>"+(i+1)+"</li>"
            }
            else
            {
                q1+="<li name='"+i+"'>"+(i+1)+"</li>"
            }
        }
        $("#number").html(q1);
        let q ="";
        fisherYatesShuffle(test.pytania)
        //console.log(test.pytania);
        for(let i=0;i<test.pytania.length;i++)
        {
            q+=cPytanie(test.pytania[i],i+1,test.ilosc_pytan);
        }
        $("#pytanieBody").html(q);
        $("#body").removeClass("disable");
        $("#body").addClass("login-wrap");
        setActive(0);
        for(let i=0;i<nuberList.getElementsByTagName("li").length;i++)
{
    nuberList.getElementsByTagName("li")[i].addEventListener("click",function(event){
        //console.log(parseInt(event.target.getAttribute("name")))
        setActive(parseInt(event.target.getAttribute("name")))
    });
}
$(".odp").on('click',(event)=>{
    select(parseInt(event.target.classList[1]));
})
    });

$("#next").on('click',()=>setActive(last+1));
$("#back").on('click',()=>setActive(last-1));
$("#end").on('click',()=>{
let punkty =0;
let max = bodyP.getElementsByClassName('pytanie').length
for(let i =0 ;i<bodyP.getElementsByClassName('pytanie').length;i++)
{
    let input = bodyP.getElementsByClassName('pytanie')[i].getElementsByTagName("input");
    for(let a =0;a<input.length;a++)
    {
        if(input[a].checked)
        {
           // console.log(test.pytania[i].ans);
            if(parseInt(input[a].getAttribute("value")) == test.pytania[i].ans)
            {
                punkty++;
                input[a].parentElement.classList.add("select");
            }
            else
            {
                input[a].parentElement.classList.add("badAnser");
            }
        }
        else
        {
            if(parseInt(input[a].getAttribute("value"))  == test.pytania[i].ans)
            {
                input[a].parentElement.classList.add("select");
            }   
        }
    }
    
}
$.post("/guestmode/save/wynik",{id: test.id,test_id:test.test_id,punkty:punkty,max:max,procent:round((punkty/max*100))},(err,data)=>{})
    document.getElementById("punkty").innerText=" "+punkty+" ";
    document.getElementById("punktyMax").innerText=" "+max+" ";
    document.getElementById("procent").innerText=" ("+round((punkty/max*100))+"%)";
    $(".pytanie").addClass("disable");
    $("#nuberBody").addClass("disable");
    $("#back").addClass("disable");
    $("#end").addClass("disable");
    $("#wyniki").removeClass("disable");
    $("#all").on("click",()=>$(".pytanie").removeClass("disable"));
});
function select(e)
{
nuberList.getElementsByTagName("li")[e-1].classList.add("select");
}

function round(a)
{
    let b = parseInt(a*100);
    return parseFloat(b/100)
}

function setActive(i)
{
    if(i>=0 && i<nuberList.getElementsByTagName("li").length)
    {
        nuberList.getElementsByTagName("li")[last].classList.remove("wpProQuiz_reviewQuestionTarget");
        nuberList.getElementsByTagName("li")[i].classList.add("wpProQuiz_reviewQuestionTarget");
        bodyP.getElementsByClassName('pytanie')[last].classList.add("disable");
        bodyP.getElementsByClassName('pytanie')[i].classList.remove("disable");
        last = i;
        if(i == nuberList.getElementsByTagName("li").length-1)
        {
            document.getElementById("next").classList.add("disable");
            document.getElementById("end").classList.remove("disable");
        }
        else
        {
            document.getElementById("end").classList.add("disable");
            document.getElementById("next").classList.remove("disable");
        }
    }
}
function cPytanie(pytanie,nr,max)
{
    let tabela = [];
    tabela.push('<label><input type="radio" class="odp '+nr+'" name="'+pytanie.id+'"  value="1"><span>'+pytanie.odpA+'</span></label>');
    tabela.push('<label><input type="radio" class="odp '+nr+'"name="'+pytanie.id+'" value="2"><span>'+pytanie.odpB+'</span></label>');
    tabela.push('<label><input type="radio" class="odp '+nr+'"name="'+pytanie.id+'" value="3"><span>'+pytanie.odpC+'</span></label>');
    tabela.push('<label><input type="radio" class="odp '+nr+'"name="'+pytanie.id+'" value="4"><span>'+pytanie.odpD+'</span></label>');
    fisherYatesShuffle(tabela);
    let q;
    if(nr == 1)
     q ="<div class='pytanie'>";
    else
    q ="<div class='pytanie disable'>";
    q+="<div class='numer'><b> "+nr+" </b>z<b> "+max+" </b></div>"
    q+="<div class='tresc'>"+pytanie.pytanie+"</div>"
    //console.log(pytanie.img);
    if(pytanie.img != "Brak")
    q+="<div class='img'><img src='/testy-img/"+pytanie.img+"'></div>" 
    q+="<div class='odpBox'>"
    for(let a = 0;a<tabela.length;a++)
        q+=tabela[a];
    q+="</div>"
    q+="</div>"
    return q;
}
}
function fisherYatesShuffle(array) {
    for(var i = array.length - 1; i > 0; --i) {
        array = swap(array, i, ( Math.random() * (i + 1) ) | 0);
    }
    return array;
}   
function swap(array, a, b) {
    var holder = array[a];
    array[a] = array[b];
    array[b] = holder;
    return array;
}