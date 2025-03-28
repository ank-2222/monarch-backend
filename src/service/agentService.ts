import { Agent, IAgent } from "../models/agent";
import ErrorHandler from "../utils/errors.handler";

export class AgentService {
  // Create a new agent
  async createAgent(data: IAgent): Promise<IAgent> {
  
    const agent = new Agent(data);
    return await agent.save();
  }

  // Get all agents
  async getAgents(): Promise<IAgent[]> {
    return await Agent.find();
  }

  // Get an agent by ID
  async getAgentById(agentId: string): Promise<IAgent | null> {
    const agent = await Agent.findById(agentId);
    if (!agent) {
      throw new ErrorHandler({ message: "Agent not found", message_code: "AGENT_NOT_FOUND" });
    }
    return agent;
  }

  // Update an agent
  async updateAgent(agentId: string, updates: Partial<IAgent>): Promise<IAgent | null> {
    const existingAgent = await Agent.findById(agentId);
    if (!existingAgent) {
      throw new ErrorHandler({ message: "Agent not found", message_code: "AGENT_NOT_FOUND" });
    }

    return await Agent.findByIdAndUpdate(agentId, { $set: updates }, { new: true, runValidators: true });
  }

  // Delete an agent
  async deleteAgent(agentId: string): Promise<string> {
    const agent = await Agent.findById(agentId);
    if (!agent) {
      throw new ErrorHandler({ message: "Agent not found", message_code: "AGENT_NOT_FOUND" });
    }

    await agent.deleteOne();
    return "Agent deleted successfully";
  }
}
