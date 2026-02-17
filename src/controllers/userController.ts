import { Request, Response } from "express";
import { User } from "../models/User";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "role"], // Не возвращаем пароль
    });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsersByRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { role } = req.params;

    console.log(`📥 GET /api/users/role/${role}`);

    const users = await User.findAll({
      where: { role },
      attributes: ["id", "name", "role"],
    });

    console.log(`✅ Найдено пользователей с ролью "${role}":`, users.length);

    res.status(200).json(users);
  } catch (error: any) {
    console.error("❌ Ошибка получения пользователей:", error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({
      where: { name, password },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      role: user.role,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
