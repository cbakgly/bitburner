//https://bitburner.readthedocs.io/en/latest/advancedgameplay/hackingalgorithms.html
//https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.ns.md

/** @param {NS} ns **/
export async function main(ns) {
    const Options = [
        ['target', ''],
        ['thread', 1],
        ['affectstock', true],
        ['delay', 3000],
        ['help', false],
        ['loop', false]
    ];
    const param = ns.flags(Options);

    if (param.help || param.target == '') {
        ns.tprint(param);
        return;
    }

    while(param.loop) {
        await ns.hack(param.target, {threads: param.thread, stock: param.affectstock});
    }
    
}   