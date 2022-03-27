/** * @param {NS} ns **/
export async function main(ns) {
    const ServerPrefix = "pserv-";
    const Options = [
        ["ram", 2048], 
        ["delay", 5000], 
        ["name", ""],
        ['all', false],
    ];
    
    const param = ns.flags(Options);
        ns.tprint(param);

    for (let node of ns.scan('home')) {
        if (node.indexOf(ServerPrefix)>=0) {
            if (!param.all && hode != param.name) continue;
            ns.killall(node);
            ns.deleteServer(node);
        }
    }
    ns.toast("Deleted server");
}