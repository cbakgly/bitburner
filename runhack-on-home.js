const HackScript = "hack.js";
const reservedMem = 8; // 8g
/**
* @param {NS} ns
**/
export async function main(ns) {
    const Options = [
        ['target', '']
    ]
    const param = ns.flags(Options);

    if (param.target == '') {
        ns.tprint(Options);
        return;
    }

    while (ns.scriptRunning(HackScript, 'home')) {
        ns.scriptKill(HackScript, 'home');
        await ns.sleep(300);
    }

    let numThreads = Math.floor((ns.getServerMaxRam('home') - ns.getServerUsedRam('home') - reservedMem) / ns.getScriptRam(HackScript));
    if (numThreads > 0) {
        ns.tprint(ns.exec(HackScript, 'home', numThreads, '--target', param.target ,'--thread', numThreads));
    }

    ns.toast("hack running");
}

