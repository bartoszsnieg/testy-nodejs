module.exports = class errorList{
    constructor()
    {
        this.data = new Date().toLocaleDateString();
        this.time = new Date().toLocaleTimeString();
        this.error_List = [];
        this.event_List = [];
        this.page_List = [];
    }   
}