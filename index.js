'use strict';

let _getDefaultValue = function (type) {
    switch (type) {
        case 'string':
            return '';
        case 'number':
            return 0;
        case 'array':
            return [];
        case 'object':
            return {};
        default:
            return null;
    }
};

let _completionProperty = function (property) {
    if (property.default) {
        property.default = _getDefaultValue(property.type);
    }

    if (property.properties) {
        Object.keys(property.properties).forEach((key) => {
            _completionProperty(property.properties[key]);
        });
    }

    return property;
};

let _checkType = function (type, value) {
    switch (type) {
        case 'string':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number' && !isNaN(value);
        case 'array':
            return Array.isArray(value);
        case 'object':
            return typeof value === 'object' && !Array.isArray(value);
        default:
            return false;
    }
};

let _checkProperty = function (infos, schema, value, path) {
    if (value === undefined) {
        return;
    }

    if (!_checkType(schema.type, value)) {
        infos.push(`Property type error: ${path} must be ${schema.type}`);
    }

    if (schema.properties) {
        let root = path ? `${path}.` : '';
        Object.keys(schema.properties).forEach((key) => {
            _checkProperty(infos, schema.properties[key], value[key], `${path}${key}`);
        });
    }
};

class Schema {

    constructor (schema) {
        this._schema = _completionProperty(schema);
    }

    scan (json) {
        let infos = [];
        _checkProperty(infos, this._schema, json);
        return infos;
    }
}

module.exports = Schema;