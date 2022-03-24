import { getRoutes } from "nodes.js";

// print all nodes or find route to connect

/*** @param {NS} ns**/
export function main(ns) {

    const Options = [
        ['to', ''],
        ['search', '']
    ];
    const param = ns.flags(Options);

    ns.tprint(param);

    let nodes = getRoutes(ns);

    if (param.to != '') {
        let c = param.to;
        while (c != null) {
            let p = nodes.get(c);

            ns.tprint(c + ' -> ' + p);
            c = p;
        }
        return;
    }

    if (param.search != '') {
        for (let node of nodes.keys()) {
            if (node.indexOf(param.search) >= 0)
                ns.tprint(node);
        }
        return;
    }

    for (let node of nodes.keys()) {
        ns.tprint(node);
    }
}