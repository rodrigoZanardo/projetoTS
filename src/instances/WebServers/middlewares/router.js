//Requires
const router = require('express').Router();
const multer = require('multer');
const requestAuth = require('../requestAuth.js');
const HistoryController = require('../../../components/history/HistoryController');
const ProxyController = require('../../../components/proxy/ProxyController');
const ApigeeController = require('../../../components/apigee/ApigeeController');
const logsApisController = require('../../../components/logsApis/logsApisController');
const VulnerabilityController = require('../../../components/vulnerability/VulnerabilityController');
const IndicatorController = require('../../../components/indicator/IndicatorController');
const TowersController = require('../../../components/towers/TowersController');
const QualificationScheduleController = require('../../../components/qualificationSchedule/QualificationScheduleController');
const AnalystController = require('../../../components/analyst/AnalystController');
const HealthController = require('../../../components/health/HealthController');

//Helpers
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
const tmpController = async (req, res, next) => {
  res.send({
    deploy: 7,
    lastChange: 'cicd',
    temp: Math.random(),
    // req_ip: req.ip,
    // req_ips: req.ips,
    // headers: req.headers,
  });
  next();
};
const multipartParser = multer({
  dest: 'uploads/',
  limits: {
    fieldSize: 150 * 1024, //150kb
    fields: 15,
    parts: 15,
    fileSize: 10 * 1024 * 1024, //10mb
  },
});

//Test routes
router.get('/test', asyncHandler(tmpController));

// health
router.get('/health', requestAuth('user'), asyncHandler(HealthController.health));

// search
router.get('/proxies/search', requestAuth('user'), asyncHandler(ProxyController.getSearch));

//Proxy routes
router.get('/proxies', requestAuth('user'), asyncHandler(ProxyController.getList));
router.get('/proxies/names', requestAuth('user'), asyncHandler(ProxyController.getNames));
router.get('/proxies/pendencies', requestAuth('user'), asyncHandler(ProxyController.getPendencies));
router.get('/proxies/adminBaseProd', requestAuth('user'), asyncHandler(ProxyController.adminBaseProd));
router.post('/proxies', requestAuth('user'), asyncHandler(ProxyController.register));
router.get('/proxies/:id', requestAuth('user'), asyncHandler(ProxyController.getOne));
router.put('/proxies/:id', requestAuth('user'), asyncHandler(ProxyController.update));
router.delete('/proxies/:id', requestAuth('user'), asyncHandler(ProxyController.deleteOne));
router.post('/proxies/generatepdf', requestAuth('user'), asyncHandler(ProxyController.generatePdf));
router.post('/proxies/sendata', requestAuth('user'), asyncHandler(ProxyController.sendAta));

//TEMP
router.post('/proxies/typeconsumption', requestAuth('user'), asyncHandler(ProxyController.updateTypeConsumption));

// LogsAPis
router.get('/logs/apis', requestAuth('user'), asyncHandler(logsApisController.getList));

//Other routes
router.get('/history', requestAuth('user'), asyncHandler(HistoryController.getList));
router.get('/history/minutes/:id', requestAuth('user'), asyncHandler(HistoryController.getMinute));

router.post(
  '/cicd/validate/apigee/proxy',
  requestAuth('cicd'),
  multipartParser.single('repositoryData'),
  asyncHandler(ApigeeController.validateProxy),
);

// vulnerability
router.post('/vulnerability', requestAuth('user'), asyncHandler(VulnerabilityController.register));
router.get('/vulnerability', requestAuth('user'), asyncHandler(VulnerabilityController.getAll));
router.delete('/vulnerability/all', requestAuth('user'), asyncHandler(VulnerabilityController.deleteAll));
router.delete('/vulnerability/:id', requestAuth('user'), asyncHandler(VulnerabilityController.deleteOne));
router.put('/vulnerability/:id', requestAuth('user'), asyncHandler(VulnerabilityController.update));
router.get('/vulnerability/status',requestAuth('user'), asyncHandler(VulnerabilityController.getAllStatus));

// indicator
router.get(
  '/indicator/vulnerability/criticality',
  requestAuth('user'),
  asyncHandler(IndicatorController.vulnerabilityByCriticality),
);
router.get(
  '/indicator/qualification/per-analyst',
  requestAuth('user'),
  asyncHandler(IndicatorController.qualificationPerAnalyst),
);

// towers
router.post('/towers', requestAuth('user'), asyncHandler(TowersController.register));
router.get('/towers', asyncHandler(TowersController.getAll));
router.delete('/towers/:id', requestAuth('user'), asyncHandler(TowersController.deleteOne));
router.get('/towers/search', asyncHandler(TowersController.getSearch));

// qualificationSchedule
router.post('/qualification-schedule', asyncHandler(QualificationScheduleController.register));
router.get('/qualification-schedule', requestAuth('user'), asyncHandler(QualificationScheduleController.getAll));
router.get('/qualification-schedule/tower', asyncHandler(QualificationScheduleController.getTower));
router.get('/qualification-schedule/ssm', asyncHandler(QualificationScheduleController.getSSM));
router.get('/qualification-schedule/:id', requestAuth('user'), asyncHandler(QualificationScheduleController.getOne));

// Analyst
router.post('/analyst', requestAuth('user'), asyncHandler(AnalystController.register));
router.get('/analyst', requestAuth('user'), asyncHandler(AnalystController.getAll));
router.put('/analyst/status/:id', requestAuth('user'), asyncHandler(AnalystController.updateStatus));
router.get('/analyst/:id', requestAuth('user'), asyncHandler(AnalystController.getOne));
router.put('/analyst/:id', requestAuth('user'), asyncHandler(AnalystController.update));

module.exports = router;
