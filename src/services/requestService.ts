import { ServiceRequest, RequestStatus } from "../models/Request";
import { Transaction } from "sequelize";
import sequelize from "../config/database";

class RequestService {
  async createRequest(requestData: {
    clientName: string;
    phone: string;
    address: string;
    problemText: string;
  }): Promise<ServiceRequest> {
    const newRequest = await ServiceRequest.create({
      ...requestData,
      status: "new",
      assignedTo: null,
    });
    return newRequest;
  }

  async getRequests(filters?: {
    status?: RequestStatus;
    assignedTo?: number;
  }): Promise<ServiceRequest[]> {
    const where: any = {};
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.assignedTo) {
      where.assignedTo = filters.assignedTo;
    }
    return await ServiceRequest.findAll({ where });
  }

  async assignMaster(
    requestId: number,
    masterId: number
  ): Promise<ServiceRequest> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const request = await ServiceRequest.findByPk(requestId, {
        transaction,
        lock: true,
      });

      if (!request) {
        await transaction.rollback();
        throw new Error("Request not found");
      }

      if (request.status !== "new") {
        await transaction.rollback();
        throw new Error(`Request already has status: ${request.status}`);
      }

      request.assignedTo = masterId;
      request.status = "assigned";
      await request.save({ transaction });

      await transaction.commit();
      return request;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async takeInProgress(
    requestId: number,
    masterId: number
  ): Promise<ServiceRequest> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const request = await ServiceRequest.findByPk(requestId, {
        transaction,
        lock: true,
      });

      if (!request) {
        await transaction.rollback();
        throw new Error("Request not found");
      }

      if (request.assignedTo !== masterId) {
        await transaction.rollback();
        throw new Error("Request is not assigned to this master");
      }

      if (request.status !== "assigned") {
        await transaction.rollback();
        throw new Error(
          `Cannot take in progress. Current status: ${request.status}`
        );
      }

      request.status = "in_progress";
      await request.save({ transaction });

      await transaction.commit();
      return request;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async completeRequest(
    requestId: number,
    masterId: number
  ): Promise<ServiceRequest> {
    const request = await ServiceRequest.findByPk(requestId);

    if (!request) {
      throw new Error("Request not found");
    }

    if (request.assignedTo !== masterId) {
      throw new Error("Request is not assigned to this master");
    }

    if (request.status !== "in_progress") {
      throw new Error(`Cannot complete. Current status: ${request.status}`);
    }

    request.status = "done";
    await request.save();
    return request;
  }

  async cancelRequest(requestId: number): Promise<ServiceRequest> {
    const request = await ServiceRequest.findByPk(requestId);

    if (!request) {
      throw new Error("Request not found");
    }

    if (request.status === "done") {
      throw new Error("Cannot cancel completed request");
    }

    request.status = "canceled";
    await request.save();
    return request;
  }
}

export default new RequestService();
