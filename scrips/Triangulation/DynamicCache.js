class DynamicCache {
  //sizeOfSpace : Vector2
  constructor(_sizeOfspace) {
    this.Cache = [];
    //Текущий размер кэша
    this.Size = 2;
    //Треугольников в кэше
    this.InCache = 0;
    //Реальные размеры кэшируемого пространства
    this.SizeOfSpace = _sizeOfspace;
    //Размеры одной ячейки кэша в пересчете на реальное пространство
    this.xSize = this.SizeOfSpace.x / this.Size;
    this.ySize = this.SizeOfSpace.y / this.Size;
  }

  GetKey(_point) {
    var i = Math.floor(_point.y / this.ySize);
    var j = Math.floor(_point.x / this.xSize);

    if (i === this.Size) i--;
    if (j === this.Size) j--;

    return i * (this.Size * 2) + j;
  }

  Add(_T) {
    this.InCache++;

    if (this.InCache >= this.Cache.length * 3) this.Increase();

    this.Cache[this.GetKey(_T.centroid)] = _T;
  }

  //Увеличивает размер кэша в 4 раза
  Increase() {
    var NewCache = [];
    NewCache.length = this.Size * 2 * this.Size * 2;
    var newIndex = 0;

    for (var i = 0; i < this.Cache.Length; i++) {
      newIndex = this.GetNewIndex(i);
      NewCache[newIndex] = this.Cache[i];
      NewCache[newIndex + 1] = this.Cache[i];
      NewCache[newIndex + Size * 2] = this.Cache[i];
      NewCache[newIndex + Size * 2 + 1] = this.Cache[i];
    }

    this.Size = this.Size * 2;
    this.xSize = this.SizeOfSpace.x / this.Size;
    this.ySize = this.SizeOfSpace.y / this.Size;

    this.Cache = NewCache;

    return undefined;
  }

  FindTriangle(_point) {
    var key = this.GetKey(_point);

    if (this.Cache[key] !== undefined) return this.Cache[key];

    for (var i = key - 25; i < key && i >= 0 && i < this.Cache.Length; i++)
      if (this.Cache[i] !== undefined) return this.Cache[i];

    for (var i = key + 25; i > key && i >= 0 && i < this.Cache.Length; i--)
      if (this.Cache[i] !== undefined) return this.Cache[i];

    return null;
  }

  GetNextIndex(_OldIndex) {
    var i = Math.floor(_OldIndex / this.Size) * 2;
    var j = Math.floor(_OldIndex % this.Size) * 2;

    return i * (this.Size * 2) + j;
  }
}
