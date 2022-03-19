/**
* @param {NS} ns
**/
export async function main(ns) {
    const Options = [
        ['target', ns.getHostname()],
        ['thread', 1],
        ['affectstock', false],
        ['delay', 3000],
        ['help', false]
    ];
    const param = ns.flags(Options);

    if (param.help) {
        ns.tprint("Options:");
        ns.tprint(Options);
        return;
    }

    param.host = ns.getHostname();

    ns.tprint(param);

    while (ns.getServerRequiredHackingLevel(param.target) > ns.getHackingLevel()) {
        await ns.sleep(param.delay);
        // return;
    }

    // if avaiable money is much lower than thresh?

    let moneyThresh = ns.getServerMaxMoney(param.target) * 0.75;
    let securityThresh = ns.getServerMinSecurityLevel(param.target) + 5;

    let total = 0;
    while (total < ns.getServerMaxMoney(param.target)) {
        let secLevel = ns.getServerSecurityLevel(param.target);
        ns.print("Security thresh " + securityThresh);
        let moneyAvailable = ns.getServerMoneyAvailable(param.target);
        ns.print("Money thresh " + moneyThresh);

        if (secLevel > securityThresh) {
            await ns.weaken(param.target, {threads: param.thread, stock: param.affectstock});
        } else if (moneyAvailable < moneyThresh) {
            await ns.grow(param.target,  {threads: param.thread, stock: param.affectstock});
        } else {
            total += await ns.hack(param.target,  {threads: param.thread, stock: param.affectstock});
            ns.print("Total money " + total);
        }
    }

    let report = {
        'script': 'hack.js',
        'param': param,
        'totalMoney': total
    }

    let port = ns.getPortHandle(1);
    while(!port.tryWrite(report)) {
        await ns.sleep(param.delay);
    }
}