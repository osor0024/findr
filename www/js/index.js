// window.onerror = function(error) {
//     alert(error);
// };
var app = {   
    options: null,
    marker:null,
    map:null,
    
    init: function () {
      if (window.hasOwnProperty("cordova")) {
          document.addEventListener("deviceready", app.ready, false);
          console.log("Porfavor");
      } else {
          document.addEventListener("DOMContentLoaded", app.ready);
          
      }
  },
    ready: function() {
      
      if (navigator.geolocation) {
        
        let giveUp = 1000 * 10;
        let toOld = 1000 * 60 * 60;
  
        app.options = {
          enableHighAccuracy: true,
          timeout: giveUp,
          maximumAge: toOld
        };
       
        navigator.geolocation.getCurrentPosition(app.initMap, app.posFail, app.options);
      } else {
        console.log("This old browser doesn't support geolocation");
      }
    },
  
    initMap: function(position) {
        let s = document.createElement("script");
        document.head.appendChild(s);
    
        s.addEventListener("load",()=>{
              app.map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: position.coords.latitude, lng: position.coords.longitude},
                zoom: 16,
                //restriction: { north: 45.0, south: 40.0, west: -100, east: -80 },
                minZoom: 10,
                maxZoom: 15,
                disableDoubleClickZoom: true,
                clickableIcons: false,
                disableDefaultUI: true
                //mapTypeId: google.maps.MapTypeId.ROADMAP
              });

              app.map.addListener("dblclick", function(e){
               app.addMyMarker(e.latLng, app.map)
              })
              
              app.map.addListener("center_changed", function() {
                console.log("I'm doing something")
                window.setTimeout(function() {
                app.map.panTo(app.marker.getPosition());
                }, 9000);
              });    
        });
             s.src = `https://maps.googleapis.com/maps/api/js?key=${myKey}`;

    },
  
    posFail: function(err) {
  
      let errors = {
          1: 'No permission',
          2: 'Unable to determine',
          3: 'Took too long'
      }
      document.querySelector('.h1').textContent = errors[err];
      console.log('posFail', err);
    },

    addMyMarker: function(latLng, map){
        let label = prompt("What's your sign?");
        localStorage.setItem("label", label);
        // if (label == false){
     
        // }
    app.marker = new google.maps.Marker({
    position: latLng,
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    label: label
  });
   app.marker.setMap(map);

   app.clickedMarker(app.marker.position, map, app.marker);

 },
clickedMarker: function(position, map, marker){
  console.log(position);
    marker.addListener("click", function(e) {
    map.setZoom(50);
    map.setCenter(marker.getPosition());
    app.infowind(e.latLng, map, marker ); 
 });
 
},
infowind:function(position, map, marker){
    let infoWindow = new google.maps.InfoWindow({ map: map });
    infoWindow.setPosition(position);
   let contentDiv = document.createElement("div");
   let label = document.createElement("h2");

   let btn = document.createElement("button");

   label.textContent = marker.label;
   contentDiv.appendChild(label);
   btn.textContent = "Delete me";

   btn.addEventListener("click", ev => {
    console.log("button inside info window was clicked");
    marker.setMap(null);
    infoWindow.close();
   });

   contentDiv.appendChild(btn);
   infoWindow.setContent(contentDiv);

   map.setCenter(position);
}

  };
  
  app.init();
  