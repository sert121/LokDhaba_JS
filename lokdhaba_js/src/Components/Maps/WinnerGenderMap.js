import React from 'react';
import { Map, GeoJSON, TileLayer, withLeaflet } from 'react-leaflet';
import '../../Assets/Styles/layout.css';
import 'leaflet/dist/leaflet.css';
import WinnerGenderLegends from './WinnerGenderLegends';
import PrintControlDefault from 'react-leaflet-easyprint';
import StateCentroids from '../../Assets/Data/StateCentroids.json';

export default class WinnerGenderMap extends React.Component {
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
			if (dataFilterOptions.has(constituency.properties.Sex)) {
				switch (constituency.properties.Sex) {
					case 'Male':
						style = {
							fillColor: '#1F78B4',
							weight: 1,
							opacity: 1,
							color: 'black',
							fillOpacity: 1
						};
						break;
					case 'Female':
						style = {
							fillColor: '#A6CEE3',
							weight: 1,
							opacity: 1,
							color: 'black',
							fillOpacity: 1
						};
						break;
					case 'Others':
						style = {
							fillColor: '#B2DF8A',
							weight: 1,
							opacity: 1,
							color: 'black',
							fillOpacity: 1
						};
						break;
						defualt: break;
				}
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

		var genders = data.map((X) => X.Sex);
		var legend = {};
		for (var i = 0; i < genders.length; i++) {
			var pty = genders[i];
			if (dataFilterOptions.has(pty)) {
				legend[pty] = legend[pty] ? legend[pty] + 1 : 1;
			}
		}

		var SortedKeys = Object.keys(legend).sort(function(a, b) {
			return legend[b] - legend[a];
		});
		var sortedLegend = {};
		for (var i = 0; i < SortedKeys.length; i++) {
			var pty = SortedKeys[i];
			sortedLegend[pty] = legend[pty];
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
					<label>{`Constituency types for ${electionType} in Assembly #${assemblyNo}`}</label>
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
					<WinnerGenderLegends Legend={sortedLegend} />
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
