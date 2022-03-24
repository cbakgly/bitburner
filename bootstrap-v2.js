// monitor.js
// https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.ns.md

/**
* @param {NS} ns
**/
export async function main(ns) {
    
    ns.run("nuke.js");

    ns.run("buy-server-v2.js", 1, '--target', 'foodnstuff');
    ns.run("runhack-v2.js", 1, '--target', 'foodnstuff');
    ns.run("runhack-v2.js", 1, '--target', 'foodnstuff', '--host', 'home');

    ns.toast("Done bootstrap");
}