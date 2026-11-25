
import { cn } from "@/lib/utils";

// 1. Sketch Button - Neobrutalist design with a solid offset border/shadow on hover
export function SketchButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 cursor-pointer font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 2. Simple Button - Elegant transition with subtle translation & shadow on hover
export function SimpleButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md border border-neutral-300 bg-neutral-100 text-neutral-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md cursor-pointer font-medium",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 3. Invert Button - Simple color inversion on hover
export function InvertButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "px-8 py-2 rounded-md bg-teal-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 4. Tailwind Connect Button - Premium radial gradient, glow overlay, and bottom gradient line
export function TailwindConnectButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
      </span>
      <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
        <span>{children}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M10.75 8.75L14.25 12L10.75 15.25"
          ></path>
        </svg>
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
    </button>
  );
}

// 5. Gradient Button - Premium smooth vertical gradient with hover shadows
export function GradientButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "px-8 py-2 rounded-full bg-gradient-to-b from-signal to-[#6B3FFA] text-white focus:ring-2 focus:ring-signal/40 hover:shadow-xl transition duration-200 cursor-pointer font-medium",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 6. Unapologetic Button - Solid flat offset shadow box translating on hover
export function UnapologeticButton({ children, className, shadowBg = "bg-yellow-300", ...props }) {
  return (
    <button
      className={cn(
        "px-8 py-2 border-2 border-black bg-transparent text-black dark:border-white relative group transition duration-200 cursor-pointer font-bold",
        className
      )}
      {...props}
    >
      <div className={cn("absolute -bottom-2 -right-2 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200 border-2 border-black", shadowBg)} />
      <span className="relative">{children}</span>
    </button>
  );
}

// 7. Lit Up Borders Button - Sleek indigo-to-purple gradient border container
export function LitUpBordersButton({ children, className, ...props }) {
  return (
    <button className={cn("p-[3px] relative cursor-pointer", className)} {...props}>
      <div className="absolute inset-0 bg-gradient-to-r from-signal to-[#6B3FFA] rounded-lg animate-pulse" />
      <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent font-medium">
        {children}
      </div>
    </button>
  );
}

// 8. Border Magic Button - Spinning conic gradient background light loop
export function BorderMagicButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 cursor-pointer",
        className
      )}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </span>
    </button>
  );
}

// 9. Shimmer Button - Subtle shifting reflection animation
export function ShimmerButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 10. Spotify Button - Vibrant green tracking-widest uppercase hover transform
export function SpotifyButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 cursor-pointer text-xs",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 11. Signal Button - Signal indigo shadow-glow transition
export function NextJSBlueButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "shadow-[0_4px_14px_0_rgb(124,92,255,35%)] hover:shadow-[0_6px_20px_rgba(124,92,255,25%)] hover:bg-signal px-8 py-2 bg-signal rounded-md text-white font-light transition duration-200 ease-linear cursor-pointer text-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 12. NextJS White Button - Pure white card shadow-glow transition
export function NextJSWhiteButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)] px-8 py-2 bg-[#fff] text-[#696969] rounded-md font-light transition duration-200 ease-linear cursor-pointer text-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
