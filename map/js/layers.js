var osmSource = new ol.source.OSM();

var osmLayer = new ol.layer.Tile({
    source: osmSource
})

var vcoLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/vco.geojson',
        format: new ol.format.GeoJSON()
    }),
    style: function (feature, resolution) {
        vcoStyle.getText().setText(resolution < 5000 ? feature.get('name') : '');
        return vcoStyle;
    }
});

var hillsShadesLayer = new ol.layer.Image({
    source: new ol.source.ImageStatic({
        url: 'data/hills_shades.png',
        imageExtent: [916909.64260972116608173, 5771666.42571559362113476, 968491.39624769741203636, 5803633.83011612482368946]
    })
});

var contoursLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/contours.geojson',
        format: new ol.format.GeoJSON()
    }),
    style: contoursStyleFunction
});

var parkLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/park.geojson',
        format: new ol.format.GeoJSON()
    }),
    style: parkStyle
});

var pedumReserveLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/pedum_integral_reserve.geojson',
        format: new ol.format.GeoJSON()
    }),
    style: pedumReserveStyle
});

var waysLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/ways.geojson',
        format: new ol.format.GeoJSON()
    }),
    style: waysStyleFunction
});

var placesLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'data/places.geojson',
        format: new ol.format.GeoJSON()
    }),
    style: placesStyleFunction
});





