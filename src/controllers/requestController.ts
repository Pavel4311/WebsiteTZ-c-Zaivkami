import { Request, Response } from "express";
import requestService from "../services/requestService";

export const getRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("📥 GET /api/requests called");
    console.log("Query params:", req.query);

    const { status, assignedTo } = req.query;

    const filters: any = {};
    if (status) filters.status = status;
    if (assignedTo) filters.assignedTo = Number(assignedTo);

    console.log("Filters:", filters);
    const requests = await requestService.getRequests(filters);
    console.log(`✅ Found ${requests.length} requests`);

    res.status(200).json(requests);
  } catch (error: any) {
    console.error("❌ Error fetching requests:", error);
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
};

export const createRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("📥 POST /api/requests called");
    const { clientName, phone, address, problemText } = req.body;

    if (!clientName || !phone || !address || !problemText) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const newRequest = await requestService.createRequest({
      clientName,
      phone,
      address,
      problemText,
    });

    console.log("✅ Request created:", newRequest.id);
    res.status(201).json(newRequest);
  } catch (error: any) {
    console.error("❌ Error creating request:", error);
    res
      .status(500)
      .json({ message: "Error creating request", error: error.message });
  }
};

export const assignMaster = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { requestId, masterId } = req.body;

    if (!requestId || !masterId) {
      res.status(400).json({ error: "requestId and masterId are required" });
      return;
    }

    console.log(`📋 Assigning master ${masterId} to request ${requestId}`);

    const updatedRequest = await requestService.assignMaster(
      requestId,
      masterId
    );

    console.log(`✅ Master assigned successfully`);
    res.status(200).json(updatedRequest);
  } catch (error: any) {
    console.error(`❌ Error assigning master:`, error.message);
    res
      .status(400)
      .json({ message: "Error assigning master", error: error.message });
  }
};

export const takeInProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { requestId } = req.params;
    const { masterId } = req.body;

    if (!masterId) {
      res.status(400).json({ error: "masterId is required" });
      return;
    }

    console.log(
      `🔧 Master ${masterId} taking request ${requestId} in progress`
    );

    const updatedRequest = await requestService.takeInProgress(
      Number(requestId),
      masterId
    );

    console.log(
      `✅ Request ${requestId} taken in progress by master ${masterId}`
    );
    res.status(200).json(updatedRequest);
  } catch (error: any) {
    console.error(`❌ Error taking request in progress:`, error.message);

    if (
      error.message.includes("Current status") ||
      error.message.includes("not assigned")
    ) {
      res.status(409).json({ error: error.message }); // 409 Conflict
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

export const completeRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { requestId } = req.params;
    const { masterId } = req.body;

    if (!masterId) {
      res.status(400).json({ error: "masterId is required" });
      return;
    }

    console.log(`✅ Master ${masterId} completing request ${requestId}`);

    const updatedRequest = await requestService.completeRequest(
      Number(requestId),
      masterId
    );

    console.log(`✅ Request ${requestId} completed by master ${masterId}`);
    res.status(200).json(updatedRequest);
  } catch (error: any) {
    console.error(`❌ Error completing request:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

export const cancelRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { requestId } = req.params;

    console.log(`🚫 Canceling request ${requestId}`);

    const result = await requestService.cancelRequest(Number(requestId));

    console.log(`✅ Request ${requestId} canceled`);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(`❌ Error canceling request:`, error.message);
    res
      .status(400)
      .json({ message: "Error canceling request", error: error.message });
  }
};
