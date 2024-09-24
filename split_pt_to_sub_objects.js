const mongoose = require('mongoose')
const Pt = require('./models/pt')
const Patient = require('./models/patient')
const Image = require('./models/image')
const Course = require('./models/course')
const PlanSetup = require('./models/plansetup')
const StructureSet = require('./models/structureset')
const Structure = require('./models/structure')
const Beam = require('./models/beam')
const structure = require('./models/structure')
const course = require('./models/course')
const patient = require('./models/patient')

mongoose.connect("mongodb://172.200.0.2/planlist", () => {
    console.log('connected')
}, e => {
    console.error(e.message)
})

function print(str) {
    console.log(str)
}

run_async()


async function create_patient(pt) {
    var patient = await Patient.create({
        Id: pt.Id,
        Sex: pt.Sex,
        DateOfBirth: pt.DateOfBirth,
    })

    return patient
}

async function create_courses(cs_list, patient) {

    //print(patient)
    var course_list = []

    for (i = 0; i < cs_list.length; i++) {
        cs = cs_list[i]

        // create a new course
        var course = await Course.create({
            Id: cs.Id,
            pt: patient._id
        })

        //print('course created')
        course_list.push(course)
    }

    return course_list
}

async function create_images(img_list, patient) {

    image_list = []

    for (i = 0; i < img_list.length; i++) {
        img = img_list[i]

        // create a new image
        const image = await Image.create({
            Id: img.Id,
            Comment: img.Comment,
            CreationDateTime: img.CreationDateTime,
            DisplayUnit: img.DisplayUnit,
            FOR: img.FOR,
            ImagingOrientation: img.ImagingOrientation,
            HasUserOrigin: img.HasUserOrigin,
            HistoryDateTime: img.HistoryDateTime,
            HistoryUserName: img.HistoryUserName,
            Series: img.Series,
            Level: img.Level,
            Window: img.Window,

            pt: patient._id,
            PatientId: patient.Id // needed to find the path of the image without populating pt._id.
        })

        // add to the image list
        image_list.push(image)
    }

    return image_list

}


async function create_structures(s_list, structureset, patient) {

    var structure_list = []
    for (j = 0; j < s_list.length; j++) {

        const s = s_list[j]

        // create a new structure
        const structure = await Structure.create({
            Name: s.name,
            NameLower: s.name.trim().toLowerCase(),
            BBox: s.bbox,
            BBoxWidth: s.bbox[1]-s.bbox[0],
            BBoxHeight: s.bbox[3]-s.bbox[2],
            BBoxDepth: s.bbox[5]-s.bbox[4],
            Volume: s.volume,
            NumberOfSeparateParts: s.NumberOfSeparateParts,
            HistoryDateTime: s.HistoryDateTime,
            HistoryUserName: s.HistoryUserName,
            DicomType: s.DicomType,
            Color: s.Color,
            HasSegment: s.HasSegment,
            IsHighResolution: s.IsHighResolution,
            Comment: s.Comment,
            ROINumber: s.ROINumber,
            MeshGeometryBounds: s["MeshGeometry[dot]Bounds"],
            sset: structureset._id,
            StructureSetId: structureset.Id,
            pt: patient._id,
            PatientId: patient.Id, // needed to find the path of the image without populating pt._id.
            // plan is not available yet...
            plansetup: null,
            PlanSetupId: null,
        })

        structure_list.push(structure)
    }

    return structure_list

}

async function create_structureset(sset_list, image_list, patient) {

    var structureset_list = []
    for (i = 0; i < sset_list.length; i++) {

        const sset = sset_list[i]

        // find image of this structure set
        //print(`Images found for ${sset["Image[dot]Id"]}`)
        const images_found = image_list.filter(image => image.Id == sset["Image[dot]Id"])
        const image_of_sset = images_found.length == 1 ? images_found[0] : null
        //print(image_of_sset)

        // create a new structureset
        const structureset = await StructureSet.create({
            Id: sset.Id,
            Comment: sset.Comment,
            HistoryDateTime: sset.HistoryDateTime,
            HistoryUserName: sset.HistoryUserName,
            UID: sset.UID,
            img: image_of_sset ? image_of_sset._id : null, // if null, the image was not found. something wrong.
            ImageId: sset["Image[dot]Id"],
            pt: patient._id,
            PatientId: patient.Id // needed to find the path of the image without populating pt._id.
        })

        //print('structureset created')
        //print(structureset._id)

        var structure_list = await create_structures(sset.s_list, structureset, patient)

        // update structure set (this updates the db but not the current object)
        const sset_ret = await StructureSet.updateOne({ _id: structureset._id }, { s_list: structure_list.map(x => x._id) })
        structureset.s_list = structure_list // update the object in the memory (with the actual structure list for later use)

        // check if the return is like this: { ok: 0, n: 0, nModified: 0 }
        // print('sset_ret')
        // print(sset_ret)
        // if (sset_ret && sset_ret.ok === 0) {
        //     print('ERROR')
        //     print(sset_ret)
        // }

        // add to the list
        structureset_list.push(structureset)
    } // for sset_list

    return structureset_list
}

async function create_plansetups(ps_list, structureset_list, course_list, patient) {

    var plansetup_list = []
    for (i = 0; i < ps_list.length; i++) {
        ps = ps_list[i]

        // structureset of the plansetup
        const ssets_found = structureset_list.filter(sset => sset.Id === ps["StructureSet[dot]Id"])
        const sset_of_ps = ssets_found.length === 1 ? ssets_found[0] : null

        // image of the plansetup
        const img_of_ps = sset_of_ps ? sset_of_ps.img : null

        // course of the plansetup
        const courses_found = course_list.filter(c => c.Id === ps["Course[dot]Id"])
        const cs_of_ps = courses_found.length === 1 ? courses_found[0] : null

        // create a new plansetup
        var plansetup = await PlanSetup.create({
            Id: ps.Id,
            IdLower: ps.Id.trim().toLowerCase(),
            PlanType: ps.PlanType,
            StructureSetId: ps["StructureSet[dot]Id"],
            ImageId: ps["Image[dot]Id"],
            ApprovalStatus: ps.ApprovalStatus,
            Comment: ps.Comment,
            CourseId: ps["Course[dot]Id"],
            CreationDateTime: ps.CreationDateTime,
            CreationUserName: ps.CreationUserName,
            SeriesUID: ps.SeriesUID,
            SeriesId: ps["Series[dot]Id"],
            TreatmentApprovalDate: ps.TreatmentApprovalDate,
            TreatmentApprover: ps.TreatmentApprover,
            TreatmentOrientation: ps.TreatmentOrientation,
            UID: ps.UID,
            NumberOfFractions: ps.NumberOfFractions,
            PrescribedDosePerFraction: ps.PrescribedDosePerFraction,
            TotalPrescribedDose: ps.TotalPrescribedDose,
            sset: sset_of_ps ? sset_of_ps._id : null,
            img: img_of_ps ? img_of_ps._id : null,
            cs: cs_of_ps ? cs_of_ps._id : null,
            pt: patient._id,
            PatientId: patient.Id
        })

        //print('plansetup created')

        // connect the plansetup to the structures
        //print("--- sset_of_ps ---")
        //print(sset_of_ps)

        if (sset_of_ps) {
            for (k = 0; k < sset_of_ps.s_list.length; k++) {
                const structure = sset_of_ps.s_list[k] // s_list object is the list of structure objects (not just '_id' list)

                //print(`connecting structure(${structure.Name}) to plansetup(${plansetup.Id})`)
                const ret = await Structure.updateOne({ _id: structure._id }, {
                    plansetup: plansetup._id,
                    PlanSetupId: plansetup.Id,
                    PlanType: plansetup.PlanType, // this is for searching structures
                    TreatmentOrientation: plansetup.TreatmentOrientation, // this is for searching structures
                })

                //print('---- ret ---')
                //print(ret)
                structure.plansetup = plansetup
            }
        }

        // create Beams
        beam_list = []
        for (j = 0; j < ps.beam_list.length; j++) {
            b = ps.beam_list[j]

            // create a new beam
            const beam = await Beam.create({
                Id: b.Id,
                ToleranceTableLabel: b.ToleranceTableLabel,
                Technique: b.Technique,
                MetersetUnit: b["Meterset[dot]Unit"],
                MetersetValue: b["Meterset[dot]Value"],
                ExternalBeamId: b["ExternalBeam[dot]Id"],
                ExternalBeamMachineModel: b["ExternalBeam[dot]MachineModel"],
                EnergyModeDisplayName: b.EnergyModeDisplayName,
                DoseRate: b.DoseRate,
                SSD: b.SSD,
                AverageSSD: b.AverageSSD,
                IsocenterPosition: b.IsocenterPosition,
                WeightFactor: b.WeightFactor,
                ControlPointsCount: b["ControlPoints[dot]Count"],
                ControlPointsJawPositionsList: b["ControlPoints[dot]JawPositionsList"],
                ControlPointsCollimatorAngleList: b["ControlPoints[dot]CollimatorAngleList"],
                ControlPointsGantryAngleList: b["ControlPoints[dot]GantryAngleList"],
                ControlPointsLeafPositionsList: b["ControlPoints[dot]LeafPositionsList"],
                ControlPointsMetersetWeightList: b["ControlPoints[dot]MetersetWeightList"],
                ControlPointsPatientSupportAngleList: b["ControlPoints[dot]PatientSupportAngleList"],
                ControlPointsTableTopLateralPositionList: b["ControlPoints[dot]TableTopLateralPositionList"],
                ControlPointsTableTopLongitudinalPositionList: b["ControlPoints[dot]TableTopLongitudinalPositionList"],
                ControlPointsTableTopVerticalPositionList: b["ControlPoints[dot]TableTopVerticalPositionList"],
                BolusesCount: b["Boluses[dot]Count"],
                ControlPointsBolusIdList: b["ControlPoints[dot]BolusIdList"],
                BlocksCount: b["Blocks[dot]Count"],
                ControlPointsBlockIdList: b["ControlPoints[dot]BlockIdList"],
                ControlPoints: b.ControlPoints ? b.ControlPoints : null,

                plansetup: plansetup._id,
                PlanSetupId: plansetup.Id,
            })

            //print("beam created")

            beam_list.push(beam)
        }

        // update plansetup
        PlanSetup.updateOne({ _id: plansetup._id }, { beam_list: beam_list.map(x => x._id) })
        plansetup.beam_list = beam_list // update the current object

        // add to the plansetup list
        plansetup_list.push(plansetup)
    }

    return plansetup_list
}

async function run_async(pt) {
    try {

        const pts = await Pt.find()

        N = pts.length

        for (n = 0; n < N; n++) {
            const pt = pts[n]

            print(`[${n}/${N} --> ${pt.Id}]`)

            var patient = await create_patient(pt)
            var course_list = await create_courses(pt.cs_list, patient)
            var image_list = await create_images(pt.img_list, patient)
            var structureset_list = await create_structureset(pt.sset_list, image_list, patient)
            var plansetup_list = await create_plansetups(pt.ps_list, structureset_list, course_list, patient)

            // update patient
            await Patient.updateOne({ _id: patient._id }, {
                sset_list: structureset_list.map(x => x._id),
                img_list: image_list.map(x => x._id),
                cs_list: course_list.map(x => x._id),
                ps_list: plansetup_list.map(x => x._id),
            })
        }




    }
    catch (e) {
        handleError(e)
    }
}

function handleError(err) {
    print(err)
}




