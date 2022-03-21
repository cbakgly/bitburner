import { getNodes } from "nodes.js";

const ServerPrefix = "pserv-";
const HackScript = "hack.js";
const Options = [
    ["killscript", false], 
    ["delay", 3000], 
    ['host', []], 
    ['target', ''],
    ['affectstock', false],
];
/**
* @param {NS} ns
**/
export async function main(ns) {

    const param = ns.flags(Options);

    let nodes = param.host;
    if (nodes.length == 0) {
        nodes = getNodes(ns);
    }

    for (let node of nodes) {
        if (node.indexOf(ServerPrefix) >= 0 || node === "home") continue;

        if (param.killscript) {
            while (ns.scriptRunning(HackScript, node)) {
                ns.scriptKill(HackScript, node);
                await ns.sleep(param.delay);
            }
        }

        let numThreads = Math.floor(ns.getServerMaxRam(node) / ns.getScriptRam(HackScript));
        if (numThreads > 0) {
            if (param.affectstock) {
                ns.exec(HackScript, node, numThreads, '--thread', numThreads, '--target', param.target, '--affectstock');
            } else {
                ns.exec(HackScript, node, numThreads, '--thread', numThreads, '--target', param.target);
            }
        }
        else {
            // if no mem available, run hack.js at home
            ns.tprint("No mem " + node);
        }
    }

    ns.toast("Done runhack");
}

