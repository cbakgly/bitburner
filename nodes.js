// basic import file

/*** @param {NS} ns**/
export function getNodes(ns) {
    let visited = new Map();

    loop("home", null, visited, ns);

    visited.delete('home');

    return visited.keys();
}

/*** @param {NS} ns**/
export function getRoutes(ns) {
    let visited = new Map();

    loop("home", null, visited, ns);

    return visited;
}

function loop(node, parent, visited, ns) {
    visited.set(node, parent);

    let nextNodes = ns.scan(node);
    // ns.print(nextNodes);

    while (nextNodes.length > 0) {
        let nextNode = nextNodes.shift();

        if (visited.has(nextNode)) {
            // ns.print("pass " + nextNode);
            continue;
        }

        // ns.print("visiting " + nextNode);
        loop(nextNode, node, visited, ns);
    }
}