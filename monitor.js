// monitor.js
// https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.ns.md

import { getNextTarget } from 'analyze.js';

let ServerPrefix = "pserv-";

// todo:
// rank all nodes by hacking level asc, available money desc
// the easiest and richest node will be hacked at home or on pserver with most threads.

// all nodes with admin:
// 1 normal
// 2 money available, no mem
// 3 no money, mem available
// 4 neither of 

/**
 * automation:
 * 1 nuke
 * 2 copy
 * 3 hack
 */

/**
* @param {NS} ns
**/
export async function main(ns) {
    const Options = [['delay', 10000], ['clearmsg', false]];
    const param = ns.flags(Options);

    const port = ns.getPortHandle(1);

    if (param.clearmsg) {
        // port.clear();
        while (!port.empty()) ns.tprint(port.read());
    }

    const hacked = new Set();

    while (true) {
        while (port.empty()) {
            await ns.sleep(param.delay);
        }
        let report = port.read();

        let host = report.host;
        let money = report.totalMoney;
        let target = report.target;

        ns.print("");
        ns.print("Total money " + money);
        ns.print("Host " + host);
        ns.print("Target " + target);


        hacked.add(target);
        let nextTarget = getNextTarget(ns, hacked);
        if (nextTarget === null) {
            ns.toast("Monitor: no available target");
            await ns.sleep(param.delay);

            hacked.clear();
            continue;
        }
        ns.print("Next " + nextTarget.hostname);
        ns.print(nextTarget);

        if (host == 'home') {
            ns.run("runhack-on-home.js", 1, '--target', nextTarget.hostname, '--reserve-mem', 32);
        } else if (host.indexOf(ServerPrefix) >= 0) {
            ns.run('runhack-on-pserver.js', 1, '--target', nextTarget.hostname, '--host', host);
        } else {
            ns.run('runhack-on-target.js', 1, '--target', nextTarget.hostname, '--host', host);
        }
        await ns.sleep(param.delay);
    }
}
