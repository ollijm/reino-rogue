var Player = function (x, y) {
    this._x = x;
    this._y = y;
    this._draw();
}

Player.prototype.getX = function() { return this._x; }

Player.prototype.getY = function() { return this._y; }

Player.prototype._draw = function () {
    Game.display.draw(this._x, this._y, "@", "#ff0");
}

Player.prototype.act = function () {
    Game.engine.lock();
    window.addEventListener("keydown", this);
}

Player.prototype.handleEvent = function (e) {
    Game.setMessage("");
    var keyMap = {};
    keyMap[38] = 0;
    keyMap[33] = 1;
    keyMap[39] = 2;
    keyMap[34] = 3;
    keyMap[40] = 4;
    keyMap[35] = 5;
    keyMap[37] = 6;
    keyMap[36] = 7;

    var code = e.keyCode;

    if (code == 13 || code == 32) {
        this._checkBox();
        return;
    }
    if (!(code in keyMap)) {
        return;
    }

    var diff = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + diff[0];
    var newY = this._y + diff[1];

    var newKey = newX + "," + newY;
    if (!(newKey in Game.floors)) {
        return;
    }
    Game.display.draw(this._x, this._y, Game.floors[this._x + "," + this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
}

Player.prototype._checkBox = function() {
    var key = this._x + "," + this._y;
    if (Game.floors[key] != "*") {
        Game.setMessage("There is no box here!");
    } else if (key == Game.treasure) {
        Game.setMessage("Hooray! You found a treasure and won this game.");
        Game.engine.lock();
        window.removeEventListener("keydown", this);
    } else {
        Game.setMessage("This box is empty :-(");
    }
}