var expect = require('chai').expect;
var helper = require('./helper/dns-cache_helper')();

describe('DNS-CACHE - examination', function() {
    var dns = null;
    var unitOfWork = null;
    var dnsCache = null;
    var resultMatrix = [];

    before(function(done) {
        dns = require('native-dns');
        unitOfWork = require('./../unitOfWork')();
        dnsCache = require('./../domain/dns-cache')(dns, unitOfWork);
        done();
    });

    describe('A record', function() {
        var recordType = null;
        before(function(done){
            recordType = 'A';
            dnsCache.resolveDns('google.com', recordType,
                function(err){
                    resultMatrix[recordType] = helper.createDnsResult(null, err);
                    done();
                },
                function(res){
                    resultMatrix[recordType] = helper.createDnsResult(res, null);
                    done();
                }
            );
        });

        it('Should be no error.', function(){
           expect(resultMatrix[recordType].err).to.be.null;
        });

        it('Should resolve A record.', function(){
            expect(resultMatrix[recordType]).to.be.not.undefined;
            expect(resultMatrix[recordType]).to.be.not.null;
            expect(resultMatrix[recordType].res).to.be.not.undefined;
            expect(resultMatrix[recordType].res).to.be.not.null;
            expect(resultMatrix[recordType].res.length).to.be.not.equal(0);
        });

        it('Should proper IP address.', function(){
           var ipArray = resultMatrix[recordType].res;
           ipArray.forEach(function(ip){
               expect(ip).to.be.not.null;
               expect(ip.address).to.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/);
           });
        });
    });

    describe('AAAA record', function() {
        var recordType = null;
        before(function(done){
            recordType = 'AAAA';
            dnsCache.resolveDns('google.com', recordType,
                function(err){
                    resultMatrix[recordType] = helper.createDnsResult(null, err);
                    done();
                },
                function(res){
                    resultMatrix[recordType] = helper.createDnsResult(res, null);
                    done();
                }
            );
        });

        it('Should be no error.', function(){
            expect(resultMatrix[recordType].err).to.be.null;
        });

        it('Should resolve AAAA record.', function(){
            expect(resultMatrix[recordType]).to.be.not.undefined;
            expect(resultMatrix[recordType]).to.be.not.null;
            expect(resultMatrix[recordType].res).to.be.not.undefined;
            expect(resultMatrix[recordType].res).to.be.not.null;
            expect(resultMatrix[recordType].res.length).to.be.not.equal(0);
        });

        it('Should proper IP address.', function(){
            var ipArray = resultMatrix[recordType].res;
            ipArray.forEach(function(ip){
                expect(ip).to.be.not.null;
                expect(ip.address).to.match(/^[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}/);
            });
        });
    });

    describe('NS record', function() {
        var recordType = null;
        before(function(done){
            recordType = 'NS';
            dnsCache.resolveDns('google.com', recordType,
                function(err){
                    resultMatrix[recordType] = helper.createDnsResult(null, err);
                    done();
                },
                function(res){
                    resultMatrix[recordType] = helper.createDnsResult(res, null);
                    done();
                }
            );
        });

        it('Should be no error.', function(){
            expect(resultMatrix[recordType].err).to.be.null;
        });

        it('Should resolve NS record.', function(){
            expect(resultMatrix[recordType]).to.be.not.undefined;
            expect(resultMatrix[recordType]).to.be.not.null;
            expect(resultMatrix[recordType].res).to.be.not.undefined;
            expect(resultMatrix[recordType].res).to.be.not.null;
            expect(resultMatrix[recordType].res.length).to.be.not.equal(0);
        });

        it('Should proper DATA address.', function(){
            var nsArray = resultMatrix[recordType].res;
            nsArray.forEach(function(ns){
                expect(ns).to.be.not.null;
                expect(ns.data.length).to.be.not.equal(0);
            });
        });
    });

    describe('MX record', function() {
        var recordType = null;
        before(function(done){
            recordType = 'MX';
            dnsCache.resolveDns('mail.google.com', recordType,
                function(err){
                    resultMatrix[recordType] = helper.createDnsResult(null, err);
                    done();
                },
                function(res){
                    resultMatrix[recordType] = helper.createDnsResult(res, null);
                    done();
                }
            );
        });

        it('Should be no error.', function(){
            expect(resultMatrix[recordType].err).to.be.null;
        });

        it('Should resolve MX record.', function(){
            expect(resultMatrix[recordType]).to.be.not.undefined;
            expect(resultMatrix[recordType]).to.be.not.null;
            expect(resultMatrix[recordType].res).to.be.not.undefined;
            expect(resultMatrix[recordType].res).to.be.not.null;
            expect(resultMatrix[recordType].res.length).to.be.not.equal(0);
        });

        it('Should proper MX address.', function(){
            var mxArray = resultMatrix[recordType].res;
            mxArray.forEach(function(mx){
                expect(mx).to.be.not.null;
                expect(mx.data).to.be.not.equal(0);
            });
        });
    });
});
