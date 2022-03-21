import { getNodes } from "nodes.js";

const ServerPrefix = "pserv-";
const HackScript = "hack.js";
const Options = [
    ["killscript", false], 
    ["delay", 3000], 
    ["target", "silver-helix"], 
    ['host', []],
    ['affectstock', false],
];
/**
* @param {NS} ns
**/
export async function main(ns) {
    if (ns.args.length == 0) {
        ns.tprint("Options:");
        ns.tprint(Options);
        return;
    }
    const param = ns.flags(Options);

    let nodes = param.host;
    if (nodes.length == 0) {
        nodes = getNodes(ns);
    }

    for (let node of nodes) {
        if (node.indexOf(ServerPrefix) < 0 || node === "home") continue;

        if (param.killscript) {
            while (ns.scriptRunning(HackScript, node)) {
                ns.scriptKill(HackScript, node);
                await ns.sleep(param.delay);
            }
        }

        let numThreads = Math.floor(ns.getServerMaxRam(node) / ns.getScriptRam(HackScript));
        if (numThreads > 0) {
            if (param.affectstock) {
                ns.exec(HackScript, node, numThreads, '--target', param.target, '--thread', numThreads, '--affectstock');
            } else {
                ns.exec(HackScript, node, numThreads, '--target', param.target, '--thread', numThreads);
            }
        }
    }

    ns.toast("Done run-on-server");
}

