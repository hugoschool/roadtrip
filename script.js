const root = document.getElementById("root");
const save_button = document.getElementById("save");
const import_button = document.getElementById("import");
const export_button = document.getElementById("export");
const roadblocks_id = document.getElementById("roadblocks");

save_button.onclick = () => {
    serializeAll();
    alert("Saved!");
};

import_button.onclick = () => {
    const b64roadblocks = prompt("Enter your encoded roadblocks here:");
    if (!b64roadblocks || b64roadblocks === "") {
        return;
    }
    try {
        const roadblocks = atob(b64roadblocks);
        window.localStorage.setItem("roadblocks", roadblocks);
        window.location.reload();
    } catch (err) {
        alert("Invalid encoded roadblocks");
        console.err("Invalid encoded roadblocks");
    }
}

export_button.onclick = () => {
    serializeAll();
    const b64roadblocks = btoa(window.localStorage.getItem("roadblocks"));
    alert(`This is your encoded roadblocks:\n\n${b64roadblocks}`);
    console.log(b64roadblocks);
}

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

if (code) {
    try {
        const roadblocks = atob(code);
        window.localStorage.setItem("roadblocks", roadblocks);
        window.location = "/";
    } catch (err) {
        alert("Invalid encoded roadblocks");
        console.err("Invalid encoded roadblocks");
    }
}

var roadblocks = [];

function serializeAll() {
    const serialized = roadblocks.map((roadblock) => roadblock.serialize);

    window.localStorage.setItem("roadblocks", JSON.stringify(serialized));
}

function deserializeAll() {
    const serialized = JSON.parse(window.localStorage.getItem("roadblocks"));
    let deserialized = [];

    if (!serialized) {
        return deserialized;
    }

    for (const serialized_road of serialized) {
        deserialized.push(Roadblock.deserialize(serialized_road));
    }

    return deserialized;
}

class NewRoadblock {
    name;
    add;

    roadblockAdd() {
        const roadblock = new Roadblock(this.name.value, roadblocks.length);
        roadblocks.push(roadblock);
        this.name.value = "";
    }

    onClick() {
        this.add.onclick = () => {
            this.roadblockAdd();
        }
    }

    onEnter() {
        this.name.onkeyup = (e) => {
            if (e.key !== "Enter") {
                return
            }
            this.roadblockAdd();
        }
    }

    constructor() {
        this.name = document.getElementById("new-roadblock-name");
        this.add = document.getElementById("new-roadblock-add");

        this.onClick();
        this.onEnter();
    }
}

class Total {
    total_element;

    constructor() {
        this.total_element = document.getElementById("total-credits");
    }

    calculate() {
        const total = roadblocks.reduce((acc, roadblock) => acc + roadblock.current_credits, 0);

        this.total_element.innerText = total;
    }
}

var total = new Total();

class Roadblock {
    name;
    index;

    div;
    prefix;

    current_credits;
    required_credits;
    modules;

    name_input;
    required_input;
    current_span;

    modules_div;
    modules_input;
    modules_button;

    constructor(name, index) {
        this.name = name;
        this.index = index;
        this.prefix = `roadblock-${this.index}`;
        this.current_credits = 0;
        this.modules = [];

        this.createAll();
    }

    createAll() {
        this.createDiv();
        this.createDelete();
        this.createName();
        this.createRequired();
        this.createCurrent();
        this.createModulesStructure();
        this.div.append(document.createElement("hr"));
    }

    createDiv() {
        this.div = document.createElement("div");
        this.div.id = this.prefix;
        roadblocks_id.append(this.div);
    }

    createDelete() {
        this.delete_button = document.createElement("button");
        this.delete_button.innerText = "Delete";

        this.deleteButtonOnClick();

        this.div.append(this.delete_button);
    }

    createName() {
        const div = document.createElement("div");
        const id = `${this.prefix}-name`;
        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.innerText = "Roadblock Name";

        this.name_input = document.createElement("input");
        this.name_input.id = id;
        this.name_input.placeholder = "Roadblock Name";
        this.name_input.value = this.name;

        this.nameOnChange();

        div.append(label);
        div.append(this.name_input);
        this.div.append(div);
    }

    createRequired() {
        const div = document.createElement("div");
        const label = document.createElement("label");
        const id = `${this.prefix}-required`;
        label.setAttribute("for", id);
        label.innerText = "Required:";

        this.required_input = document.createElement("input");
        this.required_input.id = id;
        this.required_input.setAttribute("type", "number");
        this.required_input.setAttribute("min", "0");
        this.required_input.placeholder = "None";

        this.requiredOnChange();

        div.append(label);
        div.append(this.required_input);
        this.div.append(div);
    }

    createCurrent() {
        const div = document.createElement("div");
        const label = document.createElement("label");
        const id = `${this.prefix}-current`;
        label.setAttribute("for", id);
        label.innerText = "Current:";

        this.current_span = document.createElement("span");
        this.current_span.id = id;
        this.current_span.innerText = this.current_credits;

        div.append(label);
        div.append(this.current_span);
        this.div.append(div);
    }

    createModulesStructure() {
        const div = document.createElement("div");
        const title = document.createElement("h3");
        const modules_prefix = `${this.prefix}-module`;
        title.innerText = "Modules:";

        this.modules_div = document.createElement("div");
        this.modules_div.id = `${modules_prefix}-projects`;

        let id = `${modules_prefix}-name`;
        const modules_label = document.createElement("label");
        modules_label.setAttribute("for", id);
        modules_label.innerText = "Module Name";

        this.modules_input = document.createElement("input");
        this.modules_input.id = id;
        this.modules_input.placeholder = "Module Name";

        this.modules_button = document.createElement("button");
        this.modules_button.id = `${modules_prefix}-add`;
        this.modules_button.innerText = "Add";

        div.append(title);
        div.append(this.modules_div);
        div.append(modules_label);
        div.append(this.modules_input);
        div.append(this.modules_button);
        this.div.append(div);

        this.moduleAddOnClick();
        this.moduleAddOnEnter();
    }

    deleteButtonOnClick() {
        this.delete_button.onclick = () => {
            if (confirm(`Are you sure you want to delete ${this.name}? (Contains ${this.modules.length} modules)`)) {
                roadblocks_id.removeChild(this.div);
                roadblocks.pop(this.index);
                total.calculate();
            }
        };
    }

    nameOnChange() {
        this.name_input.onchange = () => {
            this.name = this.name_input.value;
        };
    }

    moduleAdd() {
        const module = new Module(this.modules_input.value, this.modules.length, this.index, this);
        this.modules.push(module);
        this.modules_input.value = "";
    }

    moduleAddOnClick() {
        this.modules_button.onclick = () => {
            this.moduleAdd();
        };
    }

    moduleAddOnEnter() {
        this.modules_input.onkeyup = (e) => {
            if (e.key !== "Enter") {
                return
            }
            this.moduleAdd();
        }
    }

    requiredOnChange() {
        this.required_input.onchange = () => {
            this.required_credits = this.required_input.value;
        }
    }

    moduleRemove(i) {
        this.modules.pop(i);
    }

    calculateCredits() {
        this.current_credits = 0;
        for (const module of this.modules) {
            if (module.isTaking()) {
                this.current_credits += module.credits;
            }
        }
        this.current_span.innerText = this.current_credits;
        total.calculate();
    }

    setRequired(amount) {
        this.required_credits = amount;
        this.required_input.value = amount;
    }

    get serialize() {
        const modules = this.modules.map((module) => module.serialize);

        return {
            name: this.name,
            index: this.index,
            required_credits: this.required_credits,
            modules: modules
        };
    }

    static deserialize(obj) {
        const roadblock = new Roadblock(obj["name"], obj["index"]);

        roadblock.setRequired(obj["required_credits"]);

        for (const module of obj["modules"]) {
            roadblock.modules.push(Module.deserialize(module, roadblock));
        }

        roadblock.calculateCredits();

        return roadblock;
    }
}

class Module {
    name;
    index;
    prefix;
    roadblock_index;
    modules_div;
    div;
    roadblock;

    credits;
    projects;

    name_input;
    credits_input;
    projects_input;
    projects_button;
    delete_button;
    projects_ul;
    taking_checkbox;

    constructor(name, index, roadblock_index, roadblock) {
        this.name = name;
        this.index = index;
        this.roadblock_index = roadblock_index;
        this.prefix = `module-${this.roadblock_index}-${this.index}`;
        this.roadblock = roadblock;
        this.modules_div = this.roadblock.modules_div;
        this.credits = 0;
        this.projects = [];

        this.createAll();
    };

    createAll() {
        this.createDiv();
        this.createName();
        this.createDelete();
        this.createCredits();
        this.createTaking();
        this.createProjects();
        this.div.append(document.createElement("hr"));
    }

    createDiv() {
        this.div = document.createElement("div");
        this.modules_div.append(this.div);
    }

    createName() {
        const id = `${this.prefix}-module_name`;
        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.innerText = "Module Name";

        this.name_input = document.createElement("input");
        this.name_input.id = id;
        this.name_input.value = this.name;
        this.name_input.placeholder = "Module Name";

        this.nameOnChange();

        this.div.append(label);
        this.div.append(this.name_input);
    }

    createDelete() {
        this.delete_button = document.createElement("button");
        this.delete_button.id = `${this.prefix}-delete`;
        this.delete_button.innerText = "Delete";

        this.deleteButtonOnClick();

        this.div.append(this.delete_button);
    }

    createCredits() {
        const div = document.createElement("div");
        const label = document.createElement("label");
        const id = `${this.prefix}-credits`;
        label.setAttribute("for", id);
        label.innerText = "Credits:";

        this.credits_input = document.createElement("input");
        this.credits_input.id = id;
        this.credits_input.setAttribute("type", "number");
        this.credits_input.setAttribute("min", "0");
        this.credits_input.placeholder = "None";

        this.creditsOnChange();

        div.append(label);
        div.append(this.credits_input);
        this.div.append(div);
    }

    createTaking() {
        const id = `${this.prefix}-taking`;
        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.innerText = "Taking";

        this.taking_checkbox = document.createElement("input");
        this.taking_checkbox.id = id;
        this.taking_checkbox.setAttribute("type", "checkbox");

        this.checkboxOnChange();

        this.div.append(label);
        this.div.append(this.taking_checkbox);
    }

    createProjects() {
        const div = document.createElement("div");
        const label = document.createElement("label");
        const id = `${this.prefix}-project`;
        label.innerText = "Projects:";

        this.projects_ul = document.createElement("ul");
        this.projects_ul.id = `${id}s`;

        this.projects_input = document.createElement("input");
        this.projects_input.id = `${id}s-name`;
        this.projects_input.placeholder = "Project Name";

        this.projects_button = document.createElement("button");
        this.projects_button.id = `${id}s-add`;
        this.projects_button.innerText = "Add";

        div.append(this.projects_ul);
        div.append(this.projects_input);
        div.append(this.projects_button);
        this.div.append(div);

        this.projectAddOnClick();
        this.projectAddOnEnter();
    }

    nameOnChange() {
        this.name_input.onchange = () => {
            this.name = this.name_input.value;
        };
    }

    creditsOnChange() {
        this.credits_input.onchange = () => {
            this.credits = parseInt(this.credits_input.value);
            this.roadblock.calculateCredits();
        };
    }

    checkboxOnChange() {
        this.taking_checkbox.onchange = () => {
            this.roadblock.calculateCredits();
        }
    }

    projectAdd() {
        const project = new Project(this.projects_input.value, this.projects.length, this.prefix, this);
        this.projects.push(project);
        this.projects_input.value = "";
    }

    projectAddOnClick() {
        this.projects_button.onclick = () => {
            this.projectAdd();
        };
    }

    projectAddOnEnter() {
        this.projects_input.onkeyup = (e) => {
            if (e.key !== "Enter") {
                return
            }
            this.projectAdd();
        }
    }

    deleteButtonOnClick() {
        this.delete_button.onclick = () => {
            if (confirm(`Are you sure you want to delete ${this.name}?`)) {
                this.roadblock.modules_div.removeChild(this.div);
                this.roadblock.moduleRemove(this.index);
                this.roadblock.calculateCredits();
            }
        };
    }

    projectRemove(i) {
        this.projects.pop(i);
    }

    isTaking() {
        return this.taking_checkbox.checked;
    }

    setTaking(state) {
        this.taking_checkbox.checked = state;
    }

    setCredits(amount) {
        this.credits = amount;
        this.credits_input.value = amount;
    }

    get serialize() {
        const projects = this.projects.map((p) => p.serialize);

        return {
            name: this.name,
            index: this.index,
            roadblock_index: this.roadblock_index,
            credits: this.credits,
            taking: this.isTaking(),
            projects: projects
        };
    }

    static deserialize(obj, roadblock) {
        const module = new Module(obj["name"], obj["index"], obj["roadblock_index"], roadblock);

        module.setCredits(obj["credits"]);
        module.setTaking(obj["taking"]);

        for (const project of obj["projects"]) {
            module.projects.push(Project.deserialize(project, module));
        }

        return module;
    }
}

class Project {
    name;
    index;
    prefix;
    module;

    ul;
    li;
    delete_button;

    constructor(name, index, prefix, module) {
        this.name = name;
        this.index = index;
        this.prefix = `${prefix}-${this.index}`;
        this.module = module;
        this.ul = this.module.projects_ul;

        this.create();
    }

    create() {
        this.li = document.createElement("li");
        this.li.id = this.prefix;
        this.li.innerText = this.name;

        this.delete_button = document.createElement("button");
        this.delete_button.id = `${this.prefix}-delete`;
        this.delete_button.innerText = "Delete";

        this.deleteButtonOnClick();

        this.li.append(this.delete_button);
        this.ul.append(this.li);
    }

    deleteButtonOnClick() {
        this.delete_button.onclick = () => {
            this.ul.removeChild(this.li);
            this.module.projectRemove(this.index);
        };
    }

    get serialize() {
        return {name: this.name, index: this.index};
    }

    static deserialize(obj, module) {
        const project = new Project(obj["name"], obj["index"], module.prefix, module);

        return project;
    }
}

roadblocks = deserializeAll();
total.calculate();
new NewRoadblock();
