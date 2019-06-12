window.addEventListener("load",()=>{
    $('[data-toggle="tooltip"]').mouseenter(function(e){
        if(e.target.hasAttribute("data-toggle"))
        {
        for(var i = 0;i<document.getElementsByClassName("tooltip").length;i++)
        {
            document.getElementsByClassName("tooltip")[i].remove();
        }
        e.target.classList.add("tooltipParent")
        e.target.appendChild(createTooltip(e.target.getAttribute("tooltip-text"),e.target.offsetHeight,e.target.offsetWidth))
    }
    }).mouseleave(function(e){
        for(var i = 0;i<document.getElementsByClassName("tooltip").length;i++)
        {
            document.getElementsByClassName("tooltip")[i].remove();
        }
    });
});

function createTooltip(x,z,y){
    var left = (y-200)/2
    var e = document.createElement("div");
    e.innerText = x;
    e.className = "tooltip"
    e.style.bottom = (z+10)+"px";
    e.style.left = left+"px";
//console.log(z)
return e
}