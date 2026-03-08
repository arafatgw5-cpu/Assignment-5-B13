// LOGIN

function handleLogin() {

    let username = document.getElementById("username").value
    let password = document.getElementById("password").value

    if (username === "admin" && password === "admin123") {

        window.location.href = "main.html"

    } else {

        alert("Invalid credentials")

    }

}
const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues"

const container = document.getElementById("issuesContainer")

const loader = document.getElementById("loader")

// LOAD ALL

async function loadAll() {

    loader.classList.remove("hidden")

    const res = await fetch(API)

    const data = await res.json()

    displayIssues(data.data)

    loader.classList.add("hidden")

}
// DISPLAY ISSUES

function displayIssues(issues) {

    container.innerHTML = ""

    issues.forEach(issue => {

        let border = issue.status === "open"
            ? "border-t-4 border-green-500"
            : "border-t-4 border-purple-500"


        const card = `
<div onclick="openModal(${issue.id})"
class="bg-white p-4 rounded shadow cursor-pointer ${border}">

<h2 class="font-bold text-lg">${issue.title}</h2>

<p class="text-sm text-gray-600">${issue.description}</p>

<p class="mt-2">Status: ${issue.status}</p>
<p>Author: ${issue.author}</p>
<p>Priority: ${issue.priority}</p>
<p>Label: ${issue.label}</p>
<p>Created: ${issue.createdAt}</p>

</div>
`

        container.innerHTML += card

    })

}

async function loadOpen() {

    const res = await fetch(API)

    const data = await res.json()

    const openIssues = data.data.filter(i => i.status === "open")

    displayIssues(openIssues)

}



async function loadClosed() {

    const res = await fetch(API)

    const data = await res.json()

    const closedIssues = data.data.filter(i => i.status === "closed")

    displayIssues(closedIssues)

}



// SEARCH

async function searchIssues() {

    const text = document.getElementById("searchInput").value

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)

    const data = await res.json()

    displayIssues(data.data)

}



// MODAL

async function openModal(id) {

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)

    const data = await res.json()

    const issue = data.data

    document.getElementById("modalTitle").innerText = issue.title
    document.getElementById("modalDescription").innerText = issue.description
    document.getElementById("modalStatus").innerText = "Status: " + issue.status
    document.getElementById("modalAuthor").innerText = "Author: " + issue.author
    document.getElementById("modalPriority").innerText = "Priority: " + issue.priority
    document.getElementById("modalLabel").innerText = "Label: " + issue.label
    document.getElementById("modalCreated").innerText = "Created: " + issue.createdAt

    document.getElementById("issueModal").showModal()

}



// AUTO LOAD

if (window.location.pathname.includes("main.html")) {


    loadAll()
};


