import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export type UserRole = "dispatcher" | "master";

export class User extends Model {
  public id!: number;
  public name!: string;
  public role!: UserRole;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("dispatcher", "master"),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "password123", // Пароль по умолчанию для простоты
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);
