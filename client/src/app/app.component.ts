import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ol from 'openlayers';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	map: ol.Map;
	vectorLayer: ol.layer.Vector;
	vectorSource: ol.source.Vector;

	initialPosition: [number, number] = [23, 38];
	initialZoom = 7;

	private coffeeShopIconPath = "favicon.ico"

	private createIconStyle(src: string, img: any): ol.style.Style {
		const icon = new ol.style.Icon({
			anchor: [0.5, 0.5],
			crossOrigin: 'anonymous',
			src: src,
			img: img,
			scale: 0.8,
			imgSize: img ? [img.width, img.height] : undefined
		})

		return new ol.style.Style({
			image: icon
		})
	}

	private handleMapClick = (evt: any) => {
		const coords = this.map.getCoordinateFromPixel(evt.pixel);

		// check if an icon already exists at the pixel given
		let found = false;
		this.map.forEachFeatureAtPixel(evt.pixel, f => { found = true });

		if(found) {
			console.log("cannot add icon. Already exists")
			return;
		}

		let feature = new ol.Feature(new ol.geom.Point(coords));
		feature.setStyle(this.createIconStyle(this.coffeeShopIconPath, undefined));
		feature.setProperties({ name: 'test point', value: 15 });

		this.vectorSource.addFeature(feature);
	}

	ngOnInit() {
		this.vectorSource = new ol.source.Vector();
		this.vectorLayer = new ol.layer.Vector({ source: this.vectorSource })

		this.map = new ol.Map({
			target: 'map-container',
			view: new ol.View({ center: ol.proj.fromLonLat(this.initialPosition), zoom: this.initialZoom }),
			layers: [
				new ol.layer.Tile({ source: new ol.source.OSM() }),
				this.vectorLayer
			]
		})

		this.map.on('click', this.handleMapClick)

		// let style = new ol.style.Style(
		// 	{
		// 		image: new ol.style.Circle({
		// 			radius: 7,
		// 			fill: new ol.style.Fill({
		// 				color: 'yellow'
		// 			}),
		// 			stroke: new ol.style.Stroke({
		// 		 		color: 'blue'
		// 		 	})

		// 	 })
		// 	}
		// )

		// add favicon feature
		let feature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([23, 38])));
		feature.setStyle(this.createIconStyle(this.coffeeShopIconPath, undefined));
		feature.setProperties({ name: 'test point', value: 15 });

		this.vectorSource.addFeature(feature);
	}

}