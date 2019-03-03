module.exports = class error{
    constructor(tekst,from)
    {
        this.data = new Date().toLocaleDateString();
        this.time = new Date().toLocaleTimeString();
        this.tekst = tekst;
        this.from = from;
    }
}