varying float vUv;
varying vec3 vcolor;
void main()
        {
            vec2 uv=gl_PointCoord;

            float strength=distance(uv,vec2(0.5));
            // strength=step(0.5,strength);
            // strength=1.0-strength;

            //Diffused 
            // strength*=2.0;
            // strength=1.0-strength;

            //Light Point
            strength=1.0-strength;
            strength=pow(strength,10.0);

            //Final Color
            vec3 color=mix(vec3(0.0),vcolor,strength);

            gl_FragColor=vec4(color,1.0); 

        }