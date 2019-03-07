var sizeOf = require('image-size');

async function download(url,filename)
{
    var http = require('http'),                                                
    Stream = require('stream').Transform,                                  
    fs = require('fs');                                                                        

http.request(url, function(response) {                                        
  var data = new Stream();                                                    

  response.on('data', function(chunk) {                                       
    data.push(chunk);                                                         
  });                                                                         

  response.on('end', function() {                                             
    fs.writeFileSync("./public/testy-img/"+filename, data.read());
                              
  })                                                                        
}).end(()=>{ 
  
});
    
}

function a(url)
{
    let g = "";
    for(let i = url.length-1;i>=0;i--)
    {
        if(url[i] !=" ")
        {
            if(url[i] !=".")
            {
                g+=url[i];
            }
            else
            {
                break;
            }
        }
    }
    let a ="";
    for(let i = g.length-1;i>=0;i--)
    {
        a+=g[i];
    }
    return a;
}

process.on('message', async (message) => {
     
    await download(message.adress,message.nameFile+"."+a(message.adress)); 
    //const size =  sizeOf("./public/testy-img/"+filename); 
    // send response to master process
    process.send({nameFile:  message.nameFile+"."+a(message.adress),imgW:0,imgH:0,pytanieId: message.pytanieId});
  });