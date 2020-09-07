class Triangle {
  constructor(arg0, arg1, arg2) {
    //Перегрузка Vector2, Vector2, Vector2
    if (
      arguments[0] instanceof Vector2 &&
      arguments[1] instanceof Vector2 &&
      arguments[2] instanceof Vector2
    ) {
      this.points = [arg0, arg1, arg2];
      this.arcs = [
        new Arc(arg0, arg1),
        new Arc(arg1, arg2),
        new Arc(arg2, arg0)
      ];
      this.centroid;
    }
    //Перегрузка Arc, Vector2
    else if (arguments[0] instanceof Arc && arguments[1] instanceof Vector2) {
      this.points = [arg0.A, arg0.B, arg1];
      this.arcs = [
        arg0,
        new Arc(this.points[1], this.points[2]),
        new Arc(this.points[2], this.points[0])
      ];
    }
    //Перегрузка Arc, Arc, Arc
    else if (
      arguments[0] instanceof Arc &&
      arguments[1] instanceof Arc &&
      arguments[2] instanceof Arc
    ) {
      this.arcs = [arg0, arg1, arg2];
      //this.arcs[0] = arg0;
      //this.arcs[1] = arg1;
      //this.arcs[2] = arg2;

      this.points = [arg0.A, arg0.B];
      //this.points[0] = arg0.A;
      //this.points[1] = arg0.B;

      if (arg1.A === arg0.A || arg1.A === arg0.B) this.points[2] = arg1.B;
      else if (arg1.B === arg0.A || arg1.B === arg0.B) this.points[2] = arg1.A;
    }
  }

  get centroid() {
    const v1 = Vector2.sub(this.points[1], this.points[0]);
    const v2 = Vector2.mult(v1, 0.5);
    const v3 = Vector2.sum(this.points[0], v2);
    const v4 = Vector2.sub(this.points[2], v3);
    const v5 = Vector2.mult(v4, 0.666666);
    const v6 = Vector2.sub(this.points[2], v5);

    return v6;
  }
  set centroid(value) {}

  GetThirdPoint(_arc) {
    for (var i = 0; i < 3; i++) {
      if (_arc.A !== this.points[i] && _arc.B !== this.points[i])
        return this.points[i];
    }
    return null;
  }

  GetArcBeatwen2Points(_a, _b) {
    for (var i = 0; i < 3; i++) {
      if (
        (this.arcs[i].A === _a && this.arcs[i].B === _b) ||
        (this.arcs[i].A === _b && this.arcs[i].B === _a)
      ) {
        return this.arcs[i];
      }
    }

    return null;
  }

  static Get4Point(T1, T2) {
    for (var i = 0; i < 3; i++) {
      if (
        T2.points[i] !== T1.points[0] &&
        T2.points[i] !== T1.points[1] &&
        T2.points[i] !== T1.points[2]
      ) {
        return T2.points[i];
      }
    }

    return null;
  }

  GetTwoOtherArcs(_a0) {
    var _a1;
    var _a2;

    if (this.arcs[0] === _a0) {
      _a1 = this.arcs[1];
      _a2 = this.arcs[2];
    } else if (this.arcs[1] === _a0) {
      _a1 = this.arcs[0];
      _a2 = this.arcs[2];
    } else if (this.arcs[2] === _a0) {
      _a1 = this.arcs[0];
      _a2 = this.arcs[1];
    } else {
      _a1 = null;
      _a2 = null;
    }

    return [_a1, _a2];
  }
}
