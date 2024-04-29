import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls, Plane } from "@react-three/drei";
import { DirectionalLight, ShaderMaterial } from "three";
import { Scene } from "@/components/custom/Scene";
import axios from "axios";

export default function Three() {
  // const [windowSize, _setWindowSize] = useState([
  //   window.innerWidth,
  //   window.innerHeight,
  // ]);

  // console.log(windowSize, "windowSize");

  const shaderMaterial = new ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      void main() {
        gl_FragColor = vec4(abs(sin(time)), abs(cos(time)), 0.5, 1.0);
      }
    `,
  });

  const shaderMaterial2 = new ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      void main() {
        gl_FragColor = vec4(abs(sin(time)), abs(cos(time)), 0.5, 1.0);
      }
    `,
  });

  const shaderMaterial3 = new ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      // iResolution: { value: { x: window.innerWidth, y: window.innerHeight } },
    },
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float iTime;
      uniform vec2 iResolution;

      vec3 palette( float t ) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263,0.416,0.557);

        return a + b*cos( 6.28318*(c*t+d) );
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
        vec2 uv0 = uv;
        vec3 finalColor = vec3(0.0);
        
        for (float i = 0.0; i < 4.0; i++) {
            uv = fract(uv * 1.5) - 0.5;

            float d = length(uv) * exp(-length(uv0));

            vec3 col = palette(length(uv0) + i*.4 + iTime*.4);

            d = sin(d*8. + iTime)/8.;
            d = abs(d);

            d = pow(0.01 / d, 1.2);

            finalColor += col * d;
        }
            
        fragColor = vec4(finalColor, 1.0);
      }

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `,
  });

  // const [vertex, setVertex] = useState("");
  // const [fragment, setFragment] = useState("");

  // // Fetch the shaders once the component mounts
  // useEffect(() => {
  //   // fetch the vertex and fragment shaders from public folder
  //   axios.get("public/vertexShader.glsl").then((res) => {
  //     console.log("whats going on here");
  //     setVertex(res.data);
  //   });
  //   axios
  //     .get("public/fragmentShader.glsl")
  //     .then((res) => setFragment(res.data));
  // }, []);

  // // If the shaders are not loaded yet, return null (nothing will be rendered)
  // if (vertex == "" || fragment == "") return null;
  // return (
  //   <Canvas style={{ width: "100vw", height: "100vh" }}>
  //     <Scene vertex={vertex} fragment={fragment} />
  //   </Canvas>
  // );

  return (
    <div className="h-screen w-full">
      <Canvas
        style={{ background: "black" }}
        camera={{ position: [0, 0, 5] }}
        className="w-100 "
      >
        {/* <ambientLight /> */}
        {/* <DirectionalLight position={[1, 1, 1]} /> */}
        {/* <pointLight position={[10, 10, 10]} /> */}
        <Box position={[0, 0, 0]} material={shaderMaterial}>
          {/* <meshStandardMaterial color={"hotpink"} /> */}
        </Box>
        <OrbitControls />
        <Plane args={[10, 10]} material={shaderMaterial3} />
      </Canvas>
    </div>
  );
}
