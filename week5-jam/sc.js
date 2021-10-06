
const vs = `
    precision highp float;

    float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }


    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    varying vec4 vColor;

    void main(void) {
      vColor = aVertexColor;
      gl_Position = aVertexPosition;
    }
`;

const fs = `
    precision highp float;

    // uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_speed;

    varying vec4 vColor;

    float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    // Classic Perlin 3D Noise 
// by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
}

    void main(void) {
        float dis = distance(gl_FragCoord.xy+u_time,vec2(140.,730.));
        float n1 = cnoise(vec3(vec2(gl_FragCoord.xy/100.),u_time*u_speed))+.3;
        float n2 = cnoise(vec3(vec2(gl_FragCoord.xy/10.),dis))+.3;
float n = min(n1,n2);
      gl_FragColor = vec4(vec3(n),1.);
    }
`;


let s = false;
let a = 1.;
document.addEventListener('keydown',function(){
    s = !s;
    if (s==true){
        a=1.;
    }else{
        a=0.1;
    }
    console.log(a);
});



// not change this part 55-70
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl');

    const v_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(v_shader, vs);
    gl.compileShader(v_shader);

    const f_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(f_shader, fs);
    gl.compileShader(f_shader);

    const s_program = gl.createProgram();
    gl.attachShader(s_program, v_shader);
    gl.attachShader(s_program, f_shader);
    gl.linkProgram(s_program);

    // send value to shader
    const vertex_position_location = gl.getAttribLocation(s_program, 'aVertexPosition');
    const vertex_color_location = gl.getAttribLocation(s_program, 'aVertexColor');
    const u_time_location = gl.getUniformLocation(s_program, "u_time");
    // const u_resolution_location = gl.getUniformLocation(s_program, "u_resolution");
    const speed = gl.getUniformLocation(s_program,"u_speed");

// what dose buffer means?
    const position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    const positions = [
        1.0, 1.0,
        -1.0, 1.0, 
        1.0, -1.0, 
        -1.0, -1.0, 
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertex_position_location, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertex_position_location);

// not change this part 92-97
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  
  
// animate the loop
    let start_time = Date.now();
    function render() {

        gl.useProgram(s_program);
 
        // gl.uniform2fv(u_mouse_location, mouse_xy);
        gl.uniform1f(u_time_location, (Date.now() - start_time) * .001);

        // gl.uniform1f(u_resolution_location, (Date.now() - start_time) * .001);

        gl.uniform1f(speed, a);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        
        requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);


