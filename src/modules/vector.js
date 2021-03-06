class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  from(vector){
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  scale(scaler) {
    this.x *= scaler;
    this.y *= scaler;
    return this;
  }

  normalize() {
    let abs = this.abs();
    if (!Number.isNaN(abs) && abs!=0){
      this.scale(1 / abs);
    }
    return this;
  }

  abs() {
    return (this.x ** 2 + this.y ** 2) ** 0.5;
  }

  scalar(v) {
    return this.x * v.x + this.y * v.y;
  }

  reflect(n) {
    return this.sub(n.scale(this.scalar(n)).scale(2));
  }

  compare(v, range = 300) {
    return Math.abs(this.x - v.x) < range && Math.abs(this.y - v.y) < range;
  }
}

module.exports = Vector;
