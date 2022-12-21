function fetch(method, url, callback, data) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = xhrHandler;
    xhr.open(method, url);
    if (data !== undefined) {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    } else
        xhr.send();

    function xhrHandler() {
        if (this.readyState != 4) {
            return;
        }
        if (this.status != 200) {
            console.log("Error!");
            return;
        }
        callback.call(this);
    }
}

function listUsers() {
    var el = document.getElementById("userlist");
    var users = JSON.parse(this.responseText);
    el.innerHTML = "";
    users.map((e) => {
        let li = document.createElement("LI");
        li.id = e.id;
        li.appendChild(document.createTextNode(e.name));
        // el.innerHTML += `<li id="u" uid="${e.id}">${e.name}</li>`;
        li.addEventListener("click", (e) => {
            console.log(e.target.id);
            fetch("GET", "http://localhost:3000/user/" + e.target.id, detailUser);
        });
        el.appendChild(li);
    });
}

function detailUser() {
    var el = document.getElementById("userdetail");
    var user = JSON.parse(this.responseText);
    el.innerHTML = `${user.id} <br> ${user.name}`;
}

window.addEventListener("load", () => {
    document.getElementById("createBtn").onclick = create;
});

function create() {
    let username = document.getElementById("username").value;
    let user = { name: username };
    let payload = JSON.stringify(user);
    fetch("POST", "http://localhost:3000/user", createStatus, payload);

    function createStatus() {
        console.log(this.responseText);
    }
}

fetch("GET", "http://localhost:3000/user", listUsers);