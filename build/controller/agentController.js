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
exports.AgentController = void 0;
const agentService_1 = require("../service/agentService");
const errors_handler_1 = __importDefault(require("../utils/errors.handler"));
const res_error_1 = require("../utils/res.error");
const agentService = new agentService_1.AgentService();
class AgentController {
    constructor() {
        this.execute = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const method = req.method;
                const path = req.route.path;
                const id = req.params.id;
                if (path === "/") {
                    if (method === "POST") {
                        const result = yield this.createAgent(req, res);
                        res.status(201).json(result);
                    }
                    else if (method === "GET") {
                        const result = yield this.getAgents(req, res);
                        res.status(200).json(result);
                    }
                }
                else if (path === "/:id" && id) {
                    if (method === "GET") {
                        const result = yield this.getAgentById(req, res);
                        res.status(200).json(result);
                    }
                    else if (method === "PUT") {
                        const result = yield this.updateAgent(req, res);
                        res.status(200).json(result);
                    }
                    else if (method === "DELETE") {
                        const result = yield this.deleteAgent(req, res);
                        res.status(200).json(result);
                    }
                }
            }
            catch (error) {
                (0, res_error_1.errorHandler)(error, req, res);
            }
        });
    }
    createAgent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agent = yield agentService.createAgent(req.body);
                return {
                    message: "Agent created successfully",
                    message_code: "AGENT_CREATED",
                    data: agent,
                };
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_CREATING_AGENT",
                    status: 500
                });
            }
        });
    }
    getAgents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agents = yield agentService.getAgents();
                return {
                    message: "Agents retrieved successfully",
                    message_code: "AGENTS_RETRIEVED",
                    data: agents,
                };
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_FETCHING_AGENTS",
                });
            }
        });
    }
    getAgentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agent = yield agentService.getAgentById(req.params.id);
                if (!agent) {
                    throw new errors_handler_1.default({
                        message: "Agent not found",
                        message_code: "AGENT_NOT_FOUND",
                    });
                }
                return {
                    message: "Agent retrieved successfully",
                    message_code: "AGENT_RETRIEVED",
                    data: agent,
                };
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_FETCHING_AGENT",
                });
            }
        });
    }
    updateAgent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agent = yield agentService.updateAgent(req.params.id, req.body);
                if (!agent) {
                    throw new errors_handler_1.default({
                        message: "Agent not found",
                        message_code: "AGENT_NOT_FOUND",
                    });
                }
                return {
                    message: "Agent updated successfully",
                    message_code: "AGENT_UPDATED",
                    data: agent,
                };
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_UPDATING_AGENT",
                });
            }
        });
    }
    deleteAgent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield agentService.deleteAgent(req.params.id);
                return {
                    message: message,
                    message_code: "AGENT_DELETED",
                    data: null,
                };
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_DELETING_AGENT",
                });
            }
        });
    }
}
exports.AgentController = AgentController;
