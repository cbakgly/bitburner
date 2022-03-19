import { getNodes} from "nodes.js";

/**
* @param {NS} ns
**/
export function main(ns) {
    let serverPrefix = "pserv-";

    let hosts = getNodes(ns);

    for( let target of hosts) {
        if (target == "home") continue;
        if (target.indexOf(serverPrefix) >= 0) continue;
        if (ns.hasRootAccess(target)) continue;

        let level = ns.getServerNumPortsRequired(target);

        // check precondition
    
        if (level > 0 && ns.fileExists("BruteSSH.exe", "home")) {
            ns.brutessh(target);
            level--;
        }
    
        if (level > 0 && ns.fileExists("FtpCrack.exe", "home")) {
            ns.ftpcrack(target);
            level--;
        }
    
        if (level > 0 && ns.fileExists("relaySMTP.exe", "home")) {
            ns.relaysmtp(target);
            level--;
        }
    
        if (level > 0 && ns.fileExists("httpworm.exe", "home")) {
            ns.httpworm(target);
            level--;
        }
    
        if (level > 0 && ns.fileExists("sqlinject.exe", "home")) {
            ns.sqlinject(target);
            level--;
        }
        // Get root access to target server
        if (level == 0) ns.nuke(target);
    
        // ns.installBackdoor(target);
    }
    ns.toast("Nuke complete.");
}