import { Request, Response } from "express";
import { AgentService } from "../service/agentService";
import ErrorHandler from "../utils/errors.handler";
import { IApiResponse } from "../interface/apiResponse";
import { errorHandler } from "../utils/res.error";

const agentService = new AgentService();

export class AgentController {
  public execute = async (req: Request, res: Response) => {
    try {
      const method = req.method;
      const path = req.route.path;
      const id = req.params.id;

      if (path === "/") {
        if (method === "POST") {
          const result = await this.createAgent(req, res);
          res.status(201).json(result);
        } else if (method === "GET") {
          const result = await this.getAgents(req, res);
          res.status(200).json(result);
        }
      } else if (path === "/:id" && id) {
        if (method === "GET") {
          const result = await this.getAgentById(req, res);
          res.status(200).json(result);
        } else if (method === "PUT") {
          const result = await this.updateAgent(req, res);
          res.status(200).json(result);
        } else if (method === "DELETE") {
          const result = await this.deleteAgent(req, res);
          res.status(200).json(result);
        }
      }
    } catch (error: any) {
      errorHandler(error, req, res);
    }
  };

  async createAgent(req: Request, res: Response): Promise<IApiResponse<any>> {
    try {
      const agent = await agentService.createAgent(req.body);
      return {
        message: "Agent created successfully",
        message_code: "AGENT_CREATED",
        data: agent,
      };
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_CREATING_AGENT",
        status:500
      });
    }
  }

  async getAgents(req: Request, res: Response): Promise<IApiResponse<any>> {
    try {
      const agents = await agentService.getAgents();
      return {
        message: "Agents retrieved successfully",
        message_code: "AGENTS_RETRIEVED",
        data: agents,
      };
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_FETCHING_AGENTS",
      });
    }
  }

  async getAgentById(req: Request, res: Response): Promise<IApiResponse<any>> {
    try {
      const agent = await agentService.getAgentById(req.params.id);
      if (!agent) {
        throw new ErrorHandler({
          message: "Agent not found",
          message_code: "AGENT_NOT_FOUND",
        });
      }
      return {
        message: "Agent retrieved successfully",
        message_code: "AGENT_RETRIEVED",
        data: agent,
      };
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_FETCHING_AGENT",
      });
    }
  }

  async updateAgent(req: Request, res: Response): Promise<IApiResponse<any>> {
    try {
      const agent = await agentService.updateAgent(req.params.id, req.body);
      if (!agent) {
        throw new ErrorHandler({
          message: "Agent not found",
          message_code: "AGENT_NOT_FOUND",
        });
      }
      return {
        message: "Agent updated successfully",
        message_code: "AGENT_UPDATED",
        data: agent,
      };
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_UPDATING_AGENT",
      });
    }
  }

  async deleteAgent(req: Request, res: Response): Promise<IApiResponse<any>> {
    try {
      const message = await agentService.deleteAgent(req.params.id);
      return {
        message: message,
        message_code: "AGENT_DELETED",
        data: null,
      };
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_DELETING_AGENT",
      });
    }
  }
}
