window.Woo = function( id ) {
	this.people = [];
	this.init( id );
};

window.Woo.prototype = {
	init: function( id ) {
		this.map = L.map( id ).setView( [ 51.505, -0.09 ], 2 );
		L.tileLayer( 'https://{s}.tiles.mapbox.com/v4/examples.ra3sdcxr/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q', {
		} ).addTo( this.map );
		this.loadData().done( this.renderData.bind( this ) );
	},
	loadData: function() {
		var self = this,
			dfd = $.Deferred();

		$.getJSON( 'data/automattic.json', function( json ) {
			json.forEach( function( woo ) {
				self.people.push({
					"name": woo.name,
					"image": woo.image,
				 	"latitude": woo.latitude + Math.random() / 10 - Math.random() / 10 ,
					"longitude": woo.longitude + Math.random() / 10 - Math.random() / 10
				})
			});
			$.getJSON( 'data/wooimages.json', function( images ) {
				$.getJSON( 'data/woo.json' , function( woos ) {
					woos.forEach( function( woo ) {
						self.people.push({
	  						"name": woo.properties.name,
							"image": images[woo.properties.name],
						 	"latitude": woo.geometry.coordinates[1],
							"longitude": woo.geometry.coordinates[0],
						})
					});

					dfd.resolve();
				});
			})
		})

		return dfd.promise();
	},

	renderData: function() {
		this.addMarkers();
	},

	addMarkers: function() {
		var self = this;
		this.people.forEach( function( person ) {
			self.addPersonToMap( person );
		} );
	},
	addPersonToMap: function( person ) {
		if(person && person.image) {
			var icon = L.icon( {
				iconUrl: person.image,
				iconSize: [50,50],
				iconAnchor: [25,25],
				shadowUrl: person.image,
				shadowRetinaUrl: person.image,
				shadowSize: [ 0, 0 ],
				shadowAnchor: [ 50, 50 ]
			} );

			var marker = L.marker( [ person.latitude, person.longitude ], {className:"face", icon: icon} ).addTo( this.map );
			marker.bindPopup(person.name)
		}
	}
};




