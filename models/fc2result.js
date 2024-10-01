const mongoose = require('mongoose');
/*
// Analysis parameters for configuration
const AnalysisParamsSchema = new mongoose.Schema({
    invert: Boolean,
    fwxm: Number,
    bb_edge_threshold_mm: Number
}, { _id: false });

// PDF publishing parameters for configuration
const PublishPdfParamsSchema = new mongoose.Schema({
    notes: String,
    open_file: Boolean,
    metadata: {
        "Performed By": String,
        "Performed Date": String
    },
    logo: String
}, { _id: false });

// Main configuration schema
const ConfigSchema = new mongoose.Schema({
    analysis_params: AnalysisParamsSchema,
    publish_pdf_params: PublishPdfParamsSchema
}, { _id: false });
*/
// Main schema for FC2 result
const Fc2ResultSchema = new mongoose.Schema({
    pylinac_version: String,
    date_of_analysis: Date,
    field_size_x_mm: Number,
    field_size_y_mm: Number,
    field_epid_offset_x_mm: Number,
    field_epid_offset_y_mm: Number,
    field_bb_offset_x_mm: Number,
    field_bb_offset_y_mm: Number,
    device_id: String,
    performed_by: String,
    performed_on: Date,
    notes: String,
    config: Object
}, {
    timestamps: true
});

module.exports = mongoose.model('Fc2Result', Fc2ResultSchema);
