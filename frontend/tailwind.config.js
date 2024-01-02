/** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
//
// ------- copied from https://tailwindcss.com/docs/guides/vite
/** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

// copied from https://github.com/Oasixer/Personal-Website
/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  // content: ['./src/**/*.{html,js,svelte,ts}'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    // see https://tailwindcss.com/docs/customizing-spacing
    //
    // The spacing scale is inherited by the padding, margin,
    // width, minWidth, maxWidth, height, minHeight, maxHeight, gap, inset,
    // space, translate, scrollMargin, and scrollPadding core plugins.
    //
    // Default spacing scale (rem REM):
    // Name	Size	    Pixels
    // 0	  0px     	0px
    // px	  1px	      1px
    // 0.5	0.125rem	2px
    // 1	  0.25rem	  4px
    // 1.5	0.375rem	6px
    // 2  	0.5rem	  8px
    // 2.5	0.625rem	10px
    // 3	  0.75rem	  12px
    // 3.5	0.875rem	14px
    // 4	  1rem	    16px
    // 5	  1.25rem	  20px
    // 6	  1.5rem	  24px
    // 7	  1.75rem	  28px
    // 8	  2rem	    32px
    // 9	  2.25rem	  36px
    // 10	  2.5rem	  40px
    // 11	  2.75rem	  44px
    // 12	  3rem	    48px
    // 14	  3.5rem	  56px
    // 16	  4rem	    64px
    // 20	  5rem	    80px
    // 24	  6rem	    96px
    // 28	  7rem	    112px
    // 32	  8rem	    128px
    // 36	  9rem	    144px
    // 40	  10rem	    160px
    // 44	  11rem	    176px
    // 48	  12rem	    192px
    // 52	  13rem	    208px
    // 56	  14rem	    224px
    // 60	  15rem	    240px
    // 64	  16rem	    256px
    // 72	  18rem	    288px
    // 80	  20rem	    320px
    // 96	  24rem	    384px

    extend: {
      spacing: {
        "05": "2px",
        "025": "1px",
      },

      colors: {
        pink: {
          accent: "#f472b6",
        },
        green: {
          subdued: "#348f6c",
          // accent: "#4bc596",
          accent: "#3da58a",
        },
      },
      borderWidth: {
        1: "1px",
      },
      // screens: {}
    },
    screens: {
      // xs = anything smaller, & default
      //
      sm: "475px",
      // sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: "1175px",
      // => @media (min-width: 768px) { ... }

      lg: "1400px",
      // => @media (min-width: 1024px) { ... }

      // xl: '1280px'
      // => @media (min-width: 1280px) { ... }
      //
      // defaultTheme.screens.2xl
      // ...defaultTheme.screens
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      blue: {
        100: "#f0f4fe",
        200: "#d4def8",
        300: "#95aeed",
        400: "#758ce0",
        500: "#6175de",
        600: "#495dc6",
        700: "#3547a4",
        800: "#253586",
        900: "#1f2c6d",
        bgOuter: "#141b2d",
        bgInner: "#1f2a40",
        light: "#7dd3fc", // equivalent to sky-300
        bright: "#38bdf8",
        subdued: "#5d8fb6",
      },
      grey: {
        100: "#f8f9fa",
        200: "#e1e7ec",
        300: "#d5dde5",
        400: "#cbd3da",
        500: "#aebecd",
        600: "#929fb1",
        700: "#6e7a8a",
        800: "#404b5a",
        900: "#202833",

        "00": "#cbd3da",
        0: "#a3b3c8", // for labels
        1: "#94a3b8", // for labels
        2: "#64748b",
        3: "#353f4f",
        4: "#1e2739",
      },
      black: "#000000",
      greyOG: colors.grey,
      slate: colors.slate,
      purple: colors.purple,
      violet: colors.violet,
      pink: colors.pink,
      green: colors.green,
      red: colors.red,
      // 	subdued: '#348f6c',
      // 	accent: '#4bc596'
      // 100: colors.green["100"],
      // 200: colors.green["100"],
      // 300: colors.green.100,
      // 400: colors.green.100,
      // 500: colors.green.100,
      // 600: colors.green.100,
      // },
      amber: colors.amber,
      orange: colors.orange,
      yellow: colors.yellow,
      lime: colors.lime,
      teal: colors.teal,
      cyan: colors.cyan,
      sky: colors.sky,

      // 'tahiti': {
      //   100: '#cffafe',
      //   200: '#a5f3fc',
      //   300: '#67e8f9',
      //   400: '#22d3ee',
      //   500: '#06b6d4',
      //   600: '#0891b2',
      //   700: '#0e7490',
      //   800: '#155e75',
      //   900: '#164e63',
      // },
      // ...
    },
    fontSize: {
      sz2: ["0.5rem", { lineHeight: "0.5rem" }], //  8px
      "sz2.5": ["0.625rem", { lineHeight: "0.625rem" }], //  10px
      sz3: ["0.75rem", { lineHeight: "0.75rem" }], //   12px
      "sz3.5": ["0.875rem", { lineHeight: "0.875rem" }], //  14px
      sz4: ["1rem", { lineHeight: "1rem" }], //      16px
      sz5: ["1.25rem", { lineHeight: "1.25rem" }], //   20px
      sz6: ["1.5rem", { lineHeight: "1.5rem" }], //    24px
      sz7: ["1.75rem", { lineHeight: "1.75rem" }], //   28px
      sz8: ["2rem", { lineHeight: "2rem" }], //      32px
      sz9: ["2.25rem", { lineHeight: "2.25rem" }], //   36px
      sz10: ["2.5rem", { lineHeight: "2.5rem" }], //    40px
      sz11: ["2.75rem", { lineHeight: "2.75rem" }], //   44px
      sz12: ["3rem", { lineHeight: "3rem" }], //      48px

      // szXs: [
      //   "0.75rem", // 12px
      //   {
      //     lineHeight: "1rem",
      //     //fontWeight: '400', // letterSpacing: '-0.01em',
      //   },
      // ],
      // szSm: ["0.875rem" /* 14px */, { lineHeight: "1.00rem" /* idk px */ }],
      // szBaseSm: ["0.95rem", { lineHeight: "1.125rem" /* idk px */ }],
      // szBase: ["1rem" /* 16px */, { lineHeight: "1.125rem" /* idk px */ }],
      // szLg: ["1.0625rem" /* 18px */, { lineHeight: "1.1rem" /* idk px */ }],
      // szXl: ["1.125rem" /* 18px */, { lineHeight: "1.15rem" /* idk px */ }],
      // sz2xl: ["1.25rem" /* 20px */, { lineHeight: "1.4rem" /* 28px */ }],
      // sz3xl: ["1.5rem" /* 24px */, { lineHeight: "1.7rem" /* 32px */ }],
      // sz4xl: ["1.875rem" /* 30px */, { lineHeight: "2rem" /* 36px */ }],
      // sz5xl: ["2.25rem" /* 36px */, { lineHeight: "2.5rem" /* 40px */ }],
      // sz6xl: ["3rem" /* 48px */, { lineHeight: "1" }],
      // sz7xl: ["3.75rem" /* 60px */, { lineHeight: "1" }],
      // sz8xl: ["4.5rem" /* 72px */, { lineHeight: "1" }],
      // sz9xl: ["6rem" /* 96px */, { lineHeight: "1" }],
      // sz9xl: ["8rem" /* 128px */, { lineHeight: "1" }],
    },
    fontFamily: {
      qs9: [
        '"Quicksand Variable", sans-serif',
        {
          fontVariationSettings: `"wght" 900`,
        },
      ],
      qs8: [
        '"Quicksand Variable", sans-serif',
        {
          fontVariationSettings: `"wght" 800`,
        },
      ],
      qs8: [
        '"Quicksand Variable", sans-serif',
        {
          fontVariationSettings: `"wght" 800`,
        },
      ],
      qs7: [
        '"Quicksand Variable", sans-serif',
        {
          fontVariationSettings: `"wght" 700`,
        },
      ],
      qs6: [
        '"Quicksand Variable", sans-serif',
        {
          fontVariationSettings: `"wght" 600`,
        },
      ],
      qs5: [
        '"Quicksand Variable", sans-serif',
        {
          fontVariationSettings: `"wght" 500`,
        },
      ],
      qs4: [
        '"Quicksand Variable", sans-serif',
        {
          fontVariationSettings: `"wght" 400`, // Standard weight
        },
      ],
      qs3: [
        '"Quicksand Variable", sans-serif',
        {
          fontVariationSettings: `"wght" 300`,
        },
      ],
      qs2: [
        '"Quicksand Variable", sans-serif',
        {
          fontVariationSettings: `"wght" 200`,
        },
      ],
      thicc9: [
        '"Montserrat Variable", sans-serif',
        {
          fontVariationSettings: `"wght" 900`,
        },
      ],
      thicc8: [
        '"Montserrat Variable", sans-serif',
        {
          fontVariationSettings: `"wght" 800`,
        },
      ],
      thicc7: [
        "Montserrat Variable, sans-serif",
        {
          fontVariationSettings: `"wght" 700`,
        },
      ],
      thicc6: [
        "Montserrat Variable, sans-serif",
        {
          fontVariationSettings: `"wght" 600`,
        },
      ],
      thicc5: [
        "Montserrat Variable, sans-serif",
        {
          fontVariationSettings: `"wght" 500`,
        },
      ],
      thicc4: [
        "Montserrat Variable, sans-serif",
        {
          fontVariationSettings: `"wght" 400`,
        },
      ],
      thicc3: [
        "Montserrat Variable, sans-serif",
        {
          fontVariationSettings: `"wght" 300`,
        },
      ],
      rubik9: [
        "Rubik Variable, sans-serif",
        {
          fontVariationSettings: `"wght" 900`,
        },
      ],
      rubik8: [
        "Rubik Variable, sans-serif",
        {
          fontVariationSettings: `"wght" 800`,
        },
      ],
      rubik7: [
        "Rubik Variable, sans-serif",
        {
          fontVariationSettings: `"wght" 700`,
        },
      ],
      rubik6: [
        "Rubik Variable, sans-serif",
        {
          fontVariationSettings: `"wght" 600`,
        },
      ],
      rubik5: [
        "Rubik Variable, sans-serif",
        {
          fontVariationSettings: `"wght" 500`,
        },
      ],
      rubik4: [
        "Rubik Variable, sans-serif",
        {
          fontVariationSettings: `"wght" 400`,
        },
      ],
      rubik3: [
        "Rubik Variable, sans-serif",
        {
          fontVariationSettings: `"wght" 300`,
        },
      ],
      sans: ["Barlow, sans-serif"],
    },
    fontWeight: {
      wgt100: "100",
      wgt200: "200",
      wgt300: "300",
      wgt400: "400",
      wgt500: "500",
      wgt600: "600",
      wgt700: "700",
      wgt800: "800",
      wgt900: "900",
    },
  },
  plugins: [],
  // headerBold: {
  // 	fontFamily: 'headerBold',
  // 	color: 'white'
  // }
};
