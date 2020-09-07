class Arc {
  constructor(_A, _B) {
    this.A = _A;
    this.B = _B;

    //Ссылка на треугольники в которые входит ребро:
    this.trAB = null;
    this.trBA = null;

    //Ребро является границей триангуляции если не ссылается на 2 треугольника
    this.isBorder = false;
  }

  get isBorder() {
    if (this.trAB == null || this.trBA == null) return true;
    else return false;
  }
  set isBorder(value) {}

  static ArcIntersect(a1, a2) {
    var p1 = a1.A;
    var p2 = a1.B;
    var p3 = a2.A;
    var p4 = a2.B;

    var d1 = Arc.Direction(p3, p4, p1);
    var d2 = Arc.Direction(p3, p4, p2);
    var d3 = Arc.Direction(p1, p2, p3);
    var d4 = Arc.Direction(p1, p2, p4);

    if (p1 === p3 || p1 === p4 || p2 === p3 || p2 === p4) return false;
    else if (
      ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
      ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
    )
      return true;
    else if (d1 === 0 && OnSegment(p3, p4, p1)) return true;
    else if (d2 === 0 && OnSegment(p3, p4, p2)) return true;
    else if (d3 === 0 && OnSegment(p1, p2, p3)) return true;
    else if (d4 === 0 && OnSegment(p1, p2, p4)) return true;
    else return false;
  }

  static ArcIntersectForPoints(p1, p2, p3, p4) {
    var d1 = Arc.Direction(p3, p4, p1);
    var d2 = Arc.Direction(p3, p4, p2);
    var d3 = Arc.Direction(p1, p2, p3);
    var d4 = Arc.Direction(p1, p2, p4);

    if (p1 === p3 || p1 === p4 || p2 === p3 || p2 === p4) return false;
    else if (
      ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
      ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
    )
      return true;
    else if (d1 === 0 && OnSegment(p3, p4, p1)) return true;
    else if (d2 === 0 && OnSegment(p3, p4, p2)) return true;
    else if (d3 === 0 && OnSegment(p1, p2, p3)) return true;
    else if (d4 === 0 && OnSegment(p1, p2, p4)) return true;
    else return false;
  }

  static GetCommonPoint(a1, a2) {
    if (a1.A === a2.A) return a1.A;
    else if (a1.A === a2.B) return a1.A;
    else if (a1.B === a2.A) return a1.B;
    else if (a1.B === a2.B) return a1.B;
    else return null;
  }

  IsConnectedWith(_a) {
    if (this.A === _a.A || this.A === _a.B) return true;
    if (this.B === _a.A || this.B === _a.B) return true;
    return false;
  }

  static Direction(pi, pj, pk) {
    return Vector2.CrossProduct(Vector2.sub(pk, pi), Vector2.sub(pj, pi));
  }

  static OnSegment(pi, pj, pk) {
    if (
      Math.min(pi.x, pj.x) <= pk.x &&
      pk.x <= Math.max(pi.x, pj.x) &&
      Math.min(pi.y, pj.y) <= pk.y &&
      pk.y <= Math.max(pi.y, pj.y)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
