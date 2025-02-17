let dots = [];
let score = 0;
let spawnInterval = 1000; // Spawn a new dot every second
let lastSpawnTime = 0;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('p5-container');  // Attach to the div from the shortcode

  textFont('monospace', 20);
  // Create some initial dots
  for (let i = 0; i < 10; i++) {
    dots.push(new Dot(random(width), random(height)));
  }
}

function draw() {
  background(240);
  
  // Display the score
  fill(0);
  noStroke();
  text("Score: " + score, 10, 30);
  
  // Spawn a new dot every spawnInterval milliseconds
  if (millis() - lastSpawnTime > spawnInterval) {
    dots.push(new Dot(random(width), random(height)));
    lastSpawnTime = millis();
  }
  
  // Update and display all dots
  for (let dot of dots) {
    dot.update();
    dot.display();
  }
  
  // Remove dots that have expired (lifetime <= 0)
  for (let i = dots.length - 1; i >= 0; i--) {
    if (dots[i].lifetime <= 0) {
      dots.splice(i, 1);
    }
  }
}

function mousePressed() {
  // Check each dot to see if it was clicked
  for (let i = dots.length - 1; i >= 0; i--) {
    let d = dots[i];
    if (dist(mouseX, mouseY, d.x, d.y) < d.size / 2) {
      // Award points based on the dot's brightness
      score += d.points;
      // Remove the clicked dot
      dots.splice(i, 1);
      break; // Only process one dot per click
    }
  }
}

// Dot class definition
class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(30, 60);
    this.col = color(random(255), random(255), random(255));
    // Points based on the sum of RGB components (brighter dots give more points)
    this.points = max(1, floor((red(this.col) + green(this.col) + blue(this.col)) / 50));
    
    // Set a random velocity
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(0.5, 2));
    
    // Lifetime in frames (about 300 frames ≈ 5 seconds at 60fps)
    this.lifetime = 300;
  }
  
  update() {
    // Update the dot's position
    this.x += this.vel.x;
    this.y += this.vel.y;
    
    // Bounce off the edges
    if (this.x < this.size / 2 || this.x > width - this.size / 2) {
      this.vel.x *= -1;
    }
    if (this.y < this.size / 2 || this.y > height - this.size / 2) {
      this.vel.y *= -1;
    }
    
    // Decrease lifetime
    this.lifetime--;
  }
  
  display() {
    noStroke();
    fill(this.col);
    ellipse(this.x, this.y, this.size);
    
    // Optionally, draw a fading border that indicates remaining lifetime
    stroke(0, map(this.lifetime, 0, 300, 0, 255));
    noFill();
    ellipse(this.x, this.y, this.size + 10);
  }
}
