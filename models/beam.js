const mongoose = require('mongoose');

const BeamSchema = mongoose.Schema(
    {
        Id: {
            type: String,
            //        required:true, 
            //unique: true,
        },

        ToleranceTableLabel: String,
        Technique: String,
        MetersetUnit: String,
        MetersetValue: Number,
        ExternalBeamId: String,
        ExternalBeamMachineModel: String,
        EnergyModeDisplayName: String,
        DoseRate: Number,
        DoseRate: Number,
        SSD: Number,
        AverageSSD: String,
        IsocenterPosition: [Number],
        WeightFactor: Number,
        ControlPointsCount: Number,
        ControlPointsJawPositionsList: String,
        ControlPointsCollimatorAngleList: String,
        ControlPointsGantryAngleList: String,
        ControlPointsLeafPositionsList: String,
        ControlPointsMetersetWeightList: String,
        ControlPointsPatientSupportAngleList: String,
        ControlPointsPatientSupportAngleList: String,
        ControlPointsTableTopLateralPositionList: String,
        ControlPointsTableTopLongitudinalPositionList: String,
        ControlPointsTableTopVerticalPositionList: String,
        BlocksCount: Number,
        ControlPointsBlockIdList: String,
        BolusesCount: Number,
        ControlPointsBolusIdList: String,
        ControlPoints: [{
            Jaw: [Number],
            COL: Number,
            G: Number,
            MLC: {
                Bank_A: [Number],
                Bank_B: [Number],
            },
            t: Number,
            RTN: Number,
            LAT: Number,
            LNG: Number,
            VRT: Number,
        }],
        
        plansetup: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "PlanSetup"
        },

        PlanSetupId: String,
    },
    {
        timestamps: false
    }
);

module.exports = mongoose.model('Beam', BeamSchema);