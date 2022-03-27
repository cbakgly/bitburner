import { getNodes } from "nodes.js";

const Options = [
    ["delay", 3000],
    ['pserver', false],
    ['targets', false],
];

const PServer = 'pserv';
/** * @param {NS} ns **/
export async function main(ns) {
    const param = ns.flags(Options);
    ns.tprint(param);

    for (let node of getNodes(ns)) {
        if (!ns.hasRootAccess(node)) continue;
        if (param.pserver && node.indexOf(PServer) >= 0) {
            ns.killall(node);
        }
        if (param.targets && node.indexOf(PServer) < 0) {
            ns.killall(node);
        }
    }

    ns.toast("Done kill");
}

