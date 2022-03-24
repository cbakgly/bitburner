import { getNodes } from "nodes.js";

// find source files around all nodes.

/*** @param {NS} ns**/
export function main(ns) {
    for (let node of getNodes(ns)) {

        let info = ns.getServer(node);

        if (info.purchasedByPlayer) continue;

        let files = ns.ls(node);

        if (files.length == 0) continue;

        ns.tprint(node + "  " + files);

        // await ns.scp(files, node, 'home');
    }
}