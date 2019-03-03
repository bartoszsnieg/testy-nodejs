
module.exports = class BodyTest{
    constructor(id,test_id,ilosc_pytan,name)
    {
        this.name = name
        this.id = id;
        this.test_id =test_id;
        this.ilosc_pytan = ilosc_pytan;
        this.pytania = [];
        this.mysql_ID;
    }
}