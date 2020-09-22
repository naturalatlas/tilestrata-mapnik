var fs = require('fs');
var assert = require('assert');
var mapnik_backend = require('..');

describe('Info ', function() {

    it('getInfo()', function(done) {
        new mapnik_backend('mapnik://./test/data/world.xml', function(err, source) {
            if (err) throw err;
            source.getInfo(function(err, info) {
                if (err) throw err;
                var expected = {
                    name: 'Smallworld',
                    description: "It's a small world after all.",
                    id: 'world',
                    minzoom: 0,
                    maxzoom: 22,
                    center: [ 0, 0, 2 ]
                };
                assert.equal(info.name,expected.name);
                assert.equal(info.id,expected.id);
                assert.equal(info.minzoom,expected.minzoom);
                assert.equal(info.maxzoom,expected.maxzoom);
                assert.deepEqual(info.center,expected.center);
                done();
            });
        });
    });

    it('getInfo() with XML string', function(done) {
        var xml = fs.readFileSync('./test/data/world.xml', 'utf8');
        new mapnik_backend({
            protocol: 'mapnik:',
            pathname: './test/data/world.xml',
            search: '?' + Date.now(), // prevents caching
            xml: xml
        }, function(err, source) {
            if (err) throw err;
    
            source.getInfo(function(err, info) {
                if (err) throw err;
                var expected = {
                    name: 'Smallworld',
                    description: "It's a small world after all.",
                    id: 'world',
                    minzoom: 0,
                    maxzoom: 22,
                    center: [ 0, 0, 2 ]
                };
                assert.equal(info.name,expected.name);
                assert.equal(info.id,expected.id);
                assert.equal(info.minzoom,expected.minzoom);
                assert.equal(info.maxzoom,expected.maxzoom);
                assert.deepEqual(info.center,expected.center);
                done();
            });
        });
    });

    it('getInfo() with template', function(done) {
        new mapnik_backend('mapnik://./test/data/test.xml', function(err, source) {
            if (err) throw err;
    
            source.getInfo(function(err, info) {
                if (err) throw err;
                var expected = {
                    name: 'test',
                    id: 'test',
                    minzoom: 0,
                    maxzoom: 22,
                    center: [ 1.054687500000007, 29.53522956294847, 2 ],
                    template: '{{NAME}}'
                };
                assert.equal(info.name,expected.name);
                assert.equal(info.id,expected.id);
                assert.equal(info.minzoom,expected.minzoom);
                assert.equal(info.maxzoom,expected.maxzoom);
                assert.deepEqual(info.center,expected.center);
                done();
            });
        });
    });

    it('getInfo() with jpeg format defined', function(done) {
        new mapnik_backend('mapnik://./test/data/test-jpeg.xml', function(err, source) {
            if (err) throw err;
            source.getInfo(function(err, info) {
                if (err) throw err;
                assert.equal(info.format,"jpeg45");
                done();
            });
        });
    });

    it('creates backend from string with correct internal boolean values 1', function(done) {
        new mapnik_backend('mapnik://./test/data/world.xml', function(err, source) {
            if (err) throw err;
            assert.equal(source._autoLoadFonts,true);
            assert.equal(source._internal_cache,true);
            done();
        });
    });

    it('creates backend from string with correct internal boolean values 2', function(done) {
        new mapnik_backend('mapnik://./test/data/world.xml?autoLoadFonts=false&internal_cache=false', function(err, source) {
            if (err) throw err;
            assert.equal(source._autoLoadFonts,false);
            assert.equal(source._internal_cache,false);
            done();
        });
    });

    it('creates backend from object with correct internal boolean values', function(done) {
        var xml = fs.readFileSync('./test/data/world.xml', 'utf8');
        new mapnik_backend({
            protocol: 'mapnik:',
            pathname: './test/data/world.xml',
            query: {
                autoLoadFonts : false,
                internal_cache: false,
            },
            xml: xml } , function(err, s) {
                if (err) throw err;
                source = s;
                assert.equal(source._autoLoadFonts,false);
                assert.equal(source._internal_cache,false);
                done();
        });
    });

});
