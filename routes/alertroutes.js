import { Router } from "express";
import { createAlert, deleteAlert, getAllAlerts } from '../controllers/alertcontroller.js'

const router = Router();

router.get('/', getAllAlerts);
router.post('/', createAlert);
router.delete('/:id', deleteAlert);

export { router };