import { getNodes } from "nodes.js";

// find source files around all nodes.

/*** @param {NS} ns**/
export function main(ns) {

    const Options = [
        ['file', true],
        ['help', false],
    ];
    const param = ns.flags(Options);

    if (param.help) {
        ns.tprint(Options);
        return;
    }

    if (param.file) {

        ns.tprint('Own source file ' + ns.getOwnedSourceFiles());

        for (let node of getNodes(ns)) {
            if (node === 'home') continue;

            let info = ns.getServer(node);

            if (info.purchasedByPlayer) continue;

            let files = ns.ls(node);

            files = files.filter(file => file !== 'hack.js');

            if (files.length == 0) continue;

            ns.tprint(node + "  " + files);

            // await ns.scp(files, node, 'home');
        }
        return;
    }


}