console.log("Blog script running");


updateBlog();
repeatUpdate();

async function repeatUpdate()
{
  while(true)
  {
    await sleep(5000);
    updateBlog();
  }

}

function updateBlog()
{
  fetch('api/beta/block/tail')
    .then(processBlog)

}

function processBlog( resp )
{
  console.log("blog1");
  console.log(resp);

  let msg_json = resp.json().then(processBlog2);
}

function processBlog2( msg_json)
{

  var blocks = msg_json["blocks"];
  var body="";

  for(var j in blocks)
  {
    var block = blocks[j];

    var messages = block["content"];
    //console.log(messages);


    var block_str = "";

    for(var s in messages)
    {
      //console.log(s);
      var m = messages[s];
      //console.log(m);
      var mime = m["payload"]["contentInfo"]["mimeType"];
      console.log(mime);
      var ts = new Date(parseInt(m["payload"]["timestamp"]));

      if (mime == "text/chat" )
      {
        var content = m["payload"]["contentInfo"]["content"];
        if (content != null)
        {
          content = atob(content);
        }

        var msg_str = "";

        msg_str+= ts.toLocaleDateString();
        msg_str+= " ";
        msg_str+= ts.toLocaleTimeString();
        msg_str+= " ";
        msg_str+= m["sender"];
        msg_str+= ": ";
        msg_str+= content;
        msg_str+="\n";

        block_str = msg_str + block_str;

      }
    }
    body+=block_str;

  }

  //document.getElementById("content_zone").innerHTML=body;
  document.getElementById("blocklog").value=body;

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

