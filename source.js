/*** @param {NS} ns**/
export function main(ns) {
    // for (let s of ns.getOwnedSourceFiles()) {
        ns.tprint(ns.getOwnedSourceFiles());
    // }
}