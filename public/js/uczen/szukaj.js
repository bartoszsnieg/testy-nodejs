//2019 © Bartosz Śnieg
window.onload = ()=>{
    $("#buttonS").on("click",()=>{
        if(document.getElementById("dataS").value !="")
        window.location.href = "/uczen/testy/edytuj/"+document.getElementById("dataS").value;
        else
        window.location.href = "/uczen/testy/edytuj";
    });
}