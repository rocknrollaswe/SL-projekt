
//Storing the API-keys
const apiKey_SL_PlatsData ='5cfd6893792f4fca9cb0bb6fd6450cd6';
const apiKey_SL_RealTidsInfo = 'd41d969db1634c12b8f6ae2805a901df';
const apiKey_SL_ReseRobotReseplanerare = 'f62b027f-e22e-4ca9-b8cf-009a2ca7f628';

//setting up variables for event-handling
var inputField = document.getElementById("myStation");
let metroCheck = document.getElementById("metro");
let busCheck = document.getElementById("bus");
let tramCheck = document.getElementById("tram");
var crd; 
var footerText = document.getElementById("footerText");
var metroOn = document.getElementById("metroOn");
var tramOn = document.getElementById("tramOn");
var busOn = document.getElementById("busOn");




 //As soon as the page has loaded runs these functions
document.body.onload = function() {
    GetStations();
    //GetSiteId(); 
}



//Interval for calling Api-functions
setInterval( function() {GetStations(); console.log("updated grid!") }, 60000);

/*var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function success(pos) {
    crd = pos.coords;
  
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  navigator.geolocation.getCurrentPosition(success, error, options);*/
  




//function for clearing on update
function ClearElements(id){
    var areaToClear = document.getElementById(id);
    areaToClear.innerHTML = '';

}

function ChangeFieldsetBackColor(id, labelId){
    if(id.checked){
        
        labelId.style.opacity = "1";
    }
    else{
        
        labelId.style.opacity = "0.3";
    }
}

//events for checkboxes
metroCheck.onchange = function () {
    GetStations();
    ChangeFieldsetBackColor(metroCheck, metroLabel); 
}
busCheck.onchange =  function () {
    GetStations();
    ChangeFieldsetBackColor(busCheck, busLabel); 
}
tramCheck.onchange =  function () {
    GetStations();
    ChangeFieldsetBackColor(tramCheck, tramLabel); 
}

//Fetches the ID for the station the user entered
function GetStations(){
    
    ClearElements("gridheader"); 
    ClearElements("grid-area");

    var station = document.getElementById("myStation").value;

    const connStringPlatsData = `https://api.sl.se/api2/typeahead.json?` +
    `key=${apiKey_SL_PlatsData}&searchstring=${station}&` +
    `stationsonly=true&maxresults=10`;

    fetch(connStringPlatsData)
        .then((resp) => resp.json())
        .then(function(data) {
            
            let site = data.ResponseData[0];

            console.log(site.Name);
            console.log(site.SiteId)
            console.log(`long: ${site.X}`);
            console.log(`lat: ${site.Y}`);

            locationLong = site.X;
            locationLat = site.Y; 
            let stationId = site.SiteId;
            var outelement = document.getElementById("gridheader");
            
            outelement.innerHTML = site.Name; 

            GetLineDepartures(stationId);
            
        })

        .catch(function(error){
            console.log(error); 
        })   
}
//..And again from a different API because of reasons with SL and LocationID :/
/*function GetSiteId(input){
    
    var inputField = document.getElementById("myStation").value;
    const url = `https://api.resrobot.se/v2/location.name.json?key=${apiKey_SL_ReseRobotReseplanerare}&input=${inputField}`
    

    fetch(url)
        .then((response) => response.json())
        .then(function(data){
            console.log("fetching siteId from ReseRobot...")
            var localData =  data.StopLocation[0];
            console.log(localData.id);
            var destID = localData.id; 
            GetDistanceToStation(destID);
        })
        .catch(function(error){
            console.log(error);
        })
  
}*/


//Gets the timetable for the chosen station, checking if checkboxes are checked and fetching the checked transport accordingly
function GetLineDepartures(siteId){

    ClearElements("grid-area");

    console.log(siteId);
    console.log("GetLinedeparturesFunction...")

    var connString_RealTidsInfo = `https://api.sl.se/api2/realtimedeparturesV4.json?key=${apiKey_SL_RealTidsInfo}&siteid=${siteId}&timewindow=30`
    
    var lineNo = document.getElementById("lineNumber");
    var lineName = document.getElementById("lineName");
    var minToGo =  document.getElementById("minutesToGo");

    fetch(connString_RealTidsInfo)
        .then((response) => response.json())
        .then(function(data){

            console.log('fetching departure data...')

            let respData = data.ResponseData;
            var grid_area = document.getElementById("grid-area");

            console.log(data.ResponseData);

            if(metroCheck.checked){

                if(respData.Metros.length > 0){
                    var header = document.createElement("div");
                    header.innerHTML = "Tunnelbana mot:";
                    header.className = "transportHeader";
                    grid_area.appendChild(header);
                    
                    respData.Metros.forEach(element => {
                    var line = document.createElement("div");
                    var name = document.createElement("div");
                    var minutesLeft = document.createElement("div");
                    var lineBreak = document.createElement("br");
    
    
                    line.className="lineNumber";
                    name.className="lineName";
                    minutesLeft.className="minutesToGo";
                   
                    line.innerHTML = element.LineNumber;
                    name.innerHTML = element.Destination;
                    minutesLeft.innerHTML = element.DisplayTime;
    
                    grid_area.appendChild(line);
                    grid_area.appendChild(name);
                    grid_area.appendChild(minutesLeft);
                    grid_area.appendChild(lineBreak);
    
                    })
                }
                else{
                    var header = document.createElement("div");
                    header.innerHTML = "Ingen tunnelbana vid aktuell hållplats" + "<br>" + "-----";
                    header.className = "transportHeader";
                    grid_area.appendChild(header);
                }    
            }

            if(busCheck.checked){
               
                if(respData.Buses.length > 0){
                    var header = document.createElement("div");
                    header.innerHTML = "Bussar mot:";
                    header.className = "transportHeader";
                    grid_area.appendChild(header);
                    header.setAttribute("style", "grid-column-end:span 3;")
            
               

                    respData.Buses.forEach(element => {
                    var line = document.createElement("div");
                    var name = document.createElement("div");
                    var minutesLeft = document.createElement("div");
                    var lineBreak = document.createElement("br");
    
    
                    line.className="lineNumber";
                    name.className="lineName";
                    minutesLeft.className="minutesToGo";
                   
                    line.innerHTML = element.LineNumber;
                    name.innerHTML = element.Destination;
                    minutesLeft.innerHTML = element.DisplayTime;
    
                    grid_area.appendChild(line);
                    grid_area.appendChild(name);
                    grid_area.appendChild(minutesLeft);
                    grid_area.appendChild(lineBreak);
    
                    })
                }
                else{
                    var header = document.createElement("div");
                    header.innerHTML = "Inga bussar vid aktuell hållplats" + "<br>" + "-----";
                    header.className = "transportHeader";
                    grid_area.appendChild(header);
                    header.setAttribute("style", "grid-column-end:span 3;")

                }
            }
           
            if(tramCheck.checked){

                if(respData.Trams.length > 0){
                    var header = document.createElement("div");
                    header.innerHTML = "Tvärbana mot:";
                    header.className = "transportHeader";
                    grid_area.appendChild(header);
                    header.setAttribute("style", "grid-column-end:span 3;")
                

                    respData.Trams.forEach(element => {
                    var line = document.createElement("div");
                    var name = document.createElement("div");
                    var minutesLeft = document.createElement("div");
                    var lineBreak = document.createElement("br");
    
                    line.className="lineNumber";
                    name.className="lineName";
                    minutesLeft.className="minutesToGo";
                   
                    line.innerHTML = element.LineNumber;
                    name.innerHTML = element.Destination;
                    minutesLeft.innerHTML = element.DisplayTime;
                   

                    grid_area.appendChild(line);
                    grid_area.appendChild(name);
                    grid_area.appendChild(minutesLeft);
                    grid_area.appendChild(lineBreak);
                    })
                }

                else{
                    var header = document.createElement("div");
                    header.innerHTML = "Tvärbana ej aktuell för hållplatsen" + "<br>" + "-----";
                    header.className = "transportHeader";
                    grid_area.appendChild(header);
                    header.setAttribute("style", "grid-column-end:span 3;")
                }               
            }   
        })
        
        .catch(function(error){
            console.log(error);
        })
}


/*function GetDistanceToStation(destId){

    
    var userLat = crd.latitude;
    var userLong = crd.longitude;

    console.log(userLat + " " + userLong);

    const url = `https://api.resrobot.se/v2/trip?key=${apiKey_SL_ReseRobotReseplanerare}&originCoordLat=${userLat}&originCoordLong=${userLong}&destId=${destId}&format=json`

        fetch(url)
            .then((resp) => resp.json())
            .then(function(data){
                console.log(data.Trip[0].LegList.Leg[0].Destination.name + data.Trip[0].LegList.Leg[0].Destination.time);
            })




    console.log(locationLat); 
    console.log(locationLong); 
}*/