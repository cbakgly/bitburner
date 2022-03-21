const HackScript = "hack.js";
const reservedMem = 8; // 8g
/**
* @param {NS} ns
**/
export async function main(ns) {
    const Options = [
        ['target', ''],
        ['reserve-mem', reservedMem],
        ['affectstock', false],
        ["killscript", false],
    ]
    const param = ns.flags(Options);

    if (param.target == '') {
        ns.tprint(Options);
        return;
    }

    if (param.killscript) {
        while (ns.scriptRunning(HackScript, 'home')) {
            ns.scriptKill(HackScript, 'home');
            await ns.sleep(300);
        }
    }

    let numThreads = Math.floor((ns.getServerMaxRam('home') - ns.getServerUsedRam('home') - reservedMem) / ns.getScriptRam(HackScript));
    if (numThreads > 0) {
        if (param.affectstock) {
            ns.exec(HackScript, 'home', numThreads, '--target', param.target, '--thread', numThreads, '--affectstock');
        } else {
            ns.exec(HackScript, 'home', numThreads, '--target', param.target, '--thread', numThreads);
        }
    }

    ns.toast("hack running on home");
}

