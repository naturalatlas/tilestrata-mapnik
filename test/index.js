var tilestrata = require('tilestrata');
var TileServer = tilestrata.TileServer;
var TileRequest = tilestrata.TileRequest;
var mapnik = require('../index.js');
var assert = require('chai').assert;
var fs = require('fs');
var imgdiff = require('img-diff').imagesMatch;

describe('Provider Implementation "mapnik"', function() {
	describe('serve()', function() {
		it('should render tile', function(done) {
			var server = new TileServer();
			var req = TileRequest.parse('/layer/0/0/0/tile.png');

			var provider = mapnik({xml: __dirname + '/data/test.xml'});
			provider.init(server, function(err) {
				assert.isFalse(!!err);
				provider.serve(server, req, function(err, buffer, headers) {
					assert.isFalse(!!err);
					assert.deepEqual(headers, {'Content-Type': 'image/png'});
					assert.instanceOf(buffer, Buffer);

					var im_actual = buffer.toString('base64');
					var im_expected = fs.readFileSync(__dirname + '/fixtures/world.png').toString('base64');
					try { imgdiff(im_actual, im_expected, 0.02); }
					catch (e) { throw new Error('Result too different from fixture'); }

					done();
				});
			});
		});
	});
});