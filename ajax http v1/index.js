xhr = new XMLHttpRequest();
xhr.onreadystatechange = xhrHandler;
xhr.open("GET", "http://localhost:3000/user/1/dorj");
xhr.send();

function xhrHandler() {
    if (this.readyState != 4) {
        return;
    }
    if (this.status != 200) {
        console.log("Error!");
        return;
    }
    elem = document.getElementById("container");
    model = JSON.parse(this.responseText);
    console.log(model);
    elem.innerHTML = `id: ${model.id}`;
}