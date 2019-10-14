console.log("Chat script running");


updateChat();

document.getElementById("send").addEventListener("click", submit);

document.getElementById("chatmsg").addEventListener('keypress', function (e) {
    if (e.keyCode == 13) {
        submit()
    }
}, false);

repeatUpdate();


async function repeatUpdate()
{
  while(true)
  {
    await sleep(5000);
    updateChat();
  }

}

function updateChat()
{
fetch('api/beta/outsider/order_by_time')
  .then(processChat)

}

function processChat( resp )
{
  console.log("chat1");
  console.log(resp);

  let msg_json = resp.json().then(processChat2);
}

function processChat2( msg_json)
{

  //console.log("msg_json");

  //console.log(msg_json);
  
  var messages = msg_json["messages"];
  //console.log(messages);

  var body="";

  for(var s in messages)
  {
    //console.log(s);
    var m = messages[s];
    //console.log(m);

    var content = m["payload"]["contentInfo"]["content"];
    if (content != null)
    {
      content = atob(content);
    }

    //body+=m["payload"]["timestamp"];

    var ts = new Date(parseInt(m["payload"]["timestamp"]));
    //var ts = new Date(9111111);
    console.log(ts);

    body+= ts.toLocaleDateString();
    body+= " ";
    body+= ts.toLocaleTimeString();
    body+= " ";
    body+= m["sender"];
    body+= ": ";
    body+= content;
    body+="\n";
  }

  document.getElementById("msglog").value=body;

}

async function submit()
{
  var xhr = new XMLHttpRequest();
  xhr.open("POST", 'api/beta/outsider/submit', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    content: document.getElementById("chatmsg").value
  }));

  document.getElementById("chatmsg").value="";

  await sleep(200);

  updateChat();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

