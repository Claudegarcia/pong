export default function willCollide(rect1, rect2) {
  let x = false;
  let y = false;
  let xCurr = false;
  let yCurr = false;
  let collided = false;

  const rect1XNext = rect1.x + rect1.dx;
  const rect1YNext = rect1.y + rect1.dy;

  if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x) {
    xCurr = true;
  }
  if (rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
    yCurr = true;
  }
  if (
    yCurr &&
    rect1XNext < rect2.x + rect2.width &&
    rect1XNext + rect1.width > rect2.x
  ) {
    x = true;
  }
  if (
    xCurr &&
    rect1YNext < rect2.y + rect2.height &&
    rect1YNext + rect1.height > rect2.y
  ) {
    y = true;
  }
  if (
    rect1XNext < rect2.x + rect2.width &&
    rect1XNext + rect1.width > rect2.x &&
    rect1YNext < rect2.y + rect2.height &&
    rect1YNext + rect1.height > rect2.y
  ) {
    collided = true;
  }
  return { x, y, collided };
}
