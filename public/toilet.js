let buildings = [];
let callbacks = [];

function addcallback(fun) {
    callbacks.push(fun);
}

function load() {
    // set callback
    let db = firebase.database();
    let root = db.ref('root');
    root.on('value', loadbuilding);
}

function loadbuilding (data) {
    let building_datas = data.val();
    console.log(building_datas);
    for(let i=buildings.length; i<building_datas.length; ++i) {
        buildings.push(new Building());
    }
    for(let i=0; i<building_datas.length; ++i) {
        buildings[i].load(building_datas[i]);
        console.log(buildings[i]);
    }
    for(let i=0; i<callbacks.length; ++i) {
        callbacks[i]();
    }
}

function Building() {
    this.name = "";
    this.floors = [];
    this.load = function(data) {
        this.name = data.name;
        let floors = data.floors;
        for(let i=this.floors.length; i<floors.length; ++i) {
            this.floors.push(new Floor(this));
        }
        for(let i=0; i<floors.length; ++i) {
            this.floors[i].load(floors[i]);
        }
    };
}

function Floor(building) {
    this.building = building;
    this.num = -1;
    this.male = new Restroom(this, 'male');
    this.female = new Restroom(this, 'female');
    this.load = function(data) {
        this.num = data.num;
        if(null != data.male) {
            this.male.load(data.male);
        }
        if(null != data.female) {
            this.female.load(data.female);
        }
    };
}

function Restroom(floor, type) {
    this.floor = floor;
    this.type = type;
    this.toilets = [];
    this.load = function(data) {
        let toilets = data;
        for(let i=this.toilets.length; i<toilets.length; ++i) {
            this.toilets.push(new Toilet(i));
        }
        for(let i=0; i<toilets.length; ++i) {
            this.toilets[i].load(toilets[i]);
        }
    };
}

function Toilet(num) {
    this.num = num;
    this.available = true;
    this.intime = 0;
    this.load = function(data) {
        this.available = data.available;
        this.intime = data.intime;
    }
}

export {buildings, load, addcallback, Building, Floor, Restroom };