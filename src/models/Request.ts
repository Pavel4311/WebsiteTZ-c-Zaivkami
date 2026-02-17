import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export type RequestStatus =
  | "new"
  | "assigned"
  | "in_progress"
  | "done"
  | "canceled";

export class ServiceRequest extends Model {
  public id!: number;
  public clientName!: string;
  public phone!: string;
  public address!: string;
  public problemText!: string;
  public status!: RequestStatus;
  public assignedTo!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ServiceRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    problemText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "new",
        "assigned",
        "in_progress",
        "done",
        "canceled"
      ),
      defaultValue: "new",
      allowNull: false,
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "requests",
    timestamps: true,
  }
);
