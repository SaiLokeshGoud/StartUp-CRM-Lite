import { useEffect, useState } from "react";

export default function AnimatedCounter({ value, duration = 1000 }) {
  const isString = typeof value === "string";
  
  // Clean string and extract numbers: e.g. "₹5,00,000" -> 500000, "58.5%" -> 58.5
  const numericStr = isString ? value.replace(/[^0-9.]/g, "") : String(value);
  const target = parseFloat(numericStr);

  const [count, setCount] = useState(() => {
    if (isNaN(target)) return value;
    return 0;
  });

  useEffect(() => {
    if (isNaN(target)) {
      setCount(value);
      return;
    }

    // Respect accessibility settings
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setCount(target);
      return;
    }

    let start = 0;
    const end = target;
    if (start === end) {
      setCount(end);
      return;
    }

    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Quadratic ease-out formula
      const easeProgress = progress * (2 - progress);
      const current = start + (end - start) * easeProgress;
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [target, value, duration]);

  if (isNaN(target)) {
    return <span>{value}</span>;
  }

  // Format count to match original precision
  let formattedCount = Math.round(count);
  if (value.toString().includes(".")) {
    const decimals = value.toString().split(".")[1]?.length || 0;
    formattedCount = count.toFixed(decimals);
  }

  if (isString) {
    // Extract prefix and suffix
    const prefix = value.match(/^[^0-9]*/)?.[0] || "";
    const suffix = value.match(/[^0-9.]*$/)?.[0] || "";
    
    // Add commas back
    const hasCommas = value.includes(",");
    let displayNum = formattedCount;
    if (hasCommas) {
      if (prefix.includes("₹")) {
        displayNum = Number(formattedCount).toLocaleString("en-IN");
      } else {
        displayNum = Number(formattedCount).toLocaleString("en-US");
      }
    }
    
    return (
      <span>
        {prefix}
        {displayNum}
        {suffix}
      </span>
    );
  }

  return <span>{Number(formattedCount).toLocaleString()}</span>;
}
