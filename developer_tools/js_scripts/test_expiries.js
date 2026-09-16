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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../src/lib/db");
var userStore_1 = require("../src/lib/services/userStore");
var entitlements_1 = require("../src/lib/services/entitlements");
function testExpiries() {
    return __awaiter(this, void 0, void 0, function () {
        var db, user, collab, paid, effective, now, MS_PER_DAY, notified, notifiedAgain, afterCollabExpiry, afterPaidExpiry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = (0, db_1.getDb)();
                    user = (0, userStore_1.createUser)("test_collab", "testcollab@hplabs.io", "password", "+10000000000");
                    console.log("User created:", user.id);
                    collab = (0, entitlements_1.grantEntitlement)(user.id, "PREMIUM", "COLLABORATION", 6);
                    console.log("Collab granted:", collab.id, "Expires:", new Date(collab.expiresAt).toISOString());
                    paid = (0, entitlements_1.grantEntitlement)(user.id, "PREMIUM", "PAYMENT", 12);
                    console.log("Paid granted:", paid.id, "Expires:", new Date(paid.expiresAt).toISOString());
                    effective = (0, entitlements_1.recalculateUserAccess)(user.id);
                    console.log("Effective Access (Overlap):", effective);
                    if (effective.expiry !== paid.expiresAt) {
                        console.error("FAILED OVERLAP PRIORITY!");
                        process.exit(1);
                    }
                    now = Date.now();
                    MS_PER_DAY = 24 * 60 * 60 * 1000;
                    db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(now + (7.5 * MS_PER_DAY), collab.id);
                    // Run Cron
                    console.log("Running Expiry Cron (7 Days)...");
                    return [4 /*yield*/, (0, entitlements_1.processCollaborationExpiries)()];
                case 1:
                    notified = _a.sent();
                    console.log("Notified Count:", notified);
                    return [4 /*yield*/, (0, entitlements_1.processCollaborationExpiries)()];
                case 2:
                    notifiedAgain = _a.sent();
                    console.log("Notified Count (Duplicate check):", notifiedAgain);
                    // 5. Time travel to 1 day before expiry
                    db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(now + (1.5 * MS_PER_DAY), collab.id);
                    console.log("Running Expiry Cron (1 Day)...");
                    return [4 /*yield*/, (0, entitlements_1.processCollaborationExpiries)()];
                case 3:
                    notified = _a.sent();
                    console.log("Notified Count:", notified);
                    // 6. Time travel to PAST expiry
                    db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(now - (1 * MS_PER_DAY), collab.id);
                    afterCollabExpiry = (0, entitlements_1.recalculateUserAccess)(user.id);
                    console.log("After Collab Expiry Effective Access:", afterCollabExpiry);
                    if (afterCollabExpiry.expiry !== paid.expiresAt) {
                        console.error("FAILED FALLBACK TO PAID!");
                        process.exit(1);
                    }
                    // Cron should detect it's expired and send the EXPIRED email
                    console.log("Running Expiry Cron (Expired)...");
                    return [4 /*yield*/, (0, entitlements_1.processCollaborationExpiries)()];
                case 4:
                    notified = _a.sent();
                    console.log("Notified Count:", notified);
                    // 7. Expire the PAID subscription too
                    db.prepare("UPDATE entitlements SET expires_at = ? WHERE id = ?").run(now - (1 * MS_PER_DAY), paid.id);
                    afterPaidExpiry = (0, entitlements_1.recalculateUserAccess)(user.id);
                    console.log("After Paid Expiry Effective Access:", afterPaidExpiry);
                    if (afterPaidExpiry.effectivePlan !== 'FREE') {
                        console.error("FAILED FALLBACK TO FREE!");
                        process.exit(1);
                    }
                    console.log("All tests passed successfully!");
                    return [2 /*return*/];
            }
        });
    });
}
testExpiries().catch(console.error);
