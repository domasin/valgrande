var defaultStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.6)'
    }),
    stroke: new ol.style.Stroke({
        color: '#000000',
        width: 1,
        lineJoin: 'bevel',
        lineCap: 'square'
    }),
});

var vcoStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.6)'
    }),
    stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1
    }),
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3
        })
    })
});

function placesStyleFunction(feature, resolution) {
    var fill = new ol.style.Fill({
        color: 'rgba(255,255,255,0.4)'
    });
    var stroke = new ol.style.Stroke({
        color: '#3399CC',
        width: 3
    });
    var circle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: fill,
            stroke: stroke,
            radius: 1
        }),
        fill: fill,
        stroke: stroke
    });
    var style = new ol.style.Style({
        text: new ol.style.Text({
            font: '12px Calibri,sans-serif',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            offsetX: 5,
            offsetY: -5,
        })
    });

    var natural = feature.get('natural');
    var name = feature.get('name');

    if (natural && natural == 'peak') {
        if (resolution < 77) {
            if (name) {
                style.getText().setText(name);
            }
            
            return [circle, style];
        }
    }

    //countryStyle.getText().setText(resolution < 5000 ? (feature.get('name') ? feature.get('name') : '') : '');
    //    return countryStyle;
}

function waysStyleFunction(feature, resolution) {
    var highway = feature.get('highway');
    var waterway = feature.get('waterway');
    var trail_visi = feature.get('trail_visi');

    if (highway == 'trunk') {
        var border = styleMotorway = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#8f8f8f',
                width: 5,
                lineJoin: 'bevel',
                lineCap: 'butt',
            })
        });

        var inside = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#e1df69',
                width: 5,
                lineJoin: 'round',
                lineCap: 'round',
            })
        });
        return [border, inside];
    }
    else if (highway == 'tertiary') {
        var border = styleMotorway = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#8f8f8f',
                width: 3,
                lineJoin: 'bevel',
                lineCap: 'butt',
            })
        });

        var inside = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ffffff',
                width: 2,
                lineJoin: 'round',
                lineCap: 'round',
            })
        });
        return [border, inside];
    }
    else if (trail_visi == 'excellent') {

        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#e31a1c',
                width: 1,
                lineJoin: 'bevel',
                lineCap: 'round',
            })
        });

        return [style];
    }
    else if (trail_visi == 'good') {

        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#e31a1c',
                width: 1,
                lineJoin: 'bevel',
                lineCap: 'square',
                lineDash: [4, 2]
            })
        });

        return [style];
    }
    else if (trail_visi == 'intermedia') {

        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#e31a1c',
                width: 1,
                lineJoin: 'bevel',
                lineCap: 'square',
                lineDash: [1, 2]
            })
        });
        return [style];
    }
    else if (trail_visi == 'bad') {

        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1,
                lineJoin: 'bevel',
                lineCap: 'square'
            })
        });
        return [style];
    }
    else if (trail_visi == 'horrible') {

        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1,
                lineJoin: 'bevel',
                lineCap: 'square',
                lineDash: [4, 2]
            })
        });
        return [style];
    }
    else if (trail_visi == 'no') {

        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#050700',
                width: 1,
                lineJoin: 'bevel',
                lineCap: 'square',
                lineDash: [1, 2]
            })
        });
        return [style];
    }
    else if (highway == 'path' && !trail_visi) {

        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ff7f00',
                width: 1,
                lineJoin: 'bevel',
                lineCap: 'square'
            })
        });
        return [style];
    }
    else if (waterway == 'river') {

        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#a0d0ff',
                width: 3,
                lineJoin: 'round',
                lineCap: 'round',
            })
        });

        return [style];
    }
    else if (waterway == 'stream') {

        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#166cc8',
                width: 0.2,
                lineJoin: 'round',
                lineCap: 'round'
            })
        });

        return [style];
    }
    else if (highway == "track" || highway == "unclassified" || (!highway && !waterway)) {
        // to hide
        var style = new ol.style.Style({});

        return [style];
    }
    else
        return [defaultStyle];
}

var parkStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#b2df8a',
        width: 4,
        lineJoin: 'bevel'
    }),
});

var pedumReserveStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#00ed00',
        width: 4,
        lineJoin: 'bevel'
    }),
});

function contoursStyleFunction(feature, resolution) {
    var tipo = feature.get('TIPO');
    var quota = feature.get('ELEV').toString();
    var minResolution = 20;

        if (tipo == 1 && resolution < 30) {

            var style = new ol.style.Style({
                text: new ol.style.Text({
                    font: '11px Calibri,sans-serif',
                    fill: new ol.style.Fill({
                        color: '#afafaf'
                    }),
                    //offsetX: 5,
                    //offsetY: -5,
                }),
                stroke: new ol.style.Stroke({
                    color: '#afafaf',
                    width: 1,
                    lineJoin: 'bevel',
                    lineCap: 'round'
                })
            });
            style.getText().setText(quota);

            return [style];
        }
        else if (tipo == 2 && resolution < 10) {

            var style = new ol.style.Style({
                text: new ol.style.Text({
                    font: '11px Calibri,sans-serif',
                    fill: new ol.style.Fill({
                        color: '#afafaf'
                    }),
                    //offsetX: 5,
                    //offsetY: -5,
                }),
                stroke: new ol.style.Stroke({
                    color: '#afafaf',
                    width: 0.5,
                    lineJoin: 'bevel',
                    lineCap: 'round'
                })
            });
            style.getText().setText(quota);

            return [style];
        }
    else {
        // to hide
        var style = new ol.style.Style({});

        return [style];
    }
}