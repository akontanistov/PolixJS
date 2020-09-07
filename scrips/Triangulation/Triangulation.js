class Triangulation {
  constructor(_points) {
    this.points = _points;
    this.triangles = [];
    this.cache = new DynamicCache(this.points[2]);

    //Добавление суперструктуры
    this.triangles.push(
      new Triangle(this.points[0], this.points[1], this.points[2])
    );
    this.triangles.push(
      new Triangle(this.triangles[0].arcs[2], this.points[3])
    );

    //Добавление ссылок в ребра на смежные треугольники суперструктуры
    this.triangles[0].arcs[2].trAB = this.triangles[1];
    this.triangles[1].arcs[0].trBA = this.triangles[0];

    //Добавление суперструктуры в кэш
    this.cache.Add(this.triangles[0]);
    this.cache.Add(this.triangles[1]);

    var CurentTriangle = null;
    var NewTriangle0 = null;
    var NewTriangle1 = null;
    var NewTriangle2 = null;

    var NewArc0 = null;
    var NewArc1 = null;
    var NewArc2 = null;

    var OldArc0 = null;
    var OldArc1 = null;
    var OldArc2 = null;
    for (var i = 4; i < _points.length; i++) {
      CurentTriangle = this.GetTriangleForPoint(_points[i]);

      if (CurentTriangle !== null) {
        //Создание новых ребер, которые совместно с ребрами преобразуемого треугольника образуют новые три треугольника
        NewArc0 = new Arc(CurentTriangle.points[0], _points[i]);
        NewArc1 = new Arc(CurentTriangle.points[1], _points[i]);
        NewArc2 = new Arc(CurentTriangle.points[2], _points[i]);

        //Сохранение ребер преобразуемого треугольника
        OldArc0 = CurentTriangle.GetArcBeatwen2Points(
          CurentTriangle.points[0],
          CurentTriangle.points[1]
        );
        OldArc1 = CurentTriangle.GetArcBeatwen2Points(
          CurentTriangle.points[1],
          CurentTriangle.points[2]
        );
        OldArc2 = CurentTriangle.GetArcBeatwen2Points(
          CurentTriangle.points[2],
          CurentTriangle.points[0]
        );

        //Преобразование текущего треугольника в один из новых трех
        NewTriangle0 = CurentTriangle;
        NewTriangle0.arcs[0] = OldArc0;
        NewTriangle0.arcs[1] = NewArc1;
        NewTriangle0.arcs[2] = NewArc0;
        NewTriangle0.points[2] = _points[i];

        //Дополнительно создаются два треугольника
        NewTriangle1 = new Triangle(OldArc1, NewArc2, NewArc1);
        NewTriangle2 = new Triangle(OldArc2, NewArc0, NewArc2);

        //Новым ребрам передаются ссылки на образующие их треугольники
        NewArc0.trAB = NewTriangle0;
        NewArc0.trBA = NewTriangle2;
        NewArc1.trAB = NewTriangle1;
        NewArc1.trBA = NewTriangle0;
        NewArc2.trAB = NewTriangle2;
        NewArc2.trBA = NewTriangle1;

        //Передача ссылок на старые ребра
        if (OldArc0.trAB === CurentTriangle) OldArc0.trAB = NewTriangle0;
        if (OldArc0.trBA === CurentTriangle) OldArc0.trBA = NewTriangle0;

        if (OldArc1.trAB === CurentTriangle) OldArc1.trAB = NewTriangle1;
        if (OldArc1.trBA === CurentTriangle) OldArc1.trBA = NewTriangle1;

        if (OldArc2.trAB === CurentTriangle) OldArc2.trAB = NewTriangle2;
        if (OldArc2.trBA === CurentTriangle) OldArc2.trBA = NewTriangle2;

        this.triangles.push(NewTriangle1);
        this.triangles.push(NewTriangle2);

        this.cache.Add(NewTriangle0);
        this.cache.Add(NewTriangle1);
        this.cache.Add(NewTriangle2);

        this.CheckDelaunayAndRebuild(OldArc0);
        this.CheckDelaunayAndRebuild(OldArc1);
        this.CheckDelaunayAndRebuild(OldArc2);
      }
    }
    //Дополнительный проход, улучшает соответствие условию Делоне
    for (var z = 0; z < this.triangles.length; z++) {
      this.CheckDelaunayAndRebuild(this.triangles[z].arcs[0]);
      this.CheckDelaunayAndRebuild(this.triangles[z].arcs[1]);
      this.CheckDelaunayAndRebuild(this.triangles[z].arcs[2]);
    }
  }

  GetIntersectedArc(Line, triangTarget) {
    if (Arc.ArcIntersect(triangTarget.arcs[0], Line))
      return triangTarget.arcs[0];
    if (Arc.ArcIntersect(triangTarget.arcs[1], Line))
      return triangTarget.arcs[1];
    if (Arc.ArcIntersect(triangTarget.arcs[2], Line))
      return triangTarget.arcs[2];

    return null;
  }

  IsPointInTriangle(_triangle, _point) {
    var P1 = _triangle.points[0];
    var P2 = _triangle.points[1];
    var P3 = _triangle.points[2];
    var P4 = _point;

    var a = (P1.x - P4.x) * (P2.y - P1.y) - (P2.x - P1.x) * (P1.y - P4.y);
    var b = (P2.x - P4.x) * (P3.y - P2.y) - (P3.x - P2.x) * (P2.y - P4.y);
    var c = (P3.x - P4.x) * (P1.y - P3.y) - (P1.x - P3.x) * (P3.y - P4.y);

    if ((a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0))
      return true;
    else return false;
  }

  IsDelaunay(A, B, C, _CheckNode) {
    var x0 = _CheckNode.x;
    var y0 = _CheckNode.y;
    var x1 = A.x;
    var y1 = A.y;
    var x2 = B.x;
    var y2 = B.y;
    var x3 = C.x;
    var y3 = C.y;

    var matrix = [
      (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0),
      x1 - x0,
      y1 - y0,
      (x2 - x0) * (x2 - x0) + (y2 - y0) * (y2 - y0),
      x2 - x0,
      y2 - y0,
      (x3 - x0) * (x3 - x0) + (y3 - y0) * (y3 - y0),
      x3 - x0,
      y3 - y0
    ];

    var matrixDeterminant =
      matrix[0] * matrix[4] * matrix[8] +
      matrix[1] * matrix[5] * matrix[6] +
      matrix[2] * matrix[3] * matrix[7] -
      matrix[2] * matrix[4] * matrix[6] -
      matrix[0] * matrix[5] * matrix[7] -
      matrix[1] * matrix[3] * matrix[8];

    var a =
      x1 * y2 * 1 +
      y1 * 1 * x3 +
      1 * x2 * y3 -
      1 * y2 * x3 -
      y1 * x2 * 1 -
      1 * y3 * x1;

    //Sgn(a)
    if (a < 0) matrixDeterminant *= -1;

    if (matrixDeterminant < 0) {
      return true;
    } else {
      return false;
    }
  }

  CheckDelaunayAndRebuild(arc) {
    var T1 = null;
    var T2 = null;

    if (arc.trAB != null && arc.trBA != null) {
      T1 = arc.trAB;
      T2 = arc.trBA;
    } else return;

    var CurentPoints = [];

    var OldArcT1A1 = null;
    var OldArcT1A2 = null;
    var OldArcT2A1 = null;
    var OldArcT2A2 = null;

    var NewArcT1A1 = null;
    var NewArcT1A2 = null;
    var NewArcT2A1 = null;
    var NewArcT2A2 = null;

    CurentPoints[0] = T1.GetThirdPoint(arc);
    CurentPoints[1] = arc.A;
    CurentPoints[2] = arc.B;
    CurentPoints[3] = T2.GetThirdPoint(arc);

    //Дополнительная проверка, увеличивает скорость алгоритма на 10%
    if (
      Arc.ArcIntersectForPoints(
        CurentPoints[0],
        CurentPoints[3],
        CurentPoints[1],
        CurentPoints[2]
      )
    ) {
      if (
        !this.IsDelaunay(
          CurentPoints[0],
          CurentPoints[1],
          CurentPoints[2],
          CurentPoints[3]
        )
      ) {
        const otherArcs1 = T1.GetTwoOtherArcs(arc);
        OldArcT1A1 = otherArcs1[0];
        OldArcT1A2 = otherArcs1[1];

        const otherArcs2 = T2.GetTwoOtherArcs(arc);
        OldArcT2A1 = otherArcs2[0];
        OldArcT2A2 = otherArcs2[1];

        if (OldArcT1A1.IsConnectedWith(OldArcT2A1)) {
          NewArcT1A1 = OldArcT1A1;
          NewArcT1A2 = OldArcT2A1;
          NewArcT2A1 = OldArcT1A2;
          NewArcT2A2 = OldArcT2A2;
        } else {
          NewArcT1A1 = OldArcT1A1;
          NewArcT1A2 = OldArcT2A2;
          NewArcT2A1 = OldArcT1A2;
          NewArcT2A2 = OldArcT2A1;
        }

        //Изменение ребра
        arc.A = CurentPoints[0];
        arc.B = CurentPoints[3];

        //переопределение ребер треугольников
        T1.arcs[0] = arc;
        T1.arcs[1] = NewArcT1A1;
        T1.arcs[2] = NewArcT1A2;

        T2.arcs[0] = arc;
        T2.arcs[1] = NewArcT2A1;
        T2.arcs[2] = NewArcT2A2;

        //перезапись точек треугольников
        T1.points[0] = arc.A;
        T1.points[1] = arc.B;
        T1.points[2] = Arc.GetCommonPoint(NewArcT1A1, NewArcT1A2);

        T2.points[0] = arc.A;
        T2.points[1] = arc.B;
        T2.points[2] = Arc.GetCommonPoint(NewArcT2A1, NewArcT2A2);

        //Переопределение ссылок в ребрах
        if (NewArcT1A2.trAB === T2) NewArcT1A2.trAB = T1;
        else if (NewArcT1A2.trBA === T2) NewArcT1A2.trBA = T1;

        if (NewArcT2A1.trAB === T1) NewArcT2A1.trAB = T2;
        else if (NewArcT2A1.trBA === T1) NewArcT2A1.trBA = T2;

        //Добавление треугольников в кэш
        this.cache.Add(T1);
        this.cache.Add(T2);
      }
    }
  }
  //Возвращает триугольник в котором находится данная точка
  GetTriangleForPoint(_point) {
    var link = this.cache.FindTriangle(_point);

    if (link == undefined) {
      link = this.triangles[0];
    }

    if (this.IsPointInTriangle(link, _point)) {
      return link;
    } else {
      //Путь от некоторого треугольниа до искомой точки
      var way = new Arc(_point, link.centroid);
      var CurentArc = null;

      while (!this.IsPointInTriangle(link, _point)) {
        CurentArc = this.GetIntersectedArc(way, link);
        if (link !== CurentArc.trAB && CurentArc.trAB !== null)
          link = CurentArc.trAB;
        else link = CurentArc.trBA;

        way = new Arc(_point, link.centroid);
      }
      return link;
    }
  }
}
