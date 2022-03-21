// monitor.js
// https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.ns.md

/**
* @param {NS} ns
**/
export async function main(ns) {
    
    ns.run("nuke.js");
    ns.run("copy.js");

    await ns.sleep(3000);

    ns.run("monitor.js");

    ns.run("runhack-on-target.js");
    //ns.run("buy-hacknode.js");
    ns.run("buy-server.js", 1, '--target', 'foodnstuff');
    ns.run("runhack-on-home.js", 1, '--target', 'joesguns');
    ns.run("runhack-on-pserver.js", 1, '--target', 'joesguns');

    ns.toast("Done bootstrap");
}