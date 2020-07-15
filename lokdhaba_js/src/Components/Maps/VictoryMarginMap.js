import React from 'react';
import { Map, GeoJSON, TileLayer, withLeaflet } from 'react-leaflet';
import '../../Assets/Styles/layout.css';
import 'leaflet/dist/leaflet.css';
import VictoryMarginLegends from './VictoryMarginLegends';
import PrintControlDefault from 'react-leaflet-easyprint';
import StateCentroids from '../../Assets/Data/StateCentroids.json';

export default class VictoryMarginMap extends React.Component {
	onEachFeature = (feature, layer) => {
		var popupContent = '';
		for (var key in feature.properties) {
			if (feature.properties.hasOwnProperty(key)) {
				var value = feature.properties[key];
				popupContent += `<b>${key}:</b> ${value}<br/>`;
			}
		}
		layer.bindPopup(popupContent);
	};

	renderConstituencies = (mapGeoJson, dataFilterOptions) => {
		return mapGeoJson.map((constituency) => {
			let style = {
				fillColor: '#FFFFFF00',
				weight: 1,
				opacity: 1,
				color: 'black',
				fillOpacity: 1
			};
			var val = constituency.properties.Margin_Percentage;
			switch (true) {
				case !val:
					break;
				case val > 20 && dataFilterOptions.has('>20%'):
					style = {
						fillColor: '#0570b0',
						weight: 1,
						opacity: 1,
						color: 'black',
						fillOpacity: 1
					};
					break;
				case val >= 10 && val <= 20 && dataFilterOptions.has('10%-20%'):
					style = {
						fillColor: '#74a9cf',
						weight: 1,
						opacity: 1,
						color: 'black',
						fillOpacity: 1
					};
					break;
				case val >= 5 && val < 10 && dataFilterOptions.has('5%-10%'):
					style = {
						fillColor: '#bdc9e1',
						weight: 1,
						opacity: 1,
						color: 'black',
						fillOpacity: 1
					};
					break;
				case val < 5 && dataFilterOptions.has('<5%'):
					style = {
						fillColor: '#f1eef6',
						weight: 1,
						opacity: 1,
						color: 'black',
						fillOpacity: 1
					};
					break;
				default:
					break;
			}
			return (
				<GeoJSON key={constituency.id} data={constituency} style={style} onEachFeature={this.onEachFeature} />
			);
		});
	};

	render() {
		var data = this.props.data;
		var electionType = this.props.electionType === 'GE' ? 'Lok Sabha' : 'Vidhan Sabha';
		var assemblyNo = this.props.assemblyNo;
		const PrintControl = withLeaflet(PrintControlDefault);

		var dataFilterOptions = this.props.dataFilterOptions;
		//var leaflet = this.renderConstituencies(data.features,dataFilterOptions);

		var margins = data.map((X) => X.Margin_Percentage);
		var legend = {};
		for (var i = 0; i < margins.length; i++) {
			var val = margins[i];
			if (val > 20 && dataFilterOptions.has('>20%')) {
				legend['>20%'] = legend['>20%'] ? legend['>20%'] + 1 : 1;
			} else if (val >= 10 && val <= 20 && dataFilterOptions.has('10%-20%')) {
				legend['10%-20%'] = legend['10%-20%'] ? legend['10%-20%'] + 1 : 1;
			} else if (val >= 5 && val < 10 && dataFilterOptions.has('5%-10%')) {
				legend['5%-10%'] = legend['5%-10%'] ? legend['5%-10%'] + 1 : 1;
			} else if (val < 5 && dataFilterOptions.has('<5%')) {
				legend['<5%'] = legend['<5%'] ? legend['<5%'] + 1 : 1;
			}
		}

		var SortedKeys = [ '>20%', '10%-20%', '5%-10%', '<5%' ]; //Object.keys(legend).sort(function(a,b){return legend[b]-legend[a]})
		var sortedLegend = {};
		for (var i = 0; i < SortedKeys.length; i++) {
			var val = SortedKeys[i];
			if (legend[val]) {
				sortedLegend[val] = legend[val];
			}
		}

		var shape = this.props.map;
		var state = this.props.stateName;
		if (electionType === 'Lok Sabha') {
			for (var i = 0; i < data.length; i++) {
				data[i].key = data[i].State_Name + '_' + data[i].Constituency_No;
			}
			var joinMap = {
				geoKey: 'properties.State_Key', //here geoKey can be feature 'id' also
				dataKey: 'key'
			};
		} else {
			var joinMap = {
				geoKey: 'properties.ASSEMBLY', //here geoKey can be feature 'id' also
				dataKey: 'Constituency_No'
			};
		}

		var extendGeoJSON = require('extend-geojson-properties');

		extendGeoJSON(shape, data, joinMap);

		var leaflet = this.renderConstituencies(shape, dataFilterOptions);
		var st = state !== '' ? state : 'Lok_Sabha';
		var centerX = StateCentroids.filter(function(item) {
			return item.State_Name === st;
		})[0].Y;
		var centerY = StateCentroids.filter(function(item) {
			return item.State_Name === st;
		})[0].X;
		var zoom = StateCentroids.filter(function(item) {
			return item.State_Name === st;
		})[0].zoom;

		return (
			<div className="my-map" style={{ width: '100%', height: '100%' }}>
				<div style={{ textAlign: 'center' }}>
					<label>
						{`Constituency wise victory margin percentages for ${electionType} in Assembly #${assemblyNo}`}
					</label>
				</div>
				<Map
					center={[ centerX, centerY ]}
					zoom={zoom}
					maxZoom={zoom + 8}
					attributionControl={true}
					zoomControl={true}
					doubleClickZoom={true}
					scrollWheelZoom={false}
					dragging={true}
					animate={true}
					easeLinearity={0.35}
				>
					{leaflet}
					<VictoryMarginLegends Legend={sortedLegend} />
					<PrintControl
						ref={(ref) => {
							this.printControl = ref;
						}}
						position="topleft"
						sizeModes={[ 'Current', 'A4Portrait', 'A4Landscape' ]}
						hideControlContainer={false}
					/>
					<PrintControl
						position="topleft"
						sizeModes={[ 'Current', 'A4Portrait', 'A4Landscape' ]}
						hideControlContainer={false}
						title="Export as PNG"
						exportOnly
					/>
				</Map>
			</div>
		);
	}
}
