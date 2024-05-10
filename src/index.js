function i(e) {
    window.enmity.plugins.registerPlugin(e);
}

function t(e) {
    return window.enmity.patcher.create(e);
}

function r(...e) {
    return window.enmity.modules.getByProps(...e);
}

const s = "CustomStatusManager";
const c = "1.0.0";
const a = "Easily manage multiple custom statuses.";
const p = [{ name: "SerStars", id: "861631850681729045" }];
const m = "#1E90FF";
const u = { name: s, version: c, description: a, authors: p, color: m };

const StatusModule = r("getStatus", "updateStatus");
const StatusStore = r("getCurrentUser");

const d = t("CustomStatusManager");

const defaultProfiles = [
    { name: "Work Mode", status: "dnd", activity: "Working hard!" },
    { name: "Gaming Mode", status: "online", activity: "Playing games." },
    { name: "AFK", status: "idle", activity: "Away for a bit." },
    { name: "Offline Mode", status: "invisible", activity: "" }
];

let profiles = JSON.parse(localStorage.getItem("CustomStatusProfiles")) || defaultProfiles;

const CustomStatusManager = {
    ...u,
    onStart() {
        d.before(StatusModule, "updateStatus", (args) => {
            const [newStatus] = args;
            console.log(`Switching status to: ${newStatus}`);
        });

        this.addUI();
    },
    onStop() {
        d.unpatchAll();
        this.removeUI();
    },
    addUI() {
        const container = document.createElement("div");
        container.id = "custom-status-manager";
        container.style.position = "fixed";
        container.style.bottom = "20px";
        container.style.right = "20px";
        container.style.backgroundColor = "#2C2F33";
        container.style.borderRadius = "8px";
        container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        container.style.padding = "10px";
        container.style.zIndex = "9999";

        const title = document.createElement("h3");
        title.innerText = "Custom Status Manager";
        title.style.color = "#FFFFFF";
        container.appendChild(title);

        profiles.forEach((profile) => {
            const button = document.createElement("button");
            button.innerText = profile.name;
            button.style.backgroundColor = "#7289DA";
            button.style.color = "#FFFFFF";
            button.style.margin = "5px";
            button.style.padding = "6px 12px";
            button.style.border = "none";
            button.style.borderRadius = "4px";
            button.style.cursor = "pointer";

            button.addEventListener("click", () => {
                StatusModule.updateStatus({
                    status: profile.status,
                    customStatus: { text: profile.activity }
                });
            });

            container.appendChild(button);
        });

        const saveButton = document.createElement("button");
        saveButton.innerText = "Save Current Status";
        saveButton.style.backgroundColor = "#43B581";
        saveButton.style.color = "#FFFFFF";
        saveButton.style.marginTop = "10px";
        saveButton.style.padding = "6px 12px";
        saveButton.style.border = "none";
        saveButton.style.borderRadius = "4px";
        saveButton.style.cursor = "pointer";

        saveButton.addEventListener("click", () => {
            const user = StatusStore.getCurrentUser();
            const currentStatus = {
                status: user.status,
                activity: user.customStatus?.text || ""
            };
            const name = prompt("Enter a name for this status profile:");
            if (name) {
                profiles.push({ name, status: currentStatus.status, activity: currentStatus.activity });
                localStorage.setItem("CustomStatusProfiles", JSON.stringify(profiles));
                this.removeUI();
                this.addUI();
            }
        });

        container.appendChild(saveButton);

        document.body.appendChild(container);
    },
    removeUI() {
        const container = document.getElementById("custom-status-manager");
        if (container) {
            container.remove();
        }
    }
};

i(CustomStatusManager);
