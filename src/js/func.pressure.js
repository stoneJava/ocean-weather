import Papa from 'papaparse'
import { LineTextCanvas } from './leaflet.textCanvas'

export class FuncPressure {

  constructor(map) {
    this._map = map;
  }

  start() {
    var renderer = new LineTextCanvas();
    var options = {
      renderer: renderer,
      color: '#354656',
      weight: 0.8,
      opacity: 0.85,
      fill: false
    };
    var arr = [];

    if(this.pressureFeatureGroup && this._map.hasLayer(this.pressureFeatureGroup)) {
      this._map.removeLayer(this.pressureFeatureGroup);
    }
    this.pressureFeatureGroup = L.featureGroup([]).addTo(this._map);

    Papa.parse('./static/data/pressure.csv', {
      download: true,
      complete: function (results) {},
      step: function (results, parser) {
        if(results.data[0][0] === '' && arr.length) {

          // handler data -------------start------------------------
          var latlngs = [];
          for(var i = 0, len = arr.length; i < len; i++) {
            var row = arr[i];
            var lat = +row[0];
            var lng = +row[1];
            var value = options.text = +row[2];
            var latlng = L.latLng(lat, lng);

            if(i === 0) {
              latlngs.push(latlng);
            } else {
              var lastlng = (latlngs[latlngs.length - 1]).lng;
              var extend = Math.abs(lng - lastlng);
              if(extend >= 180) { //解决经度范围超过180连线异常
                if(this._map.hasLayer(this.pressureFeatureGroup)) {
                  this.pressureFeatureGroup.addLayer(L.polyline(latlngs, options));
                }
                latlngs = [];
                latlngs.push(latlng);
              } else {
                latlngs.push(latlng);
                if(i === len - 1) {
                  if(this._map.hasLayer(this.pressureFeatureGroup)) {
                    this.pressureFeatureGroup.addLayer(L.polyline(latlngs, options));
                  }
                  latlngs = [];
                }
              }
            }
          }
          // handler datq ----------------end-----------------------------
          arr = [];
        } else {
          if(arr) {
            arr.push(results.data[0]);
          } else {
            arr = [];
          }
        }
      }.bind(this)
    });
  }

  stop　() {
    if(this._map.hasLayer(this.pressureFeatureGroup)) {
      this._map.removeLayer(this.pressureFeatureGroup);
    }
  }
}