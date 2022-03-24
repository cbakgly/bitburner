export async function main(ns) {

    const Options = [
        ['target', ns.getHostname()],
        ['delay', 3000],
        ['help', false]
    ];
    const param = ns.flags(Options);


    // await ns.share();

    ns.tprint(ns.getServer(param.target));
    ns.tprint(ns.hackAnalyze(param.target));
    ns.tprint(ns.hackAnalyzeChance(param.target));
    ns.tprint(ns.hackAnalyzeSecurity(param.target));
    ns.tprint(ns.hackAnalyzeThreads(param.target, ns.getServerMaxMoney(param.target)));
    ns.tprint(ns.hackAnalyzeChance(param.target));
    ns.tprint(ns.hackAnalyzeChance(param.target));

}