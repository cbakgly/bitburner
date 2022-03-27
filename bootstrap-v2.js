// monitor.js
// https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.ns.md

/**
* @param {NS} ns
**/
export async function main(ns) {
    
    ns.run("nuke.js");
    ns.run("buy-hacknode.js", 1, '--skipcore');
    ns.run("buy-server-v2.js", 1, '--target', 'harakiri-sushi', '--ram', 2048);
    ns.run("runhack-v2.js", 1, '--target', 'harakiri-sushi');
    ns.run("runhack-v2.js", 1, '--target', 'harakiri-sushi', '--host', 'home');

    ns.toast("Done bootstrap");
}