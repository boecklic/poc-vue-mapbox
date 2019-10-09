
export default class Debugger {
    constructor(prefix='def', max_level='DEBUG'){
        this.prefix = prefix;
        this.max_level = max_level;
    }

    log(str){
        console.log(`${this.prefix}: ${str}`);
    }
}