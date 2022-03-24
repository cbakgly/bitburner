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
        ns.tprint(Options);
        return;
    }

    while(param.loop) {
        await ns.weaken(param.target, {threads: param.thread, stock: param.affectstock});
    }

}   