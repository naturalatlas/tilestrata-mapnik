var _ = require('lodash');
var MapnikBackend = require('tilelive-mapnik');

module.exports = function(options) {
	options = _.defaults(options, {
		interactivity: false,
		xml: null,
		metatile: 2,
		resolution: 4,
		bufferSize: 128,
		tileSize: 256,
		scale: 1
	});

	var source;

	/**
	 * Initializes the mapnik datasource.
	 *
	 * @param {TileServer} server
	 * @param {function} callback(err, fn)
	 * @return {void}
	 */
	function initialize(server, callback) {
		new MapnikBackend(options, function(err, result) {
			source = result;
			callback(err);
		});
	}

	/**
	 * Renders a tile and returns the result as a buffer (PNG),
	 * plus the headers that should accompany it.
	 *
	 * @param {TileServer} server
	 * @param {TileRequest} req
	 * @param {function} callback(err, buffer, headers)
	 * @return {void}
	 */
	function serveImage(server, req, callback) {
		source.getTile(req.z, req.x, req.y, function(err, buffer, headers) {
			if (err) return callback(err);
			callback(err, buffer, _.clone(headers));
		});
	}

	/**
	 * Renders a an interactivity tile (JSON).
	 *
	 * @param {TileServer} server
	 * @param {TileRequest} req
	 * @param {function} callback(err, buffer, headers)
	 * @return {void}
	 */
	function serveGrid(server, req, callback) {
		source.getGrid(req.z, req.x, req.y, function(err, json, headers) {
			if (err) return callback(err);
			var buffer = new Buffer(JSON.stringify(json), 'utf8');
			buffer._utfgrid = json;
			callback(err, buffer, _.clone(headers));
		});
	}

	return {
		name: 'mapnik',
		init: initialize,
		serve: options.interactivity ? serveGrid : serveImage
	};
};
