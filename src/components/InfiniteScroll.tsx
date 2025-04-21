import { useEffect, useRef } from "react";

export default function InfiniteScroll() {
  return (
    <div className="overflow-hidden whitespace-nowrap w-">
      <ul className="flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8 ">
        {/* Duplicate logos to ensure seamless scrolling */}
        {[...Array(8)].map((_, i) => (
          <>
            <li key={`a${i}`}>
              <img
                src="/maruti_suzuki_white.png"
                alt="Maruti"
                className="w-12 h-auto opacity-70"
              />
            </li>
            <li key={`b${i}`}>
              <img
                src="/toyota_white.png"
                alt="Toyota"
                className="w-12 h-auto opacity-70"
              />
            </li>
            <li key={`c${i}`}>
              <img
                src="/hyundai_white.png"
                alt="Hyundai"
                className="w-12 h-auto opacity-70"
              />
            </li>

            <li key={`d${i}`}>
              <img
                src="/mercedes_whitepng.png"
                alt="Merc"
                className="w-10 h-auto opacity-70"
              />
            </li>
            <li key={`e${i}`}>
              <img
                src="/mg_white.png"
                alt="MG"
                className="w-10 h-auto opacity-70"
              />
            </li>
            <li key={`f${i}`}>
              <img
                src="/audi_white.png"
                alt="Audi"
                className="w-12 h-auto opacity-70"
              />
            </li>
            <li key={`g${i}`}>
              <img
                src="/kia_white.png"
                alt="Kia"
                className="w-16 h-auto opacity-70"
              />
            </li>
            <li key={`h${i}`}>
              <img
                src="/bmw_white.png"
                alt="BMW"
                className="w-10 h-auto opacity-70"
              />
            </li>
          </>
        ))}
      </ul>
    </div>
  );
}
