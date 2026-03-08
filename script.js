// LOGIN

function handleLogin(){

let username=document.getElementById("username").value
let password=document.getElementById("password").value

if(username==="admin" && password==="admin123"){

window.location.href="main.html"

}else{

alert("Invalid credentials")

}

}
const API="https://phi-lab-server.vercel.app/api/v1/lab/issues"

const container=document.getElementById("issuesContainer")

const loader=document.getElementById("loader")

// LOAD ALL

async function loadAll(){

loader.classList.remove("hidden")

const res=await fetch(API)

const data=await res.json()

displayIssues(data.data)

loader.classList.add("hidden")

}
