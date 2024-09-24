const mongoose = require('mongoose');

const PlanSchema = mongoose.Schema(
    {
        case_name: {
            type: String,
            required: true
        },
        sim: Date,
        status: String,
        newstart: Date,
        plan_name: String,
        modality: String,
        planners: String, 
        doctors: String, 
        tx_site: String,
        machine: String,
        note: String,
        qalist: Array,
        logs: Array,
        // search string of this object for keyword searching, all lower case.
        keywords: {
            type:String,
            default:''
        }
    },
    {
        timestamps:true
    }
);

// PlanSchema.pre('save', function(next) {
    
//     // Saving reference to this because of changing scopes
//     const document = this;
    
//     // document.json = JSON.stringify({...document, json:""});

//     console.log('plan save =================================>', document)
    
//     next();
    
//   });



module.exports = mongoose.model('Plan', PlanSchema);