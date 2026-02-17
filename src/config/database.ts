import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

export const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");

    // Импортируем модели
    const { ServiceRequest } = await import("../models/Request");
    const { User } = await import("../models/User");

    // Синхронизация моделей с базой данных
    await sequelize.sync({ force: true }); // Пересоздаёт таблицы каждый раз
    console.log("✅ Database models synchronized");

    // Создаем тестовых пользователей (ВСЕГДА, так как таблица пересоздаётся)
    const users = await User.bulkCreate([
      { name: "Диспетчер Иван", role: "dispatcher", password: "dispatcher123" },
      { name: "Мастер Петр", role: "master", password: "master123" },
      { name: "Мастер Сергей", role: "master", password: "master123" },
      { name: "Мастер Алексей", role: "master", password: "master123" },
      { name: "Мастер Дмитрий", role: "master", password: "master123" },
      { name: "Мастер Николай", role: "master", password: "master123" },
    ]);
    console.log("✅ Test users created (6 пользователей)");

    // Выводим ID созданных пользователей для проверки
    console.log("👥 Созданные пользователи:");
    users.forEach((user) => {
      console.log(`   ID: ${user.id}, Имя: ${user.name}, Роль: ${user.role}`);
    });

    // Создаем тестовые заявки с правильными ID мастеров
    await ServiceRequest.bulkCreate([
      {
        clientName: "Иван Иванов",
        phone: "+7 900 123-45-67",
        address: "ул. Ленина, д. 10",
        problemText: "Не работает кондиционер",
        status: "new",
        assignedTo: null,
      },
      {
        clientName: "Петр Петров",
        phone: "+7 900 234-56-78",
        address: "пр. Мира, д. 25",
        problemText: "Протекает кран",
        status: "new",
        assignedTo: null,
      },
      {
        clientName: "Мария Сидорова",
        phone: "+7 900 345-67-89",
        address: "ул. Пушкина, д. 5",
        problemText: "Сломался холодильник",
        status: "assigned",
        assignedTo: users[1].id, // Мастер Петр (второй в списке)
      },
      {
        clientName: "Анна Смирнова",
        phone: "+7 900 456-78-90",
        address: "ул. Гагарина, д. 15",
        problemText: "Не работает стиральная машина",
        status: "assigned",
        assignedTo: users[2].id, // Мастер Сергей (третий в списке)
      },
      {
        clientName: "Сергей Кузнецов",
        phone: "+7 900 567-89-01",
        address: "пр. Победы, д. 30",
        problemText: "Замена розетки",
        status: "in_progress",
        assignedTo: users[3].id, // Мастер Алексей (четвертый в списке)
      },
    ]);
    console.log("✅ Test requests created (5 заявок)");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};

export default sequelize;
