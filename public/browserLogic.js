const dbUser = new PouchDB('user');
const dbPoints = new PouchDB('points');
const dbWaring = new PouchDB('warnings');
const userId = 'uuid';


function addWaring(warnings){
    let cache = Array.from(warnings);
    warnings = [];
    dbWaring.bulkDocs(cache);
}





// ------------------- geolocation logic starts --------------------------------------------------------------------


let userPoints =[]


var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function success(pos) {
    var crd = pos.coords;
    
    userPoints.push({
        _id : new Date().toISOString(),
        lat : crd.latitude,
        lon : crd.longitude
    });

    console.log(userPoints);
  }
  
  function error(err) {
    console.log(`ERROR(${err.code}): ${err.message}`);
  }
  
  


function addLocation(){
    navigator.geolocation.getCurrentPosition(success, error, options);
}

function addToDb(){
    let cache = Array.from(userPoints);
    userPoints = [];
    dbPoints.bulkDocs(cache);
}





// setInterval(addLocation, 4000);
// setInterval(addToDb,20000 );



// ---------------------- geoloaction logic ends ----------------------------------------------------------



// -------------------- warning algorithm calculation ----------------------------------------------------------


// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}

function calcCrow(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d*1000;
}







function calcWarning(userData, covidData){

    let warningPoints = 0;

    let n = userData.length();
    let m = covidData.length();


    for(let i = 0;i<n;i++){
        for(let j=0;j<m;j++){
            let {_id : uid, lat : ulat, lon : ulon} = covidData[j];
            let {_id : cid, lat : clat, lon : clon} = covidData[j];
            let days = abs(new Date(uid).getDate() - new Date(cid).getDate());

            if(days<=3 && calcCrow(ulat, ulon, clat, clon) <= 100)WarningPoints++;
        }
    }

    return warningPoints;
}


let warningPoints = [];




function addToWarning(){

    if(warningPoints.length() === 0)
    return;

    let cache = Array.from(warningPoints);
    warningPoints = [];
    dbWaring.bulkDocs(cache);
}


async function covidListener(){

    let user = await dbUser.get('user');
    let userId = user['id'];
    let res = await fetch('/getCovid',{
        method : 'GET',
        body : JSON.stringify({userId})
    });
    let obj = await res.json();

    // some more logic

    if(!obj["present"])
        return;


    let userDataPoints = await dbPoints.allDocs({
        include_docs: true,
        attachments: true
      });

    userDataPoints = userDataPoints['rows'].map(x=> x['doc']);
    // more logic

    warningPoints.push({_id : new Date().toISOString(), points: calcWarning(userDataPoints, obj)});
    

}

setInterval(addToWarning, 10000);




// ----------------------------Dom manipulations -------------------------------------------

// on refresh update warning list


let refresh = document.getElementById('refresh');

async function updateWarning(){

    let warnings = await dbWaring.allDocs({
        include_docs: true,
        attachments: true
      });

    warnings = warnings['rows'].map(x=> x['doc']);

    let table = document.getElementById('list');

    warnings.forEach(warning =>{

        if(warning['points']>5){
            
            let entry = `
            <tr>
                <td id = "warningId">${waring["_id"]}</td>
                <td id = "warningPoints">${order["points"]}</td>
            </tr>`;

            table.insertAdjacentHTML("beforeend", entry);
        }

    });

}

refresh.addEventListener('click', updateWarning);


















