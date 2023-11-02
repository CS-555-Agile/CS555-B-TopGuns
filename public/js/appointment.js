
async function Accept(AppId) {
  
    console.log(AppId)
    const data = await accept(AppId);
    console.log(data);
    if(data.code===404 || data.code===500){
        alert("Cannot Process the Request")
    }
    else{
        alert("Request Processed succesfully")
        window.location.reload(true)
    }
  }
  async function Decline(AppId) {
  
    console.log(AppId)
    const data = await decline(AppId);
    console.log(data);
    if(data.code===404 || data.code===500){
        alert("Cannot Process the Request")
    }
    else{
        alert("Request Processed succesfully")
        window.location.reload(true)
    }
  }
async function accept(AppId) {
    const response = await fetch('http://localhost:3000/appointment/accept/'+AppId,{method: 'PUT'});
    const data = await response.json();
    return data;
  }

  async function decline(AppId) {
    const response =  await fetch('http://localhost:3000/appointment/decline/'+AppId,{method: 'PUT'});
    const data = await response.json();
    return data;
  }
