"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objToValInitials = exports.objToValArray = exports.objToRevMap = void 0;
function objToRevMap(obj) {
    return Object.keys(obj)
        .reduce((crr, k) => crr.set(obj[k], k), new Map());
}
exports.objToRevMap = objToRevMap;
function objToValArray(obj) {
    return Object.values(obj)
        .reduce((crr, v) => crr.concat(v), []);
}
exports.objToValArray = objToValArray;
function objToValInitials(obj) {
    return Object.values(obj)
        .reduce((crr, v) => crr.concat(v.charAt(0)), []);
}
exports.objToValInitials = objToValInitials;
