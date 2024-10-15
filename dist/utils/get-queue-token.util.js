"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueToken = getQueueToken;
exports.getAsyncQueueToken = getAsyncQueueToken;
function getQueueToken(name) {
    return name ? `TemporalQueue_${name}` : 'TemporalQueue_default';
}
function getAsyncQueueToken(name) {
    return name ? `TemporalAsyncQueue_${name}` : 'TemporalAsyncQueue_default';
}
