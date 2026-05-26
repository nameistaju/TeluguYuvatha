"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface AddToCartButtonProps {
  onAddToCart?: () => void;
  className?: string;
}

export default function AddToCartButton({ onAddToCart, className = "" }: AddToCartButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handlePointerDown = () => {
      if (button.classList.contains("atc-active")) return;
      gsap.to(button, { "--background-scale": 0.97, duration: 0.15 });
    };

    const handleClick = (e: Event) => {
      e.preventDefault();
      if (button.classList.contains("atc-active")) return;

      button.classList.add("atc-active");
      onAddToCart?.();

      // Background scale bounce
      gsap.to(button, {
        keyframes: [
          { "--background-scale": 0.97, duration: 0.15 },
          { "--background-scale": 1, delay: 0.125, duration: 1.2, ease: "elastic.out(1, .6)" },
        ],
      });

      // Shirt animation sequence
      gsap.to(button, {
        keyframes: [
          { "--shirt-scale": 1, "--shirt-y": "-42px", "--cart-x": "0px", "--cart-scale": 1, duration: 0.4, ease: "power1.in" },
          { "--shirt-y": "-40px", duration: 0.3 },
          { "--shirt-y": "16px", "--shirt-scale": 0.9, duration: 0.25, ease: "none" },
          { "--shirt-scale": 0, duration: 0.3, ease: "none" },
        ],
      });

      // Shirt second layer reveal
      gsap.to(button, {
        "--shirt-second-y": "0px",
        delay: 0.835,
        duration: 0.12,
      });

      // Cart clip, tick and exit animation
      gsap.to(button, {
        keyframes: [
          { "--cart-clip": "12px", "--cart-clip-x": "3px", delay: 0.9, duration: 0.06 },
          { "--cart-y": "2px", duration: 0.1 },
          { "--cart-tick-offset": "0px", "--cart-y": "0px", duration: 0.2,
            onComplete() { button.style.overflow = "hidden"; }
          },
          { "--cart-x": "52px", "--cart-rotate": "-15deg", duration: 0.2 },
          {
            "--cart-x": "104px",
            "--cart-rotate": "0deg",
            duration: 0.2,
            clearProps: true,
            onComplete() {
              button.style.overflow = "hidden";
              button.style.setProperty("--text-o", "0");
              button.style.setProperty("--text-x", "0px");
              button.style.setProperty("--cart-x", "-104px");
            },
          },
          {
            "--text-o": "1",
            "--text-x": "12px",
            "--cart-x": "-48px",
            "--cart-scale": ".75",
            duration: 0.25,
            clearProps: true,
            onComplete() {
              button.classList.remove("atc-active");
              button.style.overflow = "";
            },
          },
        ],
      });

      // Text fade out
      gsap.to(button, {
        keyframes: [{ "--text-o": 0, duration: 0.3 }],
      });
    };

    button.addEventListener("pointerdown", handlePointerDown);
    button.addEventListener("click", handleClick);

    return () => {
      button.removeEventListener("pointerdown", handlePointerDown);
      button.removeEventListener("click", handleClick);
    };
  }, [onAddToCart]);

  return (
    <>
      <style>{`
        .atc-btn {
          /* Theme colors — Telugu Yuvatha dark palette */
          --background-default: #B00020;
          --background-hover: #8B0018;
          --background-scale: 1;
          --text-color: #F5F5F5;
          --text-o: 1;
          --text-x: 12px;
          --cart: #F5F5F5;
          --cart-x: -48px;
          --cart-y: 0px;
          --cart-rotate: 0deg;
          --cart-scale: 0.75;
          --cart-clip: 0px;
          --cart-clip-x: 0px;
          --cart-tick-offset: 10px;
          --cart-tick-color: #FFD54F;
          --shirt-y: -16px;
          --shirt-scale: 0;
          --shirt-color: #B00020;
          --shirt-logo: #F5F5F5;
          --shirt-second-y: 24px;
          --shirt-second-color: #F5F5F5;
          --shirt-second-logo: #B00020;

          -webkit-tap-highlight-color: transparent;
          -webkit-appearance: none;
          outline: none;
          background: none;
          border: none;
          padding: 12px 0;
          width: 164px;
          margin: 0;
          cursor: pointer;
          position: relative;
          font-family: inherit;
          flex-shrink: 0;
        }

        .atc-btn::before {
          content: '';
          display: block;
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          border-radius: 5px;
          transition: background 0.25s;
          background: var(--background, var(--background-default));
          transform: scaleX(var(--background-scale)) translateZ(0);
        }

        .atc-btn:not(.atc-active):hover {
          --background: var(--background-hover);
        }

        .atc-btn > span {
          display: block;
          text-align: center;
          position: relative;
          z-index: 1;
          font-size: 14px;
          font-weight: 700;
          line-height: 24px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-color);
          opacity: var(--text-o);
          transform: translateX(var(--text-x)) translateZ(0);
        }

        /* — SVG base — */
        .atc-btn svg {
          display: block;
          width: var(--svg-width, 24px);
          height: var(--svg-height, 24px);
          position: var(--svg-position, relative);
          left: var(--svg-left, 0);
          top: var(--svg-top, 0);
          stroke-linecap: round;
          stroke-linejoin: round;
          overflow: visible;
        }
        .atc-btn svg path {
          fill: var(--svg-fill, none);
          stroke: var(--svg-stroke, none);
          stroke-width: var(--svg-stroke-width, 2);
        }

        /* — Morph wave — */
        .atc-btn .atc-morph {
          --svg-width: 64px;
          --svg-height: 13px;
          --svg-left: 50%;
          --svg-top: -12px;
          --svg-position: absolute;
          --svg-fill: var(--background, var(--background-default));
          pointer-events: none;
          margin-left: -32px;
          transition: fill 0.25s;
        }

        /* — Shirt & Cart wrappers — */
        .atc-btn .atc-shirt,
        .atc-btn .atc-cart {
          pointer-events: none;
          position: absolute;
          left: 50%;
        }

        /* — Shirt — */
        .atc-btn .atc-shirt {
          margin: -12px 0 0 -12px;
          top: 0;
          transform-origin: 50% 100%;
          transform: translateY(var(--shirt-y)) scale(var(--shirt-scale));
        }
        .atc-btn .atc-shirt svg {
          --svg-fill: var(--shirt-color);
        }
        .atc-btn .atc-shirt svg g path {
          fill: var(--shirt-logo);
          stroke: none;
        }
        .atc-btn .atc-shirt svg.atc-second {
          --svg-fill: var(--shirt-second-color);
          --svg-position: absolute;
          top: 0; left: 0;
          clip-path: polygon(0 var(--shirt-second-y), 24px var(--shirt-second-y), 24px 24px, 0 24px);
        }
        .atc-btn .atc-shirt svg.atc-second g path {
          fill: var(--shirt-second-logo);
          stroke: none;
        }

        /* — Cart — */
        .atc-btn .atc-cart {
          --svg-width: 36px;
          --svg-height: 26px;
          --svg-stroke: var(--cart);
          top: 10px;
          margin-left: -18px;
          transform: translate(var(--cart-x), var(--cart-y)) rotate(var(--cart-rotate)) scale(var(--cart-scale)) translateZ(0);
        }
        .atc-btn .atc-cart::before {
          content: '';
          display: block;
          width: 22px;
          height: 12px;
          position: absolute;
          left: 7px;
          top: 7px;
          background: var(--cart);
          clip-path: polygon(0 0, 22px 0, calc(22px - var(--cart-clip-x)) var(--cart-clip), var(--cart-clip-x) var(--cart-clip));
        }
        .atc-btn .atc-cart path.atc-wheel {
          --svg-stroke-width: 1.5;
        }
        .atc-btn .atc-cart path.atc-tick {
          --svg-stroke: var(--cart-tick-color);
          stroke: var(--cart-tick-color) !important;
          stroke-dasharray: 10px;
          stroke-dashoffset: var(--cart-tick-offset);
        }
        .atc-btn .atc-cart path.atc-shape {
          stroke: var(--cart) !important;
        }
        .atc-btn .atc-cart path.atc-wheel {
          stroke: var(--cart) !important;
          stroke-width: 1.5 !important;
        }
      `}</style>

      <button ref={buttonRef} className={`atc-btn ${className}`}>
        <span>Add to cart</span>

        {/* Wave morph under button */}
        <svg className="atc-morph" viewBox="0 0 64 13">
          <path d="M0 12C6 12 17 12 32 12C47.9024 12 58 12 64 12V13H0V12Z" />
        </svg>

        {/* Shirt that flies in */}
        <div className="atc-shirt">
          <svg className="atc-first" viewBox="0 0 24 24">
            <path d="M4.99997 3L8.99997 1.5C8.99997 1.5 10.6901 3 12 3C13.3098 3 15 1.5 15 1.5L19 3L22.5 8L19.5 10.5L19 9.5L17.1781 18.6093C17.062 19.1901 16.778 19.7249 16.3351 20.1181C15.4265 20.925 13.7133 22.3147 12 23C10.2868 22.3147 8.57355 20.925 7.66487 20.1181C7.22198 19.7249 6.93798 19.1901 6.82183 18.6093L4.99997 9.5L4.5 10.5L1.5 8L4.99997 3Z" />
            <g>
              <path d="M16.3516 9.65383H14.3484V7.83652H14.1742V9.8269H16.5258V7.83652H16.3516V9.65383Z" />
              <path d="M14.5225 6.01934V7.66357H14.6967V7.4905H14.8186V7.66357H14.9928V6.01934H14.8186V7.31742H14.6967V6.01934H14.5225Z" />
              <path d="M14.1742 5.67319V7.66357H14.3484V5.84627H16.3516V7.66357H16.5258V5.67319H14.1742Z" />
              <path d="M15.707 9.48071H15.8812V9.28084L16.0032 9.4807V9.48071H16.1774V7.83648H16.0032V9.14683L15.8812 8.94697V7.83648H15.707V9.48071Z" />
              <path d="M15.5852 6.01931H15.1149V6.19238H15.5852V6.01931Z" />
              <path d="M15.707 6.01934V7.66357H15.8812V7.46371L16.0032 7.66357H16.1774V6.01934H16.0032V7.32969L15.8812 7.12984V6.01934H15.707Z" />
              <path d="M15.411 7.31742H15.2891V6.53857H15.411V7.31742ZM15.1149 7.66357H15.2891V7.4905H15.411V7.66357H15.5852V6.3655H15.1149V7.66357Z" />
              <path d="M14.5225 8.69756L14.8186 9.18291V9.30763H14.6967V9.13455H14.5225V9.48071H14.9928V9.13456V9.13455L14.6967 8.64917V8.00956H14.8186V8.6586H14.9928V7.83648H14.5225V8.69756Z" />
              <path d="M15.411 9.30763H15.2891V8.00956H15.411V9.30763ZM15.1149 9.48071H15.5852V7.83648H15.1149V9.48071Z" />
            </g>
          </svg>
          <svg className="atc-second" viewBox="0 0 24 24">
            <path d="M4.99997 3L8.99997 1.5C8.99997 1.5 10.6901 3 12 3C13.3098 3 15 1.5 15 1.5L19 3L22.5 8L19.5 10.5L19 9.5L17.1781 18.6093C17.062 19.1901 16.778 19.7249 16.3351 20.1181C15.4265 20.925 13.7133 22.3147 12 23C10.2868 22.3147 8.57355 20.925 7.66487 20.1181C7.22198 19.7249 6.93798 19.1901 6.82183 18.6093L4.99997 9.5L4.5 10.5L1.5 8L4.99997 3Z" />
            <g>
              <path d="M16.3516 9.65383H14.3484V7.83652H14.1742V9.8269H16.5258V7.83652H16.3516V9.65383Z" />
              <path d="M14.5225 6.01934V7.66357H14.6967V7.4905H14.8186V7.66357H14.9928V6.01934H14.8186V7.31742H14.6967V6.01934H14.5225Z" />
              <path d="M14.1742 5.67319V7.66357H14.3484V5.84627H16.3516V7.66357H16.5258V5.67319H14.1742Z" />
              <path d="M15.707 9.48071H15.8812V9.28084L16.0032 9.4807V9.48071H16.1774V7.83648H16.0032V9.14683L15.8812 8.94697V7.83648H15.707V9.48071Z" />
              <path d="M15.5852 6.01931H15.1149V6.19238H15.5852V6.01931Z" />
              <path d="M15.707 6.01934V7.66357H15.8812V7.46371L16.0032 7.66357H16.1774V6.01934H16.0032V7.32969L15.8812 7.12984V6.01934H15.707Z" />
              <path d="M15.411 7.31742H15.2891V6.53857H15.411V7.31742ZM15.1149 7.66357H15.2891V7.4905H15.411V7.66357H15.5852V6.3655H15.1149V7.66357Z" />
              <path d="M14.5225 8.69756L14.8186 9.18291V9.30763H14.6967V9.13455H14.5225V9.48071H14.9928V9.13456V9.13455L14.6967 8.64917V8.00956H14.8186V8.6586H14.9928V7.83648H14.5225V8.69756Z" />
              <path d="M15.411 9.30763H15.2891V8.00956H15.411V9.30763ZM15.1149 9.48071H15.5852V7.83648H15.1149V9.48071Z" />
            </g>
          </svg>
        </div>

        {/* Cart that catches the shirt */}
        <div className="atc-cart">
          <svg viewBox="0 0 36 26">
            <path d="M1 2.5H6L10 18.5H25.5L28.5 7.5L7.5 7.5" className="atc-shape" />
            <path d="M11.5 25C12.6046 25 13.5 24.1046 13.5 23C13.5 21.8954 12.6046 21 11.5 21C10.3954 21 9.5 21.8954 9.5 23C9.5 24.1046 10.3954 25 11.5 25Z" className="atc-wheel" />
            <path d="M24 25C25.1046 25 26 24.1046 26 23C26 21.8954 25.1046 21 24 21C22.8954 21 22 21.8954 22 23C22 24.1046 22.8954 25 24 25Z" className="atc-wheel" />
            <path d="M14.5 13.5L16.5 15.5L21.5 10.5" className="atc-tick" />
          </svg>
        </div>
      </button>
    </>
  );
}
