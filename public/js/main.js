document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("requestForm");
  const messageDiv = document.getElementById("message");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Предотвращаем стандартную отправку формы

      const formData = {
        clientName: document.getElementById("clientName").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        problemText: document.getElementById("problemText").value,
      };

      console.log("Отправка данных:", formData);

      try {
        const response = await fetch("http://localhost:3000/api/requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Ответ сервера:", result);

          messageDiv.style.display = "block";
          messageDiv.className = "message success";
          messageDiv.textContent = `✅ Заявка #${result.id} успешно создана!`;

          form.reset();
        } else {
          const error = await response.json();
          messageDiv.style.display = "block";
          messageDiv.className = "message error";
          messageDiv.textContent = `❌ Ошибка: ${error.error || error.message}`;
        }
      } catch (error) {
        console.error("Ошибка:", error);
        messageDiv.style.display = "block";
        messageDiv.className = "message error";
        messageDiv.textContent = "❌ Ошибка соединения с сервером";
      }
    });
  }
});
