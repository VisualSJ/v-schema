'use strict';

const Schema = require('../index');
const fs = require('fs');
const assert = require('assert');

describe('v-schema', () => {

    let schema;

    it('Create schema', () => {
        let string = fs.readFileSync(`${__dirname}/user.dms`, 'utf-8');
        schema = new Schema(JSON.parse(string));
    });

    it('Type error', () => {
        let infos = schema.scan({
            name: 0
        });
        assert.equal(infos.length, 1);
    });
});