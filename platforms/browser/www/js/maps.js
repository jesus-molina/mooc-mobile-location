var app = {
  miMapa: null,
  miMarcador: null,
  miCirculo: null,  
  radioCirculo: 500,
  numRefrescos: 0,
  timeoutRefresco: 5000,

  inicio: function() {
    this.iniciaFastClick();

  },

  iniciaFastClick: function () {
    FastClick.attach(document.body);
  },

  dispositivoListo: function(){
    // navigator.geolocation.getCurrentPosition(app.dibujaCoordenadas, app.errorAlSolicitarLocalizacion);
    // navigator.geolocation.getCurrentPosition(app.pintaCoordenadasEnMapa, app.errorAlSolicitarLocalizacion);
    // Options: throw an error if no update is received every 30 seconds.
    navigator.geolocation.getCurrentPosition(app.pintaCoordenadasEnMapa, app.alertaAlSolicitarLocalizacion );
  },

  pintaCoordenadasEnMapa: function(position){
    app.miMapa = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ29vdHlmZXIiLCJhIjoiY2l1MGlrb2M3MDAwMDJ6bXAxY3dlOXdkYiJ9.RBfUsuzHfLrofEyMR8IVlA', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(app.miMapa);

    app.actualizaCoordenadasEnMapa(position);

    app.miMapa.on('click', function(evento){
      var texto = 'Marcador en l(' + evento.latlng.lat.toFixed(2) + ') y L(' + evento.latlng.lng.toFixed(2) + ')';
      app.pintaMarcadorEspecial(evento.latlng, texto, app.miMapa);
    });

    navigator.geolocation.watchPosition(app.actualizaCoordenadasEnMapa, app.alertaAlSolicitarLocalizacion, { timeout: app.timeoutRefresco });
  },

  actualizaCoordenadasEnMapa: function(position){
    // Si ya existe un marcador previo, borro éste y el círculo:
    if (app.numRefrescos) {
      app.miMapa.removeLayer(app.miMarcador);
      app.miMapa.removeLayer(app.miCirculo);
    }
    app.numRefrescos++;
    console.log('numRefrescos: ' + app.numRefrescos);

    // app.miMarcador = L.marker(latlng, {icon: iconoGrande}).addTo(app.miMapa);
    // app.miMarcador.bindPopup('¡Estoy aquí!').openPopup();

    // Para comprobar los refrescos, voy a cambiar el color del círculo
    var colorCirculo = null;
    switch(app.numRefrescos%3) {
      case 0: colorCirculo = '#00ff00'; break;
      case 1: colorCirculo = '#ff0000'; break;
      case 2: colorCirculo = '#0000ff'; break;
      default: colorCirculo = '#0';
    }

    app.indicaCoordenadas(position);

    // app.pintaMarcador([position.coords.latitude, position.coords.longitude], '¡Estoy aquí!', app.miMapa);
    app.miMarcador = app.pintaMarcador([position.coords.latitude, position.coords.longitude], 'Aquí estoy', app.miMapa);


    app.miCirculo = app.pintaCirculo([position.coords.latitude, position.coords.longitude], app.radioCirculo, colorCirculo, app.miMapa);


  },

  dibujaCoordenadas: function(position){
    var coordsDiv = document.querySelector('#coords');
    coordsDiv.innerHTML = 'Latitud: ' + position.coords.latitude + ' Longitud: ' + position.coords.longitude;
  },

  indicaCoordenadas: function(position){
    var coordsDiv = document.querySelector('#titulo');
    coordsDiv.innerHTML = 'Lat: ' + position.coords.latitude.toFixed(4) + ' Lon: ' + position.coords.longitude.toFixed(4);
  },

  pintaMarcadorEspecial: function(latlng, texto, mapa){
    var LeafIcon = L.Icon.extend({
      options: {
        shadowUrl: 'css/images/leaf-shadow.png',
        iconSize:     [38, 95],
        shadowSize:   [50, 64],
        iconAnchor:   [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
        }
    });
    var greenIcon = new LeafIcon({iconUrl: 'css/images/leaf-green.png'});

    L.marker(latlng, {icon: greenIcon}).bindPopup(texto).addTo(mapa);
  },

  pintaMarcador: function(latlng, texto, mapa){
    var marcador = L.marker(latlng).addTo(mapa);
    marcador.bindPopup(texto).openPopup();
    return (marcador);
  },
  pintaCirculo: function(latlng, radio, color, mapa){
    var circulo = L.circle(latlng, {
  		color: color,
  		fillColor: '#f03',
  		fillOpacity: 0.15,
  		radius: radio
	    }).addTo(mapa);
    return (circulo);
  },
  // onError Callback receives a PositionError object
  //
  alertaAlSolicitarLocalizacion: function(error) {
    console.log(error.code + ': ' + error.message);
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
  },
  // Saca mensaje de error por la consola del phonegap serve
  errorAlSolicitarLocalizacion: function(error){
    console.log(error.code + ': ' + error.message);
  }

};

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    app.inicio();
  }, false);
  document.addEventListener('deviceready', function() {
    app.dispositivoListo();
  }, false);
}
