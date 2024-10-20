import { useState, useEffect } from "react";
import "./Processing.css";

export default function Processing() {
  const messages = [
    "Sending image",
    "Processing",
    "Generating prompt",
    "Generating image",
    "Rendering image",
  ];

  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prevMessage) => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className='processing'>
      <span>{currentMessage}</span>
      <img
        className='w-10 h-10'
        src='https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-07-846_512.gif'
        alt='processing'
      />
    </div>
  );
}
