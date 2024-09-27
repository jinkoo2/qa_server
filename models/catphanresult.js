const mongoose = require('mongoose');

const RoiSchema = new mongoose.Schema({
    name: String,
    value: Number,
    stdev: Number,
    difference: Number,
    nominal_value: Number,
    passed: Boolean
});

const HuRoiSchema = new mongoose.Schema({
    Air: RoiSchema,
    PMP: RoiSchema,
    "50% Bone": RoiSchema,
    LDPE: RoiSchema,
    Poly: RoiSchema,
    Acrylic: RoiSchema,
    "20% Bone": RoiSchema,
    Delrin: RoiSchema,
    Teflon: RoiSchema
});

const Ctp404Schema = new mongoose.Schema({
    offset: Number,
    low_contrast_visibility: Number,
    thickness_passed: Boolean,
    measured_slice_thickness_mm: Number,
    thickness_num_slices_combined: Number,
    geometry_passed: Boolean,
    avg_line_distance_mm: Number,
    line_distances_mm: [Number],
    hu_linearity_passed: Boolean,
    hu_tolerance: Number,
    hu_rois: HuRoiSchema
});

const Ctp486Schema = new mongoose.Schema({
    uniformity_index: Number,
    integral_non_uniformity: Number,
    nps_avg_power: Number,
    nps_max_freq: Number,
    passed: Boolean,
    rois: {
        Top: RoiSchema,
        Right: RoiSchema,
        Bottom: RoiSchema,
        Left: RoiSchema,
        Center: RoiSchema
    }
});

const Ctp528Schema = new mongoose.Schema({
    start_angle_radians: Number,
    mtf_lp_mm: {
        10: Number,
        20: Number,
        30: Number,
        40: Number,
        50: Number,
        60: Number,
        70: Number,
        80: Number,
        90: Number
    },
    roi_settings: {
        "region 1": {
            start: Number,
            end: Number,
            "num peaks": Number,
            "num valleys": Number,
            "peak spacing": Number,
            "gap size (cm)": Number,
            "lp/mm": Number
        },
        "region 2": {
            start: Number,
            end: Number,
            "num peaks": Number,
            "num valleys": Number,
            "peak spacing": Number,
            "gap size (cm)": Number,
            "lp/mm": Number
        },
        "region 3": {
            start: Number,
            end: Number,
            "num peaks": Number,
            "num valleys": Number,
            "peak spacing": Number,
            "gap size (cm)": Number,
            "lp/mm": Number
        },
        "region 4": {
            start: Number,
            end: Number,
            "num peaks": Number,
            "num valleys": Number,
            "peak spacing": Number,
            "gap size (cm)": Number,
            "lp/mm": Number
        },
        "region 5": {
            start: Number,
            end: Number,
            "num peaks": Number,
            "num valleys": Number,
            "peak spacing": Number,
            "gap size (cm)": Number,
            "lp/mm": Number
        },
        "region 6": {
            start: Number,
            end: Number,
            "num peaks": Number,
            "num valleys": Number,
            "peak spacing": Number,
            "gap size (cm)": Number,
            "lp/mm": Number
        },
        "region 7": {
            start: Number,
            end: Number,
            "num peaks": Number,
            "num valleys": Number,
            "peak spacing": Number,
            "gap size (cm)": Number,
            "lp/mm": Number
        },
        "region 8": {
            start: Number,
            end: Number,
            "num peaks": Number,
            "num valleys": Number,
            "peak spacing": Number,
            "gap size (cm)": Number,
            "lp/mm": Number
        }
    }
});

const Ctp515Schema = new mongoose.Schema({
    cnr_threshold: Number,
    num_rois_seen: Number,
    roi_settings: {
        "15": {
            angle: Number,
            distance: Number,
            radius: Number,
            distance_pixels: Number,
            angle_corrected: Number,
            radius_pixels: Number
        },
        "9": {
            angle: Number,
            distance: Number,
            radius: Number,
            distance_pixels: Number,
            angle_corrected: Number,
            radius_pixels: Number
        },
        "8": {
            angle: Number,
            distance: Number,
            radius: Number,
            distance_pixels: Number,
            angle_corrected: Number,
            radius_pixels: Number
        },
        "7": {
            angle: Number,
            distance: Number,
            radius: Number,
            distance_pixels: Number,
            angle_corrected: Number,
            radius_pixels: Number
        },
        "6": {
            angle: Number,
            distance: Number,
            radius: Number,
            distance_pixels: Number,
            angle_corrected: Number,
            radius_pixels: Number
        },
        "5": {
            angle: Number,
            distance: Number,
            radius: Number,
            distance_pixels: Number,
            angle_corrected: Number,
            radius_pixels: Number
        }
    },
    roi_results: {
        "15": {
            "contrast method": String,
            visibility: Number,
            "visibility threshold": Number,
            "passed visibility": Boolean,
            contrast: Number,
            cnr: Number,
            "signal to noise": Number
        },
        "9": {
            "contrast method": String,
            visibility: Number,
            "visibility threshold": Number,
            "passed visibility": Boolean,
            contrast: Number,
            cnr: Number,
            "signal to noise": Number
        },
        "8": {
            "contrast method": String,
            visibility: Number,
            "visibility threshold": Number,
            "passed visibility": Boolean,
            contrast: Number,
            cnr: Number,
            "signal to noise": Number
        },
        "7": {
            "contrast method": String,
            visibility: Number,
            "visibility threshold": Number,
            "passed visibility": Boolean,
            contrast: Number,
            cnr: Number,
            "signal to noise": Number
        },
        "6": {
            "contrast method": String,
            visibility: Number,
            "visibility threshold": Number,
            "passed visibility": Boolean,
            contrast: Number,
            cnr: Number,
            "signal to noise": Number
        },
        "5": {
            "contrast method": String,
            visibility: Number,
            "visibility threshold": Number,
            "passed visibility": Boolean,
            contrast: Number,
            cnr: Number,
            "signal to noise": Number
        }
    }
});

const CatPhanResultSchema = new mongoose.Schema({
    // machine id, device id, etc
    device_id: {
        type: String,
        required: true,
        index: true  // Single field index on object_id
    },

    performed_by: String,
    performed_on: String,
    notes: String,
    config: Object,
    pylinac_version: String,
    date_of_analysis: Date,
    catphan_model: String,
    catphan_roll_deg: Number,
    origin_slice: Number,
    num_images: Number,
    ctp404: Ctp404Schema,
    ctp486: Ctp486Schema,
    ctp528: Ctp528Schema,
    ctp515: Ctp515Schema,
    file: String
}, {
    timestamps: true
});

module.exports = mongoose.model('CatPhanResult', CatPhanResultSchema);
