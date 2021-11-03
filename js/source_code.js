var myMap;
var lyrOSM;
var lyrOpenTopoMap;
var lyrWorldImagery;
var baseLayers;
var overlays;
var lyrFields;

var mrkField;
var lineField;
var polyField;
var fgLayer;

var mrkCurrentLocation;
var popBangalore;
var ctlPan;
var ctlZoomslider;
var ctlMousePosition;
var ctlMeasure;
var ctlEasyButton;
var ctlSidebar

var ctlDraw;
var fDrawGroup;
var ctlStyle;




$(document).ready(function () {
    // create map object
    myMap = L.map('map_div',  {center:[12.962961743921918,77.59616196155548], zoom:17
        , zoomControl:false });


    // basemap layers

    //add basemap layer
    // lyrOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
    lyrOSM = L.tileLayer.provider('OpenStreetMap.Mapnik');
    lyrOpenTopoMap = L.tileLayer.provider('OpenTopoMap');
    lyrWorldImagery = L.tileLayer.provider('Esri.WorldImagery');
    myMap.addLayer(lyrWorldImagery);

    // add image overlays
    lyrFields = L.imageOverlay('img/fields.png', [[29.66542,72.63678],[29.66320,72.64034]], {opacity:0.6}).addTo(myMap);



    //myMap.openPopup(popBangalore);
    //popBangalore.openOn(myMap);



    var latlngs = [
        [
            [29.66534,72.64021],
            [29.66535,72.63819],
            [29.66376,72.63817],
            [29.66372,72.63749],
            [29.66352,72.63749],
            [29.66352,72.63749],
            [29.66353,72.63713]
        ],
        [
            [29.66536,72.63683],
            [29.66373,72.63681],
            [29.66372,72.63714],
            [29.66353,72.63713]
        ]
    ];


    // polygon
    polyField = L.polygon([[[12.962966971629195,77.59617269039154],[12.962961743921918,77.59616196155548],[12.962859803608108,77.59635239839554],[12.963536791063955,77.59676545858383],[12.963659641872063,77.5965428352356],[12.962966971629195,77.59617269039154]]],
        {color:"red" , fillColor:"white", fillOpacity:0.6});

    // polyField_b = L.polygon([[[12.97546404,77.58827397],[ 12.97525191,77.58857403],[12.97541817,77.58864463],[12.97561883,77.58835634],[12.97546404,77.58827397]]],
    //     {color:"red" , fillColor:"white", fillOpacity:0.6});  

    // polyField_c = L.polygon([[[ 12.97565323 77.58939771], [12.97546404,77.58939771],[ 12.97546404,77.58978014],[12.97563603,77.58978014],[12.97565323,77.58939771]]],
    //     {color:"red" , fillColor:"white", fillOpacity:0.6});

    // polyField_d = L.polygon([[[12.97563603,77.58792096], [12.9755271,77.58814454],[12.97567617,77.58819749],[12.97579083,77.58799745],[12.97563603,77.58792096]]],
    //     {color:"red" , fillColor:"white", fillOpacity:0.6});
    
    // polyline
    lineField =  L.polyline(latlngs, {color: 'blue', weight:5});

    // point
    mrkField = L.marker([29.66350,72.63713],{draggable:true});
    mrkField.bindTooltip('Field No. 6');

    fgLayer = L.featureGroup([polyField,lineField]).bindPopup('Hello world!').addTo(myMap);
    fDrawGroup = new L.featureGroup().addTo(myMap);

    baseLayers = {
        "OpenStreetMap": lyrOSM,
        "OpenTopoMap": lyrOpenTopoMap,
        "Esri-WorldImagery": lyrWorldImagery

    };

    overlays = {
        // "OpenStreetMap": lyrOSM,
        // "OpenTopoMap": lyrOpenTopoMap,
        // "Esri-WorldImagery": lyrWorldImagery,
         "FieldsData": fgLayer,
        "Draw Items" : fDrawGroup

    };

    L.control.layers(baseLayers, overlays).addTo(myMap);




    // plugins
    ctlPan = L.control.pan().addTo(myMap);
    ctlZoomslider = L.control.zoomslider({position:'topright'}).addTo(myMap);

    ctlMousePosition = L.control.mousePosition().addTo(myMap);
    ctlMeasure =L.control.polylineMeasure().addTo(myMap);


    ctlSidebar = L.control.sidebar('side-bar').addTo(myMap);
    ctlEasyButton = L.easyButton('fa-exchange', function () {
        ctlSidebar.toggle();
    }).addTo(myMap);



    ctlDraw = new L.Control.Draw({
        edit:{
            featureGroup :fDrawGroup
        }

    });
    ctlDraw.addTo(myMap);

    myMap.on('draw:created',function (e) {
        fDrawGroup.addLayer(e.layer);
        alert(JSON.stringify(e.layer.toGeoJSON()));
    });

    ctlStyle = L.control.styleEditor({position:'topleft'}).addTo(myMap);

    // event handler and anonymous functions
    // myMap.on('click',function (e) {
    //
    //     alert(e.latlng.toString());
    //     alert(myMap.getZoom());
    //
    // });

    // right click
    myMap.on('contextmenu',function (e) {

        L.marker(e.latlng).addTo(myMap).bindPopup(e.latlng.toString());

    });



    //call method location
    myMap.on('keypress',function (e) {
        if(e.originalEvent.key = 'l'){
            myMap.locate();
        }

    });

    //create circle if location found
    myMap.on('locationfound',function (e) {
        if(mrkCurrentLocation){
            mrkCurrentLocation.remove();
        }
        mrkCurrentLocation = L.circleMarker(e.latlng).addTo(myMap);
        //mrkCurrentLocation = L.circle(e.latlng, {radius:e.accuracy/4}).addTo(myMap);
        myMap.setView(e.latlng, 18);
    });

    //call method location
    myMap.on('locationerror', function(e) {
        console.log(e);
        alert("Location was not found");
    });

    //get user location on button click
    $('#get_location_id').click(function () {
        myMap.locate();
    });

    // go to specific location
    $('#go_to_location').click(function () {
        myMap.setView([31.59248,74.30966], 18);
        myMap.openPopup(popBangalore);
    });

    // get map zoom level
    myMap.on('zoomend', function () {
        $('#zoom_level_id').html(myMap.getZoom());
    });

    // get map zoom level
    myMap.on('moveend', function (e) {
        $('#map_center_id').html(latLngToString(myMap.getCenter()));
    });

    // get mouse location
    myMap.on('mousemove',function (e) {

        $('#mouse_location_id').html(latLngToString(e.latlng));

    });

    // set opacity on image

    $('#change_opacity').on('change',function () {
        $('#img_opacity_display').html(this.value);
        lyrFields.setOpacity(this.value);
    })

    mrkField.on('dragend', function () {
        mrkField.setTooltipContent('Current Location:' +mrkField.getLatLng().toString());
    })


    $('#go_to_backFieldSix').click(function () {
        myMap.setView([29.66350,72.63713], 17);
        mrkField.setLatLng([29.66350,72.63713]);
        mrkField.setTooltipContent('Welcome back to Field Six');
    })

    $('#go_to_line_field').click(function () {
        myMap.fitBounds(lineField.getBounds());
    })


    $('#add_point_id').click(function () {
        if(fgLayer.hasLayer(mrkField)){
            fgLayer.removeLayer(mrkField);
            $('#add_point_id').html('Add Marker to Layer Group');
        }else {
            fgLayer.addLayer(mrkField);
            $('#add_point_id').html('Remove Marker from Layer Group');
        }


    });

    $('#setstyle_id').click(function () {
        fgLayer.setStyle({color:'green', fillColor: 'red', fillOpacity: 0.9});
    })

    //custom functions
    function latLngToString(ll) {
        return "["+ll.lat.toFixed(5)+","+ll.lng.toFixed(5)+"]";
    }
});
