import { getNodes } from "nodes.js";

// analyze a node to find if worthy to hack at first.

/*** @param {NS} ns**/
export function main(ns) {

    const Options = [
        ['target', ''],
        ['all', false],
        ['sort', 'hackeff']
    ];
    const param = ns.flags(Options);

    ns.tprint(param);

    let level = ns.getHackingLevel();
    let results = getAllTargetInfo(ns);
    results.sort((a, b) => a[param.sort] - b[param.sort]);

    for (let i of results) {
        // ns.tprint(i.hostname)
        if ((param.target != '' && param.target != i.hostname) || (!param.all && (i.reqlvl > level)) ) continue;
        ns.tprint(format(ns, i));
        ns.tprint('');
    }
}

export function getAllTargetInfo(ns) {
    let player = ns.getPlayer();
    let results = [];
    for (let node of getNodes(ns)) {
        let info = ns.getServer(node);
        if (info.purchasedByPlayer) continue;

        let result = {
            'hostname': info.hostname,
            'admin': info.hasAdminRights,
            'reqlvl': info.requiredHackingSkill,
            'ram': info.maxRam,
            'mRatio': (info.moneyAvailable / (info.moneyMax + 1)),
            'mMax': info.moneyMax,
            'mNow': info.moneyAvailable,
            'growth': info.serverGrowth,
            'hackeff': info.moneyMax / ns.getHackTime(node),
            'groweff': info.moneyAvailable / ns.getGrowTime(node),
            'hack1thread': ns.hackAnalyze(node),
            'hackchance': ns.hackAnalyzeChance(node),
            'hsecur+': ns.hackAnalyzeSecurity(node),
            'gsecur+': ns.growthAnalyzeSecurity(10),
            'secur': info.hackDifficulty,
            'weaken1-1': ns.weakenAnalyze(1, 1), // 1 thread, 1 core, weaken effect
            'weaken10-1': ns.weakenAnalyze(10, 1), // 1 thread, 1 core, weaken effect
            'weaken1-2': ns.weakenAnalyze(1, 2), // 1 thread, 1 core, weaken effect
            'htime': ns.getHackTime(node),
            'gtime': ns.getGrowTime(node),
            'wtime': ns.getWeakenTime(node),
            'hackAvailMoneyThread': ns.hackAnalyzeThreads(info.hostname, info.moneyAvailable),
            'growDoubleThread': ns.growthAnalyze(node, 2, 1), // times to double
            'grow1HalfThread': ns.growthAnalyze(node, 1.5, 1), // times to double
            'grow25Thread': ns.growthAnalyze(node, 25, 1), // times to double
        };

        if (ns.fileExists("formulas.exe", "home")) {
            result['hackChance'] = ns.formulas.hacking.hackChance(info, player);
            result['hackExp'] = ns.formulas.hacking.hackExp(info, player);
            result['hack%'] = ns.formulas.hacking.hackPercent(info, player);
            result['hackTime'] = ns.formulas.hacking.hackTime(info, player);
            result["grow%"] = ns.formulas.hacking.growPercent(info, 1, player, 1);
            result['growTime'] = ns.formulas.hacking.growTime(info, player);
            result['weakTime'] = ns.formulas.hacking.weakenTime(info, player);
        }

        results.push(result);
    }
    // results.sort((a, b) => a.groweff - b.groweff);
    // results.sort((a, b) => a.hackeff - b.hackeff);
    return results;
}

function format(ns, info) {
    let result = {
        'host': info.hostname,
        'admin': info.admin,
        'reqlvl': info.requiredHackingSkill,
        'ram': ns.nFormat(info.ram, '0'),
        'mRatio': ns.nFormat(info.mRatio, '0.000%'),
        'mMax': ns.nFormat(info.mMax, '0.00a'),
        'mNow': ns.nFormat(info.mNow, '0.00a'),
        'growth': info.growth,
        'hackeff': ns.nFormat(info.hackeff, '0.0000a'),
        'groweff': ns.nFormat(info.groweff, '0.0000a'),
        'secur': ns.nFormat(info.secur, '0.0a'),
        'hack1thread': ns.nFormat(info.hack1thread, '0.000a'),
        'hackchance': ns.nFormat(info.hackchance, '0.000a'),
        'hsecur+': ns.nFormat(info['hsecur+'], '0.000a'),
        'gsecur+': info['gsecur+'],
        'weaken1-1': ns.nFormat(info['weaken1-1'], '0.000a'), // 1 thread, 1 core, weaken effect
        'weaken10-1': ns.nFormat(info['weaken10-1'], '0.000a'), // 1 thread, 1 core, weaken effect
        'weaken1-2': ns.nFormat(info['weaken1-2'], '0.000a'), // 1 thread, 1 core, weaken effect
        'htime': ns.tFormat(info.htime),
        'gtime': ns.tFormat(info.gtime),
        'wtime': ns.tFormat(info.wtime),
        'hackAvailMoneyThread': ns.nFormat(info.hackAvailMoneyThread, '0.000a'),
        'growDoubleThread': ns.nFormat(info.growDoubleThread, '0'), // times to double
        'grow1HalfThread': ns.nFormat(info.grow1HalfThread, '0'), // times to double
        'grow25Thread': ns.nFormat(info.grow25Thread, '0')
    }

    if (ns.fileExists("formulas.exe", "home")) {
        result['hackChance'] = ns.nFormat(info.hackChance, '0.00a');
        result['hackExp'] = ns.nFormat(info.hackExp, '0.00a');
        result['hack%'] = ns.nFormat(info.hackPercent, '0.00a');
        result['hackTime'] = ns.tFormat(info.hackTime);
        result["grow%"] = ns.nFormat(info['grow%'], '0.00a');
        result['growTime'] = ns.tFormat(info.growTime);
        result['weakTime'] = ns.tFormat(info.weakenTime);
    }

    return result;
}

export function getTargets(ns) {
    let result = [];
    let level = ns.getHackingLevel();
    for (let info of getAllTargetInfo(ns)) {

        if (!info.admin
            || info.mMax < 1000
            || info.reqlvl > level
            || info.hack1thread < 0.001) continue;

        result.push(info);
    }
    result.sort((a, b) => a.hackeff - b.hackeff);

    return result;
}

export function getNextTarget(ns, visited) {
    for (let candidate of getTargets(ns)) {
        if (visited.has(candidate.hostname)) continue;
        return candidate;
    }
    return null;
}