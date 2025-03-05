const express = require('express');
const router = express.Router();
const previewController = require('../controllers/previewController');

// Rutas para vistas previas de Trader Call
router.get('/preview/trader-call/dashboard', previewController.previewTraderCallDashboard);
router.get('/preview/trader-call/seguimiento', previewController.previewTraderCallSeguimiento);
router.get('/preview/trader-call/alertas-vigentes', previewController.previewTraderCallAlertasVigentes);
router.get('/preview/trader-call/informes', previewController.previewTraderCallInformes);
router.get('/preview/trader-call/comunidad', previewController.previewTraderCallComunidad);

module.exports = router; 