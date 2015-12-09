var tilestrata = require('tilestrata');
var TileServer = tilestrata.TileServer;
var TileRequest = tilestrata.TileRequest;
var mapnik = require('../index.js');
var assert = require('chai').assert;
var fs = require('fs');

describe('Provider Implementation "mapnik"', function() {
	describe('serve()', function() {
		it('should render tile', function(done) {
			var server = new TileServer();
			var req = TileRequest.parse('/layer/0/0/0/tile.png');

			var provider = mapnik({pathname: __dirname + '/data/test.xml'});
			assert.equal(provider.name, 'mapnik');
			provider.init(server, function(err) {
				if (err) throw err;
				provider.serve(server, req, function(err, buffer, headers) {
					if (err) throw err;
					assert.deepEqual(headers, {'Content-Type': 'image/png'});
					assert.instanceOf(buffer, Buffer);

					var im_actual = buffer.toString('base64');
					var im_expected = fs.readFileSync(__dirname + '/fixtures/world.png').toString('base64');
					assert.equal(im_actual, im_expected);

					done();
				});
			});
		});
		it('should render interactivity tiles', function(done) {
			var server = new TileServer();
			var req = TileRequest.parse('/layer/0/0/0/tile.json');

			var provider = mapnik({pathname: __dirname + '/data/test.xml', interactivity: true});
			provider.init(server, function(err) {
				if (err) throw err;
				provider.serve(server, req, function(err, buffer, headers) {
					if (err) throw err;
					assert.deepEqual(headers, {'Content-Type': 'application/json'});
					assert.instanceOf(buffer, Buffer);

					var data_actual = buffer.toString('base64');
					var data_expected = fs.readFileSync(__dirname + '/fixtures/world.json').toString('base64');
					assert.equal(data_actual, data_expected);

					done();
				});
			});
		});
		it('render a tile from a string of mapnik xml', function(done) {
			var xml = [];
			xml.push('<Map srs="+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over" background-color="#ffffff">');
			    xml.push('<Parameters>');
			        xml.push('<Parameter name="center">1.054687500000007,29.53522956294847,2</Parameter>');
			        xml.push('<Parameter name="interactivity_layer">world</Parameter>');
			        xml.push('<Parameter name="interactivity_fields">NAME</Parameter>');
			        xml.push('<Parameter name="template"><![CDATA[<b>{{NAME}}</b>]]></Parameter>');
			    xml.push('</Parameters>');
			    xml.push('<Style name="world">');
			        xml.push('<Rule>');
			            xml.push('<PolygonSymbolizer fill="#eeeeee" clip="true" />');
			            xml.push('<LineSymbolizer stroke="#cccccc" stroke-width="0.5" clip="true" />');
			        xml.push('</Rule>');
			    xml.push('</Style>');

			    xml.push('<Layer name="world" srs="+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over">');
			        xml.push('<StyleName>world</StyleName>');
			        xml.push('<Datasource>');
			            xml.push('<Parameter name="file">test/data/world_merc/world_merc</Parameter>');
			            xml.push('<Parameter name="type">shape</Parameter>');
			        xml.push('</Datasource>');
			    xml.push('</Layer>');
			xml.push('</Map>');

			var server = new TileServer();
			var req = TileRequest.parse('/layer/0/0/0/tile.png');

			var provider = mapnik({
				xml: xml.join('')
			});
			provider.init(server, function(err) {
				if (err) throw err;
				provider.serve(server, req, function(err, buffer, headers) {
					if (err) throw err;
					assert.deepEqual(headers, {'Content-Type': 'image/png'});
					assert.instanceOf(buffer, Buffer);

					var im_actual = buffer.toString('base64');
					var im_expected = fs.readFileSync(__dirname + '/fixtures/world.png').toString('base64');
					assert.equal(im_actual, im_expected);

					done();
				});
			});
		});
	});
});
