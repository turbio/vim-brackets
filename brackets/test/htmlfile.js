var expect = require('chai').expect;
var fs = require("fs");

describe('htmlfile', function(){
	before(function(){
		this.htmlfile = require('../htmlfile');
	});

	beforeEach(function(done){
		this.file = new this.htmlfile('test/index.html', function(err){
			done(err);
		});
	});

	describe('constructor', function(){
		it('should not throw errors under any circumstance', function(){
			this.htmlfile();
		});
		it('should have no errors with valid file', function(done){
			this.htmlfile('test/index.html', function(err){
				expect(err).to.be.null;
				done();
			});
		});
		it('should have errors with nonexistent file', function(done){
			this.htmlfile('file which does not exist', function(err){
				err.should.be.ok;
				done();
			});
		});
		it('should have errors with invalid html');
	});

	describe('#tagFromPosition()', function(){
		it('should return null when given a negative line or column', function(){
			expect(this.file.tagFromPosition(-1, -1)).to.be.null;
		});
		it('should return null when given an out of bound line', function(){
			expect(this.file.tagFromPosition(10000, 0)).to.be.null;
		});
		it('should return null when given an out of bound column', function(){
			expect(this.file.tagFromPosition(0, 10000)).to.be.null;
		});
		[
			{line: 1, column: 0, expected: {name: 'html', index: 1}},
			{line: 3, column: 0, expected: {name: 'head', index: 2}},
			{line: 3, column: 1, expected: {name: 'title', index: 3}},
			{line: 21, column: 4, expected: {name: 'body', index: 6}},
			{line: 30, column: 1, expected: {name: 'ol', index: 13}},
			{line: 52, column: 1, expected: {name: 'tr', index: 29}},
			{line: 53, column: 1, expected: {name: 'table', index: 23}},
		].forEach(function(test){
			it('finds the correct element on ' + test.line + ':' + test.column, function(){
				var elem = this.file.tagFromPosition(test.line, test.column);
				elem.should.have.property('name', test.expected.name);
				elem.should.have.property('index', test.expected.index);
			});
		}, this);
	});

	describe('#webSrc()', function(){
		before(function(done){
			var self = this;
			fs.readFile('test/index_websrc.html', 'utf8', function(err, data){
				self.indexwebsrc = data;
				fs.readFile('frontend.js', 'utf8', function(err, data){
					self.frontendjs = data;
					fs.readFile('frontend.css', 'utf8', function(err, data){
						self.frontendcss = data;
						done(err);
					});
				});
			});
		});
		it('should have the contents of frontend.js injected inside', function(){
			this.file.webSrc().should.include(this.frontendjs);
		});
		it('should have the contents of frontend.css injected inside', function(){
			this.file.webSrc().should.include(this.frontendcss);
		});
		it('should return correctly formated html', function(){
			this.file.webSrc().should.equal(this.indexwebsrc);
		});
	});
});
