import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="relative overflow-hidden min-h-[92vh] border-[0.5px] border-gray-200"
      style={{ background: "var(--cream)" }}
    >
      {/* Background */}
      <div
        className="absolute pointer-events-none top-[-10%] right-[-5%] w-[55w] h-[110vh] opacity-55 rounded-[50%_50%_40%_60%/60%_40%_60%_40%]"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, var(--blush-light) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none bottom-0 left-[-8%] w-[3-vw] h-[40vh] opacity-40 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, var(--sage-light) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-center min-h-[92vh] px-8 sm:px-16 lg:px-24 gap-12 sm:gap-0">
        {/* Left side - text */}
        <div className="w-full sm:w-1/2 flex flex-col justify-center py-16 sm:py-0">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-[2rem] h-[1px]"
              style={{ background: "var(--blush-dim)" }}
            />
            <p
              className="text-[0.65rem] tracking-[0.3em] font-medium font-['DM_Sans',sans-serif]"
              style={{ color: "var(--rose)" }}
            >
              SPRING · SUMMER 2026
            </p>
          </div>

          {/* Headline */}
          <h1
            className="playfair leading-[1.1] mb-6 font-normal text-[clamp(2.8rem,5.5vw,5rem)]"
            style={{ color: "var(--text-dark)" }}
          >
            Dress Your
            <br />
            <em className="italic font-normal" style={{ color: "var(--rose)" }}>
              Story.
            </em>
          </h1>

          {/* Description */}
          <p
            className="mb-10 max-w-sm leading-loose text-[0.88rem] font-light"
            style={{ color: "var(--text-mid)" }}
          >
            Curated fashion for every moment — from effortless everyday wear to
            pieces that make you feel beautifully, quietly yourself.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 items-center mb-12">
            <Link to="/collection">
              <button className="btn-blush">Shop Collection</button>
            </Link>
            <Link to="/about">
              <button className="btn-outline-blush">Our Story</button>
            </Link>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-6">
            {/* Stars */}
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="var(--blush-dim)"
                  stroke="none"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              ))}
              <span
                className="text-[0.72rem] ml-[6px]"
                style={{ color: "var(--text-mid)" }}
              >
                4.9 from 12,400+ reviews
              </span>
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="relative w-full sm:w-1/2 flex justify-center items-center min-h-[70vh]">
          {/* Main image */}
          <div className="relative overflow-hidden w-[62%] aspect-[2/3] rounded-[60%_40%_55%_45%/50%_50%_50%_50%] shadow-[0_30px_80px_rgba(196,135,125,0.18)]">
            <img
              src={assets.hero_img}
              alt="New Collection"
              className="w-full h-full object-cover object-top brightness-[0.96] saturate-[0.92]"
            />

            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(234,197,190,0.12)_0%,transparent_60%)]" />
          </div>
          <div
            className="absolute top-[8%] left-[4%] min-w-[120px] rounded-[2px] py-[14px] px-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.07)]"
            style={{ background: "var(--white)" }}
          >
            <p
              className="text-[0.58rem] tracking-[0.2em] mb-[4px]"
              style={{ color: "var(--text-soft)" }}
            >
              {" "}
              NEW IN{" "}
            </p>
            <p
              className="playfair text-[1.1rem] font-normal"
              style={{ color: "var(--text-dark)" }}
            >
              {" "}
              Spring Collection{" "}
            </p>
            <div
              className="w-[24px] h-[1px] mt-[6px]"
              style={{ background: "var(--blush)" }}
            />
          </div>

          <div
            className="absolute bottom-[10%] right-[2%] rounded-[2px] px-[18px] py-[14px] shadow-[0_8px_30px_rgba(196,135,125,0.15)]"
            style={{ background: "var(--blush-light)" }}
          >
            <p
              className="playfair text-[1.6rem] font-normal leading-none"
              style={{ color: "var(--rose)" }}
            >
              50K
            </p>
            <p className="text-[0.58rem] tracking-[0.18em] mt-[4px]" style={{ color: "var(--text-mid)"}}
            >
              HAPPY CUSTOMERS
            </p>
          </div>

          <div
            className="absolute pointer-events-none bottom-[20%] left-[5%] grid grid-cols-[repeat(4,8px)] gap-[6px] opacity-35"
          >
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="w-[3px] h-[3px] rounded-full"
                style={{ background: "var(--blush-dim)"}}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
