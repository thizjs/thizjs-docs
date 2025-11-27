// import { useState, useEffect } from 'react';
// import Link from '@docusaurus/Link';
// import Shuffle from "../components/Shuffle/Shuffle";

// export default function Home() {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const containerStyle = {
//     minHeight: "100vh",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     textAlign: "center",
//     padding: isMobile ? "60px 20px" : "40px 20px",
//   };

//   const titleStyle = {
//     fontSize: "12vw",
//     fontWeight: "900",
//     lineHeight: "0.9",
//     marginBottom: "20px",
//   };

//   const taglineStyle = {
//     fontSize: isMobile ? "18px" : "20px",
//     fontWeight: "400",
//     marginBottom: "40px",
//     maxWidth: "600px",
//     lineHeight: "1.5",
//   };

//   const buttonsContainerStyle = {
//     marginTop: "20px",
//     display: "flex",
//     flexDirection: isMobile ? "column" : "row",
//     gap: isMobile ? "16px" : "20px",
//     width: isMobile ? "100%" : "auto",
//     maxWidth: isMobile ? "320px" : "none",
//   };

//   const baseButtonStyle = {
//     padding: isMobile ? "16px 32px" : "14px 28px",
//     fontSize: "16px",
//     fontWeight: "500",
//     border: "1px solid rgba(255, 255, 255, 0.3)",
//     borderRadius: "8px",
//     textDecoration: "none",
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "all 0.3s ease",
//     cursor: "pointer",
//     fontFamily: "inherit",
//     width: isMobile ? "100%" : "auto",
//     background: "transparent",
//     color: "#ffffff",
//   };

//   const [primaryHover, setPrimaryHover] = useState(false);
//   const [secondaryHover, setSecondaryHover] = useState(false);

//   const primaryHoverStyle = primaryHover ? {
//     background: "rgba(255, 255, 255, 0.05)",
//     borderColor: "rgba(255, 255, 255, 0.5)",
//     transform: "translateY(-2px)",
//   } : {};

//   const secondaryHoverStyle = secondaryHover ? {
//     background: "rgba(255, 255, 255, 0.05)",
//     borderColor: "rgba(255, 255, 255, 0.5)",
//     transform: "translateY(-2px)",
//   } : {};

//   return (
//     <main style={containerStyle}>
//       {/* Title */}
//       <div style={titleStyle}>
//         <Shuffle
//           text="THIZ.js"
//           shuffleDirection="right"
//           duration={0.35}
//           animationMode="evenodd"
//           shuffleTimes={1}
//           ease="power3.out"
//           stagger={0.03}
//           threshold={0.1}
//           triggerOnce={true}
//           triggerOnHover={true}
//           respectReducedMotion={true}
//         />
//       </div>

//       {/* Tagline - Change this line as needed */}
//       <div style={taglineStyle}>
//         Stop configuring. Start building.
//       </div>

//       {/* Alternative taglines (comment/uncomment to switch):
      
//       <div style={taglineStyle}>
//         Backend development without the boilerplate.
//       </div>

//       <div style={taglineStyle}>
//         File-based routing for Express. Zero configuration.
//       </div>

//       <div style={taglineStyle}>
//         Convention over configuration. Developer experience first.
//       </div>

//       <div style={taglineStyle}>
//         Express APIs that make sense.
//       </div>

//       <div style={taglineStyle}>
//         Build backends that don't suck.
//       </div>

//       <div style={taglineStyle}>
//         The Express framework you actually wanted.
//       </div>

//       */}

//       {/* Buttons */}
//       <div style={buttonsContainerStyle}>
//         <a
//           href="https://github.com/santhosh-2504/create-thiz-app"
//           style={{...baseButtonStyle, ...primaryHoverStyle}}
//           onMouseEnter={() => setPrimaryHover(true)}
//           onMouseLeave={() => setPrimaryHover(false)}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <span style={{ marginRight: "8px" }}>⭐</span>
//           Star on GitHub
//         </a>

//         <Link
//           to="/docs/getting-started/introduction"
//           style={{...baseButtonStyle, ...secondaryHoverStyle}}
//           onMouseEnter={() => setSecondaryHover(true)}
//           onMouseLeave={() => setSecondaryHover(false)}
//         >
//           <span style={{ marginRight: "8px" }}>📘</span>
//           Read Documentation
//         </Link>
//       </div>
//     </main>
//   );
// }

import { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import Shuffle from "../components/Shuffle/Shuffle";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: isMobile ? "60px 20px" : "40px 20px",
    backgroundColor: "#000000",
    color: "#ffffff",
  };

  const titleStyle = {
    fontSize: "12vw",
    fontWeight: "900",
    lineHeight: "0.9",
    marginBottom: "20px",
    color: "#ffffff",
  };

  const taglineStyle = {
    fontSize: isMobile ? "18px" : "20px",
    fontWeight: "400",
    marginBottom: "40px",
    maxWidth: "600px",
    lineHeight: "1.5",
    color: "#ffffff",
  };

  const buttonsContainerStyle = {
    marginTop: "20px",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "16px" : "20px",
    width: isMobile ? "100%" : "auto",
    maxWidth: isMobile ? "320px" : "none",
  };

  const baseButtonStyle = {
    padding: isMobile ? "16px 32px" : "14px 28px",
    fontSize: "16px",
    fontWeight: "500",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "8px",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    fontFamily: "inherit",
    width: isMobile ? "100%" : "auto",
    background: "transparent",
    color: "#ffffff",
  };

  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);

  const primaryHoverStyle = primaryHover ? {
    background: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.5)",
    transform: "translateY(-2px)",
  } : {};

  const secondaryHoverStyle = secondaryHover ? {
    background: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.5)",
    transform: "translateY(-2px)",
  } : {};

  return (
    <main style={containerStyle}>
      {/* Title */}
      <div style={titleStyle}>
        <Shuffle
          text="THIZ.js"
          shuffleDirection="right"
          duration={0.35}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover={true}
          respectReducedMotion={true}
        />
      </div>

      {/* Tagline - Change this line as needed */}
      <div style={taglineStyle}>
        Stop configuring. Start building.
      </div>

      {/* Alternative taglines (comment/uncomment to switch):
      
      <div style={taglineStyle}>
        Backend development without the boilerplate.
      </div>

      <div style={taglineStyle}>
        File-based routing for Express. Zero configuration.
      </div>

      <div style={taglineStyle}>
        Convention over configuration. Developer experience first.
      </div>

      <div style={taglineStyle}>
        Express APIs that make sense.
      </div>

      <div style={taglineStyle}>
        Build backends that don't suck.
      </div>

      <div style={taglineStyle}>
        The Express framework you actually wanted.
      </div>

      */}

      {/* Buttons */}
      <div style={buttonsContainerStyle}>
        <a
          href="https://github.com/santhosh-2504/thizjs"
          style={{...baseButtonStyle, ...primaryHoverStyle}}
          onMouseEnter={() => setPrimaryHover(true)}
          onMouseLeave={() => setPrimaryHover(false)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span style={{ marginRight: "8px" }}>⭐</span>
          Star on GitHub
        </a>

        <Link
          to="/docs/getting-started/introduction"
          style={{...baseButtonStyle, ...secondaryHoverStyle}}
          onMouseEnter={() => setSecondaryHover(true)}
          onMouseLeave={() => setSecondaryHover(false)}
        >
          <span style={{ marginRight: "8px" }}>📘</span>
          Read Documentation
        </Link>
      </div>
    </main>
  );
}