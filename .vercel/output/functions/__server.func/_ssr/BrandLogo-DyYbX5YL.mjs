import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 }
  }
};
const letterVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
};
function BrandLogo() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        variants: containerVariants,
        initial: "hidden",
        animate: "show",
        className: "flex items-baseline font-brand leading-none",
        "aria-label": "BeeSafe",
        children: [
          "Bee".split("").map((char, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.span,
            {
              variants: letterVariants,
              className: "text-6xl font-black text-foreground",
              children: char
            },
            `bee-${i}`
          )),
          "Safe".split("").map((char, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.span,
            {
              variants: letterVariants,
              className: "text-6xl font-black",
              style: { color: "var(--dashcam-yellow)", textShadow: "0 0 32px rgba(234,179,8,0.4)" },
              children: char
            },
            `safe-${i}`
          ))
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { scaleX: 0, opacity: 0 },
        animate: { scaleX: 1, opacity: 1 },
        transition: { delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        className: "h-px w-48 origin-left rounded-full bg-[var(--dashcam-yellow)]"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.p,
      {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 1.4, duration: 0.7, ease: "easeOut" },
        className: "text-xs uppercase tracking-[0.28em] text-muted-foreground",
        children: "Drive smart. Stay safe."
      }
    )
  ] });
}
export {
  BrandLogo as B
};
