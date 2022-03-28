import { getTargets } from 'analyze.js';

const HackScript = "hack.js";
const GrowScript = 'grow.js';
const WeakenScript = 'weaken.js';
const ServerPrefix = "pserv-";

/** * @param {NS} ns **/
export async function main(ns) {
    let param = ns.flags([
        ['home', false]
    ]);


    let targets = getTargets(ns);
    let servers = await getNodes(ns);

    if (param.home) {
        targets = targets.reverse()
        servers.unshift('home');
    }

    while (targets.length > 0 && servers.length > 0) {
        let target = targets[0];
        let node = servers[0];

        if (deploy(ns, node, target)) {
            ns.print(targets.shift());
        } else {
            ns.print(servers.shift());
        }
        await ns.sleep(300);
    }
    ns.toast("Done runhack v2");
}

async function getNodes(ns) {
    await ns.disableLog('scan');
    let servers = [];
    for (let node of ns.scan('home').sort()) {
        if (node.indexOf(ServerPrefix) < 0) continue;
        servers.push(node);
    }
    return servers;
}

/**
 * return true on success or false.
 * @param {*} ns 
 * @param {*} node 
 * @param {*} target 
 * @param {*} reserveram 
 */
function deploy(ns, node, target) {
    // let factor = 1 / target.mRatio;
    let factor = 1;
    let grow25Thread = Math.ceil(target.grow25Thread * factor);
    let weakenThread = Math.ceil((grow25Thread / 5) * factor);

    let hackAvailMoneyThread = Math.ceil(grow25Thread / 10);
    if (target.hackAvailMoneyThread > 0 && target.hackAvailMoneyThread < Infinity) {
        ns.print(">0 " + target.hackAvailMoneyThread);
        hackAvailMoneyThread = Math.min(Math.ceil(target.hackAvailMoneyThread * factor), hackAvailMoneyThread);
        hackAvailMoneyThread = Math.ceil(hackAvailMoneyThread * target.htime / target.gtime);
    }
    let demand = ns.getScriptRam(HackScript) * hackAvailMoneyThread + ns.getScriptRam(GrowScript) * grow25Thread + ns.getScriptRam(WeakenScript) * weakenThread;

    let mem = (ns.getServerMaxRam(node) - ns.getServerUsedRam(node));

    ns.print({
        'target': target.hostname,
        'hack': hackAvailMoneyThread,
        'grow': grow25Thread,
        'weaken': weakenThread,
        'demand': demand,
        'mem': mem,
        'node': node
    })

    if (mem < 2) return false;
    
    if (demand > mem) {
        let times = Math.ceil(demand / mem);
        grow25Thread = Math.ceil(grow25Thread / times);
        weakenThread = Math.ceil(weakenThread / times);
        hackAvailMoneyThread = Math.ceil(hackAvailMoneyThread / times);
    };

    ns.exec(HackScript, node, hackAvailMoneyThread, '--target', target.hostname, '--thread', hackAvailMoneyThread, '--affectstock', '--loop');
    ns.exec(GrowScript, node, grow25Thread, '--target', target.hostname, '--thread', grow25Thread, '--affectstock', '--loop');
    ns.exec(WeakenScript, node, weakenThread, '--target', target.hostname, '--thread', weakenThread, '--affectstock', '--loop');

    return true;
}

