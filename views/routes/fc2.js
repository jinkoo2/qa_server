var express = require('express');
var router = express.Router();
var Fc2Result = require('../../models/fc2result'); // Adjust the path as needed

router.get('/list', async function(req, res) {
    try {
        const results = await Fc2Result.find().sort({ updatedAt: -1 }).lean();

        const formatted = results.map(r => ({
            _id: r._id,  // <-- required for link
            device: r.device_id || '',
            performed_on: r.performed_on?.toISOString().split('T')[0] || '',
            performed_by: r.performed_by || '',
            notes: r.notes || r.config?.publish_pdf_params?.notes || ''
          }));

        res.render('fc2list', { results: formatted });
    } catch (err) {
        console.error('Error rendering fc2list:', err);
        res.status(500).send('Server Error');
    }
});

function round(value, digits = 1) {
    return typeof value === 'number' ? Number(value.toFixed(digits)) : value;
  }
  
  function isFail(value, expected, tolerance = 2) {
    return Math.abs(value - expected) > tolerance;
  }
  
  router.get('/:id', async function(req, res) {
    try {
      const result = await Fc2Result.findById(req.params.id).lean();
  
      if (!result) return res.status(404).send('Result not found');
  
      const test = {
        field_size_x_mm: round(result.field_size_x_mm),
        field_size_y_mm: round(result.field_size_y_mm),
        field_epid_offset_x_mm: round(result.field_epid_offset_x_mm),
        field_epid_offset_y_mm: round(result.field_epid_offset_y_mm),
        field_bb_offset_x_mm: round(result.field_bb_offset_x_mm),
        field_bb_offset_y_mm: round(result.field_bb_offset_y_mm),
      };
  
      const check = {
        field_size_x_mm: isFail(test.field_size_x_mm, 150),
        field_size_y_mm: isFail(test.field_size_y_mm, 150),
        field_epid_offset_x_mm: isFail(test.field_epid_offset_x_mm, 0),
        field_epid_offset_y_mm: isFail(test.field_epid_offset_y_mm, 0),
        field_bb_offset_x_mm: isFail(test.field_bb_offset_x_mm, 0),
        field_bb_offset_y_mm: isFail(test.field_bb_offset_y_mm, 0),
      };
  
      const formatted = {
        ...result,
        performed_on: new Date(result.performed_on).toLocaleString(),
        date_of_analysis: new Date(result.date_of_analysis).toLocaleString(),
        test,
        check
      };
  
      res.render('fc2detail', { result: formatted });
    } catch (err) {
      console.error('Error loading report:', err);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;

