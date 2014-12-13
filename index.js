var _ = require('lodash');
var MapnikBackend = require('tilelive-mapnik');

module.exports = function(options) {
	options = _.defaults(options, {
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
		var url = 'mapnik://' + options.xml + '?' + [
			'metatile=' + options.metatile,
			'resolution=' + options.resolution,
			'bufferSize=' + options.bufferSize,
			'tileSize=' + options.tileSize,
			'scale=' + options.scale
		].join('&');

		new MapnikBackend(url, function(err, result) {
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
	function serve(server, req, callback) {
		source.getTile(req.z, req.x, req.y, callback);
	}

	return {
		init: initialize,
		serve: serve
	};
};