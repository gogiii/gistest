import * as bootstrap from 'bootstrap'

// react
import React from 'react';
import { useState, useRef, useEffect } from "react";

// openlayers
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Overlay from 'ol/Overlay.js';
import OSM from 'ol/source/OSM.js';
import VectorSource from 'ol/source/Vector';
import { Style } from 'ol/style.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { Zoom, Control } from 'ol/control.js';
import { Draw, Modify, Snap, Select } from 'ol/interaction.js';
import { fromLonLat, get } from 'ol/proj.js';
import { getCenter } from 'ol/extent';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

//import Feature from 'ol/Feature.js';

import { getArea, getLength } from 'ol/sphere.js'; // or use: https://openlayers.org/en/latest/examples/jsts.html
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';

import initCollapseMotion from "antd/es/_util/motion"; // wtf?

// react
function AppMap() {
    const mapElRef = useRef();

    // init once?
    useEffect(() => {
        console.log("appmap.jsx useeffect creates map");
        initMap(mapElRef.current);
    }, []);

    const mapStyle = {
        position: "fixed",  // try to honor antd layout content
        width: "100%",
        height: "100%",
        bottom: "unset",
        top: "unset"
    };
    return (
        <div id="map" ref={ mapElRef } style={ mapStyle }>
            <div id="popup"></div>
            <div id="popup2" className="position-absolute"></div>
        </div>
    );
}

// TODO: initMap is legacy pre-antd and using bootstrap for popup, needs fixing
function initMap(mapEl) {
    console.debug("initMap called with", mapEl)
    // define some layers
    const osm = new TileLayer({
        source: new OSM(),
    });

    // define some styles
    const vectorStyle = new Style({
        fill: new Fill({color: "#ffffff33"}),
        stroke: new Stroke({color: "#0000ff", width: 2})
    });

    const selectStyle = new Style({
        fill: new Fill({color: "#ffffffaa"}),
        stroke: new Stroke({color: "#ff0000", width: 3})
    });

    // default layer to draw objects
    const vector = new VectorLayer({
        source: new VectorSource(),
        style: vectorStyle,
    });

    // some test object
    let f = new Feature({
        geometry: new Polygon([[
            [4074372.6239476623, 7386721.108163904],
            [4074188.697348351, 7386487.019764781],
            [4074711.8132606777, 7386248.15405139],
            [4074766.7523747575, 7386565.8454502],
            [4074372.6239476623, 7386721.108163904] ]])
    });
    vector.getSource().addFeature(f);

    // map-based button
    class Button extends Control {
        constructor(label, pos, handler, tooltip) {
            const button = document.createElement('button');
            button.innerHTML = label;
            if(tooltip) {
                button.title = tooltip;
            }

            const element = document.createElement('div');
            element.className = 'ol-unselectable ol-control';
            element.style.left = isNaN(pos[0])?pos[0]:(pos[0] + "px");
            element.style.top = isNaN(pos[1])?pos[1]:(pos[1] + "px");
            element.appendChild(button);

            super({
                element: element
            });

            if(handler) {
                this.clickHandler = handler;
            }
            
            button.addEventListener('click', this.clickHandler.bind(this), false);
        }

        // override in inherited
        clickHandler() {}
    }

    // create popup
    const overlay = new Overlay({
        stopEvent: false
    });
    var el = document.getElementById("popup");
    const popup = new bootstrap.Popover(el, {   // FIXME: bootstrap usage depricated, migrate to antd popever?
        content: "hello world", 
        container: overlay.element,
        html: true,
        animation: false
    });
    overlay.setElement(el);

    // create map
    const map = new Map({
        controls: [
            new Zoom(),
        ],
        overlays: [overlay],
        target: 'map',
        layers: [
            osm, vector
        ],
        view: new View({
            center: [ 4074658.068475165, 7386202.769565846 ],
            zoom: 16,
        }),
    });

    // interaction tools
    let select = new Select({source: vector.getSource(), style: selectStyle});
    let draw = new Draw({source: vector.getSource(), type: "Polygon"}); // use getter or won't work
    //draw.on("drawend", (ft)=>{});
    select.on("select", (e)=>{
        popup.hide();

        if(e.selected.length < 1) {
            return;
        }
        
        let ft = e.selected[0]
        let geom = ft.getGeometry();
        let center = getCenter(geom.getExtent());
        
        popup.setContent({
            '.popover-header': 'Площадь:',
            '.popover-body': `${parseInt(getArea(geom))} м&#178;`
        });
        popup.show();
        overlay.setPosition(center);
    });
    //let snap = new Snap({source: vector.getSource()});
    //map.addInteraction(snap); // always there

    function startMode(mode) {
        if(map.getInteractions().getArray().includes(draw))
            map.getInteractions().remove(draw);
        if(map.getInteractions().getArray().includes(select))
            map.getInteractions().remove(select);

        if(mode == 'draw')
            map.addInteraction(draw);
        else if(mode == 'select')
            map.addInteraction(select);
    }

    map.controls.push(new Button("&#128393;", [ "0.5em", "4.0em" ], ()=>{startMode("draw")}, "Добавить область"));
    map.controls.push(new Button("&#129668;", [ "0.5em", "5.5em" ], ()=>{startMode("select")}, "Выбрать область"));

    // make global for debug
    window.map = map;
    return map;
}

export default AppMap;