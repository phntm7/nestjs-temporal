"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueOptionsToken = getQueueOptionsToken;
function getQueueOptionsToken(name) {
    return name ? `TemporalQueueOptions_${name}` : 'TemporalQueueOptions_default';
}
