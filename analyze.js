import { getNodes } from "nodes.js";

// analyze a node to find if worthy to hack at first.

/*** @param {NS} ns**/
export function main(ns) {

    const Options = [
        ['target', ''],
        ['help', false]
    ];
    const param = ns.flags(Options);

    if (param.help) {
        ns.tprint(Options);
        return;
    }

    if (param.target !== '') {
        ns.tprint(ns.getServer(param.target));
        ns.tprint("1 thread money hack" + ns.hackAnalyze(param.target));
        ns.tprint("hack chance " + ns.hackAnalyzeChance(param.target));
        ns.tprint("increasing sec " + ns.hackAnalyzeSecurity(param.target));
        ns.tprint("threads for 0.75 money " + ns.hackAnalyzeThreads(param.target, 0.75 * ns.getServerMaxMoney(param.target)));
        return;
    }

    let result = getTargets(ns);

    ns.tprint("First 3 nodes with max money");
    for (let i = 0; i < 3; i++)
        ns.tprint(result[i]);

    ns.tprint("First 3 nodes without mem");
    for (let i = 0, j = 0; i < result.length && j < 3; i++) {
        if (result[i].maxRam == 0) {
            ns.tprint(result[i]);
            j++;
        }
    }
}

export function getTargets(ns) {
    let result = [];
    for (let node of getNodes(ns)) {
        if (node === 'home') continue;

        let info = ns.getServer(node);

        if (!info.hasAdminRights || info.moneyMax == 0 || info.purchasedByPlayer || info.requiredHackingSkill > ns.getHackingLevel()) continue;

        result.push(info);
    }

    result.sort((a, b) => a.hackDifficulty - b.hackDifficulty);
    return result;
}

export function getNextTarget(ns, visited) {
    for (let candidate of getTargets(ns)) {
        if (visited.has(candidate.hostname)) continue;
        return candidate;
    }
    return null;
}