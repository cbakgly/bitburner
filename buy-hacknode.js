/**
* @param {NS} ns
**/
export async function main(ns) {

    const Options = [['maxnodes', 20],['help', false],['delay', 3000]];
    const param = ns.flags(Options);

    if (param.help) {
        ns.tprint("Options:");
        ns.tprint(Options);
        return;
    }

    const maxNumNodes = param.maxnodes;
    const delay = param.delay;

    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers
    let needUpgrade = true;
    let quit = false;

    while (!quit || needUpgrade) {
        // Check if we have enough money to purchase a server
        // If we have enough money, then:
        //  1. Purchase the server
        //  2. upgrade every node to match node-0 or upgrade node-0
        if (ns.hacknet.numNodes() < maxNumNodes
            && ns.getServerMoneyAvailable("home") > ns.hacknet.getPurchaseNodeCost()) {
            ns.print("Add new node");
            ns.hacknet.purchaseNode();
        } else {
            let n0 = ns.hacknet.getNodeStats(0);
            ns.print(n0);

            if (needUpgrade) {
                for (let i = 1; i < ns.hacknet.numNodes(); i++) {
                    let nx = ns.hacknet.getNodeStats(i);
                    ns.print(nx);

                    if (nx.level < n0.level) {
                        let levelDiff = Math.abs(n0.level - nx.level);
                        ns.print("Upgrade " + nx.name + " levelDiff " + levelDiff);
                        while (!ns.hacknet.upgradeLevel(i, levelDiff)) {
                            await ns.sleep(delay);
                        }
                    }
                    if (nx.ram < n0.ram) {
                        let ramDiff = Math.abs(n0.ram - nx.ram);
                        ns.print("Upgrade " + nx.name + " ram diff " + ramDiff);
                        while (!ns.hacknet.upgradeRam(i, ramDiff)) {
                            await ns.sleep(delay);
                        }
                    }
                    if (nx.cores < n0.cores) {
                        let coreDiff = Math.abs(n0.cores - nx.cores);
                        ns.print("Upgrade " + nx.name + " core diff " + coreDiff);
                        while (!ns.hacknet.upgradeCore(i, coreDiff)) {
                            await ns.sleep(delay);
                        }
                    }
                }
                needUpgrade = false;
            } else {
                // Upgrade n0
                let levelCost = ns.hacknet.getLevelUpgradeCost(0, 1);
                if (levelCost > 0 && levelCost < ns.getServerMoneyAvailable("home")) {
                    ns.hacknet.upgradeLevel(0, 1);
                    ns.print("Upgrade node 0 level");
                    needUpgrade = true;
                    continue;
                }
                let ramCost = ns.hacknet.getRamUpgradeCost(0, 1);
                if (ramCost > 0 && ramCost < ns.getServerMoneyAvailable("home")) {
                    ns.hacknet.upgradeRam(0, 1);
                    ns.print("Upgrade node 0 ram");
                    needUpgrade = true;

                    continue;
                }
                let coreCost = ns.hacknet.getCoreUpgradeCost(0, 1);
                if (coreCost > 0 && coreCost < ns.getServerMoneyAvailable("home")) {
                    ns.hacknet.upgradeCore(0, 1);
                    ns.print("Upgrade node 0 core");
                    needUpgrade = true;
                }
                if (levelCost == Infinity && ramCost == Infinity && coreCost == Infinity) quit = true;
            }
        }
        await ns.sleep(delay);
    }
    ns.toast("Hacknode Done");
}