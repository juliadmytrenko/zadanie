// add background every fifth refresh
export const toggleDisplayTextBackground = (textElement) => {
    const refreshCount = Number(localStorage.getItem("refresh"));
    if (refreshCount) {
      if (refreshCount % 5 == 0) {
        textElement.classList.add("bg");
      } else {
        textElement.classList.remove("bg");
      }
      localStorage.setItem("refresh", refreshCount + 1);
    } else {
      localStorage.setItem("refresh", 1);
    }
  };