"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapBlocks = exports.createBlocks = void 0;
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSX";
function createBlocks(start, end) {
    const numberOfIndicators = 1 + Math.floor(Math.random() * 2);
    const numberOfObservations = 10 + Math.floor(Math.random() * 20);
    const identity = createIdentity();
    const indicators = Array.from({ length: numberOfIndicators }, () => createIndicator(start, end, identity));
    const observations = Array.from({ length: numberOfObservations }, () => createObservation(start, end, identity, indicators));
    const blocks = [identity, ...indicators, ...observations.flatMap(o => [o.sighting, o.observedData])];
    blocks.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    return blocks;
}
exports.createBlocks = createBlocks;
function wrapBlocks(blocks) {
    return {
        created: (0, date_fns_1.format)(new Date(), DATE_FORMAT),
        guid: (0, uuid_1.v4)(),
        event_type: "data.stub.blocked",
        publisher: "stub",
        integrity: "some-string",
        privacy: [],
        history: [],
        payload: {
            spec_version: "2.0",
            id: `bundle--${(0, uuid_1.v4)()}`,
            type: "bundle",
            objects: blocks,
        }
    };
}
exports.wrapBlocks = wrapBlocks;
function createIdentity() {
    return {
        type: "identity",
        id: "identity--59a54192-0b63-404e-bae3-b531c216e02c",
        created: "2020-07-28T15:20:13.657Z",
        modified: "2020-07-28T15:20:13.657Z",
        name: "Stub Sicirity",
        identity_class: "organization"
    };
}
function createIndicator(start, end, identity) {
    const timeOfEvent = createTimeInWindow(start, end);
    return {
        type: "indicator",
        id: `indicator--${(0, uuid_1.v4)()}`,
        created: timeOfEvent,
        modified: timeOfEvent,
        created_by_ref: identity.id,
        labels: ["malicious-activity"],
        pattern: "[ domain-name:value = 'stub-unknown' ]",
        valid_from: timeOfEvent,
        valid_until: timeOfEvent
    };
}
function createObservation(start, end, identity, indicators) {
    const timeOfEvent = createTimeInWindow(start, end);
    const observedDataId = `observed-data--${(0, uuid_1.v4)()}`;
    return {
        observedData: createObservedData(timeOfEvent, observedDataId, identity),
        sighting: createSighting(timeOfEvent, observedDataId, identity, indicators)
    };
}
function createObservedData(timeOfEvent, observedDataId, identity) {
    return {
        type: "observed-data",
        id: observedDataId,
        created: timeOfEvent,
        modified: timeOfEvent,
        created_by_ref: identity.id,
        first_observed: timeOfEvent,
        last_observed: timeOfEvent,
        number_observed: 1,
        objects: {
            "0": {
                type: "x-stub-block",
                qname: "stub-site-a.shop",
                qtype: "A",
                qclass: "IN",
                src_ip_network_type: "ipv4",
                src_ip: "131.125.78.219",
                src_port: "8080",
                rpz_range: "domain-name",
                rpz_range_matched: "stub-site-a.shop",
                rpz_zone: "stub-zone",
            },
            "1": {
                type: "x-stub-threat-feed-source",
                name: "unknown-feed",
                meta_data: [
                    {
                        key: "threat_type",
                        value: "unknown"
                    },
                    {
                        key: "threat_details",
                        value: "unknown"
                    },
                    {
                        key: "raw_feed_meta_data",
                        value: "unknown"
                    }
                ]
            }
        }
    };
}
function createSighting(timeOfEvent, observedDataId, identity, indicators) {
    return {
        type: "sighting",
        id: `sighting--${(0, uuid_1.v4)()}`,
        created: timeOfEvent,
        modified: timeOfEvent,
        created_by_ref: identity.id,
        sighting_of_ref: randomOneOf(indicators).id,
        observed_data_refs: [observedDataId]
    };
}
function createTimeInWindow(start, end) {
    const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const date = new Date(timestamp);
    return (0, date_fns_1.format)(date, DATE_FORMAT);
}
function randomOneOf(many) {
    return many[Math.floor(Math.random() * many.length)];
}
