var express = require("express");
var router = express.Router();
var QA = require("../models/qa");
const User = require("../models/user");
const emailer = require("../services/emailer");

const authorizedOnly = require("../security/authorizedOnly");
const appLogger = require("../security/appLogger");

/* GET ALL */
router.get("/", authorizedOnly, function (req, res, next) {
  //console.log('get');
  QA.find()
    .sort({ due_on: -1 })
    .then((data) => {
      //console.log(data);

      appLogger.log("returning all qa list", "returning qa list", req);

      res.json(data);
    })
    .catch((err) => {
      console.error(err);

      appLogger.error("QA.find() failed", "QA.find() failed", req);

      res.json({ message: err });
    });
});

// ALL QAs not completed
router.get("/notcompleted", authorizedOnly, function (req, res, next) {
  //console.log('get');
  QA.find({ completed_by: "" })
    .sort({ due_on: -1 })
    .then((data) => {
      //console.log(data);

      appLogger.log("returning all qa list", "returning qa list", req);

      res.json(data);
    })
    .catch((err) => {
      console.error(err);

      appLogger.error("QA.find() failed", "QA.find() failed", req);

      res.json({ message: err });
    });
});

// ALL QAs completed
router.get("/completed", authorizedOnly, function (req, res, next) {
  //console.log('get');
  QA.find({ completed_by: { $ne: "" } })
    .sort({ due_on: -1 })
    .then((data) => {
      //console.log(data);

      appLogger.log("returning all qa list", "returning qa list", req);

      res.json(data);
    })
    .catch((err) => {
      console.error(err);

      appLogger.error("QA.find() failed", "QA.find() failed", req);

      res.json({ message: err });
    });
});

// get helper function with skip & limit
function get_skip_limit(options, req, res) {
  const skip = parseInt(req.params.skip);
  const limit = parseInt(req.params.limit);

  console.log("skip===>", skip);
  console.log("limit===>", limit);

  QA.countDocuments(options, (err, totalCount) => {
    if (err) {
      console.error(err);
      appLogger.error("finding QAs failed", "finding QAs failed", req);
      res.json({ message: err });
    } else {
      QA.find(options)
        //.select(['-json']) // exclude json field
        .sort({ due_on: -1 })
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
          if (err) {
            console.error(err);
            appLogger.error(
              "returning QAs failed",
              "returning QAs failed",
              req
            );
            res.json({ message: err });
          } else {
            appLogger.log("returning QAs", "returning QAs", req);
            //console.log("data===================>", data);
            const ret = {
              totalCount: totalCount,
              list: data,
            };
            res.json(ret);
          } // if
        }); // exec
    } // if
  }); //countDocuments
}

/* GET ALL with skip & limit */
router.get("/skip/:skip/limit/:limit", authorizedOnly, function (
  req,
  res,
  next
) {
  get_skip_limit({}, req, res);
});

// ALL QAs not completed with
router.get("/notcompleted/skip/:skip/limit/:limit", authorizedOnly, function (
  req,
  res,
  next
) {
  get_skip_limit({ completed_by: "" }, req, res);
});

// ALL QAs completed with
router.get("/completed/skip/:skip/limit/:limit", authorizedOnly, function (
  req,
  res,
  next
) {
  get_skip_limit({ completed_by: { $ne: "" } }, req, res);
});

/* GET ALL with machines, skip & limit */
router.get(
  "/machines/:machines/skip/:skip/limit/:limit",
  authorizedOnly,
  function (req, res, next) {
    const machines = req.params.machines.split(",").join("|");
    console.log("machines===========>", machines);
    const regexMachines = new RegExp(machines);

    const options = {
      machine: regexMachines,
    };

    get_skip_limit(options, req, res);
  }
);

// ALL QAs not completed with
router.get(
  "/notcompleted/machines/:machines/skip/:skip/limit/:limit",
  authorizedOnly,
  function (req, res, next) {
    const machines = req.params.machines.split(",").join("|");
    console.log("machines===========>", machines);
    const regexMachines = new RegExp(machines);

    const options = {
      completed_by: "",
      machine: regexMachines,
    };

    get_skip_limit(options, req, res);
  }
);

// ALL QAs completed with
router.get(
  "/completed/machines/:machines/skip/:skip/limit/:limit",
  authorizedOnly,
  function (req, res, next) {
    const machines = req.params.machines.split(",").join("|");
    console.log("machines===========>", machines);
    const regexMachines = new RegExp(machines);

    const options = {
      completed_by: { $ne: "" },
      machine: regexMachines,
    };

    get_skip_limit(options, req, res);
  }
);

/* GET A QA */
router.get("/:qaId", authorizedOnly, function (req, res, next) {
  const qaId = req.params.qaId;

  QA.findOne({ _id: qaId })
    .then((data) => {
      appLogger.log("returning a qa", `returning a qa(${qaId})`, req);

      res.json(data);
    })
    .catch((err) => {
      console.error(err);

      appLogger.error(
        "returning a qa failed",
        `returning a qa failed(${qaId})`,
        req
      );

      res.json({ message: err });
    });
});

/* DELETE */
router.delete("/:qaId", authorizedOnly, function (req, res, next) {
  const qaId = req.params.qaId;

  QA.remove({ _id: qaId })
    .then((data) => {
      appLogger.log("QA deleted", `QA deleted(${qaId})`, req);

      res.json(data);
    })
    .catch((err) => {
      console.error(err);

      appLogger.error("QA delete failed", `QA delete failed(${qaId})`, req);

      res.json({ message: err });
    });
});

/* UPDATE */
router.patch("/:qaId", authorizedOnly, function (req, res, next) {
  const qaId = req.params.qaId;
  const qa = req.body;

  if (req.query.action === "completed") {
    // saving with qa complete action
    //notify the requestor
    const to = [];

    // include the requester & competed by users
    to.push(qa.requested_by.split("|")[1]);
    to.push(qa.completed_by.split("|")[1]);

    // include subscribers
    User.find({ "settings.notify_qa_completed_all": true })
      .then((users) => {
        users.forEach((user) => {
          console.log("qa.machine===========>", qa.machine);
          console.log("user===========>", user);

          // notify the user if the user has no my_machines user settings or if the user's machine include the qa machine
          if (
            !user.settings ||
            !user.settings.my_machines ||
            user.settings.my_machines.trim() === "" ||
            user.settings.my_machines.includes(qa.machine)
          )
            to.push(user.email);
        });

        console.log("to===========>", to);

        const to_unique = [...new Set(to)]; // unique emails
        console.log("to_unique===========>", to_unique);

        const due_on =
          new Date(qa.due_on).toLocaleDateString() +
          " " +
          new Date(qa.due_on).toLocaleTimeString();
        const body = `Case:\t${qa.plan_case_name}\nType:\t${qa.type}\nPlan:\t${qa.plan}\nDue On:\t${due_on}\nMachine:\t${qa.machine}\nRequested By:\t${qa.requested_by}\nCompleted By:\t${qa.completed_by}\nResult:\t${qa.result}\n`;

        const mail = {
          from: "radonc.physics@stonybrookmedicine.edu",
          to: to_unique.join(","), // list of receivers
          subject: "QA Completed", // Subject line
          text: body,
          //html: err
        };

        emailer.send(mail);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  QA.updateOne(
    { _id: qaId },
    {
      $set: req.body,
    }
  )
    .then((data) => {
      // console.log(data);
      appLogger.log("qa updated", `qa updated(${qaId})`, req);

      res.json(data);
    })
    .catch((err) => {
      console.error(err);

      appLogger.error("qa update failed", `qa update failed(${qaId})`, req);

      res.json({ message: err });
    });
});

// POST
router.post("/", authorizedOnly, function (req, res, next) {
  console.log(req.body);

  const qa = new QA(req.body);

  qa.save()
    .then((data) => {
      //console.log('saved... sending the response back...');

      appLogger.log("a new QA added", "a new QA added", req);

      // notify the subscribers about  new QAs
      User.find({ "settings.notify_qa_new": true })
        .then((users) => {
          console.log("users===================>", users);

          users.forEach((user) => {
            console.log("qa.machine===========>", qa.machine);
            console.log("user===========>", user);

            // notify the user if the user does not have my_machines setting or if the user's machine include the qa machine
            if (
              !user.settings ||
              !user.settings.my_machines ||
              user.settings.my_machines.trim() === "" ||
              user.settings.my_machines.includes(qa.machine)
            ) {
              const due_on =
                new Date(qa.due_on).toLocaleDateString() +
                " " +
                new Date(qa.due_on).toLocaleTimeString();

              const body = `Case:\t${qa.plan_case_name}\nType:\t${qa.type}\nPlan:\t${qa.plan}\nDue On:\t${due_on}\nMachine:\t${qa.machine}\nRequested By:\t${qa.requested_by}\n`;

              const mail = {
                from: "radonc.physics@stonybrookmedicine.edu",
                to: user.email, // list of receivers
                subject: "New QA", // Subject line
                text: body,
                //html: err
              };

              emailer.send(mail);
            }
          });
        })
        .catch((err) => {
          console.error(err);
        });

      res.json(data);
    })
    .catch((err) => {
      console.error("error saving a QA...", err);

      appLogger.error("QA add failed", "QA add failed", req);

      res.json({
        message: err,
      });
    });
}); // post()

module.exports = router;
