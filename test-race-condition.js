// Скрипт для проверки условия гонки
// Запускает два параллельных запроса на взятие одной заявки в работу

const REQUEST_ID = 3; // ID заявки со статусом "assigned"
const MASTER_ID_1 = 2; // Мастер Петр
const MASTER_ID_2 = 3; // Мастер Сергей

async function takeInProgress(requestId, masterId, name) {
  const startTime = Date.now();

  try {
    const response = await fetch(
      `http://localhost:3000/api/requests/${requestId}/take`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ masterId }),
      }
    );

    const data = await response.json();
    const duration = Date.now() - startTime;

    console.log(`\n${name}:`);
    console.log(`  Статус: ${response.status}`);
    console.log(`  Время выполнения: ${duration}ms`);

    if (response.ok) {
      console.log(`  ✅ УСПЕХ! Заявка взята в работу`);
      console.log(`  Новый статус: ${data.status}`);
    } else {
      console.log(`  ❌ ОТКАЗ: ${data.error}`);
    }

    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.log(`\n${name}:`);
    console.log(`  ❌ ОШИБКА: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runRaceConditionTest() {
  console.log("🏁 Запуск теста условия гонки...");
  console.log(`📋 Заявка ID: ${REQUEST_ID}`);
  console.log(
    `👤 Мастер 1 (ID ${MASTER_ID_1}) vs Мастер 2 (ID ${MASTER_ID_2})`
  );
  console.log("\n⏱️  Отправка параллельных запросов...\n");

  // Запускаем оба запроса одновременно
  const [result1, result2] = await Promise.all([
    takeInProgress(REQUEST_ID, MASTER_ID_1, "Мастер 1"),
    takeInProgress(REQUEST_ID, MASTER_ID_2, "Мастер 2"),
  ]);

  console.log("\n" + "=".repeat(50));
  console.log("📊 РЕЗУЛЬТАТЫ ТЕСТА:");
  console.log("=".repeat(50));

  const successCount = [result1, result2].filter((r) => r.success).length;
  const conflictCount = [result1, result2].filter(
    (r) => r.status === 409
  ).length;

  if (successCount === 1 && conflictCount === 1) {
    console.log("✅ ТЕСТ ПРОЙДЕН!");
    console.log("   - Один запрос успешен");
    console.log("   - Один запрос получил 409 Conflict");
    console.log("   - Данные не повреждены");
  } else if (successCount === 2) {
    console.log("❌ ТЕСТ НЕ ПРОЙДЕН!");
    console.log("   - Оба запроса успешны (проблема гонки!)");
  } else if (successCount === 0) {
    console.log("⚠️  ТЕСТ НЕ ПРОЙДЕН!");
    console.log("   - Оба запроса отклонены");
  }

  console.log("=".repeat(50));
}

// Запуск теста
runRaceConditionTest().catch(console.error);
