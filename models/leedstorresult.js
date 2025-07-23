const mongoose = require('mongoose');

// Schema for each low contrast ROI
const LowContrastRoiSchema = new mongoose.Schema({
    "contrast method": String,
    visibility: Number,
    "visibility threshold": Number,
    "passed visibility": Boolean,
    contrast: Number,
    cnr: Number,
    "signal to noise": Number
}, { _id: false });

// Schema for MTF LP/MM values
const MtfLpMmSchema = new mongoose.Schema({
    "80": { type: Number, required: false },
    "50": { type: Number, required: false },
    "30": { type: Number, required: false }
}, { _id: false });
/*
// Schema for analysis parameters within config
const AnalysisParamsSchema = new mongoose.Schema({
    low_contrast_threshold: Number,
    high_contrast_threshold: Number,
    invert: Boolean,
    ssd: Number,
    low_contrast_method: String,
    visibility_threshold: Number,
    x_adjustment: Number,
    y_adjustment: Number,
    angle_adjustment: Number,
    roi_size_factor: Number,
    scaling_factor: Number
}, { _id: false });

// Schema for PDF publishing parameters within config
const PublishPdfParamsSchema = new mongoose.Schema({
    open_file: Boolean,
    metadata: {
        "Performed By": String,
        "Performed Date": String
    },
    logo: String
}, { _id: false });

// Main config schema
const ConfigSchema = new mongoose.Schema({
    analysis_params: AnalysisParamsSchema,
    publish_pdf_params: PublishPdfParamsSchema
}, { _id: false });
*/
// Main schema for the Leeds result
const LeedsTORResultSchema = new mongoose.Schema({
    pylinac_version: String,
    date_of_analysis: Date,
    analysis_type: String,
    median_contrast: Number,
    median_cnr: Number,
    num_contrast_rois_seen: Number,
    phantom_center_x_y: [Number],
    low_contrast_rois: [LowContrastRoiSchema],
    phantom_area: Number,
    mtf_lp_mm: [MtfLpMmSchema],
    percent_integral_uniformity: Number,
    device_id: String,
    performed_by: String,
    performed_on: Date,
    notes: String,
    file: String, 
    config: Object
}, {
    timestamps: true
});

module.exports = mongoose.model('LeedsTORResult', LeedsTORResultSchema);
