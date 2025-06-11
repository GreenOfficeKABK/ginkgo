document.querySelector(".contact-form form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  try {
    const response = await fetch("http://172.17.25.120:3000/send-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Show success modal
      const modal = document.createElement("div");
      modal.id = "success-modal";
      modal.style = "display: flex; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); z-index: 100002; align-items: center; justify-content: center;";

      modal.innerHTML = `
        <div style="background: #2D3C25; padding: 40px; width: 600px; max-width: 95vw; border-radius: 0; border: 2px dotted #EA9B3F; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #EA9B3F;">
          <button style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 2rem; color: #EA9B3F; cursor: pointer; line-height: 1;" onclick="document.getElementById('success-modal').remove()">&times;</button>
          <h2>✅ Thank you! We will contact you as soon as possible.</h2>
        </div>
      `;

      document.body.appendChild(modal);
      event.target.reset();
    } else {
      alert("Failed to send message. Please try again later.");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    alert("An error occurred. Please try again later.");
  }
});