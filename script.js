const root = document.getElementById("root");
const roadblocks_id = document.getElementById("roadblocks");

// TODO: add this to localStorage
let roadblocks = [];

class NewRoadblock {
    name;
    add;

    onClick() {
        this.add.onclick = () => {
            const roadblock = new Roadblock(this.name.value, roadblocks.length);
            roadblocks.push(roadblock);
        }
    }

    constructor() {
        this.name = document.getElementById("new-roadblock-name");
        this.add = document.getElementById("new-roadblock-add");

        this.onClick();
    }
}

class Roadblock {
    name;
    index;

    div;
    prefix;

    current_credits;
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
        this.createName();
        this.createRequired();
        this.createCurrent();
        this.createModulesStructure();
    }

    createDiv() {
        this.div = document.createElement("div");
        this.div.id = this.prefix;
        roadblocks_id.append(this.div);
    }

    createName() {
        this.name_input = document.createElement("input");
        this.name_input.id = `${this.prefix}-name`;
        this.name_input.placeholder = "Roadblock Name";
        this.name_input.value = this.name;
        this.div.append(this.name_input);
    }

    createRequired() {
        const div = document.createElement("div");
        const label = document.createElement("label");
        const id = `${this.prefix}-required`;
        label.setAttribute("for", id);
        label.innerText = "Required:";

        this.required_input = document.createElement("input");
        this.required_input.id = id;
        this.required_input.placeholder = "None";

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

        this.modules_input = document.createElement("input");
        this.modules_input.id = `${modules_prefix}-name`;
        this.modules_input.placeholder = `Module Name`;

        this.modules_button = document.createElement("button");
        this.modules_button.id = `${modules_prefix}-add`;
        this.modules_button.innerText = "Add";

        div.append(title);
        div.append(this.modules_div);
        div.append(this.modules_input);
        div.append(this.modules_button);
        this.div.append(div);

        this.modulesAddOnClick();
    }

    modulesAddOnClick() {
        this.modules_button.onclick = () => {
            const module = new Module(this.modules_input.value, this.modules.length, this.index, this.modules_div.id);
            this.modules.push(module);
        };
    }
}

// TODO: allow to delete a module
class Module {
    name;
    index;
    prefix;
    roadblock_index;
    div;

    projects;

    name_input;
    credits_input;
    projects_input;
    projects_button;
    projects_ul;

    constructor(name, index, roadblock_index, div_id) {
        this.name = name;
        this.index = index;
        this.roadblock_index = roadblock_index;
        this.prefix = `module-${this.roadblock_index}-${this.index}`;
        this.div = document.getElementById(div_id);
        this.projects = [];

        this.createAll();
    };

    createAll() {
        this.createName();
        this.createCredits();
        this.createProjects();
    }

    createName() {
        this.name_input = document.createElement("input");
        this.name_input.value = this.name;
        this.name_input.placeholder = "Module Name";

        this.div.append(this.name_input);
    }

    createCredits() {
        const div = document.createElement("div");
        const label = document.createElement("label");
        const id = `${this.prefix}-credits`;
        label.setAttribute("for", id);
        label.innerText = "Credits:";

        this.credits_input = document.createElement("input");
        this.credits_input.id = id;
        this.credits_input.placeholder = "None";

        div.append(label);
        div.append(this.credits_input);
        this.div.append(div);
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
    }

    projectAddOnClick() {
        this.projects_button.onclick = () => {
            const project = new Project(this.projects_input.value, this.projects.length, this.prefix, this);
            this.projects.push(project);
        };
    }

    projectRemove(i) {
        this.projects.pop(i);
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
}

new NewRoadblock();
