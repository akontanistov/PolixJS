class Vector2 {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  static sum(v1, v2) {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  static sub(v1, v2) {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  static mult(v1, s) {
    return new Vector2(v1.x * s, v1.y * s);
  }

  static CrossProduct(v1, v2) {
    return v1.x * v2.y - v2.x * v1.y;
  }

  static DotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static Vector2Rnd(RangeXmin, RangeXmax, RangeYmin, RangeYmax) {
    return new Vector2(
      Helper.RndRange(RangeXmin, RangeXmax),
      Helper.RndRange(RangeYmin, RangeYmax)
    );
  }
}
