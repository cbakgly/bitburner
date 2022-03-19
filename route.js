import { getRoutes } from "nodes.js";

// print all nodes or find route to connect

/*** @param {NS} ns**/
export function main(ns) {

    const Options = [
        ['help', false],
        ['routeto', ''],
        ['allnodes', true],
        ['search', '']
    ];
    const param = ns.flags(Options);

    if (param.help) {
        ns.tprint(Options);
        return;
    }

    let nodes = getRoutes(ns);

    if (param.routeto != '') {
        let c = param.routeto;
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

    if (param.allnodes) {
        for (let node of nodes.keys()) {
            ns.tprint(node);
        }
    }
}