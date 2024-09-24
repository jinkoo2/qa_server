var express = require('express');
const { exec } = require('child_process');

var router = express.Router();
var TrainingJob = require('../models/trainingjob');
var TensorBoard = require('../models/tensorboard');

fs = require('fs')
const multer = require('multer');
const upload = multer();
const path = require('path');
const { chmod } = require('fs');



function get_data_root_dir(create_dir = true){
    var dir = './public/__data' 
    if(create_dir) createFolderIfNotExists(dir)
    return dir
}

function get_jobs_dir(create_dir = true){
    var dir = path.join(get_data_root_dir(create_dir), 'jobs')
    if(create_dir) createFolderIfNotExists(dir)
    return dir
}

function get_job_dir(trainingjob_id, create_dir = true){
    var dir = path.join(get_jobs_dir(create_dir), trainingjob_id)
    if(create_dir) createFolderIfNotExists(dir)
    return dir
}

function get_train_dir(trainingjob_id, create_dir = true){
    var dir = path.join(get_job_dir(trainingjob_id, create_dir), 'train')
    if(create_dir) createFolderIfNotExists(dir)
    return dir
}


/* GET ALL */
router.get('/', function (req, res, next) {
    console.log('get all training jobs');

    where = {}
    TrainingJob.countDocuments(where, (err, totalCount) => {
        if (err) {
            console.error(err);
            res.json({ message: err });
        }
        else {
            TrainingJob.find(where)
                .populate({
                     path: 'DataSet',
                })
                

                // .populate({
                //     path: 'plansetup',
                //     //select: 'Id', 
                //     model: 'PlanSetup'
                // })
                // .populate({
                //     path: 'sset',
                //     //select: 'Id', 
                //     model: 'StructureSet'
                // })
                // .skip(skip)
                // .limit(limit)
                // .sort([[filter.SortBy, filter.SortIncrement ? 1 : -1]])
                .exec((err, data) => {
                    if (err) {
                        console.error(err);
                        res.json({ message: err });
                    }
                    else {
                        const ret = {
                            totalCount: totalCount,
                            list: data
                        }
    
                        res.json(ret);
                    }
                })
    
        }
    
    })
});

/* GET ALL */
router.get('/not_completed', function (req, res, next) {
    console.log('get all training jobs not completed');

    where = {Status: {$ne: 'Completed'}}

    console.log(where)

    TrainingJob.countDocuments(where, (err, totalCount) => {
        if (err) {
            console.error(err);
            res.json({ message: err });
        }
        else {
            TrainingJob.find(where)
                .populate({
                     path: 'DataSet',
                })
                

                // .populate({
                //     path: 'plansetup',
                //     //select: 'Id', 
                //     model: 'PlanSetup'
                // })
                // .populate({
                //     path: 'sset',
                //     //select: 'Id', 
                //     model: 'StructureSet'
                // })
                // .skip(skip)
                // .limit(limit)
                // .sort([[filter.SortBy, filter.SortIncrement ? 1 : -1]])
                .exec((err, data) => {
                    if (err) {
                        console.error(err);
                        res.json({ message: err });
                    }
                    else {
                        const ret = {
                            totalCount: totalCount,
                            list: data
                        }

                        console.log(ret)
    
                        res.json(ret);
                    }
                })
    
        }
    
    })
});


/* GET A */
router.get('/:id', function(req, res, next) {
  
    const id = req.params.id;
    console.log(id);
    
    StructureDataSet.findOne({_id:id})
    // .populate({path: 'TrainSet',
    //             model: 'Structure',
    //             select: 'Name'})
    .populate('DataSet')
    .then(data=>{
        
        console.log("returning a training job", `returning a training job of id=(${id})`, req)

        res.json(data);
    })
    .catch(err => {
        console.error(err);
        
        console.error("returning a training job failed", `returning a training job failed(${dataSetId})`, req)

        res.json({message: err});
    });
});

/* PUT A */
router.put('/:id', function(req, res, next) {
  
    const id = req.params.id;
    console.log(id);
   
    console.log('PUT request')

    const trainingJob = new TrainingJob(req.body);

    // TrainingJob.updateOne({_id: trainingJob._id}, trainingJob)

    // console.log(trainingJob)

    TrainingJob.updateOne({_id: trainingJob._id}, trainingJob)
    //trainingJob.save()
        .then(data => {
            console.log('saved... sending the response back...');
            console.log(data)
            res.json(data);
        })
        .catch(err => {
            console.log('error saving an object...', err);
            res.json(
                {
                    message: err
                });
        });

   
});

function filter2where(filter){
    var where = {}
    if (filter.Name !== "")
        if (filter.NameExactMatch)
            where.Name = { $regex: filter.Name.toLowerCase().trim() + '/i' }
        else
            where.Name = { $regex: '.*' + filter.Name.toLowerCase().trim() + '.*/i' }

    return where;
}

function saveBufferToFile(buffer, filePath, onSuccess, onError) {
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        //console.error('Error saving file:', err);
        onError(filePath, err)
      } else {
        //console.log('File saved successfully.');
        onSuccess(filePath)
      }
    });
  }

  function createFolderIfNotExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
      try {
        fs.mkdirSync(folderPath);
        console.log('Folder created:', folderPath);
      } catch (err) {
        console.error('Error creating folder:', err);
      }
    } else {
      console.log('Folder already exists:', folderPath);
    }
  }

  const unzipper = require('unzipper');
  
  function unzipFileToFolder(zip_file, out_dir, onFinish, onError) {
    const zipFilePath = zip_file;
    const outputFolder = out_dir;
  
    // Check if the output folder exists, if not, create it
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }
  
    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: outputFolder }))
      .on('finish', () => {
        onFinish();
      })
      .on('error', error => {
        onError(error);
      });
  }
  
  
router.post('/upload_file/:id', upload.single('file'), (req, res) => {
    
    const id = req.params.id;

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    // Process the binary data here
    // For example, you can access the binary data using req.file.buffer

    console.log(req.file)

    var out_dir = get_train_dir(id)
    
    var filename = path.basename(req.file.originalname)

    out_file = path.join(out_dir, filename)

    saveBufferToFile(req.file.buffer, out_file, ()=>{
            console.log("file uploaded!")

            // if tensorboard zip file, decompress
            if(filename==='tboard.zip'){
                const zip_file = out_file;
                const tb_dir = path.join(out_dir, 'tboard')

                console.log('zip_file=', zip_file)
                console.log('tb_dir=', tb_dir)

                unzipFileToFolder(zip_file, tb_dir, ()=>{
                    console.log('unzip succeeded!')
                },(err)=>{
                    console.log('Error: Unzip failed!', err )
                })
            }

            return res.json({
                success: true,
            })
        },
        (err)=>{
            console.log(err)
            return res.json({
                success: false,
                msg: "File same failed"
            })
        }
    )
  });

// get datasets with filter
router.post('/filtered', function (req, res, next) {

    filter = req.body

    console.log('----------- trainingjobs/filtered -------------')
    console.log('filter=', filter);

    // convert to where condision
    var where = filter2where(filter)

    // pagenation
    const skip = filter.ItemsPerPage * filter.PageNumber
    const limit = filter.ItemsPerPage

    console.log('find');
    console.log('where', where)

    TrainingJob.countDocuments(where, (err, totalCount) => {
        if (err) {
            console.error(err);
            res.json({ message: err });
        }
        else {
            TrainingJob.find(where)
                .populate({
                    path: 'DataSet',
                    //select: 'Id Sex', 
                    model: 'StructureDataSet'
                })
                // .populate({
                //     path: 'plansetup',
                //     //select: 'Id', 
                //     model: 'PlanSetup'
                // })
                // .populate({
                //     path: 'sset',
                //     //select: 'Id', 
                //     model: 'StructureSet'
                // })
                //.select("sset_list")
                .skip(skip)
                .limit(limit)
                //.sort([[filter.SortBy, filter.SortIncrement ? 1 : -1]])
                .exec((err, data) => {
                    if (err) {
                        console.error(err);
                        res.json({ message: err });
                    }
                    else {
                        const ret = {
                            totalCount: totalCount,
                            list: data
                        }

                        res.json(ret);
                    }
                })

        }

    })

}); // post()

// POS
router.post('/', function (req, res, next) {
    
    console.log('----------- post -------------')
    console.log(req.body);

    // fs.writeFile('file.json', JSON.stringify(req.body), err=>{
    //     if(err) console.log(err)
    //     console.log('save to file.json')
    // })

    console.log(JSON.stringify(req.body))

    const trainingJob = new TrainingJob(req.body);

    trainingJob.save()
        .then(data => {
            console.log('saved... sending the response back...');
            console.log(data)
            res.json(data);
        })
        .catch(err => {
            console.log('error saving a log...');
            res.json(
                {
                    message: err
                });
        });
}); // post()

/* DELETE A DS */
router.delete('/:id', function(req, res, next) {
  
    const id = req.params.id;
    console.log('deleting...',id);
    
    TrainingJob.remove({_id:id})
    .then(data=>{
        
        console.log("trainingjob deleted", `trainingjob deleted(${id})`, req)

        res.json(data);
    })
    .catch(err => {
        console.error(err);

        console.error("trainingjob delete failed", `trainingjob delete failed(${id})`, req)

        res.json({message: err});
    });
});

const portscanner = require('portscanner');
const { unzip } = require('zlib');

// Function to find the first available port starting from a specific port
// Function to find the first available port starting from a specific port
async function findFirstAvailablePort(startPort, maxPort) {
  const status = await checkPort(startPort);
  if (status === 'open') {
    if (startPort === maxPort) {
      console.error(`No available ports found between ${startPort} and ${maxPort}.`);
      return null;
    } else {
      return findFirstAvailablePort(startPort + 1, maxPort);
    }
  } else {
    console.log(`First available port: ${startPort}`);
    return startPort;
  }
}


// Function to check the port status asynchronously
function checkPort(port) {
  return new Promise((resolve, reject) => {
    portscanner.checkPortStatus(port, '127.0.0.1', (error, status) => {
      if (error) {
        reject(error);
      } else {
        resolve(status);
      }
    });
  });
}

// POST
router.post('/start_tensorboard/:id', function (req, res, next) {
    
    console.log('----------- /tensorboard/post -------------')
    console.log(req.body);

    const id = req.params.id;
    const training_id = id;
    console.log('id=', id)


    // Call the function to find the first available port starting from 10000
    const startPort = 30000;
    const maxPort = 30100; // The maximum port number
    terminationDelayInSec = 10 * 60; // 10 minutes to review the training
    findFirstAvailablePort(startPort, maxPort)
    .then(availablePort => {
        if (availablePort !== null) {
            console.log(`========== [STARTing on ${availablePort}] ============`)

            const command = `python3 -m tensorboard.main --logdir=public/__data/jobs/${training_id}/train/tboard --bind_all --port ${availablePort}`;
            console.log(command)

            //http://roweb3.uhmc.sbuh.stonybrook.edu:10000/

            // lauching a child process 
            
                const childProcess = exec(command, (error, stdout, stderr) => {
                    if (error) throw new Exception(error)
                    
                    console.log('childProcess.pid=', childProcess.pid)

                    // The output of the command will be available in the stdout variable
                    console.log(`Command output:\n${stdout}`)

                    // If there is any error output, it will be available in the stderr variable
                    if (stderr) throw new Exception(stderr)
                });
            

            childProcess.on('exit', (code, signal) => {
                console.log(`Child process exited with code ${code} and signal ${signal}`);

                TensorBoard.updateOne({_id:training_id},{
                    $set: {
                        status: "Stopped",
                        status_time: new Date()
                    }
                })
                .then(data=>{
                    console.log('TB stopped. updateOne worked')
                    console.log(data);
                })
                .catch(err => {
                    console.log('updateOne failed')
                    throw new Exception(err);
                });

            });

            // Access the PID using the 'pid' property
            console.log('Child process PID2:', childProcess.pid);

            // find the tensorboard from db
            TensorBoard.findOne({trainingjob_id: training_id})
                .then(job=>{
                    if(job === null) // not found
                    {
                        const tb = new TensorBoard({
                            trainingjob_id: training_id,
                            status: 'Running',
                            pid: childProcess.pid,
                        });

                        tb.save()
                            .then(data => {
                                console.log('saved a new tb to DB.');
                                console.log(data)
                            })
                            .catch(err => {
                                console.log('error saving a tb to DB!');
                                throw new Exception('Error saving tensorboard to DB.')                                
                            });
                    }
                    else{ // find one, so update it.
                        TensorBoard.updateOne({_id:job._id},{
                            $set: {
                                status: "Running",
                                pid: childProcess.pid,
                            }
                        })
                        .then(data=>{
                            console.log('updateOne worked')
                            console.log(data);
                        })
                        .catch(err => {
                            console.log('updateOne failed')
                            throw new Exception(err);
                        });
                    }
                })

            // Schedule the termination after 10 seconds
            setTimeout(() => {
                childProcess.kill();
            }, terminationDelayInSec * 1000);

            return res.json({
                port: availablePort
            })
        }
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
        return res.json({error: error})
    });
    


    
    
}); // post()



router.get('/is_tensorboard_avilable/:id', function (req, res, next) {
    
    
    const id = req.params.id;
    
    var data_root_dir = './public/__data' 
    var jobs_dir = path.join(data_root_dir, 'jobs')
    var job_dir = path.join(jobs_dir, id)
    var train_dir = path.join(job_dir, 'train')
    var tb_dir = path.join(train_dir, 'tboard')
    const tb_zip = tb_dir + '.zip'
    
    
    console.log(fs.existsSync(tb_dir))
    console.log(fs.existsSync(tb_zip))
    
    console.log('tb_dir', tb_dir);
    

    return res.json({
         result: fs.existsSync(tb_dir) || fs.existsSync(tb_zip)
    })
});

module.exports = router;