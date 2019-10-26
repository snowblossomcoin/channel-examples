console.log("Blog script running");


updateBlog();

checkOwner();
repeatUpdate();


async function checkOwner()
{
  var resp = await fetch('api/beta/am_i_block_signer');
  var json = await resp.json();
  console.log(json);
  if (json["result"] == true)
  {
    document.getElementById("submit_zone").style.display="inline";
    document.getElementById("send").addEventListener("click", submit);

    document.getElementById("chatmsg").addEventListener('keypress', function (e) {
      if (e.keyCode == 13) {
        submit()
      }
    }, false);

  }

}

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


    for(var s in messages)
    {
      //console.log(s);
      var m = messages[s];
      //console.log(m);
      var mime = m["payload"]["contentInfo"]["mimeType"];
      console.log(mime);
      var ts = new Date(parseInt(m["payload"]["timestamp"]));

      if (mime == "text/blog" )
      {
        var content = m["payload"]["contentInfo"]["content"];
        if (content != null)
        {
          content = atob(content);
        }

        console.log(m);

        body+="<li>"+m["sender"]+" - "+ts.toLocaleDateString() +" "+ts.toLocaleTimeString()+"</li>";
        body+="<textarea readonly='true' rows='2' cols='120'>"+content+"</textarea>";

      }
      else 
      {
        if (m["payload"]["contentInfo"]["contentDataMap"] != null)
        {
          if (m["payload"]["contentInfo"]["contentDataMap"]["blog_entry"] == "dHJ1ZQ==")
          {
            body+="<li>"+m["sender"]+" - "+ts.toLocaleDateString() +" "+ts.toLocaleTimeString()+"</li>";
            id=m["message_id"];
            body+="<a href='content_direct/" + id +"'>file</a> " + mime;
            if (mime.startsWith("image/"))
            {
              body+="<img src='content_direct/" +id+"' height='75'>";

            }

          }
        }

        
      }
    }

  }

  document.getElementById("content_zone").innerHTML=body;

}

async function submit()
{
  var xhr = new XMLHttpRequest();
  xhr.open("POST", 'api/beta/block/submit', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    content_list: [ 
      { 
        content: document.getElementById("chatmsg").value, 
        mime_type: "text/blog",
        data_map: {
          "blog_entry": true
        }
      } ]
  }));

  document.getElementById("chatmsg").value="";

  await sleep(200);

  updateBlog();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

