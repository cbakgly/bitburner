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
        return;
    }

    for (let i of getAllTargetInfo(ns)) {
        ns.tprint(i);
    }
}

export function getAllTargetInfo(ns) {
    let nodes = [];
    for (let node of getNodes(ns)) {
        let info = ns.getServer(node);

        if (info.purchasedByPlayer) continue;

        nodes.push(info);
    }

    nodes.sort((a, b) => a.moneyMax - b.moneyMax);

    let player = ns.getPlayer();
    let results = [];
    for (let info of nodes) {
        let result = {
            'hostname': info.hostname,
            'mMem': ns.nFormat(info.maxRam, '0'),
            'mMax': ns.nFormat(info.moneyMax, '0.00a'),
            'mNow': ns.nFormat(info.moneyAvailable, '0.00a'),
            'growth': info.serverGrowth,
            'hard': ns.nFormat(info.hackDifficulty, '0.0a'),
            'reqlvl': info.requiredHackingSkill,
            'admin': info.hasAdminRights
        };

        if (ns.fileExists("formulas.exe", "home")) {
            result["grow%"] = ns.nFormat(ns.formulas.hacking.growPercent(info, 1, player, 1), '0.00a');
            result['growTime'] = ns.tFormat(ns.formulas.hacking.growTime(info, player));
            result['hackChance'] = ns.nFormat(ns.formulas.hacking.hackChance(info, player), '0.00a');
            result['hackExp'] = ns.nFormat(ns.formulas.hacking.hackExp(info, player), '0.00a');
            result['hack%'] = ns.nFormat(ns.formulas.hacking.hackPercent(info, player), '0.00a');
            result['hackTime'] = ns.tFormat(ns.formulas.hacking.hackTime(info, player));
            result['weakTime'] = ns.tFormat(ns.formulas.hacking.weakenTime(info, player));
        }

        results.push(result);
    }
    return results;
}

export function getTargets(ns) {
    let result = [];
    let level = ns.getHackingLevel();
    for (let info of getAllTargetInfo(ns)) {

        if (!info.admin 
            || info.mMax == 0 
            || info.reqlvl > level) continue;

        result.push(info);
    }

    result.sort((a, b) => a.hard - b.hard);
    return result;
}

export function getNextTarget(ns, visited) {
    for (let candidate of getTargets(ns)) {
        if (visited.has(candidate.hostname)) continue;
        return candidate;
    }
    return null;
}