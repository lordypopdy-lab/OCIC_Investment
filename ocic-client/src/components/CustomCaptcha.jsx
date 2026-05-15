import React, { useState, useEffect } from "react";
import { setCaptchaVerified, isCaptchaVerified } from "../utils/captchaStorage";
import toast from "react-hot-toast"; // popup notifications

const CustomCaptcha = ({ onVerify }) => {
  const [verified, setVerified] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [selected, setSelected] = useState(null);
  const [challenge, setChallenge] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Random challenge
  const generateChallenge = () => {
    const shapes = ["circle", "square", "triangle"];
    const correct = shapes[Math.floor(Math.random() * shapes.length)];
    setChallenge({
      shapes,
      question: `Click on the ${correct}`,
      correct,
    });
  };

  useEffect(() => {
    if (isCaptchaVerified()) {
      setVerified(true);
      onVerify(true);
    } else {
      setVerified(false);
    }
  }, []);

  const handleStart = () => {
    setShowChallenge(true);
    generateChallenge();
  };

  const handleSelect = (shape) => {
    setSelected(shape);
    if (shape === challenge.correct) {
      setCaptchaVerified();
      setVerified(true);
      onVerify(true);

      // ✅ show popup success
      toast.success("✅ Verified — You’re not a robot!");

      // ✅ show temporary inline message (disappears after 3s)
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // hide the challenge box
      setTimeout(() => setShowChallenge(false), 800);
    } else {
      toast.error("❌ Wrong shape! Try again.");
      generateChallenge();
    }
  };

  return (
    <div className="captcha-box">
      {verified && showSuccess && (
        <div className="verified">✅ Verified — You’re not a robot</div>
      )}

      {!verified && !showChallenge && (
        <button onClick={handleStart} className="captcha-btn">
          I’m not a robot
        </button>
      )}

      {showChallenge && (
        <div className="captcha-challenge">
          <p>{challenge.question}</p>
          <div className="captcha-grid">
            {challenge.shapes.map((shape) => (
              <button
                key={shape}
                onClick={() => handleSelect(shape)}
                className={`shape-btn ${shape}`}
              >
                {shape === "circle" && <div className="circle"></div>}
                {shape === "square" && <div className="square"></div>}
                {shape === "triangle" && <div className="triangle"></div>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCaptcha;
