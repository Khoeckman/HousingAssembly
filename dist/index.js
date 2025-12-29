const NAME = "&5&lHASM";
const PREFIX = `&7[${NAME}&7]&r `;
const TAB = "    ";
const isJavaClass = (obj, className) => {
	return obj && "getClassName" in obj && typeof obj.getClassName === "function" && obj.getClassName() === className;
};
const chat = (message, id = -1) => {
	if (typeof message === "string" || isJavaClass(message, "com.chattriggers.ctjs.minecraft.objects.message.TextComponent")) message = new Message(PREFIX, message);
	else if (isJavaClass(message, "com.chattriggers.ctjs.minecraft.objects.message.Message")) message.addTextComponent(0, PREFIX);
	else message = new Message(PREFIX, String(message));
	if (id > -1) message = message.setChatLineId(id & 2147483647);
	message.chat();
};
const error = (message, options = {}) => {
	const { printStackTrace = true, sound = true } = options;
	ChatLib.chat("&c" + message);
	if (printStackTrace) try {
		throw new Error(message);
	} catch (err) {
		err.stack.replace(/\t/g, TAB).split(/\r?\n/g).forEach((line) => ChatLib.chat("&c" + line));
	}
	if (sound) World.playSound("random.anvil_land", .3, 1);
};
const dialog = (title, lines) => {
	ChatLib.chat("");
	chat(title);
	ChatLib.chat("");
	for (let line of lines) ChatLib.chat(TAB + line);
	ChatLib.chat("");
	World.playSound("random.click", .7, 1);
};
var metadata_default = new class Metadata {
	local;
	remote;
	remoteURL = "null";
	constructor(moduleName, fileName, remoteURL = "null") {
		try {
			this.local = JSON.parse(FileLib.read(moduleName, fileName));
		} catch (err) {
			this.local = null;
			error(err);
			return;
		}
		if (typeof remoteURL !== "string") {
			error((/* @__PURE__ */ new TypeError("remoteURL is not a string")).toString());
			return;
		}
		this.remoteURL = remoteURL;
	}
	static compareVersions(v1, v2) {
		const a = v1.split(".").map((n) => Number(n));
		const b = v2.split(".").map((n) => Number(n));
		for (let i = 0, len = Math.max(a.length, b.length); i < len; i++) {
			const x = a[i] || 0;
			const y = b[i] || 0;
			if (x > y) return 1;
			if (x < y) return -1;
		}
		return 0;
	}
	getRemote(onFinally = () => {}) {
		new Thread(() => {
			try {
				this.remote = JSON.parse(FileLib.getUrlContent(this.remoteURL.toString()) ?? null);
			} catch (err) {
				error(err, { printStackTrace: false });
			} finally {
				onFinally();
			}
		}).start();
	}
	printVersionStatus() {
		if (!World.isLoaded()) return;
		if (!this.local || typeof this.local.version !== "string") return error((/* @__PURE__ */ new TypeError(`Cannot read properties of ${this.local} (reading 'version')`)).toString());
		chat(`&aVersion ${this.local.version} &7● Getting latest...`, 32486e3);
		this.getRemote(() => this.updateVersionStatus(32486e3));
	}
	updateVersionStatus = (messageId) => {
		if (!World.isLoaded() || !this.local || !this.remote) return;
		const latestVersion = this.remote && typeof this.remote.version === "string" ? Metadata.compareVersions(this.local.version, this.remote.version) >= 0 ? "&2✔ Latest" : "&c✖ Latest " + this.remote.version : "&c✖ Latest unknown";
		try {
			ChatLib.deleteChat(messageId);
			ChatLib.chat(new Message([`&aVersion ${this.local.version} ${latestVersion} `, new TextComponent(PREFIX + "&7[&8&lGitHub&7]").setHover("show_text", `&fClick to view ${NAME}&f on &8&lGitHub`).setClick("open_url", this.local.homepage.toString())]).setChatLineId(messageId));
		} catch (err) {
			error(err);
		}
		World.playSound("mob.villager." + (latestVersion.includes("✔") ? "yes" : "no"), .7, 1);
	};
}("HousingAssembly", "metadata.json", "https://raw.githubusercontent.com/Khoeckman/HousingAssembly/refs/heads/main/metadata.json");
var rootCommand = "hasm";
register("command", (command, ...args) => {
	try {
		if (typeof command !== "string") command = "";
		else command = command.toLowerCase();
		if (!Array.isArray(args)) args = [];
		switch (command) {
			case "":
			case "help":
				const commands = [`&6ver&esion &7 Prints the &fcurrent&7 and &flatest &aversion&7 of ${NAME}&7.`];
				dialog("&eCommands", commands.map((line) => `&e/${rootCommand} ${line}`));
				break;
			case "version":
			case "ver":
				metadata_default.printVersionStatus();
				break;
			default:
				error(`Unknown command. Type "/${rootCommand}" for help.`, { printStackTrace: false });
				break;
		}
	} catch (err) {
		error(err);
	}
}).setName(rootCommand);
var firstWorldLoad = register("worldLoad", () => {
	try {
		chat(`&eModule loaded. Type "/${rootCommand}" for help.`);
		metadata_default.printVersionStatus();
	} catch (err) {
		error(err);
	} finally {
		firstWorldLoad.unregister();
	}
});
