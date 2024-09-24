const mongoose = require('mongoose');

const QASchema = mongoose.Schema(
    {
        type: String,
        plan: String,
        result: String,
        requested_by: String,
        requested_on: Date,
        completed_by: String,
        completed_on: String,
        due_on: Date,
        plan_case_name: String,
        plan_case_id: String,
        machine: String,
        notes: String
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('QA', QASchema);