import { getNodes } from "nodes.js";

const HackScript = "hack.js";
const GrowScript = 'grow.js';
const WeakenScript = 'weaken.js';
const AllInOne = 'hack-weaken-grow.js';

const Options = [
    ["killscript", false],
    ["delay", 3000],
    ["target", ""],
    ['host', []],
    ['loop', true]
];

/** * @param {NS} ns **/
export async function main(ns) {
    if (ns.args.length == 0) {
        ns.tprint(Options);
        return;
    }
    const param = ns.flags(Options);

    if (ns.getServerRequiredHackingLevel(param.target) > ns.getHackingLevel()) {
        ns.tprint("Doesn't meet the required hacking level.")
    }

    let nodes = param.host;
    if (nodes.length == 0) {
        nodes = getNodes(ns);
    }

    for (let node of nodes) {
        if (!ns.hasRootAccess(node)) continue;
        if (param.killscript) {
            ns.scriptKill(HackScript, node);
            ns.scriptKill(GrowScript, node);
            ns.scriptKill(WeakenScript, node);
        }


        let thread = calcThreadForServer(ns, node);
        if (thread != null) {
            if (node != 'home') {
                await ns.scp([HackScript, GrowScript, WeakenScript], "home", node);
            }            ns.exec(HackScript, node, thread.hack, '--target', param.target, '--thread', thread.hack, '--affectstock', '--loop');
            ns.exec(GrowScript, node, thread.grow, '--target', param.target, '--thread', thread.grow, '--affectstock', '--loop');
            ns.exec(WeakenScript, node, thread.weaken, '--target', param.target, '--thread', thread.weaken, '--affectstock', '--loop');
        } else {
            if (node != 'home') {
                await ns.scp(AllInOne, "home", node);
            }
            ns.exec(AllInOne, node, 1, '--target', param.target);
        }
    }

    ns.toast("Done runhack v2");
}


function calcThreadForServer(ns, node) {
    let mem = (ns.getServerMaxRam(node) - ns.getServerUsedRam(node));

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
        thread.grow = 2;
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
