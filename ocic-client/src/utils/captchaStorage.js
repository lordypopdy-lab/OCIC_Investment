// Store verification with expiry
export function setCaptchaVerified() {
    const now = Date.now();
    const expiresAt = now + 48 * 60 * 60 * 1000; // 48 hours
    const token = crypto.randomUUID(); // unique identifier
  
    const data = { token, expiresAt };
    localStorage.setItem("captcha_verification", JSON.stringify(data));
  }
  
  // Check if CAPTCHA is still valid
  export function isCaptchaVerified() {
    const data = JSON.parse(localStorage.getItem("captcha_verification"));
    if (!data) return false;
  
    const { expiresAt } = data;
    if (Date.now() > expiresAt) {
      localStorage.removeItem("captcha_verification");
      return false;
    }
  
    return true;
  }
  
  // Clear verification manually
  export function clearCaptcha() {
    localStorage.removeItem("captcha_verification");
  }
  