var Game = {
    display: null,
    engine: null,
    floors: {},
    walls: {},
    treasure: null,
    player: null,
    taneli: null,

    init: function () {
        this.display = new ROT.Display();
        document.body.appendChild(this.display.getContainer());
        this._generateMap();
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        scheduler.add(this.taneli, true);
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
        this.setMessage("Welcome REINO! Examine chests with Spacebar. Watch out for Taneli...");
    }
};

$(function() {
    Game.setMessage = function (msg) {
        $("#messages").text(msg);
    }
});


Game._generateMap = function () {
    var digger = new ROT.Map.Digger();
    var freeCells = [];

    var digCallback = function (x, y, value) {
        var key = x + "," + y;
        if (value) {
            this.walls[key] = "#";
        } else {
            freeCells.push(key);
            //this.floors[key] = ".";
            this.floors[key] = "·";
        }
    };
    digger.create(digCallback.bind(this));

    this._generateBoxes(freeCells);
    this._drawWholeMap();

    this.player = this._createBeing(Player, freeCells);
    this.taneli = this._createBeing(Enemy, freeCells);
};

Game._drawWholeMap = function () {
    for (var key in this.floors) {
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        this.display.draw(x, y, this.floors[key]);
    }
    for (var key in this.walls) {
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        this.display.draw(x, y, this.walls[key], "#444");
    }
};

Game._generateBoxes = function (freeCells) {
    for (var i = 0; i < 10; i++) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        this.floors[key] = "*";

        if (i === 0) {
            this.treasure = key;
        }

    }
};

Game._createBeing = function(what, freeCells) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
    var key = freeCells.splice(index, 1)[0];
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    return new what(x, y);
};

