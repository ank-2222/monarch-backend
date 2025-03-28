"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const agent_1 = require("../models/agent");
const errors_handler_1 = __importDefault(require("../utils/errors.handler"));
class AgentService {
    // Create a new agent
    createAgent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const agent = new agent_1.Agent(data);
            return yield agent.save();
        });
    }
    // Get all agents
    getAgents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield agent_1.Agent.find();
        });
    }
    // Get an agent by ID
    getAgentById(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const agent = yield agent_1.Agent.findById(agentId);
            if (!agent) {
                throw new errors_handler_1.default({ message: "Agent not found", message_code: "AGENT_NOT_FOUND" });
            }
            return agent;
        });
    }
    // Update an agent
    updateAgent(agentId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingAgent = yield agent_1.Agent.findById(agentId);
            if (!existingAgent) {
                throw new errors_handler_1.default({ message: "Agent not found", message_code: "AGENT_NOT_FOUND" });
            }
            return yield agent_1.Agent.findByIdAndUpdate(agentId, { $set: updates }, { new: true, runValidators: true });
        });
    }
    // Delete an agent
    deleteAgent(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const agent = yield agent_1.Agent.findById(agentId);
            if (!agent) {
                throw new errors_handler_1.default({ message: "Agent not found", message_code: "AGENT_NOT_FOUND" });
            }
            yield agent.deleteOne();
            return "Agent deleted successfully";
        });
    }
}
exports.AgentService = AgentService;
