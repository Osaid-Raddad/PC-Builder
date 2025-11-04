import { useEffect, useState } from "react";

const Meteors = ({ number = 20 }) => {
  const [meteorStyles, setMeteorStyles] = useState([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: Math.floor(Math.random() * 100),
      left: Math.floor(Math.random() * 100),
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className="pointer-events-none absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-[#F5CB5C] shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: style.top + "%",
            left: style.left + "%",
            animationDelay: style.animationDelay,
            animationDuration: style.animationDuration,
            boxShadow: "0 0 0 1px #ffffff10, 0 0 20px 2px #F5CB5C",
            background: "linear-gradient(to bottom, #F5CB5C, transparent)",
            width: "1px",
            height: "100px",
          }}
        />
      ))}
    </>
  );
};

export default Meteors;
