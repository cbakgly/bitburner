import { getNodes } from "nodes.js";

const Options = [["file", ["hack.js"]],["help", false]];

/**
* @param {NS} ns
**/
export async function main(ns) {
	const data = ns.flags(Options);
	if (data.help) {
        ns.tprint("Options:");
        ns.tprint(Options);
        return;
    }

	let nodes = getNodes(ns);

	for (let node of nodes) {
		await ns.scp(data.file, "home", node);
	}

	ns.toast("Done copy");
}