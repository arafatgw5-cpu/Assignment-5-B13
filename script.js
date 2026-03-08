function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === 'admin' && password === 'admin123') {
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'main.html';
    } else {
        alert("Invalid Username or Password");
    }
}

const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues"

const container = document.getElementById("issuesContainer")
const loader = document.getElementById("loader")

const allBtn = document.getElementById("allBtn")
const openBtn = document.getElementById("openBtn")
const closedBtn = document.getElementById("closedBtn")

const totalIssues = document.getElementById("totalIssues")
const openCount = document.getElementById("openCount")
const closedCount = document.getElementById("closedCount")

let allIssues = []


// active tab
function setActive(btn){

[allBtn,openBtn,closedBtn].forEach(button=>{

button.classList.remove("btn-active")
button.classList.add("btn-outline")

})

btn.classList.add("btn-active")
btn.classList.remove("btn-outline")

}


// fetch issues
async function fetchIssues(filter="all"){

loader.classList.remove("hidden")

try{

const res = await fetch(API)
const data = await res.json()

allIssues = data.data

updateCounts(allIssues)

let issues = allIssues

if(filter==="open"){
issues = allIssues.filter(i=>i.status==="open")
}

else if(filter==="closed"){
issues = allIssues.filter(i=>i.status==="closed")
}

displayIssues(issues)

}

catch(err){

container.innerHTML = "<p class='text-red-500'>Failed to load issues</p>"

}

finally{

loader.classList.add("hidden")

}

}



// update count
function updateCounts(issues){

const open = issues.filter(i=>i.status==="open").length
const closed = issues.filter(i=>i.status==="closed").length

totalIssues.innerText = issues.length+" Issues"
openCount.innerText = open+" Open"
closedCount.innerText = closed+" Closed"

}



// display cards
function displayIssues(issues){

container.innerHTML=""

issues.forEach(issue=>{

const border = issue.status==="open"
? "border-t-4 border-green-400"
: "border-t-4 border-purple-400"


const priorityColor =
issue.priority==="high"
? "badge badge-error"
: issue.priority==="medium"
? "badge badge-warning"
: "badge badge-ghost"


const card = `
<div onclick="openModal(${issue.id})"
class="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer ${border}">

<div class="p-4">

<div class="flex justify-between mb-2">

<span class="${priorityColor}">
${issue.priority.toUpperCase()}
</span>

</div>

<h2 class="font-bold text-lg">
${issue.title}
</h2>

<p class="text-gray-500 text-sm mt-1">
${issue.description.slice(0,80)}...
</p>

</div>

<div class="border-t px-4 py-2 text-sm text-gray-500">

#${issue.id} by ${issue.author}
<br>
${issue.createdAt}

</div>

</div>
`

container.innerHTML += card

})

}



// search
function searchIssues(){

const text = document.getElementById("searchInput").value.toLowerCase()

if(!text){
displayIssues(allIssues)
return
}

const filtered = allIssues.filter(issue=>
issue.title.toLowerCase().includes(text)
)

displayIssues(filtered)

}



// modal
async function openModal(id){

const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)

const issue = (await res.json()).data

document.getElementById("modalTitle").innerText = issue.title
document.getElementById("modalDescription").innerText = issue.description
document.getElementById("modalStatus").innerText = "Status: "+issue.status
document.getElementById("modalAuthor").innerText = "Author: "+issue.author
document.getElementById("modalPriority").innerText = "Priority: "+issue.priority
document.getElementById("modalLabel").innerText = "Label: "+issue.label
document.getElementById("modalCreated").innerText = "Created: "+issue.createdAt

document.getElementById("issueModal").showModal()

}



// tab events
allBtn.addEventListener("click",()=>{

setActive(allBtn)
displayIssues(allIssues)

})


openBtn.addEventListener("click",()=>{

setActive(openBtn)
displayIssues(allIssues.filter(i=>i.status==="open"))

})


closedBtn.addEventListener("click",()=>{

setActive(closedBtn)
displayIssues(allIssues.filter(i=>i.status==="closed"))

})



// load data
window.addEventListener("DOMContentLoaded",()=>{

setActive(allBtn)
fetchIssues()

})