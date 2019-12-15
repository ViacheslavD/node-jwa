/**
 * https://tools.ietf.org/html/rfc7515#appendix-A.2
 */

const fs = require('fs');
const path = require('path');

const Buffer = require('safe-buffer').Buffer;
const jwkToPem = require('jwk-to-pem');
const test = require('tap').test;

const jwa = require('../../');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'));
const inputFromBytes = Buffer.from(JSON.parse(fs.readFileSync(path.join(__dirname, 'input.bytes.json'), 'utf8')));

const jwk = JSON.parse(fs.readFileSync(path.join(__dirname, 'key.json'), 'utf8'));
const privKey = jwkToPem(jwk, { private: true });
const pubKey = jwkToPem(jwk);

const signature = fs.readFileSync(path.join(__dirname, 'signature.txt'), 'ascii');
const signatureFromBytes = Buffer.from(JSON.parse(fs.readFileSync(path.join(__dirname, 'signature.bytes.json'), 'utf8')));

const algo = jwa('RS256');

test('A.2', function (t) {
	t.plan(6);

	t.equivalent(input, inputFromBytes);
	t.equivalent(Buffer.from(signature, 'base64'), signatureFromBytes);

	t.equal(algo.sign(input, privKey), signature);
	t.equal(algo.sign(input.toString('ascii'), privKey), signature);

	t.ok(algo.verify(input, signature, pubKey));
	t.ok(algo.verify(input.toString('ascii'), signature, pubKey));
})
