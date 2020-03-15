function isValidHexCode(string) {
  const regexPattern = /^#([0-9A-F]{3}){1,2}$/i;
  return regexPattern.test(string);
}

function createResultsTable(json){
  let columns = [""];
  for(let key in json[0]){
    columns.push(key);
  }

  if(document.getElementById('results-table')){
    document.body.removeChild(document.getElementById('results-table'));
  }

  let table = document.createElement("TABLE");
  table.setAttribute("id", "results-table");

  let headerRow = table.insertRow(-1);
  columns.forEach(col => {
    let th = document.createElement('TH');
    if(col === 'colour'){
      th.innerHTML = "name";
    } else {
      th.innerHTML = col;
    }
    headerRow.appendChild(th);
  });

  for(let i = 0; i < json.length; i++){
    let tr = table.insertRow(-1);
    tr.addEventListener('click', e => changeBodyColour(json[i].hex));
    for(let j = 0; j < columns.length; j++){
      let cell = tr.insertCell(-1);
      if(j === 0){
        cell.style.backgroundColor = json[i].hex;
        cell.style.width = '30px';
      } else {
        cell.innerHTML = json[i][columns[j]];
      }
    }
  }
  document.body.appendChild(table);
}

function changeBodyColour(colour){
  document.body.style.background = `linear-gradient(to bottom left, ${colour}, #131212)`;
}

let inputField = document.getElementById("colour-input");
inputField.addEventListener("keypress", event => {
  if (event.keyCode === 13 && inputField.value !== "") {
    if (isValidHexCode(inputField.value)) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = alertResponse;
      xhttp.open(
        "GET",
        `http://colour-matching.herokuapp.com:${process.env.PORT}/api/colours?colour=${inputField.value.split('#')[1]}`,
        true
      );
      xhttp.send();

      function alertResponse() {
        if (xhttp.readyState === XMLHttpRequest.DONE) {
          if (xhttp.status === 200) {
            createResultsTable(JSON.parse(xhttp.responseText));
            changeBodyColour(JSON.parse(xhttp.responseText)[0].hex);
          } else {
            console.log("There was a problem with the request.");
          }
        }
      }
    } else {
      let warningText = document.getElementById('warning-text');
      warningText.innerHTML = '* Please enter a valid hex code.'
      warningText.style.color = 'red';
    }
  }
});