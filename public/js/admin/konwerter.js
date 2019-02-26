window.onload =()=>{
clear();
let data =[];
$("#fast").on("click",()=>{
document.getElementById("body").classList.toggle("disable");
document.getElementById("fastBody").classList.toggle("disable");
});
$("#close").on("click",()=>{
    document.getElementById("body").classList.toggle("disable");
    document.getElementById("fastBody").classList.toggle("disable");
    });
    $("#konwert").on('click',()=>{
if(document.getElementById("vKonwert").value != "")
{
converrt(document.getElementById("vKonwert").value);
console.log(data);
document.getElementById("tresc").value = removeFirstSpace(data[0]);
document.getElementById("odpA").value = removeFirstSpace(data[1]);
document.getElementById("odpB").value = removeFirstSpace(data[2]);
document.getElementById("odpC").value = removeFirstSpace(data[3]);
document.getElementById("odpD").value = removeFirstSpace(data[4]);
document.getElementById("poprawna").value = document.getElementById('poprawnaK').value
}else
{
    alert("Nie wpisano danych do konwersji!");
}
});
    function converrt(a){
        data = null;
        data =  []
        a+="\n";
        let d = "";
        for(let g = 0;g<a.length;g++)
        {

            if(a[g] =='\n')
            {
                if(d != "")
                //console.log(d)

                data.push(d);
                d = "";


            }else{
                d+=a[g];
            }
        }
    }
    function removeFirstSpace(e)
    {if((e!="")&&(e.length > 0))
    {
        let g = "";
        let t = false;
        for(let a = 0; a<e.length;a++)
        {
            if((e[a] == " ")&&(a ==0))
            {

            }else if(((e[a] == " ")&&(a !=0)&&(!t)))
            {

            }else if((e[a] != " ")||(t))
            {
                t = true;
                g+=e[a];
            }

        }
        return g;
    }else{
        return "";
    }

    }
    function clear()
    {
        document.getElementById("tresc").value ="";
        document.getElementById("odpA").value = "";
        document.getElementById("odpB").value = "";
        document.getElementById("odpC").value = "";
        document.getElementById("odpD").value = "";
        document.getElementById("poprawna").value = 1;
        document.getElementById('poprawnaK').value = 1;
        document.getElementById("vKonwert").value = "";
    }
}