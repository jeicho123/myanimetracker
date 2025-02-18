import { useEffect } from "react";

export default function Popular() {
  let x = 5;  // This is recreated as 5 on every render
  
  useEffect(() => {
    x += 1;   // This changes x to 6, but doesn't trigger a re-render
  });

  useEffect(() => {
    console.log('x is:', x);  // Only runs on mount or if component re-renders for other reasons
  }, [x]);

  return <div>{x}</div>;  // Will always show 5
}