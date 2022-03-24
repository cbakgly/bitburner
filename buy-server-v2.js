const ServerPrefix = "pserv-";
const HackScript = "runhack-v2.js";
const Options = [
    ["ram", 32], 
    ["delay", 5000], 
    ["target", "joesguns"],
    ['help',false]
];

/**
* @param {NS} ns
**/
export async function main(ns) {
    
    const param = ns.flags(Options);

    if (param.help) {
        ns.tprint(Options);
        return;
    }

    const target = param.target;
    const ram = Math.min(param.ram, ns.getPurchasedServerMaxRam()); 
    const delay = param.delay;

    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers
    for (let i = 0; i < ns.getPurchasedServerLimit();) {
        // Check if we have enough money to purchase a server
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Copy our hacking script onto the newly-purchased server
            //  3. Run our hacking script on the newly-purchased server with 3 threads
            //  4. Increment our iterator to indicate that we've bought a new server
            let hostname = ns.purchaseServer(ServerPrefix + i, ram);

            if (!ns.serverExists(hostname)) {
                ns.toast("Purchased Server Invalid " + hostname);
                break;
            }

            ns.exec(HackScript, 'home', 1, '--target', target, '--host', hostname);

            ++i;
        }
        await ns.sleep(delay);
    }
}