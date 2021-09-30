$(document).ready(function() {
    // Add smooth scrolling to all links
    $("a").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function() {

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });
});


var canvas;
var mic;
let value = 0;
let offset = 0;
let r, g, b;
let R = 1;
let x, y, a, c;

r = 0;
g = 0;
b = 0;
x = 0;
y = 0;
a = 2;
c = 2;

function windowResized() {
    //console.log('resized');
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    //canvas.style('z-index', '-1');
    // mic = new p5.AudioIn();
    // mic.start();
    //background(175);
}

function keyPressed() {
    clear();
}

function draw() {
    // if (mouseIsPressed) {
    //   ellipse(pmouseX, pmouseY, mouseX, mouseY);
    // }
    noStroke();

    if (r < 256 && g <= 0 && b <= 0) {
        r = r + R;
    }
    if (r >= 255 && g < 256 && b <= 0) {
        g = g + R;
    }
    if (r > 0 && g >= 255 && b <= 0) {
        r = r - R;
    }
    if (r <= 0 && g >= 255 && b < 256) {
        b = b + R;
    }
    if (r <= 0 && g > 0 && b >= 255) {
        g = g - R;
    }
    if (r < 256 && g <= 0 && b >= 255) {
        r = r + R;
    }
    if (r >= 255 && g <= 0 && b > 0) {
        b = b - R;
    }
    fill(r, g, b, 90);
    // ellipse(mouseX, mouseY, 117);
    // push();
    if (mouseIsPressed) {
        ellipse(pmouseX, pmouseY, 20);
    }
    // x += a;
    // y += c;
    // if (x >= windowWidth) {
    //   a=a * -1
    // }
    // if (y > windowHeight) {
    //  c= c * -1
    // }
    // if (x <0) {
    //   a=a * -1
    // }
    // if (y <0) {
    //   c=c* -1
    // }
    // var vol = mic.getLevel();
    // ellipse(width / 2, height / 2, vol * width);
}