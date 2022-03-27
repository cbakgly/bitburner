import { getNodes } from "nodes.js";
import { getTargets } from 'analyze.js';

const HackScript = "hack.js";
const GrowScript = 'grow.js';
const WeakenScript = 'weaken.js';
const AllInOne = 'hack-weaken-grow.js';
const ServerPrefix = "pserv-";

const Options = [
    ["killscript", false],
    ["delay", 3000],
    ['reserveram', 12] // reserve 12g 
];

/** * @param {NS} ns **/
export async function main(ns) {
    if (ns.args.length == 0) {
        ns.tprint(Options);
        return;
    }
    const param = ns.flags(Options);

    let targets = getTargets(ns);

    for (let node of getNodes(ns)) {
        if (node.indexOf(ServerPrefix) < 0) continue;
        if (param.killscript) {
            ns.scriptKill(HackScript, node);
            ns.scriptKill(GrowScript, node);
            ns.scriptKill(WeakenScript, node);
        }

        let target = targets.pop().hostname;

        let thread = calcThreadForServer(ns, node, param.reserveram);
        if (thread != null) {
            if (node != 'home') {
                await ns.scp([HackScript, GrowScript, WeakenScript], "home", node);
            }
            ns.exec(HackScript, node, thread.hack, '--target', target, '--thread', thread.hack, '--affectstock', '--loop');
            ns.exec(GrowScript, node, thread.grow, '--target', target, '--thread', thread.grow, '--affectstock', '--loop');
            ns.exec(WeakenScript, node, thread.weaken, '--target', target, '--thread', thread.weaken, '--affectstock', '--loop');
        } else {
            if (node != 'home') {
                await ns.scp(AllInOne, "home", node);
            }
            ns.exec(AllInOne, node, 1, '--target', target);
        }
    }

    ns.toast("Done runhack v2");
}


function calcThreadForServer(ns, node, reserveram) {
    let mem = (ns.getServerMaxRam(node) - ns.getServerUsedRam(node));

    if (node == 'home') {
        mem -= reserveram;
    }

    let thread = {
        'hack': 1,
        'grow': 2,
        'weaken': 1
    };
    if (mem <= 4) {
        // ns.tprint("Not applicable.");
        return null;
    }

    if (mem >= 8) {
        thread.hack = 1;
        thread.grow = 3;
        thread.weaken = 1;
    }
    if (mem >= 16) {
        thread.hack = 1;
        thread.grow = 7;
        thread.weaken = 1;
    }
    if (mem >= 32) {
        thread.hack = 1;
        thread.grow = 14;
        thread.weaken = 3;
    }
    if (mem >= 64) {
        thread.hack = 2;
        thread.grow = 28;
        thread.weaken = 6;
    }
    if (mem >= 65) {
        let demand = ns.getScriptRam(HackScript) + ns.getScriptRam(GrowScript) * 10 + ns.getScriptRam(WeakenScript) * 2;

        let n = Math.floor(mem / demand);

        thread.hack = n;
        thread.grow = 10 * n;
        thread.weaken = 2 * n;
    }
    return thread;
}
