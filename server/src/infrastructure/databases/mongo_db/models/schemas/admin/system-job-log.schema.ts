import { Schema, model } from "mongoose";
import { JobStatus } from "@domain/entities/admin/system-job-log.entity";
import { ISystemJobLogDocument } from "../../interfaces/admin/system-job-log.schema.interface";

const SystemJobLogSchema = new Schema<ISystemJobLogDocument>({
    jobName: { type: String, required: true, index: true },
    status: { type: String, enum: Object.values(JobStatus), required: true, index: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number },
    processedCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    errorMessage: { type: String },
    metadata: { type: Schema.Types.Mixed },
}, {
    timestamps: true,
    versionKey: false
});

SystemJobLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const SystemJobLogModel = model<ISystemJobLogDocument>("SystemJobLog", SystemJobLogSchema);
export { ISystemJobLogDocument };
