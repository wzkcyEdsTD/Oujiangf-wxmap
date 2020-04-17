import esriLoader from 'esri-loader';
import Vue from 'vue';
export default
{
  that: {},
  view: {},
  draw: {},
  action1:null,
  action2:null,
  /*线测量*/
  enableCreateLine(draw,view,state) {
    const self =this;
    Vue.$vux.loading.show('加载中');
    esriLoader.loadModules([
      "esri/Graphic",
      "esri/geometry/Polyline",
      "esri/geometry/geometryEngine"
    ])
    .then(([Graphic, Polyline, geometryEngine]) => {
      Vue.$vux.loading.hide();
      var action = draw.create("polygon");
      self.action1 = action;
      // create() will return a reference to an instance of PolygonDrawAction
      // focus the view to activate keyboard shortcuts for drawing polygons
      view.focus();

      action.on("vertex-add", drawPolyline);
      action.on("vertex-remove", drawPolyline);
      action.on("cursor-update", drawPolyline);
      action.on("redo", drawPolyline);
      action.on("undo", drawPolyline);
      action.on("draw-complete", drawPolyline);

      function drawPolyline(event) {
        /*if(event.type=='draw-complete'){
          var action = draw.create("polygon");
          self.action1 = action;
          action.on("vertex-add", drawPolyline);
          action.on("vertex-remove", drawPolyline);
          action.on("cursor-update", drawPolyline);
          action.on("redo", drawPolyline);
          action.on("undo", drawPolyline);
          action.on("draw-complete", drawPolyline);
        }*/
        var vertices = event.vertices;
        view.graphics.removeAll();
        //console.log(vertices);
        var lines = new Polyline({
          paths: vertices,
          spatialReference: view.spatialReference
        });
        var graphic = new Graphic({
          geometry: lines,
          symbol: {
            type: "simple-line", // autocasts as new SimpleFillSymbol
            color: "#ff937d",//009e60
            width: 2,
            style: "solid",
            outline: { // autocasts as SimpleLineSymbol
              color: [255, 255, 255],
              width: 1
            },
            cap: "round",
            join: "round"
          }
        });
        view.graphics.add(graphic);
        if(!state){
          var lineLength = geometryEngine.geodesicLength(lines, "meters");
          var graphic2 = new Graphic({
            geometry: lines.extent.center,
            symbol: {
              type: "text",
              color: "#ff3400",
              haloSize: 2,
              haloColor: "#ffffff",
              text: parseInt(lineLength) + " 米",
              font: { // autocast as Font
                size: 12
              }
            }
          });
          view.graphics.add(graphic2);
        }
      }
    });
  },
  /*面测量*/
  enableCreatePolygon(draw,view,state) {
    //this.that = that;
    Vue.$vux.loading.show('加载中');
    const self = this;
    esriLoader.loadModules([
      "esri/Graphic",
      "esri/geometry/Polygon",
      "esri/geometry/geometryEngine"
    ])
    .then(([Graphic, Polygon, geometryEngine]) => {
      Vue.$vux.loading.hide();
      //console.log(draw);
      // create() will return a reference to an instance of PolygonDrawAction
      var action = draw.create("polygon");
      self.action2 = action;
      // focus the view to activate keyboard shortcuts for drawing polygons
      view.focus();

      action.on("vertex-add", drawPolygon);
      action.on("cursor-update", drawPolygon);
      action.on("vertex-remove", drawPolygon);
      //action.on("redo", drawPolygon);
      //action.on("undo", drawPolygon);
      action.on("draw-complete", drawPolygon);

      function drawPolygon(event) {

        var vertices = event.vertices;

        var polygon = new Polygon({
          rings: vertices,
          spatialReference: view.spatialReference
        });

        // create a new graphic representing the polygon, add it to the view
        var graphic = new Graphic({
          geometry: polygon,
          symbol: {
            type: "simple-fill", // autocasts as SimpleFillSymbol
            color: [255, 52, 0, 0.6],//0, 158, 96
            style: "solid",
            outline: { // autocasts as SimpleLineSymbol
              color: [255, 255, 255],
              width: 1
            }
          }
        });
        //remove existing graphic
        view.graphics.removeAll();

        // create a new graphic representing the polygon, add it to the view
        //var graphic = instance.createGraphic(polygon);
        view.graphics.add(graphic);

        // calculate the area of the polygon
        if(!state){
          var area = geometryEngine.geodesicArea(polygon, "square-meters");
          if (area < 0) {
            // simplify the polygon if needed and calculate the area again
            var simplifiedPolygon = geometryEngine.simplify(polygon);
            if (simplifiedPolygon) {
              area = geometryEngine.geodesicArea(simplifiedPolygon, "square-meters");
            }
          }
          // start displaying the area of the polygon
          //instance.labelAreas(polygon, area);
          var graphic2 = new Graphic({
            geometry: polygon,//polygon.centroid
            symbol: {
              type: "text",
              color: [255, 255, 255],
              haloColor: "black",
              haloSize: "1px",
              text: area.toFixed(2) + "平方米",
              xoffset: 3,
              yoffset: 3,
              font: { // autocast as Font
                size: 12
              }
            }
          });
          view.graphics.add(graphic2);
        }
      }
    });
  }
}
