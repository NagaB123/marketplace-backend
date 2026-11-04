"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const fakeStore_1 = require("./fakeStore");
const apiRoutes_1 = require("./routes/apiRoutes");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json({ limit: "1mb" }));
app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
});
app.use("/api", apiRoutes_1.apiRouter);
app.use((error, _request, response, _next) => {
    if (error instanceof zod_1.z.ZodError) {
        response.status(400).json({ error: "Invalid request", details: error.flatten() });
        return;
    }
    if (error instanceof fakeStore_1.UpstreamError) {
        response.status(error.statusCode).json({ error: error.message });
        return;
    }
    response.status(500).json({ error: "Internal server error" });
});
