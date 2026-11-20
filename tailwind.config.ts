import type { Config } from "tailwindcss";
export default { content:["./src/**/*.{ts,tsx}"], theme:{extend:{colors:{bg:"#0F0F0F",surface:"#181818",chip:"#272727",line:"#3F3F3F",txt:"#F1F1F1",mute:"#AAAAAA",yt:"#FF0000",link:"#3EA6FF"},fontFamily:{sans:["var(--font-roboto)","sans-serif"]}}},plugins:[] } satisfies Config;
